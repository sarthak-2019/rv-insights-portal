import { createContext, useContext, useState, ReactNode } from "react";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FilterContextType {
  selectedCompanies: number[];
  setSelectedCompanies: (companies: number[]) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  return (
    <FilterContext.Provider
      value={{
        selectedCompanies,
        setSelectedCompanies,
        dateRange,
        setDateRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
