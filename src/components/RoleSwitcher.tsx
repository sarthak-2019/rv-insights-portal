import { useState, useEffect } from "react";
import { roles, getCurrentRole, setCurrentRole, UserRole, RoleConfig } from "@/data/roleData";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Shield, User, Building2, Wrench, FileCheck, Package, Truck, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roleIcons: Record<UserRole, React.ElementType> = {
  ceo: Shield,
  service_director: Wrench,
  customer_service_manager: User,
  retail_manager: Building2,
  manufacturer_manager: Package,
  compliance_manager: FileCheck,
  claims_manager: FileCheck,
  supplier_admin: Truck,
  overall_admin: Settings,
};

interface RoleSwitcherProps {
  onRoleChange?: (role: RoleConfig) => void;
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [currentRole, setCurrentRoleState] = useState<RoleConfig>(getCurrentRole());
  const navigate = useNavigate();

  useEffect(() => {
    const role = getCurrentRole();
    setCurrentRoleState(role);
  }, []);

  const handleRoleChange = (roleId: UserRole) => {
    const newRole = roles.find(r => r.id === roleId);
    if (newRole) {
      setCurrentRole(roleId);
      setCurrentRoleState(newRole);
      onRoleChange?.(newRole);
      navigate(newRole.dashboardPath);
    }
  };

  const Icon = roleIcons[currentRole.id];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentRole.label}</span>
          <Badge variant="secondary" className="hidden md:inline-flex text-xs">
            {currentRole.department}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => {
          const RoleIcon = roleIcons[role.id];
          return (
            <DropdownMenuItem
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              className="flex items-start gap-3 py-3 cursor-pointer"
            >
              <RoleIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{role.label}</span>
                  {currentRole.id === role.id && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{role.description}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
