import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CallLog, sampleTranscripts } from "@/data/mockData";
import { Phone, Clock, User, Calendar, Building2 } from "lucide-react";

interface TranscriptModalProps {
  call: CallLog | null;
  open: boolean;
  onClose: () => void;
}

export function TranscriptModal({ call, open, onClose }: TranscriptModalProps) {
  if (!call) return null;

  const transcript = sampleTranscripts[call.id] || generateMockTranscript(call);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Call Transcript - {call.id}
          </DialogTitle>
        </DialogHeader>

        {/* Call Info */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Company:</span>{" "}
              <span className="font-medium">{call.companyName}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Customer:</span>{" "}
              <span className="font-medium">{call.customerName}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Date:</span>{" "}
              <span className="font-medium">{call.date}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Duration:</span>{" "}
              <span className="font-medium">{call.duration}</span>
            </span>
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Issue Type:</span>
            <Badge variant="secondary" className="capitalize">
              {call.issueType}
            </Badge>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg border border-border p-4">
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Call Summary
          </h4>
          <p className="text-sm">{call.summary}</p>
        </div>

        {/* Transcript */}
        <div className="rounded-lg border border-border">
          <div className="border-b border-border bg-secondary/30 px-4 py-2">
            <h4 className="text-sm font-medium">Full Transcript</h4>
          </div>
          <ScrollArea className="h-[300px] p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {transcript}
            </pre>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateMockTranscript(call: CallLog): string {
  return `Agent: Thank you for calling ${call.companyName} support, this is ${call.agentName}. How can I help you today?

Customer: Hi ${call.agentName.split(" ")[0]}, my name is ${call.customerName}. I'm calling about ${call.issueType} related inquiry.

Agent: I'd be happy to help you with that. Can you provide me with more details about your situation?

Customer: Sure. ${call.summary}

Agent: I understand. Let me pull up your information and see what we can do to resolve this for you.

[Agent reviews customer account]

Agent: I've found your account. I can see the details here. Based on what you've described, I recommend we ${call.issueType === "parts" ? "order the replacement parts" : call.issueType === "motor" ? "schedule a diagnostic appointment" : "review your warranty coverage"}.

Customer: That sounds good. What are the next steps?

Agent: I'll create a service ticket for you right now. You should receive a confirmation email within the next few minutes with all the details.

Customer: Perfect, thank you so much for your help!

Agent: You're welcome, ${call.customerName.split(" ")[0]}. Is there anything else I can assist you with today?

Customer: No, that's all I needed. Thanks again!

Agent: My pleasure. Thank you for calling ${call.companyName}. Have a great day!

[Call ended - Duration: ${call.duration}]`;
}
