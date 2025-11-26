// Component Suppliers Data
export interface ComponentSupplier {
  id: number;
  name: string;
  category: string;
  partsCount: number;
  failureRate: number;
  avgResolutionTime: string;
  activeIssues: number;
  regions: string[];
}

export const componentSuppliers: ComponentSupplier[] = [
  { id: 1, name: "Dometic", category: "Climate Control", partsCount: 245, failureRate: 2.3, avgResolutionTime: "4.2 days", activeIssues: 18, regions: ["Midwest", "Southeast", "Texas"] },
  { id: 2, name: "Lippert Components", category: "Chassis & Structural", partsCount: 412, failureRate: 1.8, avgResolutionTime: "3.8 days", activeIssues: 24, regions: ["National"] },
  { id: 3, name: "Airxcel", category: "HVAC & Ventilation", partsCount: 189, failureRate: 2.1, avgResolutionTime: "5.1 days", activeIssues: 12, regions: ["Midwest", "West"] },
  { id: 4, name: "Dicor", category: "Roofing & Sealants", partsCount: 78, failureRate: 0.9, avgResolutionTime: "2.4 days", activeIssues: 5, regions: ["National"] },
  { id: 5, name: "Firefly Integrations", category: "Electrical Systems", partsCount: 156, failureRate: 3.2, avgResolutionTime: "6.3 days", activeIssues: 28, regions: ["Indiana", "Ohio"] },
  { id: 6, name: "RELiON Battery", category: "Lithium Power", partsCount: 34, failureRate: 1.5, avgResolutionTime: "7.2 days", activeIssues: 8, regions: ["National"] },
  { id: 7, name: "Furrion", category: "Electronics & Appliances", partsCount: 203, failureRate: 2.7, avgResolutionTime: "4.8 days", activeIssues: 15, regions: ["Southeast", "Texas"] },
  { id: 8, name: "Suburban", category: "Water Heaters", partsCount: 67, failureRate: 1.2, avgResolutionTime: "3.2 days", activeIssues: 6, regions: ["Midwest"] },
  { id: 9, name: "Atwood", category: "Appliances", partsCount: 145, failureRate: 1.9, avgResolutionTime: "4.1 days", activeIssues: 11, regions: ["National"] },
  { id: 10, name: "Carefree of Colorado", category: "Awnings", partsCount: 89, failureRate: 2.4, avgResolutionTime: "5.5 days", activeIssues: 9, regions: ["West", "Southwest"] },
];

export interface PartFailure {
  partNumber: string;
  partName: string;
  supplierId: number;
  supplierName: string;
  failureCount: number;
  avgRepairCost: number;
  affectedModels: string[];
  region: string;
  lastReported: string;
}

export const partFailures: PartFailure[] = [
  { partNumber: "DOM-AC-2401", partName: "Penguin II A/C Unit", supplierId: 1, supplierName: "Dometic", failureCount: 45, avgRepairCost: 890, affectedModels: ["Keystone Cougar", "Jayco Eagle"], region: "Southeast", lastReported: "2024-01-15" },
  { partNumber: "LIP-SLD-1102", partName: "Slide-Out Motor Assembly", supplierId: 2, supplierName: "Lippert", failureCount: 38, avgRepairCost: 650, affectedModels: ["Forest River Wildwood", "Thor Palazzo"], region: "Midwest", lastReported: "2024-01-14" },
  { partNumber: "FFI-CTL-3301", partName: "Firefly Control Module", supplierId: 5, supplierName: "Firefly Integrations", failureCount: 52, avgRepairCost: 420, affectedModels: ["Grand Design Solitude", "Keystone Montana"], region: "Indiana", lastReported: "2024-01-16" },
  { partNumber: "AXL-FAN-0801", partName: "Fantastic Vent Fan", supplierId: 3, supplierName: "Airxcel", failureCount: 29, avgRepairCost: 180, affectedModels: ["Winnebago Vista", "Coachmen Mirada"], region: "National", lastReported: "2024-01-13" },
  { partNumber: "REL-BAT-1201", partName: "100Ah Lithium Battery", supplierId: 6, supplierName: "RELiON Battery", failureCount: 18, avgRepairCost: 1200, affectedModels: ["Airstream Flying Cloud", "Grand Design Reflection"], region: "West", lastReported: "2024-01-12" },
  { partNumber: "FUR-TV-4201", partName: "32\" LED TV", supplierId: 7, supplierName: "Furrion", failureCount: 33, avgRepairCost: 350, affectedModels: ["Jayco Precept", "Thor Ace"], region: "Texas", lastReported: "2024-01-15" },
  { partNumber: "DOM-REF-1801", partName: "8 Cu Ft Refrigerator", supplierId: 1, supplierName: "Dometic", failureCount: 27, avgRepairCost: 780, affectedModels: ["Keystone Outback", "Forest River Rockwood"], region: "Midwest", lastReported: "2024-01-14" },
  { partNumber: "LIP-LEV-2201", partName: "Ground Control Leveling", supplierId: 2, supplierName: "Lippert", failureCount: 41, avgRepairCost: 520, affectedModels: ["Entegra Cornerstone", "Newmar Dutch Star"], region: "National", lastReported: "2024-01-16" },
];

// Regional failure heatmap data
export interface RegionData {
  region: string;
  totalFailures: number;
  topIssue: string;
  trend: "up" | "down" | "stable";
  changePercent: number;
}

export const regionData: RegionData[] = [
  { region: "Midwest", totalFailures: 156, topIssue: "Slide-Out Motors", trend: "up", changePercent: 12 },
  { region: "Southeast", totalFailures: 134, topIssue: "A/C Units", trend: "down", changePercent: 8 },
  { region: "Texas", totalFailures: 98, topIssue: "Water Heaters", trend: "stable", changePercent: 2 },
  { region: "West", totalFailures: 87, topIssue: "Lithium Batteries", trend: "up", changePercent: 15 },
  { region: "Northeast", totalFailures: 72, topIssue: "Awnings", trend: "down", changePercent: 5 },
  { region: "Southwest", totalFailures: 65, topIssue: "Refrigerators", trend: "stable", changePercent: 1 },
  { region: "Indiana", totalFailures: 189, topIssue: "Electrical Systems", trend: "up", changePercent: 18 },
];
