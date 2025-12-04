import { useMemo, useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterHeader } from "@/components/common/FilterHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { companies } from "@/data/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useFilters } from "@/contexts/FilterContext";
import { CallLog } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Phone,
  TrendingUp,
  TrendingDown,
  Clock,
  Building2,
} from "lucide-react";
import { getApiUrl, apiFetch } from "@/lib/api";

interface ApiStats {
  total: number;
  completed: number;
  error: number;
  pending: number;
}

export default function Analytics() {
  const { selectedCompanies, setSelectedCompanies, dateRange, setDateRange } =
    useFilters();
  const { selectedDepartment } = useDepartment();
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [apiStats, setApiStats] = useState<ApiStats>({
    total: 0,
    completed: 0,
    error: 0,
    pending: 0,
  });
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

        const countResp = await apiFetch("count-calls");
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
            issueType: "general",
            hasTranscript: false,
            date: log.date,
          })
        );

        setCallLogs(transformedLogs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch call logs"
        );
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCallLogs();
  }, [dateRange]);

  // Filter logs based on selections
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
      return true;
    });
  }, [callLogs, selectedCompanies, selectedDepartment]);

  // Issue type distribution
  const issueTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.forEach((log) => {
      const issueType = log.issueType || "general";
      counts[issueType] = (counts[issueType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [filteredLogs]);

  // Top companies by call volume
  const topCompaniesData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.forEach((log) => {
      counts[log.companyName] = (counts[log.companyName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        calls: count,
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 10);
  }, [filteredLogs]);

  // Call type distribution
  const callTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.forEach((log) => {
      const type = log.callType || "phone_call";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name === "phone_call" ? "Phone Call" : "Web Call",
      value,
    }));
  }, [filteredLogs]);

  // Calculate average duration
  const avgDuration = useMemo(() => {
    if (filteredLogs.length === 0) return "0:00";
    const totalMs = filteredLogs.reduce((sum, log) => sum + log.duration, 0);
    const avgMs = totalMs / filteredLogs.length;
    const seconds = Math.floor((avgMs / 1000) % 60);
    const minutes = Math.floor((avgMs / (1000 * 60)) % 60);
    const hours = Math.floor(avgMs / (1000 * 60 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  }, [filteredLogs]);

  // Filtered stats based on department/company selection
  const filteredStats = useMemo(() => {
    const completed = filteredLogs.filter(
      (log) => log.status === "completed"
    ).length;
    const pending = filteredLogs.filter(
      (log) => log.status === "pending"
    ).length;
    const issues = filteredLogs.filter((log) => log.status === "issue").length;
    return {
      total: filteredLogs.length,
      completed,
      pending,
      issues,
      avgDuration,
    };
  }, [filteredLogs, avgDuration]);

  // Status distribution
  const statusData = useMemo(() => {
    return [
      {
        name: "Completed",
        value: filteredStats.completed,
        color: "hsl(142, 76%, 36%)",
      },
      {
        name: "Pending",
        value: filteredStats.pending,
        color: "hsl(38, 92%, 50%)",
      },
      {
        name: "Issues",
        value: filteredStats.issues,
        color: "hsl(0, 84%, 60%)",
      },
    ];
  }, [filteredStats]);

  // Mock daily calls trend
  const dailyTrendData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const baseMultiplier =
      filteredLogs.length > 0
        ? filteredLogs.length / Math.max(1, callLogs.length)
        : 1;
    return days.map((day, idx) => ({
      name: day,
      calls: Math.floor((30 + idx * 5) * baseMultiplier),
      completed: Math.floor((20 + idx * 4) * baseMultiplier),
    }));
  }, [filteredLogs.length, callLogs.length]);

  const COLORS = [
    "hsl(217, 91%, 60%)",
    "hsl(173, 80%, 40%)",
    "hsl(38, 92%, 50%)",
    "hsl(0, 84%, 60%)",
    "hsl(280, 65%, 60%)",
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="mt-1 text-muted-foreground">
              Loading analytics data...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Performance metrics and insights across all companies
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">
              Error loading analytics: {error}
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

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Calls"
            value={apiStats.total.toLocaleString()}
            icon={Phone}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Avg Duration"
            value={filteredStats.avgDuration}
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="Active Companies"
            value={new Set(filteredLogs.map((l) => l.companyName)).size}
            icon={Building2}
            variant="default"
          />
          <StatCard
            title="Success Rate"
            value={
              filteredStats.total > 0
                ? `${Math.round(
                    (filteredStats.completed / filteredStats.total) * 100
                  )}%`
                : "0%"
            }
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            variant="success"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Daily Trend */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Weekly Call Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(217, 91%, 60%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 76%, 36%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Companies */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Top Companies by Call Volume
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCompaniesData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="calls"
                  fill="hsl(217, 91%, 60%)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Issue Type Distribution */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Issue Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {issueTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Call Status */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Call Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Call Type Distribution */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Call Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={callTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {callTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Call Status Summary */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Call Status Summary</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-success" />
                  <span className="font-medium">Completed</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {filteredStats.completed.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredStats.total > 0
                      ? (
                          (filteredStats.completed / filteredStats.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    % of total
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <span className="font-medium">Pending</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {filteredStats.pending.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredStats.total > 0
                      ? (
                          (filteredStats.pending / filteredStats.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    % of total
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <span className="font-medium">Issues</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {filteredStats.issues.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredStats.total > 0
                      ? (
                          (filteredStats.issues / filteredStats.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    % of total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
