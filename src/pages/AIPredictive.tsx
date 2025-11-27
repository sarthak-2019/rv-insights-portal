import { MainLayout } from "@/components/layout/MainLayout";
import { predictiveAlerts, PredictiveAlert } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AIPredictive() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-muted";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-success" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const highAlerts = predictiveAlerts.filter(a => a.severity === "high");
  const mediumAlerts = predictiveAlerts.filter(a => a.severity === "medium");
  const lowAlerts = predictiveAlerts.filter(a => a.severity === "low");

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text">AI Predictive Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Identify warranty risks and failure trends before they impact operations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 border-destructive/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Alerts</p>
                <p className="text-3xl font-bold text-destructive">{highAlerts.length}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-destructive/20" />
            </div>
          </Card>
          <Card className="p-6 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium Risk</p>
                <p className="text-3xl font-bold text-warning">{mediumAlerts.length}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-warning/20" />
            </div>
          </Card>
          <Card className="p-6 border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Risk</p>
                <p className="text-3xl font-bold text-blue-500">{lowAlerts.length}</p>
              </div>
              <Target className="h-10 w-10 text-blue-500/20" />
            </div>
          </Card>
          <Card className="p-6 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-3xl font-bold text-primary">
                  {Math.round(predictiveAlerts.reduce((acc, a) => acc + a.confidence, 0) / predictiveAlerts.length)}%
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-primary/20" />
            </div>
          </Card>
        </div>

        {/* Predictive Alerts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Predictions</h2>
          
          {predictiveAlerts.map((alert) => (
            <Card key={alert.id} className="p-6 animate-fade-in">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()} RISK
                      </Badge>
                      <Badge variant="outline">{alert.category}</Badge>
                      {getTrendIcon(alert.trend)}
                    </div>
                    <h3 className="text-lg font-semibold">{alert.prediction}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="text-2xl font-bold text-primary">{alert.confidence}%</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prediction Confidence</span>
                    <span className="font-medium">{alert.confidence}%</span>
                  </div>
                  <Progress value={alert.confidence} className="h-2" />
                </div>

                {/* Details Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimated Impact</p>
                    <p className="font-medium">{alert.estimatedImpact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Timeline</p>
                    <p className="font-medium">{alert.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trend</p>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(alert.trend)}
                      <span className="font-medium capitalize">{alert.trend}</span>
                    </div>
                  </div>
                </div>

                {/* Affected Models */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Affected Models</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.affectedModels.map((model, idx) => (
                      <Badge key={idx} variant="secondary">
                        {model}
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
