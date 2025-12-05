import { useMemo, useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FilterHeader } from "@/components/common/FilterHeader";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useFilters } from "@/contexts/FilterContext";
import { IssueType, CallLog } from "@/data/mockData";
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

interface Company {
  id: number;
  name: string;
}

export default function Analytics() {
  const { selectedCompanies, setSelectedCompanies, dateRange, setDateRange } =
    useFilters();
  const { selectedDepartment } = useDepartment();
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
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
            issueType: (log.customerData?.issueType || "general") as IssueType,
            department: log.customerData?.industryType || "retail",
            hasTranscript: false,
            date: log.date,
          })
        );

        setCallLogs(transformedLogs);

        // Extract unique companies from call logs
        const uniqueCompanies = new Map<string, Company>();
        transformedLogs.forEach((log, index) => {
          if (log.companyName && log.companyName !== "Not provided") {
            if (!uniqueCompanies.has(log.companyName)) {
              uniqueCompanies.set(log.companyName, {
                id: index,
                name: log.companyName,
              });
            }
          }
        });

        const companyList = Array.from(uniqueCompanies.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCompanies(companyList);
        console.log("Companies extracted from call logs:", companyList);
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

      // Department/Industry Type filter
      if (
        selectedDepartment !== "all" &&
        log.department !== selectedDepartment
      ) {
        return false;
      }

      return true;
    });
  }, [callLogs, selectedCompanies, selectedDepartment, companies]);

  // Issue type distribution
  const issueTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.forEach((log) => {
      const issueType = log.issueType || "general";
      counts[issueType] = (counts[issueType] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .sort((a, b) => b.value - a.value);
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

  // Daily calls trend based on filtered logs
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

  // Static data for department breakdown
  const departmentBreakdown = [
    { name: "Retail", calls: 1245, resolved: 1180 },
    { name: "Service", calls: 2340, resolved: 2156 },
    { name: "Maintenance", calls: 890, resolved: 845 },
    { name: "Compliance", calls: 456, resolved: 432 },
    { name: "Claims/Warranty", calls: 1678, resolved: 1520 },
    { name: "Manufacturer", calls: 567, resolved: 534 },
  ];

  // Static peak hours data
  const peakHoursData = [
    { hour: "6AM", calls: 45 },
    { hour: "8AM", calls: 120 },
    { hour: "10AM", calls: 285 },
    { hour: "12PM", calls: 190 },
    { hour: "2PM", calls: 310 },
    { hour: "4PM", calls: 265 },
    { hour: "6PM", calls: 145 },
    { hour: "8PM", calls: 65 },
  ];

  // Static monthly comparison
  const monthlyTrend = [
    { month: "Jul", calls: 4520, resolved: 4280, avgTime: 4.2 },
    { month: "Aug", calls: 4890, resolved: 4650, avgTime: 4.0 },
    { month: "Sep", calls: 5234, resolved: 4980, avgTime: 3.8 },
    { month: "Oct", calls: 5678, resolved: 5420, avgTime: 3.5 },
    { month: "Nov", calls: 6120, resolved: 5890, avgTime: 3.3 },
    { month: "Dec", calls: 5890, resolved: 5650, avgTime: 3.4 },
  ];

  // Resolution rate by issue type (static)
  const resolutionByIssue = [
    { type: "Warranty", rate: 92, count: 1245 },
    { type: "Technical", rate: 88, count: 2340 },
    { type: "Billing", rate: 95, count: 890 },
    { type: "Parts", rate: 85, count: 1567 },
    { type: "General", rate: 97, count: 2100 },
  ];

  // Heatmap data - Top Repair Issues by Model/Part
  const heatmapData = [
    { model: "Class A Diesel", ac: 85, electrical: 62, plumbing: 45, slideout: 78, generator: 92 },
    { model: "Class C Gas", ac: 72, electrical: 55, plumbing: 68, slideout: 45, generator: 38 },
    { model: "Fifth Wheel", ac: 58, electrical: 82, plumbing: 35, slideout: 95, generator: 22 },
    { model: "Travel Trailer", ac: 45, electrical: 48, plumbing: 72, slideout: 65, generator: 15 },
    { model: "Toy Hauler", ac: 38, electrical: 75, plumbing: 28, slideout: 52, generator: 68 },
  ];

  // Company performance data (static)
  const companyPerformance = [
    { name: "Summit RV Group", calls: 1245, resolved: 1180, avgTime: "3.2m", satisfaction: 94 },
    { name: "Horizon Motors", calls: 987, resolved: 945, avgTime: "2.8m", satisfaction: 96 },
    { name: "Coastal Camping Co", calls: 856, resolved: 798, avgTime: "4.1m", satisfaction: 89 },
    { name: "Mountain View RV", calls: 743, resolved: 712, avgTime: "3.5m", satisfaction: 92 },
    { name: "Desert Sun Motors", calls: 654, resolved: 620, avgTime: "3.8m", satisfaction: 91 },
    { name: "Pacific Coast RV", calls: 589, resolved: 565, avgTime: "2.9m", satisfaction: 95 },
  ];

  // Region data
  const regionData = [
    { region: "West Coast", calls: 3245, percentage: 28 },
    { region: "Southeast", calls: 2890, percentage: 25 },
    { region: "Midwest", calls: 2456, percentage: 21 },
    { region: "Northeast", calls: 1678, percentage: 14 },
    { region: "Southwest", calls: 1390, percentage: 12 },
  ];

  // Helper function for heatmap color
  const getHeatColor = (value: number) => {
    if (value >= 80) return "bg-red-500/80";
    if (value >= 60) return "bg-orange-500/70";
    if (value >= 40) return "bg-yellow-500/60";
    if (value >= 20) return "bg-green-500/50";
    return "bg-green-600/40";
  };

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

          {/* Department Breakdown */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Calls by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="calls" fill="hsl(217, 91%, 60%)" name="Total Calls" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="hsl(142, 76%, 36%)" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Peak Hours */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Peak Call Hours</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="calls" fill="hsl(280, 65%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Monthly Trend - Full Width */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">6-Month Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="calls" stroke="hsl(217, 91%, 60%)" strokeWidth={2} name="Total Calls" />
              <Line type="monotone" dataKey="resolved" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Resolution Rate by Issue Type */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Resolution Rate by Issue Type</h3>
          <div className="grid gap-4 sm:grid-cols-5">
            {resolutionByIssue.map((item) => (
              <div key={item.type} className="rounded-lg bg-secondary/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">{item.type}</p>
                <p className="text-2xl font-bold text-primary">{item.rate}%</p>
                <p className="text-xs text-muted-foreground">{item.count.toLocaleString()} calls</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Repair Issues Heatmap */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Top Repair Issues Heatmap (by Model & Part)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium">RV Model</th>
                  <th className="py-3 px-4 text-center font-medium">AC/HVAC</th>
                  <th className="py-3 px-4 text-center font-medium">Electrical</th>
                  <th className="py-3 px-4 text-center font-medium">Plumbing</th>
                  <th className="py-3 px-4 text-center font-medium">Slide-Out</th>
                  <th className="py-3 px-4 text-center font-medium">Generator</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.model} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{row.model}</td>
                    <td className="py-2 px-2">
                      <div className={`mx-auto w-16 rounded py-2 text-center text-xs font-bold text-white ${getHeatColor(row.ac)}`}>
                        {row.ac}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className={`mx-auto w-16 rounded py-2 text-center text-xs font-bold text-white ${getHeatColor(row.electrical)}`}>
                        {row.electrical}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className={`mx-auto w-16 rounded py-2 text-center text-xs font-bold text-white ${getHeatColor(row.plumbing)}`}>
                        {row.plumbing}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className={`mx-auto w-16 rounded py-2 text-center text-xs font-bold text-white ${getHeatColor(row.slideout)}`}>
                        {row.slideout}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className={`mx-auto w-16 rounded py-2 text-center text-xs font-bold text-white ${getHeatColor(row.generator)}`}>
                        {row.generator}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-green-600/40" /> Low (0-19)</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-green-500/50" /> Medium-Low (20-39)</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-yellow-500/60" /> Medium (40-59)</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-orange-500/70" /> High (60-79)</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-red-500/80" /> Critical (80+)</div>
          </div>
        </Card>

        {/* Company Performance Table */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Company Performance Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-left font-medium">Company</th>
                  <th className="py-3 px-4 text-right font-medium">Total Calls</th>
                  <th className="py-3 px-4 text-right font-medium">Resolved</th>
                  <th className="py-3 px-4 text-right font-medium">Avg Time</th>
                  <th className="py-3 px-4 text-right font-medium">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {companyPerformance.map((company) => (
                  <tr key={company.name} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4 font-medium">{company.name}</td>
                    <td className="py-3 px-4 text-right">{company.calls.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-success">{company.resolved.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{company.avgTime}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={company.satisfaction >= 93 ? "text-success" : company.satisfaction >= 90 ? "text-warning" : "text-destructive"}>
                        {company.satisfaction}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Regional Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Calls by Region</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="calls" fill="hsl(173, 80%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Regional Distribution</h3>
            <div className="space-y-4">
              {regionData.map((region) => (
                <div key={region.region} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{region.region}</span>
                    <span className="font-medium">{region.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${region.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
