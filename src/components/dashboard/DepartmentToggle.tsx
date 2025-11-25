import { cn } from "@/lib/utils";

interface DepartmentToggleProps {
  selected: "all" | "retail" | "service";
  onChange: (value: "all" | "retail" | "service") => void;
}

export function DepartmentToggle({ selected, onChange }: DepartmentToggleProps) {
  const options = [
    { value: "all" as const, label: "All" },
    { value: "retail" as const, label: "Retail" },
    { value: "service" as const, label: "Service" },
  ];

  return (
    <div className="inline-flex rounded-lg bg-secondary p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-all",
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
