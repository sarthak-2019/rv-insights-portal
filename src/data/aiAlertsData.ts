// AI-Powered Agentic Alerts and Triggers Data

export type AlertPriority = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "acknowledged" | "resolved" | "auto-resolved";
export type AlertType = "reorder" | "failure-spike" | "diagnostic" | "prediction";

export interface AIAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  description: string;
  partNumber?: string;
  partName?: string;
  supplier?: string;
  triggeredAt: string;
  aiConfidence: number;
  automationStatus?: "pending" | "triggered" | "completed" | "cancelled";
  suggestedAction: string;
  estimatedImpact: string;
  relatedData?: {
    currentStock?: number;
    reorderQuantity?: number;
    failureRate?: number;
    previousFailureRate?: number;
    affectedUnits?: number;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: AlertType;
  enabled: boolean;
  triggerCondition: string;
  action: string;
  lastTriggered?: string;
  triggerCount: number;
}

export const aiAlerts: AIAlert[] = [
  {
    id: "ALERT-001",
    type: "reorder",
    priority: "critical",
    status: "active",
    title: "Auto-Reorder Triggered: 15K BTU A/C Units",
    description: "Stock level dropped below critical threshold. AI detected seasonal demand spike pattern and automatically initiated purchase order.",
    partNumber: "AC-UNT-1501",
    partName: "15K BTU A/C Unit",
    supplier: "Dometic",
    triggeredAt: "2024-01-14T08:30:00Z",
    aiConfidence: 94,
    automationStatus: "triggered",
    suggestedAction: "Review and approve PO-2024-0156 for 30 units",
    estimatedImpact: "Prevents 2-week production delay worth $180K",
    relatedData: {
      currentStock: 8,
      reorderQuantity: 30,
    },
  },
  {
    id: "ALERT-002",
    type: "failure-spike",
    priority: "high",
    status: "active",
    title: "Part Failure Spike: 12V Wiring Harness",
    description: "AI detected 340% increase in failure reports over the last 30 days. Pattern analysis suggests potential batch quality issue from supplier.",
    partNumber: "ELC-WIR-0501",
    partName: "12V Wiring Harness",
    supplier: "Firefly Integrations",
    triggeredAt: "2024-01-13T14:22:00Z",
    aiConfidence: 87,
    suggestedAction: "Initiate supplier quality audit and consider alternative sourcing",
    estimatedImpact: "Estimated 45 warranty claims at $2,800 avg = $126K exposure",
    relatedData: {
      failureRate: 5.1,
      previousFailureRate: 1.2,
      affectedUnits: 312,
    },
  },
  {
    id: "ALERT-003",
    type: "diagnostic",
    priority: "medium",
    status: "acknowledged",
    title: "Diagnostic Pattern: Slide-Out Motor Overheating",
    description: "AI analyzed 18 recent service calls and identified common root cause: inadequate thermal protection in coastal installations.",
    partNumber: "SLD-MOT-0801",
    partName: "Slide-Out Motor Kit",
    supplier: "Lippert",
    triggeredAt: "2024-01-12T11:45:00Z",
    aiConfidence: 82,
    suggestedAction: "Issue TSB for coastal installations recommending heat shield retrofit",
    estimatedImpact: "Could reduce motor failures by 35% in affected regions",
    relatedData: {
      failureRate: 2.8,
      affectedUnits: 89,
    },
  },
  {
    id: "ALERT-004",
    type: "reorder",
    priority: "high",
    status: "active",
    title: "Predictive Reorder: Lithium Batteries",
    description: "Based on production schedule and current consumption rate, AI predicts stockout in 8 days. Recommending early reorder.",
    partNumber: "BAT-LTH-1001",
    partName: "100Ah Lithium Battery",
    supplier: "RELiON Battery",
    triggeredAt: "2024-01-14T06:00:00Z",
    aiConfidence: 91,
    automationStatus: "pending",
    suggestedAction: "Approve automated PO for 25 units at current pricing",
    estimatedImpact: "Avoids 3-day production halt affecting 12 units",
    relatedData: {
      currentStock: 12,
      reorderQuantity: 25,
    },
  },
  {
    id: "ALERT-005",
    type: "failure-spike",
    priority: "medium",
    status: "auto-resolved",
    title: "Refrigerator Cooling Fan Issue - Resolved",
    description: "AI detected failure spike, traced to single shipping batch. Affected units quarantined and supplier notified. Issue contained.",
    partNumber: "REF-DOM-0801",
    partName: "8 Cu Ft Refrigerator",
    supplier: "Dometic",
    triggeredAt: "2024-01-10T09:15:00Z",
    aiConfidence: 95,
    suggestedAction: "No action required - resolved automatically",
    estimatedImpact: "Prevented $45K in potential warranty costs",
    relatedData: {
      failureRate: 2.3,
      affectedUnits: 23,
    },
  },
  {
    id: "ALERT-006",
    type: "prediction",
    priority: "low",
    status: "active",
    title: "Demand Forecast: Awning Fabric Surge Expected",
    description: "AI predicts 40% demand increase for awning fabric in Q2 based on RV show bookings and dealer pre-orders.",
    partNumber: "AWN-FAB-4201",
    partName: "Awning Fabric - 18ft",
    supplier: "Carefree of Colorado",
    triggeredAt: "2024-01-14T00:00:00Z",
    aiConfidence: 78,
    automationStatus: "pending",
    suggestedAction: "Increase Q2 order quantities by 40% and confirm supplier capacity",
    estimatedImpact: "Capture $320K additional revenue opportunity",
    relatedData: {
      currentStock: 0,
      reorderQuantity: 80,
    },
  },
];

