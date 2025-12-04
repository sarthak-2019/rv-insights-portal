import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { FilterHeader } from "@/components/common/FilterHeader";
import { CallLogsTable } from "@/components/dashboard/CallLogsTable";
import { TranscriptModal } from "@/components/dashboard/TranscriptModal";
import { IssueTypeFilter } from "@/components/dashboard/IssueTypeFilter";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { companies, dashboardStats, IssueType, CallLog } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useFilters } from "@/contexts/FilterContext";
import {
  Phone,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  TrendingUp,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const { selectedCompanies, setSelectedCompanies, dateRange, setDateRange } = useFilters();
  const { selectedDepartment } = useDepartment();
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<IssueType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [quickDateFilter, setQuickDateFilter] = useState<"today" | "week" | "month" | "all">("week");
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch call logs from API
  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3005/get-call-list");
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Transform API data to match CallLog interface
        const transformedLogs: CallLog[] = data.data.map((log: any) => ({
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
          issueType: "general",
          hasTranscript: false,
        }));
        
        setCallLogs(transformedLogs);
        setRecentActivity(data.recentIssues || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch call logs");
        console.error("Error fetching call logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return callLogs.filter((log) => {
      // Company filter
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(log.companyId)) {
        return false;
      }
      
      // Department filter
      if (selectedDepartment !== "all" && log.department !== selectedDepartment) {
        return false;
      }
      
      // Issue type filter
      if (selectedIssueTypes.length > 0 && !selectedIssueTypes.includes(log.issueType)) {
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
  }, [callLogs, selectedCompanies, selectedDepartment, selectedIssueTypes, searchQuery]);

  const handleViewTranscript = (callId: string) => {
    const call = callLogs.find((c) => c.id === callId);
    if (call) {
      setSelectedCall(call);
      setTranscriptOpen(true);
    }
  };

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    return {
      totalCalls: filteredLogs.length,
      completedCalls: filteredLogs.filter((c) => c.status === "completed").length,
      pendingCalls: filteredLogs.filter((c) => c.status === "pending").length,
      issues: filteredLogs.filter((c) => c.status === "issue").length,
    };
  }, [filteredLogs]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">RV AI Portal</h1>
            <p className="mt-1 text-muted-foreground">
              Unified dashboard for {dashboardStats.totalCompanies} companies
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
            value={filteredStats.totalCalls.toLocaleString()}
            icon={Phone}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Completed"
            value={filteredStats.completedCalls.toLocaleString()}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Pending"
            value={filteredStats.pendingCalls.toLocaleString()}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Issues"
            value={filteredStats.issues.toLocaleString()}
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
                      quickDateFilter === "today" ? "bg-background shadow-sm" : "hover:bg-background/50"
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setQuickDateFilter("week")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      quickDateFilter === "week" ? "bg-background shadow-sm" : "hover:bg-background/50"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setQuickDateFilter("month")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      quickDateFilter === "month" ? "bg-background shadow-sm" : "hover:bg-background/50"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setQuickDateFilter("all")}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      quickDateFilter === "all" ? "bg-background shadow-sm" : "hover:bg-background/50"
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
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Filter by issue type:</span>
              <IssueTypeFilter
                selected={selectedIssueTypes}
                onChange={setSelectedIssueTypes}
              />
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
              <CallLogsTable logs={filteredLogs} onViewTranscript={handleViewTranscript} />
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
