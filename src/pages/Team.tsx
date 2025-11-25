import { useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { callLogs } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Phone, CheckCircle, AlertTriangle, Clock } from "lucide-react";

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

        {/* Team Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {agentStats.map((agent, index) => (
            <div
              key={agent.name}
              className="rounded-xl border border-border bg-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {getInitials(agent.name)}
                </div>
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
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {agent.completed} completed
                </Badge>
                {agent.pending > 0 && (
                  <Badge variant="secondary" className="bg-warning/10 text-warning">
                    {agent.pending} pending
                  </Badge>
                )}
                {agent.issues > 0 && (
                  <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                    {agent.issues} issues
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
