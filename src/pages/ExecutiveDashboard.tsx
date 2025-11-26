import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  globalKPIs,
  divisionPerformance,
  topIssuesByBrand,
  monthlyTrends,
  companyHealthScores,
} from "@/data/executiveData";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Phone,
  DollarSign,
  AlertTriangle,
  Target,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function ExecutiveDashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">Executive Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Macro-level KPIs across all 61 RV brands
          </p>
        </div>

        {/* Global KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {globalKPIs.map((kpi) => (
            <Card key={kpi.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardDescription className="text-sm">{kpi.name}</CardDescription>
                <CardTitle className="text-3xl font-bold">{kpi.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {kpi.changeType === "positive" ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {Math.abs(kpi.change)}%
                    </Badge>
                  ) : kpi.changeType === "negative" ? (
                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
                      <TrendingDown className="mr-1 h-3 w-3" />
                      {Math.abs(kpi.change)}%
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Minus className="mr-1 h-3 w-3" />
                      {kpi.change}%
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">vs previous {kpi.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* AI vs Human Trend */}
          <Card>
            <CardHeader>
              <CardTitle>AI vs Human Call Handling</CardTitle>
              <CardDescription>Monthly trend showing AI adoption</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="aiCalls" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="AI Handled"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humanCalls" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                    name="Human Handled"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Savings */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost Savings</CardTitle>
              <CardDescription>Savings from AI automation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Savings']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="costSavings" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Cost Savings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Division Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Division Performance</CardTitle>
            <CardDescription>Key metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Division</th>
                    <th className="pb-3 font-medium text-right">Calls</th>
                    <th className="pb-3 font-medium text-right">AI Handled</th>
                    <th className="pb-3 font-medium text-right">Avg Resolution</th>
                    <th className="pb-3 font-medium text-right">CSAT</th>
                    <th className="pb-3 font-medium text-right">Escalation</th>
                  </tr>
                </thead>
                <tbody>
                  {divisionPerformance.map((div) => (
                    <tr key={div.division} className="border-b last:border-0">
                      <td className="py-4 font-medium">{div.division}</td>
                      <td className="py-4 text-right">{div.callsHandled.toLocaleString()}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={div.aiHandledPercent} className="w-16 h-2" />
                          <span className="text-sm">{div.aiHandledPercent}%</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">{div.avgResolutionTime}</td>
                      <td className="py-4 text-right">
                        <Badge variant={div.customerSatisfaction >= 4.5 ? "default" : "secondary"}>
                          {div.customerSatisfaction}/5
                        </Badge>
                      </td>
                      <td className="py-4 text-right">
                        <Badge variant={div.escalationRate > 10 ? "destructive" : "outline"}>
                          {div.escalationRate}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Issues by Brand */}
          <Card>
            <CardHeader>
              <CardTitle>Top Issues by Brand</CardTitle>
              <CardDescription>Most reported problems across RV companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topIssuesByBrand.slice(0, 6).map((item) => (
                  <div key={item.brand} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.brand}</p>
                        <p className="text-sm text-muted-foreground">{item.issue}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.count} cases</Badge>
                      {item.trend === "up" && <ArrowUpRight className="h-4 w-4 text-destructive" />}
                      {item.trend === "down" && <ArrowDownRight className="h-4 w-4 text-green-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company Health Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Company Health Scores</CardTitle>
              <CardDescription>Overall operational health by company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyHealthScores.slice(0, 6).map((company) => (
                  <div key={company.companyId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{company.companyName}</span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            company.trend === "improving" ? "default" :
                            company.trend === "declining" ? "destructive" : "secondary"
                          }
                        >
                          {company.trend}
                        </Badge>
                        <span className="font-bold">{company.healthScore}</span>
                      </div>
                    </div>
                    <Progress 
                      value={company.healthScore} 
                      className={`h-2 ${
                        company.healthScore >= 90 ? "[&>div]:bg-green-500" :
                        company.healthScore >= 80 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
