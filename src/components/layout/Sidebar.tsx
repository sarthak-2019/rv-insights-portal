import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Phone,
  Building2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Shield,
  Truck,
  Package,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { RoleSwitcher } from "@/components/RoleSwitcher";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: Shield, label: "Executive", path: "/executive" },
  { icon: LayoutDashboard, label: "Customer Service", path: "/" },
  { icon: Package, label: "Manufacturer", path: "/manufacturer" },
  { icon: Truck, label: "Suppliers", path: "/supplier" },
  { icon: Phone, label: "Call Logs", path: "/calls" },
  { icon: Building2, label: "Companies", path: "/companies" },
  { icon: FileText, label: "Transcripts", path: "/transcripts" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Users, label: "Team", path: "/team" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

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
