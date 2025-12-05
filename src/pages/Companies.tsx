import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Building2, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "@/lib/api";

interface CompanyStats {
  name: string;
  region: string;
  type: "retail" | "service";
  totalCalls: number;
  completedCalls: number;
  issues: number;
}

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "retail" | "service">("all");
  const [companies, setCompanies] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch call logs from API
  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(getApiUrl("get-call-list"));
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();

        // Extract unique companies and their stats from call logs
        const companiesMap = new Map<string, CompanyStats>();

        (data.data || []).forEach((log: any) => {
          const companyName = log.customerData?.companyName || "Unknown";
          const region = log.customerData?.region || "Unknown";
          const industryType = log.customerData?.industryType || "retail";

          if (!companiesMap.has(companyName)) {
            companiesMap.set(companyName, {
              name: companyName,
              region: region,
              type: (industryType as "retail" | "service") || "retail",
              totalCalls: 0,
              completedCalls: 0,
              issues: 0,
            });
          }

          const company = companiesMap.get(companyName)!;
          company.totalCalls += 1;

          // Count completed calls
          if (log.status === "ended" || log.status === "completed") {
            company.completedCalls += 1;
          }

          // Count issues
          if (log.status === "error" || log.status === "issue") {
            company.issues += 1;
          }
        });

        const companiesList = Array.from(companiesMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCompanies(companiesList);
        console.log("Companies extracted from call logs:", companiesList);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch companies data"
        );
        console.error("Error fetching companies:", err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesData();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      if (typeFilter !== "all" && company.type !== typeFilter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          company.name.toLowerCase().includes(query) ||
          company.region.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [companies, typeFilter, searchQuery]);

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="mt-1 text-muted-foreground">Loading companies...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Companies</h1>
            <p className="mt-1 text-muted-foreground">
              Managing {companies.length} RV companies across all regions
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">Error loading companies: {error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-lg bg-secondary p-1">
            {(["all", "retail", "service"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium capitalize transition-all",
                  typeFilter === type
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type === "all" ? "All Types" : type}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCompanies.map((company, index) => (
            <div
              key={company.name}
              className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => navigate(`/?company=${encodeURIComponent(company.name)}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mt-4 font-semibold line-clamp-1">{company.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {company.region}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={cn(
                    "capitalize",
                    company.type === "retail"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  )}
                >
                  {company.type}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  {company.totalCalls}
                </div>
              </div>
              <div className="mt-3 flex gap-4 border-t border-border pt-3 text-xs">
                <span className="text-success">
                  {company.completedCalls} completed
                </span>
                {company.issues > 0 && (
                  <span className="text-destructive">{company.issues} issues</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No companies found</h3>
            <p className="mt-1 text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
