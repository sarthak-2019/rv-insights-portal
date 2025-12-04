import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterHeader } from "@/components/common/FilterHeader";
import { CallLogsTable } from "@/components/dashboard/CallLogsTable";
import { TranscriptModal } from "@/components/dashboard/TranscriptModal";
import { IssueTypeFilter } from "@/components/dashboard/IssueTypeFilter";
import { companies, IssueType, CallLog, CallStatus } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useFilters } from "@/contexts/FilterContext";
import { Search, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { apiFetch, getApiUrl } from "@/lib/api";

export default function CallLogs() {
  const { selectedCompanies, setSelectedCompanies, dateRange, setDateRange } =
    useFilters();
  const { selectedDepartment } = useDepartment();
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<IssueType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<CallStatus | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            issueType: "general",
            hasTranscript: false,
            summary: `${log.customerData?.customerName || "Customer"} - ${
              log.customerData?.companyName || "Company"
            }`,
          })
        );

        setCallLogs(transformedLogs);
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
      if (
        selectedCompanies.length > 0 &&
        !selectedCompanies.includes(log.companyId)
      ) {
        return false;
      }
      if (
        selectedDepartment !== "all" &&
        log.department !== selectedDepartment
      ) {
        return false;
      }
      if (
        selectedIssueTypes.length > 0 &&
        !selectedIssueTypes.includes(log.issueType)
      ) {
        return false;
      }
      if (selectedStatus !== "all" && log.status !== selectedStatus) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.customerName.toLowerCase().includes(query) ||
          log.companyName.toLowerCase().includes(query) ||
          log.id.toLowerCase().includes(query) ||
          (log.summary && log.summary.toLowerCase().includes(query)) ||
          log.agentName.toLowerCase().includes(query) ||
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
    selectedStatus,
    searchQuery,
  ]);

  const handleViewTranscript = (callId: string) => {
    const call = callLogs.find((c) => c.id === callId);
    if (call) {
      setSelectedCall(call);
      setTranscriptOpen(true);
    }
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCompanies.length > 0) count++;
    if (selectedDepartment !== "all") count++;
    if (selectedIssueTypes.length > 0) count++;
    if (selectedStatus !== "all") count++;
    return count;
  }, [
    selectedCompanies,
    selectedDepartment,
    selectedIssueTypes,
    selectedStatus,
  ]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Call Logs</h1>
            <p className="mt-1 text-muted-foreground">
              View and manage all call records across companies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">
              Error loading call logs: {error}
            </p>
          </div>
        )}

        {/* Filter Header */}
        <FilterHeader
          selectedCompanies={selectedCompanies}
          onCompaniesChange={setSelectedCompanies}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          companies={companies}
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer, company, call ID, VIN, agent, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-4 animate-fade-in space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                  Issue type:
                </span>
                <IssueTypeFilter
                  selected={selectedIssueTypes}
                  onChange={setSelectedIssueTypes}
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex gap-2">
                  {(["all", "completed", "pending", "issue"] as const).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={cn(
                          "filter-chip capitalize",
                          selectedStatus === status && "filter-chip-active"
                        )}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length.toLocaleString()} of{" "}
            {callLogs.length.toLocaleString()} calls
          </p>
        </div>

        {/* Table */}
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
