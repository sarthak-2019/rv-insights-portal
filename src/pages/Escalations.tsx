import { MainLayout } from "@/components/layout/MainLayout";
import { escalations, companies } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, CheckCircle, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterHeader } from "@/components/common/FilterHeader";
import { useFilters } from "@/contexts/FilterContext";
import { useDepartment } from "@/contexts/DepartmentContext";

export default function Escalations() {
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");
  const { selectedCompanies, setSelectedCompanies, dateRange, setDateRange } = useFilters();
  const { selectedDepartment } = useDepartment();

  const filteredEscalations = useMemo(() => {
    return escalations.filter(esc => {
      // Filter by outcome
      if (outcomeFilter !== "all" && esc.outcome !== outcomeFilter) return false;
      
      // Filter by company
      if (selectedCompanies.length > 0) {
        const companyMatch = companies.find(c => c.name === esc.company);
        if (!companyMatch || !selectedCompanies.includes(companyMatch.id)) return false;
      }
      
      return true;
    });
  }, [outcomeFilter, selectedCompanies]);

  const resolvedCount = filteredEscalations.filter(e => e.outcome === "resolved").length;
  const pendingCount = filteredEscalations.filter(e => e.outcome === "pending").length;
  const avgConfidence = filteredEscalations.length > 0 
    ? (filteredEscalations.reduce((acc, e) => acc + e.aiConfidence, 0) / filteredEscalations.length).toFixed(1)
    : "0";

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "returned-to-ai":
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "resolved":
        return <Badge className="bg-success/10 text-success border-success/20">Resolved</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case "returned-to-ai":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Returned to AI</Badge>;
      default:
        return <Badge variant="outline">{outcome}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">Escalation Management</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor and analyze escalations to improve AI performance
          </p>
        </div>

        {/* Filter Header */}
        <FilterHeader
          selectedCompanies={selectedCompanies}
          onCompaniesChange={setSelectedCompanies}
          companies={companies}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-success">{resolvedCount}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-success/20" />
            </div>
          </Card>
          <Card className="p-6 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">{pendingCount}</p>
              </div>
              <Clock className="h-10 w-10 text-warning/20" />
            </div>
          </Card>
          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg AI Confidence</p>
                <p className="text-3xl font-bold text-primary">{avgConfidence}%</p>
              </div>
              <AlertCircle className="h-10 w-10 text-primary/20" />
            </div>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by outcome:</span>
          <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="returned-to-ai">Returned to AI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Escalations Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Call ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>AI Confidence</TableHead>
                <TableHead>Resolved By</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEscalations.map((esc) => (
                <TableRow key={esc.id} className="animate-fade-in">
                  <TableCell className="font-mono text-sm">{esc.callId}</TableCell>
                  <TableCell className="font-medium">{esc.customerName}</TableCell>
                  <TableCell>{esc.company}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{esc.reason}</p>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{esc.aiConfidence}%</span>
                      </div>
                      <Progress value={esc.aiConfidence} className="h-1" />
                    </div>
                  </TableCell>
                  <TableCell>{esc.resolvedBy}</TableCell>
                  <TableCell>{esc.resolutionTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getOutcomeIcon(esc.outcome)}
                      {getOutcomeBadge(esc.outcome)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {esc.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
}
