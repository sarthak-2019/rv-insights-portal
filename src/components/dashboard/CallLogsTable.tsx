import { useState } from "react";
import { CallLog } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, ChevronRight, Phone, Clock, User } from "lucide-react";

interface CallLogsTableProps {
  logs: CallLog[];
  onViewTranscript: (callId: string) => void;
}

const statusStyles = {
  completed: "status-success",
  pending: "status-warning",
  issue: "status-error",
};

const issueTypeStyles = {
  parts: "bg-primary/10 text-primary",
  motor: "bg-accent/10 text-accent",
  warranty: "bg-warning/10 text-warning",
  general: "bg-secondary text-secondary-foreground",
  billing: "bg-destructive/10 text-destructive",
};

export function CallLogsTable({ logs, onViewTranscript }: CallLogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(logs.length / pageSize);

  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="rounded-xl border border-border bg-card animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="data-table-header hover:bg-transparent">
              <TableHead className="w-[120px]">Call ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log, index) => (
              <TableRow
                key={log.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell className="font-mono text-sm">{log.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.companyName}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px]",
                        log.department === "retail"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      {log.department}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{log.customerName}</span>
                    <span className="text-xs text-muted-foreground">
                      {log.phoneNumber}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{log.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {log.duration}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs capitalize", issueTypeStyles[log.issueType])}
                  >
                    {log.issueType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cn("status-badge", statusStyles[log.status])}>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        log.status === "completed" && "bg-success",
                        log.status === "pending" && "bg-warning",
                        log.status === "issue" && "bg-destructive"
                      )}
                    />
                    {log.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{log.agentName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {log.hasTranscript && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTranscript(log.id)}
                      className="h-8 px-2"
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      Transcript
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, logs.length)} of {logs.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
