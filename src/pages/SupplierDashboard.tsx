import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  componentSuppliers,
  partFailures,
  regionData,
  ComponentSupplier,
} from "@/data/supplierData";
import {
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  MapPin,
  Clock,
  Wrench,
} from "lucide-react";
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
} from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--destructive))", "hsl(var(--warning))", "hsl(var(--secondary))", "#6366f1", "#8b5cf6"];

export default function SupplierDashboard() {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFailures = partFailures.filter((pf) => {
    if (selectedSupplier !== "all" && pf.supplierId.toString() !== selectedSupplier) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        pf.partName.toLowerCase().includes(query) ||
        pf.partNumber.toLowerCase().includes(query) ||
        pf.supplierName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const currentSupplier = selectedSupplier !== "all" 
    ? componentSuppliers.find(s => s.id.toString() === selectedSupplier)
    : null;

  // Data for charts
  const supplierIssueData = componentSuppliers.map(s => ({
    name: s.name.split(' ')[0],
    issues: s.activeIssues,
    failureRate: s.failureRate,
  }));

  const categoryData = componentSuppliers.reduce((acc, s) => {
    const existing = acc.find(a => a.name === s.category);
    if (existing) {
      existing.value += s.activeIssues;
    } else {
      acc.push({ name: s.category, value: s.activeIssues });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Component Supplier Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Vendor-specific parts data, failures, and regional insights
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {componentSuppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Supplier Stats */}
        {currentSupplier ? (
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{currentSupplier.name}</CardTitle>
                  <CardDescription>{currentSupplier.category}</CardDescription>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {currentSupplier.partsCount} Parts
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Failure Rate</p>
                  <p className="text-2xl font-bold">{currentSupplier.failureRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                  <p className="text-2xl font-bold">{currentSupplier.avgResolutionTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Issues</p>
                  <p className="text-2xl font-bold">{currentSupplier.activeIssues}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Regions</p>
                  <div className="flex flex-wrap gap-1">
                    {currentSupplier.regions.map((r) => (
                      <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Suppliers</CardDescription>
                <CardTitle className="text-3xl">{componentSuppliers.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Parts Tracked</CardDescription>
                <CardTitle className="text-3xl">
                  {componentSuppliers.reduce((sum, s) => sum + s.partsCount, 0).toLocaleString()}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Issues</CardDescription>
                <CardTitle className="text-3xl text-destructive">
                  {componentSuppliers.reduce((sum, s) => sum + s.activeIssues, 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Failure Rate</CardDescription>
                <CardTitle className="text-3xl">
                  {(componentSuppliers.reduce((sum, s) => sum + s.failureRate, 0) / componentSuppliers.length).toFixed(1)}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Issues by Supplier</CardTitle>
              <CardDescription>Active issues per component vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierIssueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="issues" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Distribution across component types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Regional Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Failure Heatmap</CardTitle>
            <CardDescription>Part failures by geographic region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {regionData.map((region) => (
                <div
                  key={region.region}
                  className={`rounded-lg border p-4 ${
                    region.totalFailures > 150 ? "border-destructive/50 bg-destructive/5" :
                    region.totalFailures > 100 ? "border-yellow-500/50 bg-yellow-500/5" :
                    "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    {region.trend === "up" && <TrendingUp className="h-4 w-4 text-destructive" />}
                    {region.trend === "down" && <TrendingDown className="h-4 w-4 text-green-600" />}
                    {region.trend === "stable" && <Minus className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="text-2xl font-bold">{region.totalFailures}</p>
                  <p className="text-sm text-muted-foreground">Top: {region.topIssue}</p>
                  <Badge 
                    variant={region.trend === "up" ? "destructive" : region.trend === "down" ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {region.trend === "up" ? "+" : region.trend === "down" ? "-" : ""}{region.changePercent}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Part Failures Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Top Reported Part Failures</CardTitle>
                <CardDescription>Issues by part number with repair costs</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search parts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Part #</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Supplier</th>
                    <th className="pb-3 font-medium text-right">Failures</th>
                    <th className="pb-3 font-medium text-right">Avg Cost</th>
                    <th className="pb-3 font-medium">Region</th>
                    <th className="pb-3 font-medium">Affected Models</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFailures.map((pf) => (
                    <tr key={pf.partNumber} className="border-b last:border-0">
                      <td className="py-3">
                        <code className="rounded bg-muted px-2 py-1 text-sm">{pf.partNumber}</code>
                      </td>
                      <td className="py-3 font-medium">{pf.partName}</td>
                      <td className="py-3">{pf.supplierName}</td>
                      <td className="py-3 text-right">
                        <Badge variant={pf.failureCount > 40 ? "destructive" : pf.failureCount > 25 ? "secondary" : "outline"}>
                          {pf.failureCount}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">${pf.avgRepairCost}</td>
                      <td className="py-3">
                        <Badge variant="outline">{pf.region}</Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {pf.affectedModels.slice(0, 2).map((model) => (
                            <Badge key={model} variant="secondary" className="text-xs">{model}</Badge>
                          ))}
                          {pf.affectedModels.length > 2 && (
                            <Badge variant="secondary" className="text-xs">+{pf.affectedModels.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
