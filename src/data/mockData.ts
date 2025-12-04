// Mock RV Companies Data
export const companies = [
  { id: 1, name: "Acme RV Sales Co.", type: "service", region: "National" },
  { id: 2, name: "Global RV Center", type: "service", region: "Southeast" },
  { id: 3, name: "Premier Service Hub", type: "retail", region: "Midwest" },
  { id: 4, name: "Coastal Repair Group", type: "retail", region: "Texas" },
  { id: 5, name: "Metro RV Dealership", type: "retail", region: "Texas" },
  { id: 6, name: "Apex Service Center", type: "service", region: "Indiana" },
  { id: 7, name: "Summit RV Services", type: "service", region: "National" },
  { id: 8, name: "Titan Maintenance Co.", type: "manufacturer", region: "Indiana" },
  { id: 9, name: "Stellar Manufacturing Co.", type: "manufacturer", region: "Iowa" },
  { id: 10, name: "Platinum Motors Inc.", type: "manufacturer", region: "Indiana" },
  { id: 11, name: "Horizon Camper Co.", type: "retail", region: "Ohio" },
  { id: 12, name: "Liberty RV Group", type: "service", region: "Indiana" },
  { id: 13, name: "Pioneer Coach Works", type: "manufacturer", region: "Indiana" },
  { id: 14, name: "Cascade RV Industries", type: "retail", region: "Indiana" },
  { id: 15, name: "Sterling Motor Corp.", type: "manufacturer", region: "Indiana" },
  { id: 16, name: "Southern Comfort RV", type: "service", region: "Alabama" },
  { id: 17, name: "Atlas Coach Co.", type: "retail", region: "Indiana" },
  { id: 18, name: "Evergreen RV Group", type: "service", region: "Indiana" },
  { id: 19, name: "Monarch Motorhomes", type: "retail", region: "Indiana" },
  { id: 20, name: "Voyager RV Inc.", type: "service", region: "Indiana" },
  { id: 21, name: "Elite Coach Systems", type: "retail", region: "Indiana" },
  { id: 22, name: "Prestige Luxury RV", type: "service", region: "Indiana" },
  { id: 23, name: "Valley View RV", type: "retail", region: "Indiana" },
  { id: 24, name: "Mountain Ridge RV", type: "maintenance", region: "Indiana" },
  { id: 25, name: "Trailhead RV Co.", type: "retail", region: "Indiana" },
  { id: 26, name: "Frontier Manufacturing", type: "maintenance", region: "Indiana" },
  { id: 27, name: "Redwood RV Sales", type: "retail", region: "Indiana" },
  { id: 28, name: "Heritage RV Center", type: "service", region: "Indiana" },
  { id: 29, name: "Lakeside RV Group", type: "retail", region: "Indiana" },
  { id: 30, name: "Discovery RV Services", type: "service", region: "Indiana" },
  { id: 31, name: "Keystone West RV", type: "retail", region: "Indiana" },
  { id: 32, name: "Navigator RV Co.", type: "service", region: "Indiana" },
  { id: 33, name: "Riverside Coach Inc.", type: "retail", region: "Indiana" },
  { id: 34, name: "Pacific Coast Campers", type: "service", region: "California" },
  { id: 35, name: "Northwest RV Mfg.", type: "manufacturer", region: "Oregon" },
  { id: 36, name: "Tennessee Trail RV", type: "service", region: "Tennessee" },
  { id: 37, name: "Northern Lights RV", type: "retail", region: "Canada" },
  { id: 38, name: "Maple Leaf Motorhomes", type: "service", region: "Canada" },
  { id: 39, name: "Great White North RV", type: "retail", region: "Canada" },
  { id: 40, name: "Midwest Custom RV", type: "maintenance", region: "Minnesota" },
  { id: 41, name: "Heartland Coach Co.", type: "retail", region: "Indiana" },
  { id: 42, name: "Phoenix RV Works", type: "service", region: "Indiana" },
  { id: 43, name: "Dynamic RV Corp.", type: "retail", region: "Indiana" },
  { id: 44, name: "Midwest Auto Designs", type: "maintenance", region: "Indiana" },
  { id: 45, name: "Desert Sun RV", type: "retail", region: "Nevada" },
  { id: 46, name: "Cascade Coach Works", type: "service", region: "Washington" },
  { id: 47, name: "Freedom Trail RV", type: "retail", region: "Canada" },
  { id: 48, name: "Buckeye RV Co.", type: "service", region: "Ohio" },
  { id: 49, name: "Compact Camper Co.", type: "retail", region: "Ohio" },
  { id: 50, name: "Hoosier RV Sales", type: "service", region: "Indiana" },
  { id: 51, name: "Precision RV Tech", type: "retail", region: "Indiana" },
  { id: 52, name: "Wanderlust RV Co.", type: "service", region: "Indiana" },
  { id: 53, name: "Sunset RV Sales", type: "retail", region: "Indiana" },
  { id: 54, name: "Keystone East RV", type: "service", region: "Pennsylvania" },
  { id: 55, name: "Lone Star RV Co.", type: "retail", region: "Texas" },
  { id: 56, name: "Golden State Campers", type: "service", region: "California" },
  { id: 57, name: "North Star Trailers", type: "retail", region: "Minnesota" },
  { id: 58, name: "Gulf Coast RV", type: "service", region: "Texas" },
  { id: 59, name: "Adventure Pod RV", type: "retail", region: "Canada" },
  { id: 60, name: "Sunset Camper Co.", type: "service", region: "California" },
  { id: 61, name: "Outback RV Sales", type: "retail", region: "California" },
  { id: 62, name: "RV Compliance Solutions", type: "compliance", region: "National" },
  { id: 63, name: "National RV Inspections", type: "compliance", region: "National" },
  { id: 64, name: "RV Warranty Services", type: "claims", region: "National" },
  { id: 65, name: "Extended RV Protection", type: "claims", region: "National" },
  { id: 66, name: "Premier RV Claims", type: "claims", region: "Texas" },
];

