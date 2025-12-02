import { MainLayout } from "@/components/layout/MainLayout";
import { vendorPerformance, companies } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Package, Clock, AlertTriangle, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { FilterHeader } from "@/components/common/FilterHeader";
import { useFilters } from "@/contexts/FilterContext";
import { useDepartment } from "@/contexts/DepartmentContext";

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCompanies, setSelectedCompanies, dateRange, setDateRange } = useFilters();
  const { selectedDepartment } = useDepartment();

  const filteredVendors = vendorPerformance.filter(vendor =>
    vendor.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const avgFailureRate = (vendorPerformance.reduce((acc, v) => acc + v.failureRate, 0) / vendorPerformance.length).toFixed(1);
  const totalWarrantyClaims = vendorPerformance.reduce((acc, v) => acc + v.warrantyClaims, 0);
  const avgSatisfaction = (vendorPerformance.reduce((acc, v) => acc + v.customerSatisfaction, 0) / vendorPerformance.length).toFixed(1);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Component Vendor Performance</h1>
            <p className="mt-1 text-muted-foreground">
              Leverage real performance data across all suppliers
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Header */}
        <FilterHeader
          selectedCompanies={selectedCompanies}
          onCompaniesChange={setSelectedCompanies}
          companies={companies}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Failure Rate</p>
                <p className="text-3xl font-bold text-warning">{avgFailureRate}%</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-warning/20" />
            </div>
          </Card>
          <Card className="p-6 border-destructive/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Warranty Claims</p>
                <p className="text-3xl font-bold text-destructive">{totalWarrantyClaims.toLocaleString()}</p>
              </div>
              <Package className="h-10 w-10 text-destructive/20" />
            </div>
          </Card>
          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                <p className="text-3xl font-bold text-primary">{avgSatisfaction}/5</p>
              </div>
              <Star className="h-10 w-10 text-primary/20" />
            </div>
          </Card>
        </div>

        {/* Vendor Cards */}
        <div className="grid gap-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="p-6 animate-fade-in">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{vendor.vendor}</h3>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(vendor.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(vendor.trend)}`}>
                          {vendor.trend === "up" ? "Improving" : vendor.trend === "down" ? "Declining" : "Stable"}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">{vendor.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-warning fill-warning" />
                    <span className="text-2xl font-bold">{vendor.customerSatisfaction}</span>
                    <span className="text-muted-foreground">/5</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Units</p>
                    <p className="text-xl font-bold">{vendor.totalUnits.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Failure Rate</p>
                    <p className="text-xl font-bold text-warning">{vendor.failureRate}%</p>
                    <Progress value={vendor.failureRate} className="h-1 mt-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Warranty Claims</p>
                    <p className="text-xl font-bold text-destructive">{vendor.warrantyClaims.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Avg Repair Time</p>
                    </div>
                    <p className="text-xl font-bold">{vendor.avgRepairTime}</p>
                  </div>
                </div>

                {/* Top Issues */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Top Issues</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.topIssues.map((issue, idx) => (
                      <Badge key={idx} variant="secondary">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
