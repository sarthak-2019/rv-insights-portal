// Executive/CEO Dashboard Data

export interface GlobalKPI {
  id: string;
  name: string;
  value: string | number;
  previousValue: string | number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  period: string;
}

export const globalKPIs: GlobalKPI[] = [
  { id: "total-ai-calls", name: "Total AI Calls Handled", value: "12,847", previousValue: "11,234", change: 14.4, changeType: "positive", period: "30 days" },
  { id: "escalation-rate", name: "Escalation Rate", value: "8.2%", previousValue: "11.5%", change: -28.7, changeType: "positive", period: "30 days" },
  { id: "cost-per-ticket", name: "Cost Per Ticket", value: "$18.50", previousValue: "$24.20", change: -23.6, changeType: "positive", period: "30 days" },
  { id: "warranty-risk", name: "Warranty Risk Reduction", value: "$142K", previousValue: "$98K", change: 44.9, changeType: "positive", period: "30 days" },
  { id: "ai-accuracy", name: "AI Accuracy Score", value: "94.7%", previousValue: "92.1%", change: 2.8, changeType: "positive", period: "30 days" },
  { id: "revenue-impact", name: "Revenue Impact from AI", value: "$2.4M", previousValue: "$1.8M", change: 33.3, changeType: "positive", period: "30 days" },
];

export interface DivisionPerformance {
  division: string;
  callsHandled: number;
  aiHandledPercent: number;
  avgResolutionTime: string;
  customerSatisfaction: number;
  escalationRate: number;
}

export const divisionPerformance: DivisionPerformance[] = [
  { division: "Customer Service", callsHandled: 5420, aiHandledPercent: 78, avgResolutionTime: "4.2 min", customerSatisfaction: 4.6, escalationRate: 6.2 },
  { division: "Retail/Sales", callsHandled: 3180, aiHandledPercent: 65, avgResolutionTime: "6.8 min", customerSatisfaction: 4.4, escalationRate: 8.5 },
  { division: "Service/Maintenance", callsHandled: 2890, aiHandledPercent: 71, avgResolutionTime: "8.1 min", customerSatisfaction: 4.3, escalationRate: 12.1 },
  { division: "Claims/Warranty", callsHandled: 1357, aiHandledPercent: 52, avgResolutionTime: "12.4 min", customerSatisfaction: 4.1, escalationRate: 18.3 },
];

export interface TopIssueByBrand {
  brand: string;
  issue: string;
  count: number;
  trend: "up" | "down" | "stable";
  relatedPart: string;
}

export const topIssuesByBrand: TopIssueByBrand[] = [
  { brand: "Keystone RV", issue: "Slide-Out Malfunction", count: 89, trend: "up", relatedPart: "Lippert Motor" },
  { brand: "Jayco", issue: "A/C Not Cooling", count: 76, trend: "stable", relatedPart: "Dometic A/C" },
  { brand: "Forest River", issue: "Electrical Issues", count: 68, trend: "up", relatedPart: "Firefly System" },
  { brand: "Thor Industries", issue: "Water Heater Failure", count: 54, trend: "down", relatedPart: "Suburban Heater" },
  { brand: "Winnebago", issue: "Awning Problems", count: 45, trend: "stable", relatedPart: "Carefree Awning" },
  { brand: "Grand Design", issue: "Battery Issues", count: 42, trend: "up", relatedPart: "RELiON Battery" },
  { brand: "Coachmen", issue: "Refrigerator Failure", count: 38, trend: "down", relatedPart: "Dometic Fridge" },
  { brand: "Airstream", issue: "Leveling System", count: 35, trend: "stable", relatedPart: "Lippert Leveling" },
];

export interface MonthlyTrend {
  month: string;
  aiCalls: number;
  humanCalls: number;
  escalations: number;
  costSavings: number;
}

export const monthlyTrends: MonthlyTrend[] = [
  { month: "Aug", aiCalls: 8500, humanCalls: 4200, escalations: 890, costSavings: 125000 },
  { month: "Sep", aiCalls: 9200, humanCalls: 3800, escalations: 820, costSavings: 142000 },
  { month: "Oct", aiCalls: 10100, humanCalls: 3500, escalations: 750, costSavings: 168000 },
  { month: "Nov", aiCalls: 11200, humanCalls: 3200, escalations: 680, costSavings: 195000 },
  { month: "Dec", aiCalls: 11800, humanCalls: 2900, escalations: 620, costSavings: 218000 },
  { month: "Jan", aiCalls: 12847, humanCalls: 2650, escalations: 580, costSavings: 245000 },
];

// Company health scores
export interface CompanyHealth {
  companyId: number;
  companyName: string;
  healthScore: number;
  callVolume: number;
  issueRate: number;
  avgResolution: string;
  trend: "improving" | "declining" | "stable";
}

export const companyHealthScores: CompanyHealth[] = [
  { companyId: 1, companyName: "Camping World", healthScore: 92, callVolume: 1245, issueRate: 3.2, avgResolution: "3.8 min", trend: "improving" },
  { companyId: 2, companyName: "Lazy Days RV", healthScore: 88, callVolume: 890, issueRate: 4.1, avgResolution: "4.2 min", trend: "stable" },
  { companyId: 6, companyName: "Keystone RV", healthScore: 85, callVolume: 1120, issueRate: 5.8, avgResolution: "5.1 min", trend: "declining" },
  { companyId: 7, companyName: "Jayco", healthScore: 91, callVolume: 980, issueRate: 3.5, avgResolution: "3.9 min", trend: "improving" },
  { companyId: 10, companyName: "Forest River", healthScore: 83, callVolume: 1340, issueRate: 6.2, avgResolution: "5.8 min", trend: "declining" },
  { companyId: 8, companyName: "Thor Industries", healthScore: 89, callVolume: 756, issueRate: 4.0, avgResolution: "4.5 min", trend: "stable" },
  { companyId: 9, companyName: "Winnebago", healthScore: 94, callVolume: 620, issueRate: 2.8, avgResolution: "3.2 min", trend: "improving" },
  { companyId: 11, companyName: "Airstream", healthScore: 96, callVolume: 420, issueRate: 2.1, avgResolution: "2.9 min", trend: "improving" },
];
