import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, callLogs, companies, repairIssues } from "@/data/mockData";
import { StatCard } from "@/components/dashboard/StatCard";
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

export default function Analytics() {
  // Issue type distribution
  const issueTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    callLogs.forEach((log) => {
      counts[log.issueType] = (counts[log.issueType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, []);

  // Top companies by call volume
  const topCompaniesData = useMemo(() => {
    const counts: Record<number, number> = {};
    callLogs.forEach((log) => {
      counts[log.companyId] = (counts[log.companyId] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([id, count]) => ({
        name: companies.find((c) => c.id === parseInt(id))?.name || "Unknown",
        calls: count,
      }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 10);
  }, []);

  // Calls by department
  const departmentData = useMemo(() => {
    const retail = callLogs.filter((l) => l.department === "retail").length;
    const service = callLogs.filter((l) => l.department === "service").length;
    return [
      { name: "Retail", value: retail },
      { name: "Service", value: service },
    ];
  }, []);

  // Status distribution
  const statusData = useMemo(() => {
    return [
      { name: "Completed", value: dashboardStats.completedCalls, color: "hsl(142, 76%, 36%)" },
      { name: "Pending", value: dashboardStats.pendingCalls, color: "hsl(38, 92%, 50%)" },
      { name: "Issues", value: dashboardStats.issues, color: "hsl(0, 84%, 60%)" },
    ];
  }, []);

  // Mock daily calls trend
  const dailyTrendData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      name: day,
      calls: Math.floor(Math.random() * 50) + 30,
      completed: Math.floor(Math.random() * 40) + 20,
    }));
  }, []);

  const COLORS = ["hsl(217, 91%, 60%)", "hsl(173, 80%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(280, 65%, 60%)"];

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

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Calls"
            value={dashboardStats.totalCalls.toLocaleString()}
            icon={Phone}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Avg Duration"
            value={dashboardStats.avgDuration}
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="Active Companies"
            value={dashboardStats.totalCompanies}
            icon={Building2}
            variant="default"
          />
          <StatCard
            title="Success Rate"
            value={`${Math.round((dashboardStats.completedCalls / dashboardStats.totalCalls) * 100)}%`}
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            variant="success"
          />
        </div>

        {/* Top Repair Issues Heatmap */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Repair Issues Heatmap</h3>
          <div className="space-y-3">
            {repairIssues.slice(0, 10).map((issue, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                    <span className="font-medium">{issue.issue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {issue.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-success" />
                    )}
                    <span className={issue.trend > 0 ? "text-destructive" : "text-success"}>
                      {issue.trend > 0 ? "+" : ""}{issue.trend}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        issue.severity === "critical" ? "bg-destructive" :
                        issue.severity === "high" ? "bg-warning" :
                        issue.severity === "medium" ? "bg-blue-500" :
                        "bg-success"
                      }`}
                      style={{ width: `${(issue.count / repairIssues[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{issue.count}</span>
                </div>
                <p className="text-xs text-muted-foreground">Top models: {issue.topModels.join(", ")}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Daily Trend */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Weekly Call Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
            <h3 className="mb-4 text-lg font-semibold">Top Companies by Call Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCompaniesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                <Bar dataKey="calls" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Issue Type Distribution */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Issue Type Distribution</h3>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {issueTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        </div>

        {/* Department Breakdown */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Department Breakdown</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {departmentData.map((dept, index) => (
              <div
                key={dept.name}
                className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="font-medium">{dept.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{dept.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {((dept.value / dashboardStats.totalCalls) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
