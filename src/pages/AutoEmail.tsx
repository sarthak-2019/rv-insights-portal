import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, FileText, Video, CheckCircle, Clock, Settings, Zap } from "lucide-react";
import { toast } from "sonner";

interface EmailTrigger {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  template: string;
}

export default function AutoEmail() {
  const [triggers, setTriggers] = useState<EmailTrigger[]>([
    {
      id: "1",
      name: "Post-Call Repair Guide",
      description: "Automatically send repair PDF and video after diagnosing issue",
      enabled: true,
      trigger: "After issue diagnosed",
      template: "repair_guide"
    },
    {
      id: "2",
      name: "Appointment Confirmation",
      description: "Send confirmation email when service appointment is scheduled",
      enabled: true,
      trigger: "Appointment scheduled",
      template: "appointment_confirm"
    },
    {
      id: "3",
      name: "Follow-up Survey",
      description: "Request feedback 24 hours after service completion",
      enabled: false,
      trigger: "24h after service",
      template: "follow_up"
    },
    {
      id: "4",
      name: "Parts Order Update",
      description: "Notify customer when parts are ordered or arrive",
      enabled: true,
      trigger: "Parts status change",
      template: "parts_update"
    }
  ]);

  const [recentEmails] = useState([
    {
      id: "e1",
      recipient: "john.doe@email.com",
      subject: "Your RV Slide-Out Repair Guide",
      trigger: "Post-Call Repair Guide",
      status: "delivered",
      timestamp: "2 min ago",
      attachments: ["slide-out-repair.pdf", "repair-video.mp4"]
    },
    {
      id: "e2",
      recipient: "jane.smith@email.com",
      subject: "Service Appointment Confirmation - Tuesday 9 AM",
      trigger: "Appointment Confirmation",
      status: "delivered",
      timestamp: "15 min ago",
      attachments: ["appointment-details.pdf"]
    },
    {
      id: "e3",
      recipient: "mike.johnson@email.com",
      subject: "Your AC Compressor Parts Have Arrived",
      trigger: "Parts Order Update",
      status: "delivered",
      timestamp: "1 hour ago",
      attachments: []
    }
  ]);

  const toggleTrigger = (id: string) => {
    setTriggers(prev => prev.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
    toast.success("Email trigger updated");
  };

  const testEmail = (triggerName: string) => {
    toast.success(`Test email sent for: ${triggerName}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Auto-Email System</h1>
            <p className="mt-1 text-muted-foreground">
              Automated customer communication workflows
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure SMTP
            </Button>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              New Trigger
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails Sent Today</p>
                <p className="text-3xl font-bold text-primary">247</p>
              </div>
              <Mail className="h-10 w-10 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
                <p className="text-3xl font-bold text-success">98.5%</p>
              </div>
              <CheckCircle className="h-10 w-10 text-success/20" />
            </div>
          </Card>
          <Card className="p-6 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Triggers</p>
                <p className="text-3xl font-bold text-blue-500">{triggers.filter(t => t.enabled).length}</p>
              </div>
              <Zap className="h-10 w-10 text-blue-500/20" />
            </div>
          </Card>
          <Card className="p-6 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-3xl font-bold text-warning">2.3s</p>
              </div>
              <Clock className="h-10 w-10 text-warning/20" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="triggers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="triggers">Email Triggers</TabsTrigger>
            <TabsTrigger value="recent">Recent Emails</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="triggers" className="space-y-4">
            {triggers.map((trigger) => (
              <Card key={trigger.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{trigger.name}</h3>
                      <Badge variant={trigger.enabled ? "default" : "secondary"}>
                        {trigger.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{trigger.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        Trigger: {trigger.trigger}
                      </span>
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Template: {trigger.template}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testEmail(trigger.name)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={trigger.enabled}
                        onCheckedChange={() => toggleTrigger(trigger.id)}
                      />
                      <Label className="text-sm">
                        {trigger.enabled ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {recentEmails.map((email) => (
              <Card key={email.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{email.subject}</h3>
                      <Badge className="bg-success/10 text-success border-success/20">
                        {email.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">To: {email.recipient}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Trigger: {email.trigger}</span>
                        <span className="text-muted-foreground">{email.timestamp}</span>
                      </div>
                      {email.attachments.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {email.attachments.map((att, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {att.endsWith('.pdf') ? <FileText className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                              {att}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Subject Line</Label>
                  <Input
                    placeholder="Your RV Repair Guide - {{issue_type}}"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Email Body</Label>
                  <Textarea
                    placeholder="Dear {{customer_name}},&#10;&#10;Thank you for contacting us about your {{vehicle_model}}. We've diagnosed the issue and prepared a comprehensive repair guide for you..."
                    className="mt-2 min-h-[200px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button>Save Template</Button>
                  <Button variant="outline">Preview</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
