import { cn } from "@/lib/utils";
import { IssueType } from "@/data/mockData";
import { Wrench, Cog, Shield, MessageSquare, CreditCard } from "lucide-react";

interface IssueTypeFilterProps {
  selected: IssueType[];
  onChange: (types: IssueType[]) => void;
}

const issueTypes: { value: IssueType; label: string; icon: typeof Wrench }[] = [
  { value: "parts", label: "Parts", icon: Wrench },
  { value: "motor", label: "Motor", icon: Cog },
  { value: "warranty", label: "Warranty", icon: Shield },
  { value: "general", label: "General", icon: MessageSquare },
  { value: "billing", label: "Billing", icon: CreditCard },
];

export function IssueTypeFilter({ selected, onChange }: IssueTypeFilterProps) {
  const toggleType = (type: IssueType) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {issueTypes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => toggleType(value)}
          className={cn(
            "filter-chip",
            selected.includes(value) && "filter-chip-active"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
