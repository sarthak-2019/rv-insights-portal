import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { FilterHeader } from "@/components/common/FilterHeader";
import { CallLogsTable } from "@/components/dashboard/CallLogsTable";
import { TranscriptModal } from "@/components/dashboard/TranscriptModal";
import { IssueTypeFilter } from "@/components/dashboard/IssueTypeFilter";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { dashboardStats, IssueType, CallLog } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useFilters } from "@/contexts/FilterContext";
import {
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getApiUrl } from "@/lib/api";

interface ApiStats {
  total: number;
  completed: number;
  error: number;
  pending: number;
}

interface Company {
  id: number;
  name: string;
}

export default function Dashboard() {
  const { selectedCompanies, setSelectedCompanies, dateRange, setDateRange } =
    useFilters();
  const { selectedDepartment, setSelectedDepartment } = useDepartment();
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<IssueType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [quickDateFilter, setQuickDateFilter] = useState<
    "today" | "week" | "month" | "all"
  >("week");
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [issueTypes, setIssueTypes] = useState<IssueType[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStats, setApiStats] = useState<ApiStats>({
    total: 0,
    completed: 0,
    error: 0,
    pending: 0,
  });

  // Fetch call logs from API
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert dateRange to timestamps
        const params = new URLSearchParams();
        if (dateRange.from) {
          const startTimestamp = new Date(dateRange.from).getTime();
          params.append("startDate", startTimestamp.toString());
        }
        if (dateRange.to) {
          const endTimestamp = new Date(dateRange.to).getTime();
          params.append("endDate", endTimestamp.toString());
        }

        const url = `${getApiUrl("get-call-list")}${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();

        const countResp = await fetch(getApiUrl("count-calls"));
        if (!countResp.ok) {
          throw new Error(`API error: ${countResp.statusText}`);
        }
        const countData = await countResp.json();

        // Set API stats
        setApiStats({
          total: countData.total || 0,
          completed: countData.completed || 0,
          error: countData.error || 0,
          pending: countData.pending || 0,
        });

        // Transform API data to match CallLog interface
        const transformedLogs: CallLog[] = (data.data || []).map(
          (log: any) => ({
            id: log.id,
            companyName: log.customerData?.companyName || "Not provided",
            customerName: log.customerData?.customerName || "Not provided",
            phoneNumber: log.customerData?.phoneNumber || "Not provided",
            vin: log.customerData?.vinNumber || "Not provided",
            duration: log.duration,
            status: log.status === "ended" ? "completed" : log.status,
            agentName: log.callAgent || "N/A",
            callType: log.callType,
            success: log.success,
            customerData: log.customerData,
            issueType: (log.customerData.issueType || "general") as any,
            department: log.customerData.industryType || "retail",
            hasTranscript: false,
            date: log.date,
            transcript: log.transcript || "",
          })
        );

        setCallLogs(transformedLogs);

        // Extract unique companies from call logs
        const uniqueCompanies = new Map<string, Company>();
        const uniqueIssueTypes = new Set<IssueType>();
        const uniqueDepartments = new Set<string>();

        transformedLogs.forEach((log, index) => {
          // Extract companies
          if (log.companyName && log.companyName !== "Not provided") {
            if (!uniqueCompanies.has(log.companyName)) {
              uniqueCompanies.set(log.companyName, {
                id: index,
                name: log.companyName,
              });
            }
          }

          // Extract issue types
          uniqueIssueTypes.add(log.issueType);

          // Extract departments
          uniqueDepartments.add(log.department);
        });

        const companyList = Array.from(uniqueCompanies.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCompanies(companyList);

        const issueTypesList = Array.from(uniqueIssueTypes).sort();
        setIssueTypes(issueTypesList);

        const departmentsList = Array.from(uniqueDepartments).sort();
        setDepartments(departmentsList);

        console.log("Companies extracted from call logs:", companyList);
        console.log("Issue types extracted from call logs:", issueTypesList);
        console.log("Departments extracted from call logs:", departmentsList);

        setRecentActivity(data.recentIssues || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch call logs"
        );
        console.error("Error fetching call logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, [dateRange]);

  const filteredLogs = useMemo(() => {
    return callLogs.filter((log) => {
      // Company filter
      if (
        selectedCompanies.length > 0 &&
        !selectedCompanies.some((companyId) => {
          const company = companies.find((c) => c.id === companyId);
          return company && log.companyName === company.name;
        })
      ) {
        return false;
      }

      // Department filter
      if (
        selectedDepartment !== "all" &&
        log.department !== selectedDepartment
      ) {
        return false;
      }

      // Issue type filter
      if (
        selectedIssueTypes.length > 0 &&
        !selectedIssueTypes.includes(log.issueType)
      ) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.customerName.toLowerCase().includes(query) ||
          log.companyName.toLowerCase().includes(query) ||
          log.id.toLowerCase().includes(query) ||
          (log.vin && log.vin.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [
    callLogs,
    selectedCompanies,
    selectedDepartment,
    selectedIssueTypes,
    searchQuery,
    companies,
  ]);

  const handleViewTranscript = (callId: string) => {
    const call = callLogs.find((c) => c.id === callId);
    if (call) {
      setSelectedCall(call);
      setTranscriptOpen(true);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">RV AI Portal</h1>
            <p className="mt-1 text-muted-foreground">
              Unified dashboard for {companies.length} companies
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">Error loading call logs: {error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Calls"
            value={apiStats.total.toLocaleString()}
            icon={Phone}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Completed"
            value={apiStats.completed.toLocaleString()}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Pending"
            value={apiStats.pending.toLocaleString()}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Issues"
            value={apiStats.error.toLocaleString()}
            icon={AlertTriangle}
            trend={{ value: 3, isPositive: false }}
            variant="destructive"
          />
        </div>

        {/* Filter Header */}
        <FilterHeader
          selectedCompanies={selectedCompanies}
          onCompaniesChange={setSelectedCompanies}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          companies={companies}
        />

        {/* Additional Filters */}
        <div className="rounded-xl border border-border bg-card p-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setQuickDateFilter("today")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      quickDateFilter === "today"
                        ? "bg-background shadow-sm"
                        : "hover:bg-background/50"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setQuickDateFilter("week")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      quickDateFilter === "week"
                        ? "bg-background shadow-sm"
                        : "hover:bg-background/50"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setQuickDateFilter("month")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      quickDateFilter === "month"
                        ? "bg-background shadow-sm"
                        : "hover:bg-background/50"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setQuickDateFilter("all")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      quickDateFilter === "all"
                        ? "bg-background shadow-sm"
                        : "hover:bg-background/50"
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search calls, customers, VIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm text-muted-foreground">
                  Filter by issue type:
                </span>
                {issueTypes.length > 0 ? (
                  <IssueTypeFilter
                    selected={selectedIssueTypes}
                    onChange={setSelectedIssueTypes}
                    availableTypes={issueTypes}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">Loading issue types...</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm text-muted-foreground">Department:</span>
                {departments.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedDepartment === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDepartment("all")}
                      className="capitalize"
                    >
                      All
                    </Button>
                    {departments.map((dept) => (
                      <Button
                        key={dept}
                        variant={selectedDepartment === dept ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDepartment(dept as any)}
                        className="capitalize"
                      >
                        {dept}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Loading departments...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Call Logs Table */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">Loading call logs...</p>
              </div>
            ) : (
              <CallLogsTable
                logs={filteredLogs}
                onViewTranscript={handleViewTranscript}
              />
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity logs={recentActivity} />
          </div>
        </div>

        {/* Transcript Modal */}
        <TranscriptModal
          call={selectedCall}
          open={transcriptOpen}
          onClose={() => setTranscriptOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
