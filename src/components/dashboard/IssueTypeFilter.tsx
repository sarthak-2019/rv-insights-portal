import { cn } from "@/lib/utils";
import { IssueType } from "@/data/mockData";
import { Wrench, Cog, Shield, MessageSquare, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IssueTypeFilterProps {
  selected: IssueType[];
  onChange: (selected: IssueType[]) => void;
  availableTypes?: IssueType[];
}

const issueTypes: { value: IssueType; label: string; icon: typeof Wrench }[] = [
  { value: "parts", label: "Parts", icon: Wrench },
  { value: "motor", label: "Motor", icon: Cog },
  { value: "warranty", label: "Warranty", icon: Shield },
  { value: "general", label: "General", icon: MessageSquare },
  { value: "billing", label: "Billing", icon: CreditCard },
];

export function IssueTypeFilter({
  selected,
  onChange,
  availableTypes = [],
}: IssueTypeFilterProps) {
  const types = availableTypes.length > 0 ? availableTypes : ["general", "technical", "billing", "other"] as IssueType[];

  const handleToggle = (type: IssueType) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <Button
          key={type}
          variant={selected.includes(type) ? "default" : "outline"}
          size="sm"
          onClick={() => handleToggle(type)}
          className="capitalize"
        >
          {type}
          {selected.includes(type) && (
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              ✓
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
