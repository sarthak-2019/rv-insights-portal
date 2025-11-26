import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  inventoryItems,
  purchaseOrders,
  defectReports,
  inventoryStats,
} from "@/data/inventoryData";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Truck,
  Search,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const statusColors = {
  "in-stock": "bg-green-500/10 text-green-600 border-green-500/30",
  "low-stock": "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  "critical": "bg-red-500/10 text-red-600 border-red-500/30",
  "out-of-stock": "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

const orderStatusIcons = {
  pending: Clock,
  shipped: Truck,
  received: CheckCircle,
  delayed: AlertCircle,
};

const orderStatusColors = {
  pending: "bg-yellow-500/10 text-yellow-600",
  shipped: "bg-blue-500/10 text-blue-600",
  received: "bg-green-500/10 text-green-600",
  delayed: "bg-red-500/10 text-red-600",
};

export default function ManufacturerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInventory = inventoryItems.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.partNumber.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const categoryData = inventoryItems.reduce((acc, item) => {
    const existing = acc.find((a) => a.category === item.category);
    if (existing) {
      existing.count += item.currentStock;
      existing.value += item.currentStock * item.unitCost;
    } else {
      acc.push({
        category: item.category,
        count: item.currentStock,
        value: item.currentStock * item.unitCost,
      });
    }
    return acc;
  }, [] as { category: string; count: number; value: number }[]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">Manufacturer Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Parts inventory, purchasing, and defect tracking
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total SKUs</CardDescription>
              <CardTitle className="text-2xl">{inventoryStats.totalSKUs}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-green-500/30">
            <CardHeader className="pb-2">
              <CardDescription>In Stock</CardDescription>
              <CardTitle className="text-2xl text-green-600">{inventoryStats.inStock}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardDescription>Low Stock</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">{inventoryStats.lowStock}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-red-500/30">
            <CardHeader className="pb-2">
              <CardDescription>Critical / Out</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {inventoryStats.critical + inventoryStats.outOfStock}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-2xl">${(inventoryStats.totalValue / 1000).toFixed(0)}K</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Purchase Orders
            </TabsTrigger>
            <TabsTrigger value="defects" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Defect Reports
            </TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Parts Inventory</CardTitle>
                    <CardDescription>Real-time stock levels</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search parts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="in-stock">In Stock</option>
                      <option value="low-stock">Low Stock</option>
                      <option value="critical">Critical</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Part #</th>
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Supplier</th>
                        <th className="pb-3 font-medium text-right">Stock</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Unit Cost</th>
                        <th className="pb-3 font-medium">Lead Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-3">
                            <code className="rounded bg-muted px-2 py-1 text-sm">{item.partNumber}</code>
                          </td>
                          <td className="py-3 font-medium">{item.name}</td>
                          <td className="py-3">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">{item.supplier}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-medium">{item.currentStock}</span>
                              <span className="text-xs text-muted-foreground">/ {item.maxStock}</span>
                            </div>
                            <Progress 
                              value={(item.currentStock / item.maxStock) * 100} 
                              className="h-1 w-16 mt-1"
                            />
                          </td>
                          <td className="py-3">
                            <Badge className={statusColors[item.status]}>
                              {item.status.replace("-", " ")}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">${item.unitCost}</td>
                          <td className="py-3 text-muted-foreground">{item.leadTimeDays} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Stock by Category</CardTitle>
                <CardDescription>Inventory distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="category" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [value.toLocaleString(), "Units"]}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchase Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
                <CardDescription>Track incoming shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchaseOrders.map((po) => {
                    const StatusIcon = orderStatusIcons[po.status];
                    return (
                      <div key={po.id} className="rounded-lg border p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold">{po.id}</span>
                              <Badge className={orderStatusColors[po.status]}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {po.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Supplier: <span className="font-medium text-foreground">{po.supplier}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${po.totalAmount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{po.itemCount} items</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Ordered:</span>{" "}
                            <span className="font-medium">{po.orderDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected:</span>{" "}
                            <span className="font-medium">{po.expectedDate}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {po.items.map((item) => (
                            <Badge key={item.partNumber} variant="secondary">
                              {item.name} x{item.quantity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Defects Tab */}
          <TabsContent value="defects">
            <Card>
              <CardHeader>
                <CardTitle>Defect Reports</CardTitle>
                <CardDescription>Quality issues and warranty claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">ID</th>
                        <th className="pb-3 font-medium">Part</th>
                        <th className="pb-3 font-medium">Supplier</th>
                        <th className="pb-3 font-medium">Defect Type</th>
                        <th className="pb-3 font-medium">Severity</th>
                        <th className="pb-3 font-medium text-right">Occurrences</th>
                        <th className="pb-3 font-medium text-right">Claim Rate</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {defectReports.map((defect) => (
                        <tr key={defect.id} className="border-b last:border-0">
                          <td className="py-3 font-mono text-sm">{defect.id}</td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{defect.partName}</p>
                              <p className="text-xs text-muted-foreground">{defect.partNumber}</p>
                            </div>
                          </td>
                          <td className="py-3">{defect.supplier}</td>
                          <td className="py-3">{defect.defectType}</td>
                          <td className="py-3">
                            <Badge
                              variant={
                                defect.severity === "critical"
                                  ? "destructive"
                                  : defect.severity === "high"
                                  ? "destructive"
                                  : defect.severity === "medium"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {defect.severity}
                            </Badge>
                          </td>
                          <td className="py-3 text-right font-medium">{defect.occurrences}</td>
                          <td className="py-3 text-right">{defect.warrantyClaimRate}%</td>
                          <td className="py-3">
                            <Badge
                              variant={
                                defect.status === "resolved"
                                  ? "default"
                                  : defect.status === "confirmed"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {defect.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
