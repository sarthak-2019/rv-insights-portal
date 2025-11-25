import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { callLogs, CallLog } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TranscriptModal } from "@/components/dashboard/TranscriptModal";
import { Search, FileText, Phone, Calendar, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Transcripts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const logsWithTranscripts = useMemo(() => {
    return callLogs.filter((log) => log.hasTranscript);
  }, []);

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logsWithTranscripts;
    
    const query = searchQuery.toLowerCase();
    return logsWithTranscripts.filter(
      (log) =>
        log.customerName.toLowerCase().includes(query) ||
        log.companyName.toLowerCase().includes(query) ||
        log.id.toLowerCase().includes(query) ||
        log.summary.toLowerCase().includes(query)
    );
  }, [logsWithTranscripts, searchQuery]);

  const handleViewTranscript = (log: CallLog) => {
    setSelectedCall(log);
    setTranscriptOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Transcripts</h1>
          <p className="mt-1 text-muted-foreground">
            Browse and search through {logsWithTranscripts.length} call transcripts
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transcripts by customer, company, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Transcripts Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLogs.map((log, index) => (
            <div
              key={log.id}
              className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => handleViewTranscript(log)}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs capitalize",
                    log.status === "completed" && "bg-success/10 text-success",
                    log.status === "pending" && "bg-warning/10 text-warning",
                    log.status === "issue" && "bg-destructive/10 text-destructive"
                  )}
                >
                  {log.status}
                </Badge>
              </div>

              <h3 className="mt-4 font-semibold">{log.customerName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{log.companyName}</p>

              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {log.summary}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {log.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {log.duration}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {log.agentName}
                </span>
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <span className="text-xs font-mono text-muted-foreground">
                  {log.id}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No transcripts found</h3>
            <p className="mt-1 text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}

        {/* Transcript Modal */}
        <TranscriptModal
          call={selectedCall}
          open={transcriptOpen}
          onClose={() => setTranscriptOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
