import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CompanyFilter } from "@/components/dashboard/CompanyFilter";
import { CallLogsTable } from "@/components/dashboard/CallLogsTable";
import { TranscriptModal } from "@/components/dashboard/TranscriptModal";
import { IssueTypeFilter } from "@/components/dashboard/IssueTypeFilter";
import { callLogs, IssueType, CallLog, CallStatus } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import { Search, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CallLogs() {
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const { selectedDepartment } = useDepartment();
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<IssueType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<CallStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const filteredLogs = useMemo(() => {
    return callLogs.filter((log) => {
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(log.companyId)) {
        return false;
      }
      if (selectedDepartment !== "all" && log.department !== selectedDepartment) {
        return false;
      }
      if (selectedIssueTypes.length > 0 && !selectedIssueTypes.includes(log.issueType)) {
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
          log.summary.toLowerCase().includes(query) ||
          log.agentName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedCompanies, selectedDepartment, selectedIssueTypes, selectedStatus, searchQuery]);

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
  }, [selectedCompanies, selectedDepartment, selectedIssueTypes, selectedStatus]);

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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer, company, call ID, agent, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-4 animate-fade-in space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CompanyFilter
                selectedCompanies={selectedCompanies}
                onSelectionChange={setSelectedCompanies}
              />
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Issue type:</span>
                <IssueTypeFilter
                  selected={selectedIssueTypes}
                  onChange={setSelectedIssueTypes}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex gap-2">
                  {(["all", "completed", "pending", "issue"] as const).map((status) => (
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length.toLocaleString()} of {callLogs.length.toLocaleString()} calls
          </p>
        </div>

        {/* Table */}
        <CallLogsTable logs={filteredLogs} onViewTranscript={handleViewTranscript} />

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
