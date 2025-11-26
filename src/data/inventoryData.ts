// Manufacturer/Parts Inventory Data

export interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  supplier: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  status: "in-stock" | "low-stock" | "critical" | "out-of-stock";
  lastOrdered: string;
  leadTimeDays: number;
}

export const inventoryItems: InventoryItem[] = [
  { id: "INV-001", partNumber: "WAL-PLY-1201", name: "Interior Wall Panel - Oak", category: "Walls", supplier: "Patrick Industries", currentStock: 245, minStock: 100, maxStock: 500, unitCost: 89, status: "in-stock", lastOrdered: "2024-01-10", leadTimeDays: 7 },
  { id: "INV-002", partNumber: "CAB-KIT-2401", name: "Kitchen Cabinet Set", category: "Cabinets", supplier: "Patrick Industries", currentStock: 67, minStock: 50, maxStock: 200, unitCost: 450, status: "in-stock", lastOrdered: "2024-01-08", leadTimeDays: 14 },
  { id: "INV-003", partNumber: "ELC-WIR-0501", name: "12V Wiring Harness", category: "Electric", supplier: "Firefly Integrations", currentStock: 32, minStock: 75, maxStock: 300, unitCost: 125, status: "low-stock", lastOrdered: "2024-01-12", leadTimeDays: 5 },
  { id: "INV-004", partNumber: "ROF-MEM-3601", name: "EPDM Roof Membrane", category: "Roof", supplier: "Dicor", currentStock: 156, minStock: 80, maxStock: 400, unitCost: 320, status: "in-stock", lastOrdered: "2024-01-05", leadTimeDays: 10 },
  { id: "INV-005", partNumber: "AC-UNT-1501", name: "15K BTU A/C Unit", category: "AC", supplier: "Dometic", currentStock: 8, minStock: 25, maxStock: 100, unitCost: 890, status: "critical", lastOrdered: "2024-01-14", leadTimeDays: 21 },
  { id: "INV-006", partNumber: "SLD-MOT-0801", name: "Slide-Out Motor Kit", category: "Chassis", supplier: "Lippert", currentStock: 45, minStock: 40, maxStock: 150, unitCost: 380, status: "in-stock", lastOrdered: "2024-01-11", leadTimeDays: 12 },
  { id: "INV-007", partNumber: "AWN-FAB-4201", name: "Awning Fabric - 18ft", category: "Awnings", supplier: "Carefree of Colorado", currentStock: 0, minStock: 20, maxStock: 80, unitCost: 245, status: "out-of-stock", lastOrdered: "2024-01-02", leadTimeDays: 18 },
  { id: "INV-008", partNumber: "REF-DOM-0801", name: "8 Cu Ft Refrigerator", category: "Appliances", supplier: "Dometic", currentStock: 23, minStock: 30, maxStock: 100, unitCost: 780, status: "low-stock", lastOrdered: "2024-01-09", leadTimeDays: 14 },
  { id: "INV-009", partNumber: "WTR-HTR-0601", name: "6 Gal Water Heater", category: "Appliances", supplier: "Suburban", currentStock: 89, minStock: 50, maxStock: 200, unitCost: 420, status: "in-stock", lastOrdered: "2024-01-07", leadTimeDays: 8 },
  { id: "INV-010", partNumber: "BAT-LTH-1001", name: "100Ah Lithium Battery", category: "Electric", supplier: "RELiON Battery", currentStock: 12, minStock: 20, maxStock: 60, unitCost: 1200, status: "low-stock", lastOrdered: "2024-01-13", leadTimeDays: 10 },
];

export interface PurchaseOrder {
  id: string;
  supplier: string;
  orderDate: string;
  expectedDate: string;
  status: "pending" | "shipped" | "received" | "delayed";
  totalAmount: number;
  itemCount: number;
  items: { partNumber: string; name: string; quantity: number; unitCost: number }[];
}

