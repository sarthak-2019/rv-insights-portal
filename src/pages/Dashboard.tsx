import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CompanyFilter } from "@/components/dashboard/CompanyFilter";
import { DepartmentToggle } from "@/components/dashboard/DepartmentToggle";
import { CallLogsTable } from "@/components/dashboard/CallLogsTable";
import { TranscriptModal } from "@/components/dashboard/TranscriptModal";
import { IssueTypeFilter } from "@/components/dashboard/IssueTypeFilter";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { callLogs, dashboardStats, IssueType, CallLog } from "@/data/mockData";
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
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [department, setDepartment] = useState<"all" | "retail" | "service">("all");
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<IssueType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const filteredLogs = useMemo(() => {
    return callLogs.filter((log) => {
      // Company filter
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(log.companyId)) {
        return false;
      }
      
      // Department filter
      if (department !== "all" && log.department !== department) {
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
          log.summary.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [selectedCompanies, department, selectedIssueTypes, searchQuery]);

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
          <DepartmentToggle selected={department} onChange={setDepartment} />
        </div>

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

        {/* Filters Section */}
        <div className="rounded-xl border border-border bg-card p-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CompanyFilter
                selectedCompanies={selectedCompanies}
                onSelectionChange={setSelectedCompanies}
              />
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search calls, customers, companies..."
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
            <CallLogsTable logs={filteredLogs} onViewTranscript={handleViewTranscript} />
          </div>

          {/* Recent Activity */}
          <div>
            <RecentActivity logs={filteredLogs} />
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
