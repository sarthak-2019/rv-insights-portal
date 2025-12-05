import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallLog, sampleTranscripts, detailedTranscripts, CallAuditTrail } from "@/data/mockData";
import { 
  Phone, Clock, User, Calendar, Building2, Shield, Activity, 
  FileText, Database, CheckCircle, XCircle, AlertCircle, 
  Brain, Lock, Server, History, TrendingUp, Zap, Eye
} from "lucide-react";

interface TranscriptModalProps {
  call: CallLog | null;
  open: boolean;
  onClose: () => void;
}

// Generate mock audit trail for calls without detailed data
function generateMockAuditTrail(call: any): any {
  return {
    sessionId: `SES-${call.id.replace("CALL-", "")}`,
    callId: call.id,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 480000).toISOString(),
    duration: call.duration,
    callerIdentifier: call.phoneNumber,
    accountId: `ACC-${Math.floor(Math.random() * 90000) + 10000}`,
    ticketId: `TKT-${Math.floor(Math.random() * 9000) + 1000}`,
    channel: "Inbound Phone",
    agentUsed: "AI Voice Agent v3.2.1",
    aiInterpretations: [
      {
        userUtterance: call.transcript.substring(0, 60) + "...",
        parsedIntent: call.issueType === "parts" ? "parts_inquiry" : call.issueType === "motor" ? "motor_diagnostic" : "general_inquiry",
        entities: [`issue:${call.issueType}`, `company:${call.companyName}`, `vin:${call.vin}`],
        confidence: 0.88 + Math.random() * 0.1,
        aiResponse: "I understand. Let me help you with that.",
        fallbackTriggered: false
      }
    ],
    actions: [
      { timestamp: "00:00:15", actionType: "lookup", description: "Retrieved customer account", system: "CRM", result: "success" },
      { timestamp: "00:01:30", actionType: "lookup", description: `Fetched VIN history: ${call.vin}`, system: "VehicleDB", result: "success" },
      { timestamp: "00:03:45", actionType: "create", description: "Created service ticket", system: "ServiceNow", result: "success" },
      { timestamp: "00:05:00", actionType: "api_call", description: "Sent confirmation email", system: "EmailService", result: "success" }
    ],
    security: {
      modelVersion: "voice_agent_v3.2.1",
      authenticationStatus: "verified",
      authMethod: "Account PIN Verification",
      accessLevel: "standard_customer",
      redactionApplied: true,
      redactedFields: ["credit_card", "ssn_last4"],
      processingRegion: "US-East",
      dataCenter: "us-east-1",
      encryptionStatus: "AES-256 at rest, TLS 1.3 in transit",
      complianceFlags: ["SOC2", "PCI-DSS", "GDPR"]
    },
    quality: {
      intentClassification: `${call.issueType}_support`,
      intentConfidence: 0.89,
      sentimentAnalysis: { start: "neutral", end: "positive", trend: "improving" },
      resolutionStatus: call.status === "completed" ? "resolved_by_ai" : call.status === "issue" ? "escalated" : "transferred",
      outcomeTag: call.status === "completed" ? "issue_resolved" : "requires_followup",
      customerSatisfactionPredicted: 4.0 + Math.random() * 0.8
    },
    changeHistory: [
      { timestamp: new Date().toISOString(), changedBy: "system", changeType: "auto_tag", description: `Applied '${call.issueType}' tag` },
      { timestamp: new Date().toISOString(), changedBy: "system", changeType: "quality_score", description: "Quality review completed" }
    ]
  };
}

