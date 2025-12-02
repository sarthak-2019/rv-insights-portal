import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Phone,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Brain,
  Target,
  Package,
  AlertTriangle,
  Mail,
  Filter,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDepartment } from "@/contexts/DepartmentContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Phone, label: "Call Logs", path: "/call-logs" },
  { icon: Building2, label: "Companies", path: "/companies" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Brain, label: "AI Predictive", path: "/ai-predictive" },
  { icon: Target, label: "AI Performance", path: "/ai-performance" },
  { icon: Package, label: "Vendors", path: "/vendors" },
  { icon: AlertTriangle, label: "Escalations", path: "/escalations" },
  { icon: Users, label: "Team", path: "/team" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Mail, label: "Auto-Email", path: "/auto-email" },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedDepartment, setSelectedDepartment } = useDepartment();

  const departmentOptions = [
    { value: "all", label: "All Departments" },
    { value: "retail", label: "Retail" },
    { value: "service", label: "Service" },
    { value: "maintenance", label: "Maintenance" },
    { value: "compliance", label: "Compliance" },
    { value: "claims", label: "Claims / Warranty" },
    { value: "manufacturer", label: "Manufacturer" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">RV</span>
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">AI Portal</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">RV</span>
            </div>
          )}
        </div>

        {/* Department Filter */}
        <div className="border-b border-sidebar-border px-3 py-3">
          {!collapsed ? (
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="h-9 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <button
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-sidebar-accent"
              title="Department Filter"
            >
              <Filter className="h-5 w-5 text-sidebar-foreground" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "sidebar-item",
                  isActive && "sidebar-item-active",
                  collapsed && "justify-center px-3"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-item w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-3",
              collapsed && "justify-center"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium text-sidebar-accent-foreground">
              AD
            </div>
            {!collapsed && (
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                <p className="text-xs text-sidebar-muted">admin@rvportal.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
