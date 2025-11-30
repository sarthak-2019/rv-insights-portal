import { createContext, useContext, useState, ReactNode } from "react";

export type DepartmentType = "all" | "retail" | "service" | "maintenance" | "compliance" | "claims" | "manufacturer";

interface DepartmentContextType {
  selectedDepartment: DepartmentType;
  setSelectedDepartment: (department: DepartmentType) => void;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function DepartmentProvider({ children }: { children: ReactNode }) {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>("all");

  return (
    <DepartmentContext.Provider value={{ selectedDepartment, setSelectedDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartment must be used within a DepartmentProvider");
  }
  return context;
}
