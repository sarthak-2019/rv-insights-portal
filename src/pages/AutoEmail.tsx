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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Mail,
  Send,
  FileText,
  Video,
  CheckCircle,
  Clock,
  Settings,
  Zap,
  Image,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ContentRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  keywords: string[];
  issueTypes: string[];
  contentToSend: {
    pdfs: string[];
    videos: string[];
    images: string[];
    manuals: string[];
  };
  priority: number;
}

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

  const [contentRules, setContentRules] = useState<ContentRule[]>([
    {
      id: "cr1",
      name: "Slide-Out Issues",
      description: "Send slide-out repair guides when customer mentions slide-out problems",
      enabled: true,
      keywords: ["slide-out", "slideout", "slide out", "extension", "retract"],
      issueTypes: ["motor", "parts"],
      contentToSend: {
        pdfs: ["slide-out-repair-guide.pdf", "slide-out-troubleshooting.pdf"],
        videos: ["slide-out-motor-replacement.mp4", "slide-out-alignment.mp4"],
        images: ["slide-out-diagram.png"],
        manuals: ["lippert-slide-out-manual.pdf"]
      },
      priority: 1
    },
    {
      id: "cr2",
      name: "AC/HVAC Problems",
      description: "Send AC repair content for heating and cooling inquiries",
      enabled: true,
      keywords: ["AC", "air conditioning", "HVAC", "cooling", "heating", "thermostat", "compressor"],
      issueTypes: ["parts", "warranty"],
      contentToSend: {
        pdfs: ["ac-troubleshooting-guide.pdf"],
        videos: ["ac-filter-replacement.mp4", "thermostat-calibration.mp4"],
        images: ["ac-unit-diagram.png", "thermostat-wiring.png"],
        manuals: ["dometic-ac-manual.pdf", "coleman-mach-manual.pdf"]
      },
      priority: 2
    },
    {
      id: "cr3",
      name: "Water System Issues",
      description: "Plumbing, water heater, and tank related content",
      enabled: true,
      keywords: ["water", "leak", "plumbing", "water heater", "tank", "pump", "faucet"],
      issueTypes: ["parts", "general"],
      contentToSend: {
        pdfs: ["water-system-overview.pdf", "leak-detection-guide.pdf"],
        videos: ["water-pump-replacement.mp4", "water-heater-maintenance.mp4"],
        images: ["plumbing-schematic.png"],
        manuals: ["atwood-water-heater-manual.pdf"]
      },
      priority: 3
    },
    {
      id: "cr4",
      name: "Electrical Issues",
      description: "Battery, converter, and wiring related content",
      enabled: true,
      keywords: ["battery", "electrical", "wiring", "converter", "inverter", "shore power", "12v", "110v"],
      issueTypes: ["parts", "general"],
      contentToSend: {
        pdfs: ["electrical-safety-guide.pdf", "battery-maintenance.pdf"],
        videos: ["converter-testing.mp4", "battery-replacement.mp4"],
        images: ["electrical-diagram.png", "fuse-panel-layout.png"],
        manuals: ["progressive-dynamics-manual.pdf"]
      },
      priority: 4
    },
    {
      id: "cr5",
      name: "Warranty Claims",
      description: "Send warranty documentation and claim forms",
      enabled: true,
      keywords: ["warranty", "claim", "coverage", "defect", "manufacturer"],
      issueTypes: ["warranty", "claims"],
      contentToSend: {
        pdfs: ["warranty-claim-form.pdf", "warranty-policy.pdf"],
        videos: ["how-to-file-warranty-claim.mp4"],
        images: [],
        manuals: ["warranty-terms-conditions.pdf"]
      },
      priority: 5
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

  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ContentRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<ContentRule>>({
    name: "",
    description: "",
    keywords: [],
    issueTypes: [],
    contentToSend: { pdfs: [], videos: [], images: [], manuals: [] },
    enabled: true,
    priority: contentRules.length + 1
  });
  const [keywordInput, setKeywordInput] = useState("");
  const [contentInput, setContentInput] = useState({ pdf: "", video: "", image: "", manual: "" });

  const toggleTrigger = (id: string) => {
    setTriggers(prev => prev.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
    toast.success("Email trigger updated");
  };

  const toggleContentRule = (id: string) => {
    setContentRules(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
    toast.success("Content rule updated");
  };

  const testEmail = (triggerName: string) => {
    toast.success(`Test email sent for: ${triggerName}`);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setNewRule(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()]
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setNewRule(prev => ({
      ...prev,
      keywords: (prev.keywords || []).filter(k => k !== keyword)
    }));
  };

  const handleAddContent = (type: 'pdf' | 'video' | 'image' | 'manual') => {
    const value = contentInput[type].trim();
    if (value) {
      setNewRule(prev => ({
        ...prev,
        contentToSend: {
          ...prev.contentToSend!,
          [`${type}s`]: [...(prev.contentToSend?.[`${type}s` as keyof typeof prev.contentToSend] || []), value]
        }
      }));
      setContentInput(prev => ({ ...prev, [type]: "" }));
    }
  };

  const handleRemoveContent = (type: 'pdfs' | 'videos' | 'images' | 'manuals', value: string) => {
    setNewRule(prev => ({
      ...prev,
      contentToSend: {
        ...prev.contentToSend!,
        [type]: (prev.contentToSend?.[type] || []).filter(v => v !== value)
      }
    }));
  };

  const handleToggleIssueType = (issueType: string) => {
    setNewRule(prev => ({
      ...prev,
      issueTypes: prev.issueTypes?.includes(issueType)
        ? prev.issueTypes.filter(t => t !== issueType)
        : [...(prev.issueTypes || []), issueType]
    }));
  };

  const handleSaveRule = () => {
    if (!newRule.name || !newRule.keywords?.length) {
      toast.error("Please provide a name and at least one keyword");
      return;
    }

    if (editingRule) {
      setContentRules(prev => prev.map(r => 
        r.id === editingRule.id ? { ...r, ...newRule } as ContentRule : r
      ));
      toast.success("Content rule updated");
    } else {
      const rule: ContentRule = {
        id: `cr${Date.now()}`,
        name: newRule.name!,
        description: newRule.description || "",
        enabled: newRule.enabled ?? true,
        keywords: newRule.keywords || [],
        issueTypes: newRule.issueTypes || [],
        contentToSend: newRule.contentToSend || { pdfs: [], videos: [], images: [], manuals: [] },
        priority: newRule.priority || contentRules.length + 1
      };
      setContentRules(prev => [...prev, rule]);
      toast.success("Content rule created");
    }

    setIsRuleDialogOpen(false);
    setEditingRule(null);
    setNewRule({
      name: "",
      description: "",
      keywords: [],
      issueTypes: [],
      contentToSend: { pdfs: [], videos: [], images: [], manuals: [] },
      enabled: true,
      priority: contentRules.length + 1
    });
  };

  const handleEditRule = (rule: ContentRule) => {
    setEditingRule(rule);
    setNewRule(rule);
    setIsRuleDialogOpen(true);
  };

  const handleDeleteRule = (id: string) => {
    setContentRules(prev => prev.filter(r => r.id !== id));
    toast.success("Content rule deleted");
  };

  const issueTypeOptions = [
    { value: "parts", label: "Parts" },
    { value: "motor", label: "Motor" },
    { value: "warranty", label: "Warranty" },
    { value: "general", label: "General" },
    { value: "billing", label: "Billing" },
    { value: "claims", label: "Claims" }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'pdfs': return <FileText className="h-3 w-3" />;
      case 'videos': return <Video className="h-3 w-3" />;
      case 'images': return <Image className="h-3 w-3" />;
      case 'manuals': return <BookOpen className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Auto-Email System</h1>
            <p className="mt-1 text-muted-foreground">
              Configure AI agent rules for automated content delivery
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
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-3xl font-bold text-blue-500">{contentRules.filter(r => r.enabled).length}</p>
              </div>
              <Zap className="h-10 w-10 text-blue-500/20" />
            </div>
          </Card>
          <Card className="p-6 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Content Matched</p>
                <p className="text-3xl font-bold text-warning">89%</p>
              </div>
              <Clock className="h-10 w-10 text-warning/20" />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="content-rules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content-rules">Content Rules</TabsTrigger>
            <TabsTrigger value="triggers">Email Triggers</TabsTrigger>
            <TabsTrigger value="recent">Recent Emails</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Content Rules Tab */}
          <TabsContent value="content-rules" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">AI Agent Content Rules</h2>
                <p className="text-sm text-muted-foreground">
                  Define what content (PDFs, videos, images, manuals) agents should send based on customer inquiries
                </p>
              </div>
              <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingRule(null);
                    setNewRule({
                      name: "",
                      description: "",
                      keywords: [],
                      issueTypes: [],
                      contentToSend: { pdfs: [], videos: [], images: [], manuals: [] },
                      enabled: true,
                      priority: contentRules.length + 1
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingRule ? "Edit Content Rule" : "Create Content Rule"}</DialogTitle>
                    <DialogDescription>
                      Configure when and what content AI agents should send to customers
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <Label>Rule Name</Label>
                        <Input
                          placeholder="e.g., Slide-Out Issues"
                          value={newRule.name}
                          onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe when this rule should trigger..."
                          value={newRule.description}
                          onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <Label>Trigger Keywords</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        When customer mentions these words, this rule will be triggered
                      </p>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Add keyword..."
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        />
                        <Button type="button" variant="outline" onClick={handleAddKeyword}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newRule.keywords?.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="gap-1">
                            {keyword}
                            <button
                              onClick={() => handleRemoveKeyword(keyword)}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Issue Types */}
                    <div>
                      <Label>Related Issue Types</Label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Select issue categories this rule applies to
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {issueTypeOptions.map((option) => (
                          <div key={option.value} className="flex items-center gap-2">
                            <Checkbox
                              id={option.value}
                              checked={newRule.issueTypes?.includes(option.value)}
                              onCheckedChange={() => handleToggleIssueType(option.value)}
                            />
                            <Label htmlFor={option.value} className="text-sm cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content to Send */}
                    <div className="space-y-4">
                      <Label>Content to Send</Label>
                      <p className="text-xs text-muted-foreground -mt-2">
                        Add files that should be attached when this rule triggers
                      </p>
                      
                      {/* PDFs */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">PDF Documents</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="filename.pdf"
                            value={contentInput.pdf}
                            onChange={(e) => setContentInput(prev => ({ ...prev, pdf: e.target.value }))}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => handleAddContent('pdf')}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {newRule.contentToSend?.pdfs.map((pdf) => (
                            <Badge key={pdf} variant="outline" className="gap-1 text-xs">
                              <FileText className="h-3 w-3" />
                              {pdf}
                              <button onClick={() => handleRemoveContent('pdfs', pdf)} className="ml-1 hover:text-destructive">×</button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Videos */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Videos</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="video.mp4"
                            value={contentInput.video}
                            onChange={(e) => setContentInput(prev => ({ ...prev, video: e.target.value }))}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => handleAddContent('video')}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {newRule.contentToSend?.videos.map((video) => (
                            <Badge key={video} variant="outline" className="gap-1 text-xs">
                              <Video className="h-3 w-3" />
                              {video}
                              <button onClick={() => handleRemoveContent('videos', video)} className="ml-1 hover:text-destructive">×</button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Images */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Images</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="diagram.png"
                            value={contentInput.image}
                            onChange={(e) => setContentInput(prev => ({ ...prev, image: e.target.value }))}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => handleAddContent('image')}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {newRule.contentToSend?.images.map((image) => (
                            <Badge key={image} variant="outline" className="gap-1 text-xs">
                              <Image className="h-3 w-3" />
                              {image}
                              <button onClick={() => handleRemoveContent('images', image)} className="ml-1 hover:text-destructive">×</button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Manuals */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium">Product Manuals</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="manual.pdf"
                            value={contentInput.manual}
                            onChange={(e) => setContentInput(prev => ({ ...prev, manual: e.target.value }))}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => handleAddContent('manual')}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {newRule.contentToSend?.manuals.map((manual) => (
                            <Badge key={manual} variant="outline" className="gap-1 text-xs">
                              <BookOpen className="h-3 w-3" />
                              {manual}
                              <button onClick={() => handleRemoveContent('manuals', manual)} className="ml-1 hover:text-destructive">×</button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveRule}>
                      {editingRule ? "Save Changes" : "Create Rule"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {contentRules.map((rule) => (
              <Card key={rule.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-5 w-5 cursor-grab" />
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded">#{rule.priority}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                    
                    {/* Keywords */}
                    <div className="mb-3">
                      <span className="text-xs font-medium text-muted-foreground">Triggers on:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rule.keywords.map((keyword) => (
                          <Badge key={keyword} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Issue Types */}
                    {rule.issueTypes.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs font-medium text-muted-foreground">Issue Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rule.issueTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs capitalize">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Summary */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {rule.contentToSend.pdfs.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span>{rule.contentToSend.pdfs.length} PDFs</span>
                        </div>
                      )}
                      {rule.contentToSend.videos.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Video className="h-4 w-4 text-blue-500" />
                          <span>{rule.contentToSend.videos.length} Videos</span>
                        </div>
                      )}
                      {rule.contentToSend.images.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Image className="h-4 w-4 text-green-500" />
                          <span>{rule.contentToSend.images.length} Images</span>
                        </div>
                      )}
                      {rule.contentToSend.manuals.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-purple-500" />
                          <span>{rule.contentToSend.manuals.length} Manuals</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleContentRule(rule.id)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

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
