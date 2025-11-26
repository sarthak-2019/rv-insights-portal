import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  aiAlerts,
  automationRules,
  recentDiagnostics,
  alertStats,
  type AIAlert,
  type AlertPriority,
  type AlertType,
} from "@/data/aiAlertsData";
import {
  Bot,
  Bell,
  Zap,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Wrench,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Brain,
} from "lucide-react";
import { toast } from "sonner";

const priorityConfig: Record<AlertPriority, { color: string; icon: typeof AlertCircle }> = {
  critical: { color: "bg-red-500/10 text-red-600 border-red-500/30", icon: AlertCircle },
  high: { color: "bg-orange-500/10 text-orange-600 border-orange-500/30", icon: AlertTriangle },
  medium: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", icon: Clock },
  low: { color: "bg-blue-500/10 text-blue-600 border-blue-500/30", icon: TrendingUp },
};

const typeConfig: Record<AlertType, { label: string; icon: typeof Package }> = {
  reorder: { label: "Auto-Reorder", icon: Package },
  "failure-spike": { label: "Failure Spike", icon: AlertTriangle },
  diagnostic: { label: "Diagnostic", icon: Wrench },
  prediction: { label: "Prediction", icon: TrendingUp },
};

const statusConfig = {
  active: { color: "bg-primary/10 text-primary", label: "Active" },
  acknowledged: { color: "bg-yellow-500/10 text-yellow-600", label: "Acknowledged" },
  resolved: { color: "bg-green-500/10 text-green-600", label: "Resolved" },
  "auto-resolved": { color: "bg-emerald-500/10 text-emerald-600", label: "Auto-Resolved" },
};