export const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-2024-0156", supplier: "Dometic", orderDate: "2024-01-14", expectedDate: "2024-02-04", status: "pending", totalAmount: 26700, itemCount: 30, items: [{ partNumber: "AC-UNT-1501", name: "15K BTU A/C Unit", quantity: 30, unitCost: 890 }] },
  { id: "PO-2024-0155", supplier: "Firefly Integrations", orderDate: "2024-01-12", expectedDate: "2024-01-17", status: "shipped", totalAmount: 6250, itemCount: 50, items: [{ partNumber: "ELC-WIR-0501", name: "12V Wiring Harness", quantity: 50, unitCost: 125 }] },
  { id: "PO-2024-0154", supplier: "Carefree of Colorado", orderDate: "2024-01-10", expectedDate: "2024-01-28", status: "delayed", totalAmount: 9800, itemCount: 40, items: [{ partNumber: "AWN-FAB-4201", name: "Awning Fabric - 18ft", quantity: 40, unitCost: 245 }] },
  { id: "PO-2024-0153", supplier: "Lippert", orderDate: "2024-01-08", expectedDate: "2024-01-20", status: "shipped", totalAmount: 19000, itemCount: 50, items: [{ partNumber: "SLD-MOT-0801", name: "Slide-Out Motor Kit", quantity: 50, unitCost: 380 }] },
  { id: "PO-2024-0152", supplier: "RELiON Battery", orderDate: "2024-01-06", expectedDate: "2024-01-16", status: "received", totalAmount: 24000, itemCount: 20, items: [{ partNumber: "BAT-LTH-1001", name: "100Ah Lithium Battery", quantity: 20, unitCost: 1200 }] },
];

export interface DefectReport {
  id: string;
  partNumber: string;
  partName: string;
  supplier: string;
  defectType: string;
  severity: "low" | "medium" | "high" | "critical";
  occurrences: number;
  warrantyClaimRate: number;
  firstReported: string;
  status: "investigating" | "confirmed" | "resolved";
}

export const defectReports: DefectReport[] = [
  { id: "DEF-001", partNumber: "AC-UNT-1501", partName: "15K BTU A/C Unit", supplier: "Dometic", defectType: "Compressor Failure", severity: "high", occurrences: 23, warrantyClaimRate: 4.2, firstReported: "2023-11-15", status: "investigating" },
  { id: "DEF-002", partNumber: "SLD-MOT-0801", partName: "Slide-Out Motor Kit", supplier: "Lippert", defectType: "Motor Burnout", severity: "medium", occurrences: 18, warrantyClaimRate: 2.8, firstReported: "2023-12-01", status: "confirmed" },
  { id: "DEF-003", partNumber: "ELC-WIR-0501", partName: "12V Wiring Harness", supplier: "Firefly Integrations", defectType: "Short Circuit", severity: "critical", occurrences: 31, warrantyClaimRate: 5.1, firstReported: "2023-10-20", status: "investigating" },
  { id: "DEF-004", partNumber: "AWN-FAB-4201", partName: "Awning Fabric - 18ft", supplier: "Carefree of Colorado", defectType: "UV Degradation", severity: "low", occurrences: 12, warrantyClaimRate: 1.5, firstReported: "2023-09-10", status: "resolved" },
  { id: "DEF-005", partNumber: "REF-DOM-0801", partName: "8 Cu Ft Refrigerator", supplier: "Dometic", defectType: "Cooling Fan Failure", severity: "medium", occurrences: 15, warrantyClaimRate: 2.3, firstReported: "2023-11-28", status: "confirmed" },
];

// Inventory summary stats
export const inventoryStats = {
  totalSKUs: inventoryItems.length,
  inStock: inventoryItems.filter(i => i.status === "in-stock").length,
  lowStock: inventoryItems.filter(i => i.status === "low-stock").length,
  critical: inventoryItems.filter(i => i.status === "critical").length,
  outOfStock: inventoryItems.filter(i => i.status === "out-of-stock").length,
  totalValue: inventoryItems.reduce((sum, i) => sum + (i.currentStock * i.unitCost), 0),
  pendingOrders: purchaseOrders.filter(p => p.status === "pending" || p.status === "shipped").length,
  openDefects: defectReports.filter(d => d.status !== "resolved").length,
};
