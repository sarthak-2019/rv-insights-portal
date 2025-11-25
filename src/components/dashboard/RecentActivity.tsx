import { CallLog } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Phone, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface RecentActivityProps {
  logs: CallLog[];
}

export function RecentActivity({ logs }: RecentActivityProps) {
  const recentLogs = logs.slice(0, 8);

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {recentLogs.map((log, index) => (
          <div
            key={log.id}
            className="flex items-start gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={cn(
                "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full",
                log.status === "completed" && "bg-success/10 text-success",
                log.status === "pending" && "bg-warning/10 text-warning",
                log.status === "issue" && "bg-destructive/10 text-destructive"
              )}
            >
              {log.status === "completed" && <CheckCircle className="h-4 w-4" />}
              {log.status === "pending" && <Clock className="h-4 w-4" />}
              {log.status === "issue" && <AlertCircle className="h-4 w-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">
                  {log.customerName}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {log.date}
                </span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {log.companyName} • {log.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