export function AIAlertsPanel() {
  const [diagnosticQuery, setDiagnosticQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rules, setRules] = useState(automationRules);

  const handleToggleRule = (ruleId: string) => {
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    toast.success("Automation rule updated");
  };

  const handleAlertAction = (alert: AIAlert, action: "approve" | "dismiss" | "investigate") => {
    const messages = {
      approve: `Approved: ${alert.title}`,
      dismiss: `Dismissed: ${alert.title}`,
      investigate: `Investigation started: ${alert.title}`,
    };
    toast.success(messages[action]);
  };

  const handleDiagnosticSubmit = () => {
    if (!diagnosticQuery.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("AI analysis complete - see results below");
      setDiagnosticQuery("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* AI Stats Header */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Active Alerts
            </CardDescription>
            <CardTitle className="text-2xl">{alertStats.totalActive}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-red-500/30">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              Critical
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{alertStats.criticalCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-500/30">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Auto-Resolved
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{alertStats.autoResolved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Avg Confidence
            </CardDescription>
            <CardTitle className="text-2xl">{alertStats.avgConfidence}%</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="h-4 w-4" />
              Est. Savings
            </CardDescription>
            <CardTitle className="text-2xl text-emerald-600">{alertStats.estimatedSavings}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="h-4 w-4" />
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="automations" className="gap-2">
            <Zap className="h-4 w-4" />
            Automation Rules
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="gap-2">
            <Wrench className="h-4 w-4" />
            AI Diagnostics
          </TabsTrigger>
        </TabsList>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {aiAlerts.map((alert) => {
            const PriorityIcon = priorityConfig[alert.priority].icon;
            const TypeIcon = typeConfig[alert.type].icon;
            
            return (
              <Card key={alert.id} className={`${alert.priority === "critical" ? "border-red-500/50" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 ${priorityConfig[alert.priority].color}`}>
                          <PriorityIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge variant="outline" className="gap-1">
                              <TypeIcon className="h-3 w-3" />
                              {typeConfig[alert.type].label}
                            </Badge>
                            <Badge className={statusConfig[alert.status].color}>
                              {statusConfig[alert.status].label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="font-medium">{alert.aiConfidence}% confidence</span>
                      </div>
                    </div>

                    {/* Details */}
                    {alert.partNumber && (
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Part:</span>{" "}
                          <code className="rounded bg-muted px-2 py-0.5">{alert.partNumber}</code>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Supplier:</span>{" "}
                          <span className="font-medium">{alert.supplier}</span>
                        </div>
                        {alert.relatedData?.currentStock !== undefined && (
                          <div>
                            <span className="text-muted-foreground">Stock:</span>{" "}
                            <span className="font-medium">{alert.relatedData.currentStock} units</span>
                          </div>
                        )}
                        {alert.relatedData?.failureRate !== undefined && (
                          <div>
                            <span className="text-muted-foreground">Failure Rate:</span>{" "}
                            <span className="font-medium text-red-600">{alert.relatedData.failureRate}%</span>
                            {alert.relatedData.previousFailureRate && (
                              <span className="text-muted-foreground"> (was {alert.relatedData.previousFailureRate}%)</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Impact & Action */}
                    <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">Suggested Action: </span>
                          <span className="text-sm text-muted-foreground">{alert.suggestedAction}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">Estimated Impact: </span>
                          <span className="text-sm text-muted-foreground">{alert.estimatedImpact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {alert.status === "active" && (
                      <div className="flex flex-wrap gap-2">
                        {alert.automationStatus === "pending" && (
                          <Button size="sm" onClick={() => handleAlertAction(alert, "approve")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Automation
                          </Button>
                        )}
                        {alert.automationStatus === "triggered" && (
                          <Button size="sm" variant="outline">
                            <ChevronRight className="mr-2 h-4 w-4" />
                            View PO
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleAlertAction(alert, "investigate")}>
                          <Wrench className="mr-2 h-4 w-4" />
                          Investigate
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleAlertAction(alert, "dismiss")}>
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Automation Rules Tab */}
        <TabsContent value="automations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Automation Rules
              </CardTitle>
              <CardDescription>Configure AI-powered triggers and automated actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => {
                  const TypeIcon = typeConfig[rule.type].icon;
                  return (
                    <div
                      key={rule.id}
                      className={`rounded-lg border p-4 transition-colors ${
                        rule.enabled ? "border-primary/30 bg-primary/5" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-2 ${rule.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{rule.name}</h4>
                              <Badge variant="outline">{typeConfig[rule.type].label}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
                            <div className="mt-3 space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Trigger:</span>{" "}
                                <span className="text-muted-foreground">{rule.triggerCondition}</span>
                              </p>
                              <p>
                                <span className="font-medium">Action:</span>{" "}
                                <span className="text-muted-foreground">{rule.action}</span>
                              </p>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <RotateCcw className="h-3 w-3" />
                                {rule.triggerCount} triggers
                              </span>
                              {rule.lastTriggered && (
                                <span>
                                  Last: {new Date(rule.lastTriggered).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Diagnostics Tab */}
        <TabsContent value="diagnostics" className="space-y-4">
          {/* Query Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Diagnostic Assistant
              </CardTitle>
              <CardDescription>
                Ask questions about inventory, failures, or get predictive insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Why are A/C units failing? What should we reorder next week?"
                  value={diagnosticQuery}
                  onChange={(e) => setDiagnosticQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDiagnosticSubmit()}
                  disabled={isProcessing}
                />
                <Button onClick={handleDiagnosticSubmit} disabled={isProcessing || !diagnosticQuery.trim()}>
                  {isProcessing ? (
                    <RotateCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                    AI is analyzing data...
                  </div>
                  <Progress value={66} className="h-1" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Diagnostics */}
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Analysis</CardTitle>
              <CardDescription>Previous diagnostic queries and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDiagnostics.map((diag) => (
                  <div key={diag.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(diag.timestamp).toLocaleDateString()}</span>
                          <Badge variant="outline" className="gap-1">
                            <Brain className="h-3 w-3" />
                            {diag.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="mt-2 font-medium">{diag.query}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{diag.response}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {diag.relatedParts.map((part) => (
                            <Badge key={part} variant="secondary">
                              {part}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
