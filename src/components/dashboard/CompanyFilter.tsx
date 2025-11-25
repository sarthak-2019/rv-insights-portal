import { useState, useMemo } from "react";
import { companies } from "@/data/mockData";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface CompanyFilterProps {
  selectedCompanies: number[];
  onSelectionChange: (ids: number[]) => void;
}

export function CompanyFilter({
  selectedCompanies,
  onSelectionChange,
}: CompanyFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedCompanyNames = useMemo(() => {
    return companies
      .filter((c) => selectedCompanies.includes(c.id))
      .map((c) => c.name);
  }, [selectedCompanies]);

  const toggleCompany = (companyId: number) => {
    if (selectedCompanies.includes(companyId)) {
      onSelectionChange(selectedCompanies.filter((id) => id !== companyId));
    } else {
      onSelectionChange([...selectedCompanies, companyId]);
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[200px] justify-between"
          >
            <span className="truncate">
              {selectedCompanies.length === 0
                ? "All Companies"
                : `${selectedCompanies.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search companies..." />
            <CommandList>
              <CommandEmpty>No company found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {companies.map((company) => (
                  <CommandItem
                    key={company.id}
                    value={company.name}
                    onSelect={() => toggleCompany(company.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCompanies.includes(company.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <span>{company.name}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-2 text-xs",
                          company.type === "retail"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent/10 text-accent"
                        )}
                      >
                        {company.type}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCompanies.length > 0 && (
        <>
          <div className="flex flex-wrap gap-1">
            {selectedCompanyNames.slice(0, 3).map((name) => (
              <Badge key={name} variant="secondary" className="text-xs">
                {name}
              </Badge>
            ))}
            {selectedCompanyNames.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedCompanyNames.length - 3} more
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        </>
      )}
    </div>
  );
}
