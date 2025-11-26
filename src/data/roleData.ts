// Role-based access data

export type UserRole = 
  | "ceo"
  | "service_director"
  | "customer_service_manager"
  | "retail_manager"
  | "manufacturer_manager"
  | "compliance_manager"
  | "claims_manager"
  | "supplier_admin"
  | "overall_admin";

export interface RoleConfig {
  id: UserRole;
  label: string;
  description: string;
  department: string;
  accessLevel: "executive" | "manager" | "specialist" | "admin";
  dashboardPath: string;
  permissions: string[];
}

export const roles: RoleConfig[] = [
  {
    id: "ceo",
    label: "CEO / VP",
    description: "Executive overview with macro-level KPIs",
    department: "Executive",
    accessLevel: "executive",
    dashboardPath: "/executive",
    permissions: ["view_all", "export_reports", "manage_settings"],
  },
  {
    id: "service_director",
    label: "Service Director",
    description: "Real-time service operations and team performance",
    department: "Service",
    accessLevel: "manager",
    dashboardPath: "/service-director",
    permissions: ["view_service", "manage_escalations", "view_transcripts"],
  },
  {
    id: "customer_service_manager",
    label: "Customer Service Manager",
    description: "Call logs, AI handling, agent performance",
    department: "Customer Service",
    accessLevel: "manager",
    dashboardPath: "/",
    permissions: ["view_calls", "view_transcripts", "manage_agents"],
  },
  {
    id: "retail_manager",
    label: "Retail Manager",
    description: "Sales data, parts availability, customer inquiries",
    department: "Retail/Sales",
    accessLevel: "manager",
    dashboardPath: "/retail",
    permissions: ["view_sales", "view_parts", "manage_inventory"],
  },
  {
    id: "manufacturer_manager",
    label: "Manufacturer/Parts Manager",
    description: "Inventory, purchasing, defect tracking",
    department: "Manufacturing",
    accessLevel: "manager",
    dashboardPath: "/manufacturer",
    permissions: ["view_inventory", "manage_orders", "view_defects"],
  },
  {
    id: "compliance_manager",
    label: "Compliance Manager",
    description: "TSB/Recalls, regulatory monitoring",
    department: "Compliance",
    accessLevel: "specialist",
    dashboardPath: "/compliance",
    permissions: ["view_compliance", "manage_tsb", "view_recalls"],
  },
  {
    id: "claims_manager",
    label: "Claims/Warranty Manager",
    description: "Warranty claims, risk assessment",
    department: "Claims/Warranty",
    accessLevel: "specialist",
    dashboardPath: "/claims",
    permissions: ["view_claims", "process_warranty", "view_risk"],
  },
  {
    id: "supplier_admin",
    label: "Component Supplier",
    description: "Vendor-specific parts data and issues",
    department: "External",
    accessLevel: "specialist",
    dashboardPath: "/supplier",
    permissions: ["view_own_parts", "view_own_issues"],
  },
  {
    id: "overall_admin",
    label: "Overall Admin",
    description: "Full system access and configuration",
    department: "IT/Admin",
    accessLevel: "admin",
    dashboardPath: "/",
    permissions: ["all"],
  },
];

export const getCurrentRole = (): RoleConfig => {
  // In a real app, this would come from auth context
  // For demo, default to overall_admin
  const storedRole = localStorage.getItem("demo_role") || "overall_admin";
  return roles.find(r => r.id === storedRole) || roles[roles.length - 1];
};

export const setCurrentRole = (roleId: UserRole): void => {
  localStorage.setItem("demo_role", roleId);
};
