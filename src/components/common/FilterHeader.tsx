import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDepartment } from "@/contexts/DepartmentContext";

interface FilterHeaderProps {
  selectedCompanies: number[];
  onCompaniesChange: (companies: number[]) => void;
  dateRange?: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  companies: Array<{ id: number; name: string }>;
}

export function FilterHeader({
  selectedCompanies,
  onCompaniesChange,
  dateRange,
  onDateRangeChange,
  companies,
}: FilterHeaderProps) {
  const { selectedDepartment } = useDepartment();
  const [showCompanySelect, setShowCompanySelect] = useState(false);

  const handleCompanyToggle = (companyId: number) => {
    const isSelected = selectedCompanies.includes(companyId);
    if (isSelected) {
      onCompaniesChange(selectedCompanies.filter((id) => id !== companyId));
    } else {
      onCompaniesChange([...selectedCompanies, companyId]);
    }
  };

  const selectedCompanyNames = selectedCompanies
    .map((id) => companies.find((c) => c.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4 animate-fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Company Filter */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-sm font-medium text-muted-foreground">Company</span>
          <Popover open={showCompanySelect} onOpenChange={setShowCompanySelect}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start h-10 w-full lg:w-[280px]"
              >
                {selectedCompanies.length === 0
                  ? "All Companies"
                  : selectedCompanies.length === 1
                  ? selectedCompanyNames
                  : `${selectedCompanies.length} companies selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-3" align="start">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Select Companies</span>
                  {selectedCompanies.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCompaniesChange([])}
                      className="h-auto p-1 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {companies.map((company) => (
                    <label
                      key={company.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCompanies.includes(company.id)}
                        onChange={() => handleCompanyToggle(company.id)}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm flex-1">{company.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Department Display (read-only from context) */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-sm font-medium text-muted-foreground">Department</span>
          <div className="h-10 px-3 flex items-center rounded-md border border-border bg-muted/50 text-sm capitalize">
            {selectedDepartment === "all" ? "All Departments" : selectedDepartment}
          </div>
        </div>

        {/* Date Range Filter */}
        {onDateRangeChange && (
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-sm font-medium text-muted-foreground">Date Range</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start h-10 w-full lg:w-[280px]",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: dateRange?.from,
                    to: dateRange?.to,
                  }}
                  onSelect={(range) => {
                    onDateRangeChange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
                {dateRange?.from && (
                  <div className="p-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
                      className="w-full"
                    >
                      Clear dates
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}