export function TranscriptModal({ call, open, onClose }: any) {
  if (!call) return null;

  const transcript = sampleTranscripts[call.id] || generateMockTranscript(call);
  const detailedData = detailedTranscripts[call.id];
  const auditTrail = detailedData?.auditTrail || generateMockAuditTrail(call);

  const getStatusIcon = (result: string) => {
    switch (result) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failure": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAuthBadgeVariant = (status: string) => {
    switch (status) {
      case "verified": return "default";
      case "partial": return "secondary";
      default: return "destructive";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Call Details - {call.id}
          </DialogTitle>
        </DialogHeader>

        {/* Call Info Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">
              <span className="text-muted-foreground">Company:</span>{" "}
              <span className="font-medium">{call.companyName}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">
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
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="transcript" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Security
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Quality
            </TabsTrigger>
          </TabsList>

          {/* Transcript Tab */}
          <TabsContent value="transcript" className="mt-4">
            <div className="space-y-4">
              {/* Summary */}
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Call Summary</h4>
                <p className="text-sm">{call.transcript?.substring(0, 200) + "..."}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Issue Type:</span>
                  <Badge variant="secondary" className="capitalize">{call.issueType}</Badge>
                </div>
              </div>

              {/* Full Transcript */}
              <div className="rounded-lg border border-border">
                <div className="border-b border-border bg-secondary/30 px-4 py-2">
                  <h4 className="text-sm font-medium">Full Transcript</h4>
                </div>
                <ScrollArea className="h-[250px] p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {transcript}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="ai" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Interpretations
                  </h4>
                  <div className="space-y-4">
                    {auditTrail.aiInterpretations.map((interp, idx) => (
                      <div key={idx} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground">User Utterance:</span>
                          <p className="text-sm font-medium">"{interp.userUtterance}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs text-muted-foreground">Parsed Intent:</span>
                            <Badge variant="outline" className="ml-2">{interp.parsedIntent}</Badge>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Confidence:</span>
                            <span className="ml-2 text-sm font-medium">{(interp.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Entities Extracted:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {interp.entities.map((entity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{entity}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">AI Response:</span>
                          <p className="text-sm italic">"{interp.aiResponse}"</p>
                        </div>
                        {interp.fallbackTriggered && (
                          <Badge variant="destructive" className="text-xs">Fallback Triggered</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Database className="h-4 w-4 text-primary" />
                    Actions & Integrations Log
                  </h4>
                  <div className="space-y-2">
                    {auditTrail.actions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-lg bg-secondary/30 p-3">
                        {getStatusIcon(action.result)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-mono">{action.timestamp}</span>
                            <Badge variant="outline" className="text-xs capitalize">{action.actionType.replace("_", " ")}</Badge>
                            {action.system && (
                              <Badge variant="secondary" className="text-xs">{action.system}</Badge>
                            )}
                          </div>
                          <p className="text-sm mt-1">{action.description}</p>
                          {action.details && (
                            <p className="text-xs text-muted-foreground mt-1">{action.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Details */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Eye className="h-4 w-4 text-primary" />
                    Session Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Session ID:</span>
                      <span className="ml-2 font-mono">{auditTrail.sessionId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Channel:</span>
                      <span className="ml-2">{auditTrail.channel}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Account ID:</span>
                      <span className="ml-2 font-mono">{auditTrail.accountId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ticket ID:</span>
                      <span className="ml-2 font-mono">{auditTrail.ticketId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agent Used:</span>
                      <span className="ml-2">{auditTrail.agentUsed}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Caller:</span>
                      <span className="ml-2 font-mono">{auditTrail.callerIdentifier}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {/* Authentication & Access */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4 text-primary" />
                    Authentication & Access
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Auth Status:</span>
                        <Badge variant={getAuthBadgeVariant(auditTrail.security.authenticationStatus)} className="capitalize">
                          {auditTrail.security.authenticationStatus}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Method:</span>
                        <span className="ml-2 text-sm">{auditTrail.security.authMethod}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Access Level:</span>
                        <span className="ml-2 text-sm capitalize">{auditTrail.security.accessLevel.replace("_", " ")}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Model Version:</span>
                        <span className="ml-2 text-sm font-mono">{auditTrail.security.modelVersion}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Protection */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Shield className="h-4 w-4 text-primary" />
                    Data Protection
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">PII Redaction:</span>
                      <Badge variant={auditTrail.security.redactionApplied ? "default" : "destructive"}>
                        {auditTrail.security.redactionApplied ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    {auditTrail.security.redactedFields && (
                      <div>
                        <span className="text-sm text-muted-foreground">Redacted Fields:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {auditTrail.security.redactedFields.map((field, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{field}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-muted-foreground">Encryption:</span>
                      <span className="ml-2 text-sm">{auditTrail.security.encryptionStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Server className="h-4 w-4 text-primary" />
                    Infrastructure & Compliance
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Region:</span>
                        <span className="ml-2 text-sm">{auditTrail.security.processingRegion}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Data Center:</span>
                        <span className="ml-2 text-sm font-mono">{auditTrail.security.dataCenter}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Compliance:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {auditTrail.security.complianceFlags.map((flag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{flag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change History */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <History className="h-4 w-4 text-primary" />
                    Change History
                  </h4>
                  <div className="space-y-2">
                    {auditTrail.changeHistory.map((change, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {new Date(change.timestamp).toLocaleTimeString()}
                        </span>
                        <Badge variant="outline" className="text-xs">{change.changeType}</Badge>
                        <span className="text-muted-foreground">by {change.changedBy}:</span>
                        <span>{change.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {/* Intent & Classification */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Brain className="h-4 w-4 text-primary" />
                    Intent Classification
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Primary Intent:</span>
                      <Badge variant="outline" className="ml-2 capitalize">
                        {auditTrail.quality.intentClassification.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <span className="ml-2 text-sm font-medium">{(auditTrail.quality.intentConfidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Sentiment Analysis
                  </h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Start:</span>
                      <Badge variant={auditTrail.quality.sentimentAnalysis.start === "positive" ? "default" : auditTrail.quality.sentimentAnalysis.start === "negative" ? "destructive" : "secondary"} className="capitalize">
                        {auditTrail.quality.sentimentAnalysis.start}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">End:</span>
                      <Badge variant={auditTrail.quality.sentimentAnalysis.end === "positive" ? "default" : auditTrail.quality.sentimentAnalysis.end === "negative" ? "destructive" : "secondary"} className="capitalize">
                        {auditTrail.quality.sentimentAnalysis.end}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Trend:</span>
                      <Badge variant={auditTrail.quality.sentimentAnalysis.trend === "improving" ? "default" : auditTrail.quality.sentimentAnalysis.trend === "declining" ? "destructive" : "secondary"} className="capitalize">
                        {auditTrail.quality.sentimentAnalysis.trend}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Resolution & Outcome */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4 text-primary" />
                    Resolution & Outcome
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Resolution Status:</span>
                      <Badge variant={auditTrail.quality.resolutionStatus === "resolved_by_ai" ? "default" : "secondary"} className="ml-2 capitalize">
                        {auditTrail.quality.resolutionStatus.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Outcome:</span>
                      <Badge variant="outline" className="ml-2 capitalize">
                        {auditTrail.quality.outcomeTag.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    {auditTrail.quality.customerSatisfactionPredicted && (
                      <div className="col-span-2">
                        <span className="text-sm text-muted-foreground">Predicted CSAT:</span>
                        <span className="ml-2 text-lg font-bold text-primary">
                          {auditTrail.quality.customerSatisfactionPredicted.toFixed(1)} / 5.0
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
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