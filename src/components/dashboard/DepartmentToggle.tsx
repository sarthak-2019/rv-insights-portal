import { cn } from "@/lib/utils";

interface DepartmentToggleProps {
  selected: "all" | "retail" | "service" | "maintenance" | "compliance" | "claims" | "manufacturer";
  onChange: (value: "all" | "retail" | "service" | "maintenance" | "compliance" | "claims" | "manufacturer") => void;
}

export function DepartmentToggle({ selected, onChange }: DepartmentToggleProps) {
  const options = [
    { value: "all" as const, label: "All" },
    { value: "retail" as const, label: "Retail" },
    { value: "service" as const, label: "Service" },
    { value: "maintenance" as const, label: "Maintenance" },
    { value: "compliance" as const, label: "Compliance" },
    { value: "claims" as const, label: "Claims / Warranty" },
    { value: "manufacturer" as const, label: "Manufacturer" },
  ];

  return (
    <div className="inline-flex flex-wrap rounded-lg bg-secondary p-1 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap",
            selected === option.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