export type CallStatus = "completed" | "pending" | "issue";
export type IssueType = "parts" | "motor" | "warranty" | "general" | "billing";

export interface CallLog {
  id: string;
  companyId?: number;
  companyName: string;
  customerName: string;
  phoneNumber: string;
  date?: string;
  duration: number; // Changed from string to number (milliseconds)
  status: CallStatus;
  issueType?: IssueType;
  summary?: string;
  hasTranscript?: boolean;
  agentName: string;
  department?: "retail" | "service" | "maintenance" | "compliance" | "claims" | "manufacturer";
  vin?: string;
  callType: "phone_call" | "web_call"; // Added from API
  success: boolean; // Added from API
  customerData?: {
    companyName: string;
    customerName: string;
    phoneNumber: string;
    vinNumber: string;
  };
}

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const agentNames = ["Alex Thompson", "Jordan Lee", "Casey Morgan", "Taylor Smith", "Riley Davis", "Morgan Johnson", "Jamie Wilson", "Quinn Brown"];

const summaries = {
  parts: [
    "Customer inquiring about replacement awning fabric availability",
    "Request for brake controller installation parts",
    "Looking for water pump replacement options",
    "Inquiry about LED light conversion kits",
    "Needs replacement slide-out motor",
    "Seeking fridge parts for 2019 model",
  ],
  motor: [
    "Engine running rough at idle, scheduled diagnostic",
    "Transmission shifting issues reported",
    "Customer reporting unusual exhaust smoke",
    "Generator maintenance inquiry",
    "AC compressor not engaging properly",
    "Leveling system malfunction reported",
  ],
  warranty: [
    "Extended warranty claim for roof leak",
    "Warranty status check for appliances",
    "Filing claim for slide-out seal failure",
    "Factory warranty coverage question",
    "Requesting warranty transfer documentation",
    "Warranty repair authorization needed",
  ],
  general: [
    "New customer orientation scheduling",
    "Questions about winterization services",
    "Campground recommendation request",
    "RV storage availability inquiry",
    "Trade-in value assessment request",
    "Annual service scheduling",
  ],
  billing: [
    "Payment plan inquiry for repairs",
    "Invoice clarification needed",
    "Requesting itemized service breakdown",
    "Extended payment options discussion",
    "Previous balance inquiry",
    "Service estimate approval",
  ],
};

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const subscriber = Math.floor(Math.random() * 9000) + 1000;
  return `(${areaCode}) ${exchange}-${subscriber}`;
}

function generateDuration(): string {
  const minutes = Math.floor(Math.random() * 45) + 2;
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split("T")[0];
}