export const automationRules: AutomationRule[] = [
  {
    id: "RULE-001",
    name: "Critical Stock Auto-Reorder",
    description: "Automatically create PO when stock falls below critical threshold",
    type: "reorder",
    enabled: true,
    triggerCondition: "Current stock < Min stock AND Lead time > 5 days",
    action: "Create purchase order for (Max stock - Current stock) units",
    lastTriggered: "2024-01-14T08:30:00Z",
    triggerCount: 12,
  },
  {
    id: "RULE-002",
    name: "Failure Spike Detection",
    description: "Alert when defect rate exceeds 200% of baseline",
    type: "failure-spike",
    enabled: true,
    triggerCondition: "30-day failure rate > 2x historical average",
    action: "Create high-priority alert and notify quality team",
    lastTriggered: "2024-01-13T14:22:00Z",
    triggerCount: 8,
  },
  {
    id: "RULE-003",
    name: "Predictive Stockout Warning",
    description: "Predict stockouts 7-14 days in advance",
    type: "prediction",
    enabled: true,
    triggerCondition: "Projected stock = 0 within 14 days based on consumption rate",
    action: "Create medium-priority reorder recommendation",
    lastTriggered: "2024-01-14T06:00:00Z",
    triggerCount: 23,
  },
  {
    id: "RULE-004",
    name: "Diagnostic Pattern Recognition",
    description: "Identify common failure patterns from service data",
    type: "diagnostic",
    enabled: true,
    triggerCondition: "≥3 similar service calls within 7 days",
    action: "Analyze root cause and suggest corrective action",
    lastTriggered: "2024-01-12T11:45:00Z",
    triggerCount: 5,
  },
  {
    id: "RULE-005",
    name: "Supplier Quality Degradation",
    description: "Monitor supplier quality metrics over time",
    type: "failure-spike",
    enabled: false,
    triggerCondition: "Supplier defect rate increases >50% over 90 days",
    action: "Flag for supplier review meeting",
    triggerCount: 0,
  },
];

// AI Diagnostic Assistant mock responses
export interface DiagnosticQuery {
  id: string;
  query: string;
  response: string;
  confidence: number;
  relatedParts: string[];
  timestamp: string;
}

export const recentDiagnostics: DiagnosticQuery[] = [
  {
    id: "DIAG-001",
    query: "Why are we seeing increased A/C compressor failures?",
    response: "Analysis of 23 failure reports shows 78% occurred in units manufactured between Oct 15-Nov 2. Cross-referencing with supplier shipments indicates a potential correlation with batch #DC-2023-4421. Recommend quality hold on remaining units from this batch and accelerated testing.",
    confidence: 87,
    relatedParts: ["AC-UNT-1501"],
    timestamp: "2024-01-14T10:30:00Z",
  },
  {
    id: "DIAG-002",
    query: "What's causing the wiring harness short circuits?",
    response: "Pattern analysis reveals 89% of short circuits occur at connector junction C4. Root cause appears to be inadequate strain relief during installation. Suggesting updated installation procedure with additional support bracket.",
    confidence: 92,
    relatedParts: ["ELC-WIR-0501"],
    timestamp: "2024-01-13T16:45:00Z",
  },
  {
    id: "DIAG-003",
    query: "Predict battery demand for next quarter",
    response: "Based on production schedule, historical seasonality, and current dealer orders, Q1 demand projected at 245 units (+18% YoY). Current inventory + incoming orders will cover 89% of projected need. Recommend additional order of 30 units by Jan 20 to maintain safety stock.",
    confidence: 84,
    relatedParts: ["BAT-LTH-1001"],
    timestamp: "2024-01-12T09:00:00Z",
  },
];

// Alert statistics
export const alertStats = {
  totalActive: aiAlerts.filter(a => a.status === "active").length,
  criticalCount: aiAlerts.filter(a => a.priority === "critical" && a.status === "active").length,
  autoResolved: aiAlerts.filter(a => a.status === "auto-resolved").length,
  avgConfidence: Math.round(aiAlerts.reduce((sum, a) => sum + a.aiConfidence, 0) / aiAlerts.length),
  automationsTriggered: automationRules.reduce((sum, r) => sum + r.triggerCount, 0),
  estimatedSavings: "$487K",
};
