import { MainLayout } from "@/components/layout/MainLayout";
import { aiMetrics } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Target, TrendingUp, AlertCircle, Smile, Meh, Frown } from "lucide-react";

export default function AIPerformance() {
  const sentimentData = [
    { name: "Positive", value: aiMetrics.sentimentPositive, color: "#22c55e" },
    { name: "Neutral", value: aiMetrics.sentimentNeutral, color: "#6b7280" },
    { name: "Negative", value: aiMetrics.sentimentNegative, color: "#ef4444" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">AI Performance Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Real-time accuracy metrics, escalation rates, and sentiment analysis
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-success/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Resolution Accuracy</p>
                <p className="text-3xl font-bold text-success">{aiMetrics.resolutionAccuracy}%</p>
              </div>
              <Target className="h-10 w-10 text-success/20" />
            </div>
            <Progress value={aiMetrics.resolutionAccuracy} className="h-2" />
          </Card>

          <Card className="p-6 border-warning/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Escalation Rate</p>
                <p className="text-3xl font-bold text-warning">{aiMetrics.escalationRate}%</p>
              </div>
              <AlertCircle className="h-10 w-10 text-warning/20" />
            </div>
            <Progress value={aiMetrics.escalationRate} className="h-2" />
          </Card>

          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-3xl font-bold text-primary">{aiMetrics.avgConfidenceScore}%</p>
              </div>
              <TrendingUp className="h-10 w-10 text-primary/20" />
            </div>
            <Progress value={aiMetrics.avgConfidenceScore} className="h-2" />
          </Card>

          <Card className="p-6 border-success/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                <p className="text-3xl font-bold text-success">{aiMetrics.sentimentPositive}%</p>
              </div>
              <Smile className="h-10 w-10 text-success/20" />
            </div>
            <Progress value={aiMetrics.sentimentPositive} className="h-2" />
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Trend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Trend (Last 5 Months)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aiMetrics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
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
                  dataKey="accuracy" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Accuracy %"
                />
                <Line 
                  type="monotone" 
                  dataKey="escalations" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Escalation %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Sentiment Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Smile className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Positive</p>
                  <p className="font-semibold">{aiMetrics.sentimentPositive}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Meh className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Neutral</p>
                  <p className="font-semibold">{aiMetrics.sentimentNeutral}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Frown className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Negative</p>
                  <p className="font-semibold">{aiMetrics.sentimentNegative}%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Types */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Error Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={aiMetrics.topErrorTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </MainLayout>
  );
}