function generateVIN(): string {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let vin = "";
  for (let i = 0; i < 17; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return vin;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCallLogs(count: number = 500): CallLog[] {
  const logs: CallLog[] = [];
  
  for (let i = 0; i < count; i++) {
    const company = randomElement(companies);
    const issueType = randomElement(["parts", "motor", "warranty", "general", "billing"] as IssueType[]);
    const status = randomElement(["completed", "completed", "completed", "pending", "issue"] as CallStatus[]);
    
    logs.push({
      id: `CALL-${String(i + 1).padStart(6, "0")}`,
      companyId: company.id,
      companyName: company.name,
      customerName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      phoneNumber: generatePhoneNumber(),
      date: randomDate(90),
      duration: Math.floor(Math.random() * 3600000), // Random duration in milliseconds
      status,
      issueType,
      summary: randomElement(summaries[issueType]),
      hasTranscript: Math.random() > 0.3,
      agentName: randomElement(agentNames),
      department: company.type as "retail" | "service",
      vin: generateVIN(),
      callType: randomElement(["phone_call", "web_call"]),
      success: Math.random() > 0.1, // 90% chance of success
      customerData: {
        companyName: company.name,
        customerName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
        phoneNumber: generatePhoneNumber(),
        vinNumber: generateVIN(),
      },
    });
  }
  
  return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const callLogs = generateCallLogs(500);

// Dashboard Statistics
export const dashboardStats = {
  totalCalls: callLogs.length,
  completedCalls: callLogs.filter(c => c.status === "completed").length,
  pendingCalls: callLogs.filter(c => c.status === "pending").length,
  issues: callLogs.filter(c => c.status === "issue").length,
  avgDuration: "12:34",
  totalCompanies: companies.length,
  retailCompanies: companies.filter(c => c.type === "retail").length,
  serviceCompanies: companies.filter(c => c.type === "service").length,
};

// AI Performance Metrics
export interface AIMetrics {
  resolutionAccuracy: number;
  escalationRate: number;
  avgConfidenceScore: number;
  sentimentPositive: number;
  sentimentNeutral: number;
  sentimentNegative: number;
  topErrorTypes: { type: string; count: number; percentage: number }[];
  monthlyTrend: { month: string; accuracy: number; escalations: number }[];
}

export const aiMetrics: AIMetrics = {
  resolutionAccuracy: 94.3,
  escalationRate: 5.7,
  avgConfidenceScore: 89.2,
  sentimentPositive: 72,
  sentimentNeutral: 21,
  sentimentNegative: 7,
  topErrorTypes: [
    { type: "Complex Technical Issue", count: 156, percentage: 42 },
    { type: "Missing Part Information", count: 98, percentage: 26 },
    { type: "Warranty Clarification Needed", count: 67, percentage: 18 },
    { type: "Customer Request for Human", count: 52, percentage: 14 },
  ],
  monthlyTrend: [
    { month: "Jan", accuracy: 89.5, escalations: 8.2 },
    { month: "Feb", accuracy: 91.2, escalations: 7.5 },
    { month: "Mar", accuracy: 92.8, escalations: 6.8 },
    { month: "Apr", accuracy: 93.5, escalations: 6.2 },
    { month: "May", accuracy: 94.3, escalations: 5.7 },
  ],
};

// Predictive Analytics
export interface PredictiveAlert {
  id: string;
  severity: "high" | "medium" | "low";
  category: string;
  prediction: string;
  affectedModels: string[];
  confidence: number;
  estimatedImpact: string;
  timeline: string;
  trend: "increasing" | "stable" | "decreasing";
}

export const predictiveAlerts: PredictiveAlert[] = [
  {
    id: "pred-1",
    severity: "high",
    category: "Electrical",
    prediction: "Firefly Integrations failure rate expected to increase 43% in next 60 days",
    affectedModels: ["Jayco 2023 Models", "Grand Design Momentum", "Forest River Cherokee"],
    confidence: 91,
    estimatedImpact: "~850 additional service calls",
    timeline: "Next 60 days",
    trend: "increasing",
  },
  {
    id: "pred-2",
    severity: "high",
    category: "HVAC",
    prediction: "Dometic AC compressor failures trending up across all 2022-2023 models",
    affectedModels: ["Keystone Montana", "Thor Venetian", "Winnebago Vista"],
    confidence: 87,
    estimatedImpact: "~620 warranty claims",
    timeline: "Next 90 days",
    trend: "increasing",
  },
  {
    id: "pred-3",
    severity: "medium",
    category: "Plumbing",
    prediction: "Water pump seal failures expected in high-humidity regions",
    affectedModels: ["Dutchmen Voltage", "Alliance RV Paradigm"],
    confidence: 78,
    estimatedImpact: "~340 service appointments",
    timeline: "Summer season",
    trend: "stable",
  },
  {
    id: "pred-4",
    severity: "medium",
    category: "Chassis",
    prediction: "Lippert slide mechanism wear patterns indicate service needs",
    affectedModels: ["Grand Design Solitude", "Jayco North Point"],
    confidence: 82,
    estimatedImpact: "~290 maintenance visits",
    timeline: "Next 45 days",
    trend: "increasing",
  },
  {
    id: "pred-5",
    severity: "low",
    category: "Appliances",
    prediction: "Refrigerator cooling efficiency declining in older units",
    affectedModels: ["2020-2021 Models across brands"],
    confidence: 73,
    estimatedImpact: "~180 service calls",
    timeline: "Ongoing",
    trend: "stable",
  },
];

// Component Vendor Performance
export interface VendorPerformance {
  id: string;
  vendor: string;
  category: string;
  totalUnits: number;
  failureRate: number;
  avgRepairTime: string;
  warrantyClaims: number;
  customerSatisfaction: number;
  trend: "up" | "down" | "stable";
  topIssues: string[];
}

export const vendorPerformance: VendorPerformance[] = [
  {
    id: "v-1",
    vendor: "Lippert Components",
    category: "Chassis & Slide Systems",
    totalUnits: 12450,
    failureRate: 8.3,
    avgRepairTime: "3.2 hours",
    warrantyClaims: 1034,
    customerSatisfaction: 3.8,
    trend: "down",
    topIssues: ["Slide mechanism binding", "Leveling jack hydraulics", "Frame alignment"],
  },
  {
    id: "v-2",
    vendor: "Dometic",
    category: "HVAC & Appliances",
    totalUnits: 18920,
    failureRate: 12.7,
    avgRepairTime: "2.8 hours",
    warrantyClaims: 2403,
    customerSatisfaction: 3.2,
    trend: "down",
    topIssues: ["AC compressor failure", "Refrigerator cooling loss", "Thermostat issues"],
  },
  {
    id: "v-3",
    vendor: "Firefly Integrations",
    category: "Electrical Systems",
    totalUnits: 8650,
    failureRate: 15.2,
    avgRepairTime: "4.5 hours",
    warrantyClaims: 1315,
    customerSatisfaction: 2.9,
    trend: "down",
    topIssues: ["Control panel failures", "Battery management", "Solar integration"],
  },
  {
    id: "v-4",
    vendor: "Furrion",
    category: "Electronics & Entertainment",
    totalUnits: 15230,
    failureRate: 6.1,
    avgRepairTime: "1.9 hours",
    warrantyClaims: 929,
    customerSatisfaction: 4.2,
    trend: "stable",
    topIssues: ["Camera system connectivity", "Audio system", "Display issues"],
  },
  {
    id: "v-5",
    vendor: "Truma",
    category: "Heating & Water",
    totalUnits: 9870,
    failureRate: 4.8,
    avgRepairTime: "2.1 hours",
    warrantyClaims: 474,
    customerSatisfaction: 4.5,
    trend: "up",
    topIssues: ["Ignition system", "Water heater efficiency", "Thermostat calibration"],
  },
  {
    id: "v-6",
    vendor: "Winegard",
    category: "Satellite & Antenna",
    totalUnits: 11450,
    failureRate: 7.2,
    avgRepairTime: "1.5 hours",
    warrantyClaims: 824,
    customerSatisfaction: 4.0,
    trend: "stable",
    topIssues: ["Motor mechanism", "Signal reception", "Weather damage"],
  },
];

// Escalation Data
export interface EscalationData {
  id: string;
  callId: string;
  customerName: string;
  company: string;
  reason: string;
  aiConfidence: number;
  escalatedAt: string;
  resolvedBy: string;
  resolutionTime: string;
  outcome: "resolved" | "pending" | "returned-to-ai";
  tags: string[];
}

export const escalations: EscalationData[] = [
  {
    id: "esc-1",
    callId: "CL-2401",
    customerName: "Michael Thompson",
    company: "Camping World",
    reason: "Complex warranty coverage question",
    aiConfidence: 62,
    escalatedAt: "2024-05-15 14:23",
    resolvedBy: "Sarah Johnson",
    resolutionTime: "18 mins",
    outcome: "resolved",
    tags: ["warranty", "policy-clarification"],
  },
  {
    id: "esc-2",
    callId: "CL-2398",
    customerName: "Jennifer White",
    company: "Jayco Inc",
    reason: "Customer requested human agent",
    aiConfidence: 85,
    escalatedAt: "2024-05-15 13:45",
    resolvedBy: "Marcus Chen",
    resolutionTime: "12 mins",
    outcome: "resolved",
    tags: ["customer-preference", "high-confidence"],
  },
  {
    id: "esc-3",
    callId: "CL-2389",
    customerName: "David Rodriguez",
    company: "Lazy Days RV",
    reason: "Missing technical specifications",
    aiConfidence: 45,
    escalatedAt: "2024-05-15 11:32",
    resolvedBy: "Tech Team",
    resolutionTime: "45 mins",
    outcome: "resolved",
    tags: ["technical", "parts-database"],
  },
  {
    id: "esc-4",
    callId: "CL-2376",
    customerName: "Lisa Anderson",
    company: "Thor Industries",
    reason: "Multiple interconnected issues",
    aiConfidence: 58,
    escalatedAt: "2024-05-15 09:15",
    resolvedBy: "James Wilson",
    resolutionTime: "32 mins",
    outcome: "resolved",
    tags: ["complex", "multiple-systems"],
  },
  {
    id: "esc-5",
    callId: "CL-2365",
    customerName: "Robert Martinez",
    company: "Keystone RV",
    reason: "AI uncertainty on repair approach",
    aiConfidence: 51,
    escalatedAt: "2024-05-14 16:50",
    resolvedBy: "Pending",
    resolutionTime: "-",
    outcome: "pending",
    tags: ["low-confidence", "repair-method"],
  },
];

// Repair Issues Heatmap
export interface RepairIssue {
  category: string;
  issue: string;
  count: number;
  severity: "critical" | "high" | "medium" | "low";
  trend: number;
  topModels: string[];
}

export const repairIssues: RepairIssue[] = [
  { category: "Electrical", issue: "Firefly Control Panel", count: 287, severity: "critical", trend: 43, topModels: ["Jayco 2023", "Grand Design"] },
  { category: "HVAC", issue: "Dometic AC Compressor", count: 243, severity: "critical", trend: 38, topModels: ["Thor Venetian", "Keystone Montana"] },
  { category: "Plumbing", issue: "Water Pump Failure", count: 156, severity: "high", trend: -12, topModels: ["Forest River", "Dutchmen"] },
  { category: "Chassis", issue: "Lippert Slide Issues", count: 198, severity: "high", trend: 25, topModels: ["Grand Design Solitude", "Jayco North Point"] },
  { category: "Appliances", issue: "Refrigerator Cooling", count: 134, severity: "medium", trend: 8, topModels: ["Various 2020-2021 Models"] },
  { category: "Electronics", issue: "Camera System", count: 92, severity: "medium", trend: -5, topModels: ["Furrion equipped models"] },
  { category: "Electrical", issue: "Battery Management", count: 167, severity: "high", trend: 31, topModels: ["Lithium models 2023"] },
  { category: "HVAC", issue: "Furnace Ignition", count: 78, severity: "medium", trend: 2, topModels: ["Truma equipped"] },
  { category: "Chassis", issue: "Leveling Jack Hydraulics", count: 112, severity: "high", trend: 18, topModels: ["Lippert equipped"] },
  { category: "Plumbing", issue: "Water Heater", count: 89, severity: "medium", trend: -8, topModels: ["Suburban/Atwood models"] },
];

// Technician Performance
export interface TechnicianMetrics {
  id: string;
  name: string;
  role: string;
  avatar: string;
  totalCalls: number;
  resolvedCalls: number;
  avgHandleTime: string;
  schematicsUsed: number;
  videosWatched: number;
  customerRating: number;
  specializations: string[];
  performanceTrend: "up" | "stable" | "down";
}

export const technicianMetrics: TechnicianMetrics[] = [
  {
    id: "tech-1",
    name: "Sarah Johnson",
    role: "Senior Technician",
    avatar: "SJ",
    totalCalls: 324,
    resolvedCalls: 312,
    avgHandleTime: "14.3 mins",
    schematicsUsed: 189,
    videosWatched: 45,
    customerRating: 4.8,
    specializations: ["Electrical", "HVAC"],
    performanceTrend: "up",
  },
  {
    id: "tech-2",
    name: "Marcus Chen",
    role: "Lead Technician",
    avatar: "MC",
    totalCalls: 298,
    resolvedCalls: 287,
    avgHandleTime: "16.1 mins",
    schematicsUsed: 167,
    videosWatched: 52,
    customerRating: 4.7,
    specializations: ["Plumbing", "Appliances"],
    performanceTrend: "up",
  },
  {
    id: "tech-3",
    name: "James Wilson",
    role: "Technician",
    avatar: "JW",
    totalCalls: 267,
    resolvedCalls: 251,
    avgHandleTime: "18.5 mins",
    schematicsUsed: 142,
    videosWatched: 38,
    customerRating: 4.5,
    specializations: ["Chassis", "Electrical"],
    performanceTrend: "stable",
  },
  {
    id: "tech-4",
    name: "Emily Rodriguez",
    role: "Technician",
    avatar: "ER",
    totalCalls: 245,
    resolvedCalls: 234,
    avgHandleTime: "15.7 mins",
    schematicsUsed: 156,
    videosWatched: 61,
    customerRating: 4.9,
    specializations: ["Electronics", "HVAC"],
    performanceTrend: "up",
  },
  {
    id: "tech-5",
    name: "David Kim",
    role: "Junior Technician",
    avatar: "DK",
    totalCalls: 178,
    resolvedCalls: 165,
    avgHandleTime: "22.4 mins",
    schematicsUsed: 98,
    videosWatched: 74,
    customerRating: 4.3,
    specializations: ["Appliances"],
    performanceTrend: "up",
  },
];

// Enhanced Transcript with Timestamps
export interface TranscriptSegment {
  id: string;
  timestamp: string;
  speaker: "agent" | "customer" | "system";
  text: string;
  sentiment?: "positive" | "neutral" | "negative";
  confidence?: number;
}

// AI Audit Trail Interfaces
export interface AIInterpretation {
  userUtterance: string;
  parsedIntent: string;
  entities: string[];
  confidence: number;
  promptUsed?: string;
  aiResponse: string;
  fallbackTriggered?: boolean;
}

export interface AuditAction {
  timestamp: string;
  actionType: "lookup" | "create" | "update" | "api_call" | "routing" | "escalation";
  description: string;
  system?: string;
  result: "success" | "failure" | "pending";
  details?: string;
}

export interface SecurityMetadata {
  modelVersion: string;
  authenticationStatus: "verified" | "unverified" | "partial";
  authMethod?: string;
  accessLevel: string;
  redactionApplied: boolean;
  redactedFields?: string[];
  processingRegion: string;
  dataCenter: string;
  encryptionStatus: string;
  complianceFlags: string[];
}

export interface QualityMetrics {
  intentClassification: string;
  intentConfidence: number;
  sentimentAnalysis: {
    start: string;
    end: string;
    trend: "improving" | "declining" | "stable";
  };
  resolutionStatus: "resolved_by_ai" | "escalated" | "abandoned" | "transferred";
  outcomeTag: string;
  customerSatisfactionPredicted?: number;
}

export interface CallAuditTrail {
  sessionId: string;
  callId: string;
  startTime: string;
  endTime: string;
  duration: string;
  callerIdentifier: string;
  accountId?: string;
  ticketId?: string;
  channel: string;
  agentUsed: string;
  aiInterpretations: AIInterpretation[];
  actions: AuditAction[];
  security: SecurityMetadata;
  quality: QualityMetrics;
  changeHistory: {
    timestamp: string;
    changedBy: string;
    changeType: string;
    description: string;
  }[];
}

export interface DetailedTranscript {
  callId: string;
  duration: string;
  recordingUrl?: string;
  segments: TranscriptSegment[];
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: {
    overall: "positive" | "neutral" | "negative";
    score: number;
  };
  auditTrail?: CallAuditTrail;
}

export const detailedTranscripts: Record<string, DetailedTranscript> = {
  "CALL-000001": {
    callId: "CALL-000001",
    duration: "8:45",
    segments: [
      { id: "s1", timestamp: "00:00", speaker: "system", text: "Call connected. Recording started." },
      { id: "s2", timestamp: "00:02", speaker: "agent", text: "Thank you for calling RV Support, this is Alex. How can I help you today?", sentiment: "positive", confidence: 0.95 },
      { id: "s3", timestamp: "00:08", speaker: "customer", text: "Hi Alex, I'm calling about my 2021 Keystone Cougar. I'm having issues with my slide-out.", sentiment: "neutral", confidence: 0.88 },
      { id: "s4", timestamp: "00:15", speaker: "agent", text: "I'm sorry to hear that. Can you describe what's happening with the slide-out?", sentiment: "positive", confidence: 0.92 },
      { id: "s5", timestamp: "00:20", speaker: "customer", text: "When I try to extend it, it makes a grinding noise and only goes about halfway out.", sentiment: "negative", confidence: 0.85 },
      { id: "s6", timestamp: "00:28", speaker: "agent", text: "That does sound like it could be an issue with the slide-out motor or possibly the gear mechanism. Have you noticed any debris or obstructions in the track?", sentiment: "neutral", confidence: 0.90 },
      { id: "s7", timestamp: "00:38", speaker: "customer", text: "I checked and the track looks clear.", sentiment: "neutral", confidence: 0.93 },
      { id: "s8", timestamp: "00:42", speaker: "agent", text: "Alright, I'd recommend bringing it in for a diagnostic. We can get you scheduled as early as next Tuesday. Would that work for you?", sentiment: "positive", confidence: 0.94 },
      { id: "s9", timestamp: "00:52", speaker: "customer", text: "Yes, Tuesday works great.", sentiment: "positive", confidence: 0.96 },
      { id: "s10", timestamp: "00:55", speaker: "agent", text: "Perfect. I've got you scheduled for Tuesday at 9 AM. Is there anything else I can help with?", sentiment: "positive", confidence: 0.97 },
      { id: "s11", timestamp: "01:02", speaker: "customer", text: "No, that's all. Thank you!", sentiment: "positive", confidence: 0.98 },
      { id: "s12", timestamp: "01:05", speaker: "agent", text: "You're welcome. We'll see you Tuesday. Have a great day!", sentiment: "positive", confidence: 0.97 },
      { id: "s13", timestamp: "01:10", speaker: "system", text: "Call ended. Total duration: 8 minutes 45 seconds." },
    ],
    summary: "Customer reported grinding noise and partial extension issue with slide-out on 2021 Keystone Cougar. Scheduled diagnostic appointment for Tuesday 9 AM.",
    keyPoints: [
      "Slide-out extending only halfway",
      "Grinding noise during extension",
      "Track appears clear of debris",
      "Appointment scheduled for Tuesday 9 AM"
    ],
    actionItems: [
      "Diagnostic inspection scheduled",
      "Check slide-out motor and gear mechanism",
      "Send confirmation email to customer"
    ],
    sentiment: { overall: "positive", score: 0.82 },
    auditTrail: {
      sessionId: "SES-2024-001234",
      callId: "CALL-000001",
      startTime: "2024-01-15T09:23:45Z",
      endTime: "2024-01-15T09:32:30Z",
      duration: "8:45",
      callerIdentifier: "+1-555-0123",
      accountId: "ACC-78945",
      ticketId: "TKT-2024-5678",
      channel: "Inbound Phone",
      agentUsed: "AI Voice Agent v3.2.1",
      aiInterpretations: [
        {
          userUtterance: "I'm calling about my 2021 Keystone Cougar. I'm having issues with my slide-out.",
          parsedIntent: "report_mechanical_issue",
          entities: ["year:2021", "brand:Keystone", "model:Cougar", "component:slide-out"],
          confidence: 0.94,
          aiResponse: "I'm sorry to hear that. Can you describe what's happening with the slide-out?",
          fallbackTriggered: false
        },
        {
          userUtterance: "When I try to extend it, it makes a grinding noise and only goes about halfway out.",
          parsedIntent: "describe_symptom",
          entities: ["symptom:grinding_noise", "symptom:partial_extension", "severity:moderate"],
          confidence: 0.91,
          aiResponse: "That does sound like it could be an issue with the slide-out motor or possibly the gear mechanism.",
          fallbackTriggered: false
        }
      ],
      actions: [
        { timestamp: "09:24:12", actionType: "lookup", description: "Retrieved customer account #ACC-78945", system: "CRM", result: "success" },
        { timestamp: "09:24:18", actionType: "lookup", description: "Fetched vehicle history for VIN 1KEYSTONE2021COUGAR", system: "VehicleDB", result: "success" },
        { timestamp: "09:28:45", actionType: "lookup", description: "Checked warranty status - Active until 2026-01-15", system: "WarrantySystem", result: "success" },
        { timestamp: "09:29:30", actionType: "create", description: "Created service ticket TKT-2024-5678", system: "ServiceNow", result: "success" },
        { timestamp: "09:30:15", actionType: "create", description: "Scheduled appointment for Tuesday 9 AM", system: "CalendarAPI", result: "success" },
        { timestamp: "09:31:00", actionType: "api_call", description: "Sent confirmation email to customer", system: "EmailService", result: "success" }
      ],
      security: {
        modelVersion: "voice_agent_v3.2.1",
        authenticationStatus: "verified",
        authMethod: "Account PIN + Phone Number Match",
        accessLevel: "standard_customer",
        redactionApplied: true,
        redactedFields: ["credit_card", "ssn_last4"],
        processingRegion: "US-East",
        dataCenter: "us-east-1",
        encryptionStatus: "AES-256 at rest, TLS 1.3 in transit",
        complianceFlags: ["SOC2", "PCI-DSS", "GDPR"]
      },
      quality: {
        intentClassification: "mechanical_support_request",
        intentConfidence: 0.94,
        sentimentAnalysis: { start: "neutral", end: "positive", trend: "improving" },
        resolutionStatus: "resolved_by_ai",
        outcomeTag: "appointment_booked",
        customerSatisfactionPredicted: 4.2
      },
      changeHistory: [
        { timestamp: "2024-01-15T09:32:35Z", changedBy: "system", changeType: "auto_tag", description: "Applied 'slide-out-issue' tag" },
        { timestamp: "2024-01-15T09:33:00Z", changedBy: "system", changeType: "quality_score", description: "Quality review completed - Score: 94%" }
      ]
    }
  },
  "CALL-000002": {
    callId: "CALL-000002",
    duration: "12:30",
    segments: [
      { id: "s1", timestamp: "00:00", speaker: "system", text: "Call connected. Recording started." },
      { id: "s2", timestamp: "00:03", speaker: "agent", text: "Good afternoon, this is Sarah from RV Technical Support. How may I assist you?", sentiment: "positive", confidence: 0.94 },
      { id: "s3", timestamp: "00:09", speaker: "customer", text: "Hi Sarah, I'm having a major problem with my Dometic AC unit. It's completely stopped cooling.", sentiment: "negative", confidence: 0.89 },
      { id: "s4", timestamp: "00:17", speaker: "agent", text: "I understand how frustrating that must be, especially in this heat. Let me help you troubleshoot this. Can you tell me what model year your RV is?", sentiment: "positive", confidence: 0.91 },
      { id: "s5", timestamp: "00:28", speaker: "customer", text: "It's a 2022 Thor Venetian.", sentiment: "neutral", confidence: 0.95 },
      { id: "s6", timestamp: "00:32", speaker: "agent", text: "Thank you. Is the unit turning on at all, or is it completely unresponsive?", sentiment: "neutral", confidence: 0.93 },
      { id: "s7", timestamp: "00:38", speaker: "customer", text: "It turns on, the fan runs, but there's no cold air coming out.", sentiment: "negative", confidence: 0.87 },
      { id: "s8", timestamp: "00:45", speaker: "agent", text: "Okay, that helps narrow it down. It sounds like it could be a compressor issue. Have you checked your circuit breaker to make sure it hasn't tripped?", sentiment: "neutral", confidence: 0.90 },
      { id: "s9", timestamp: "00:55", speaker: "customer", text: "Yes, I checked that first thing. Everything looks fine there.", sentiment: "neutral", confidence: 0.92 },
      { id: "s10", timestamp: "01:00", speaker: "agent", text: "I'm going to send you a diagnostic video that shows how to check the compressor. This is a common issue we've been seeing with 2022-2023 Dometic units. In the meantime, I'll create a priority service ticket.", sentiment: "positive", confidence: 0.88 },
      { id: "s11", timestamp: "01:15", speaker: "customer", text: "That would be great. How soon can someone look at it?", sentiment: "neutral", confidence: 0.90 },
      { id: "s12", timestamp: "01:20", speaker: "agent", text: "I can get you scheduled for tomorrow morning at 8 AM. We'll also check if this is covered under your warranty.", sentiment: "positive", confidence: 0.95 },
      { id: "s13", timestamp: "01:30", speaker: "customer", text: "Perfect, thank you so much for your help!", sentiment: "positive", confidence: 0.97 },
      { id: "s14", timestamp: "01:35", speaker: "agent", text: "You're welcome! I'm sending the video and appointment confirmation to your email now. We'll take good care of you tomorrow.", sentiment: "positive", confidence: 0.96 },
      { id: "s15", timestamp: "01:45", speaker: "system", text: "Call ended. Total duration: 12 minutes 30 seconds." },
    ],
    summary: "Customer reported complete cooling failure on 2022 Thor Venetian Dometic AC unit. Compressor suspected. Priority service scheduled for next day with warranty check.",
    keyPoints: [
      "AC fan running but no cooling",
      "2022 Thor Venetian - Dometic AC",
      "Circuit breaker checked - working fine",
      "Compressor failure suspected",
      "Priority appointment scheduled for 8 AM next day"
    ],
    actionItems: [
      "Send diagnostic video to customer email",
      "Create priority service ticket",
      "Check warranty coverage for Dometic AC",
      "Schedule technician for 8 AM appointment",
      "Send appointment confirmation"
    ],
    sentiment: { overall: "positive", score: 0.78 },
    auditTrail: {
      sessionId: "SES-2024-001235",
      callId: "CALL-000002",
      startTime: "2024-01-15T14:05:00Z",
      endTime: "2024-01-15T14:17:30Z",
      duration: "12:30",
      callerIdentifier: "+1-555-0456",
      accountId: "ACC-12367",
      ticketId: "TKT-2024-5679",
      channel: "Inbound Phone",
      agentUsed: "AI Voice Agent v3.2.1",
      aiInterpretations: [
        {
          userUtterance: "I'm having a major problem with my Dometic AC unit. It's completely stopped cooling.",
          parsedIntent: "report_hvac_issue",
          entities: ["brand:Dometic", "component:AC_unit", "symptom:no_cooling", "urgency:high"],
          confidence: 0.92,
          aiResponse: "I understand how frustrating that must be, especially in this heat. Let me help you troubleshoot this.",
          fallbackTriggered: false
        },
        {
          userUtterance: "It turns on, the fan runs, but there's no cold air coming out.",
          parsedIntent: "describe_symptom",
          entities: ["status:fan_operational", "symptom:no_cold_air", "component:compressor_suspected"],
          confidence: 0.89,
          aiResponse: "Okay, that helps narrow it down. It sounds like it could be a compressor issue.",
          fallbackTriggered: false
        }
      ],
      actions: [
        { timestamp: "14:05:15", actionType: "lookup", description: "Retrieved customer account #ACC-12367", system: "CRM", result: "success" },
        { timestamp: "14:06:00", actionType: "lookup", description: "Fetched vehicle specs for 2022 Thor Venetian", system: "VehicleDB", result: "success" },
        { timestamp: "14:08:30", actionType: "lookup", description: "Searched known issues database for Dometic AC", system: "KnowledgeBase", result: "success", details: "Found 23 similar cases" },
        { timestamp: "14:12:00", actionType: "create", description: "Created priority service ticket TKT-2024-5679", system: "ServiceNow", result: "success" },
        { timestamp: "14:13:45", actionType: "api_call", description: "Sent diagnostic video link", system: "ContentDelivery", result: "success" },
        { timestamp: "14:15:00", actionType: "create", description: "Scheduled priority appointment for 8 AM", system: "CalendarAPI", result: "success" },
        { timestamp: "14:16:30", actionType: "api_call", description: "Triggered warranty check workflow", system: "WarrantySystem", result: "pending" }
      ],
      security: {
        modelVersion: "voice_agent_v3.2.1",
        authenticationStatus: "verified",
        authMethod: "Account Verification Questions",
        accessLevel: "standard_customer",
        redactionApplied: true,
        redactedFields: ["payment_method", "address"],
        processingRegion: "US-East",
        dataCenter: "us-east-1",
        encryptionStatus: "AES-256 at rest, TLS 1.3 in transit",
        complianceFlags: ["SOC2", "PCI-DSS", "GDPR"]
      },
      quality: {
        intentClassification: "hvac_support_urgent",
        intentConfidence: 0.92,
        sentimentAnalysis: { start: "negative", end: "positive", trend: "improving" },
        resolutionStatus: "resolved_by_ai",
        outcomeTag: "priority_appointment_booked",
        customerSatisfactionPredicted: 4.5
      },
      changeHistory: [
        { timestamp: "2024-01-15T14:17:35Z", changedBy: "system", changeType: "priority_flag", description: "Marked as priority - HVAC in summer" },
        { timestamp: "2024-01-15T14:18:00Z", changedBy: "system", changeType: "auto_escalate", description: "Flagged for warranty team review" }
      ]
    }
  }
};

// Sample transcripts (legacy)
export const sampleTranscripts: Record<string, string> = {
  "CALL-000001": detailedTranscripts["CALL-000001"].segments.map(s => 
    s.speaker === "system" ? `[System] ${s.text}` : `${s.speaker === "agent" ? "Agent" : "Customer"}: ${s.text}`
  ).join("\n\n"),
  "CALL-000002": detailedTranscripts["CALL-000002"].segments.map(s => 
    s.speaker === "system" ? `[System] ${s.text}` : `${s.speaker === "agent" ? "Agent" : "Customer"}: ${s.text}`
  ).join("\n\n"),
};
