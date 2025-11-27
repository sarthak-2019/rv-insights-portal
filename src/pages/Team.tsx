import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Phone, CheckCircle, TrendingUp, TrendingDown, Minus, FileText, Video, Star } from "lucide-react";
import { callLogs, technicianMetrics } from "@/data/mockData";

export default function Team() {
  const agentStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; pending: number; issues: number }> = {};
    
    callLogs.forEach((log) => {
      if (!stats[log.agentName]) {
        stats[log.agentName] = { total: 0, completed: 0, pending: 0, issues: 0 };
      }
      stats[log.agentName].total++;
      if (log.status === "completed") stats[log.agentName].completed++;
      if (log.status === "pending") stats[log.agentName].pending++;
      if (log.status === "issue") stats[log.agentName].issues++;
    });

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        ...data,
        successRate: Math.round((data.completed / data.total) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Team Performance</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor agent performance and call handling metrics
          </p>
        </div>

        {/* Technician Performance Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {technicianMetrics.map((tech) => {
            const resolutionRate = ((tech.resolvedCalls / tech.totalCalls) * 100).toFixed(1);
            return (
              <Card key={tech.id} className="p-6 animate-fade-in">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {tech.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{tech.name}</h3>
                        <p className="text-sm text-muted-foreground">{tech.role}</p>
                      </div>
                    </div>
                    {getTrendIcon(tech.performanceTrend)}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-warning fill-warning" />
                    <span className="text-xl font-bold">{tech.customerRating}</span>
                    <span className="text-sm text-muted-foreground">/5</span>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Resolution Rate</span>
                        <span className="font-medium">{resolutionRate}%</span>
                      </div>
                      <Progress value={parseFloat(resolutionRate)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Calls</p>
                        <p className="text-lg font-bold">{tech.totalCalls}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resolved</p>
                        <p className="text-lg font-bold text-success">{tech.resolvedCalls}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Avg Handle Time</p>
                      <p className="text-lg font-medium">{tech.avgHandleTime}</p>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Schematics Used</span>
                      </div>
                      <span className="font-medium">{tech.schematicsUsed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" />
                        <span>Videos Watched</span>
                      </div>
                      <span className="font-medium">{tech.videosWatched}</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {tech.specializations.map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Team Members Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">All Team Members</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agentStats.map((agent, index) => (
              <Card
                key={agent.name}
                className="p-6 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(agent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">Support Agent</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-semibold">{agent.total}</p>
                      <p className="text-xs text-muted-foreground">Total Calls</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-lg font-semibold text-success">{agent.successRate}%</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                    {agent.completed} completed
                  </Badge>
                  {agent.pending > 0 && (
                    <Badge variant="secondary" className="bg-warning/10 text-warning text-xs">
                      {agent.pending} pending
                    </Badge>
                  )}
                  {agent.issues > 0 && (
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive text-xs">
                      {agent.issues} issues
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
