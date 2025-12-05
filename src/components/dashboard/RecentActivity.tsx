import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentActivityItem {
  customerName: string;
  issueSummary: string;
}

interface RecentActivityProps {
  logs: RecentActivityItem[];
}

export function RecentActivity({ logs }: RecentActivityProps) {
  const [expandedAll, setExpandedAll] = useState(false);
  const itemsToShow = expandedAll ? logs.length : 5;

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Badge variant="secondary" className="text-xs">
          {logs.length} issues
        </Badge>
      </div>

      <div className="space-y-3">
        {logs && logs.length > 0 ? (
          logs.slice(0, itemsToShow).map((activity, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-lg border border-border bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors animate-fade-in"
            >
              <div className="mt-0.5 flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.customerName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {activity.issueSummary}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-6">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>

      {logs && logs.length > 5 && (
        <Button
          variant="outline"
          onClick={() => setExpandedAll(!expandedAll)}
          className="mt-4 w-full gap-2"
        >
          {expandedAll ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              View all ({logs.length})
            </>
          )}
        </Button>
      )}
    </Card>
  );
}
