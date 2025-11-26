import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CallLogs from "./pages/CallLogs";
import Companies from "./pages/Companies";
import Transcripts from "./pages/Transcripts";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/executive" element={<ExecutiveDashboard />} />
          <Route path="/manufacturer" element={<ManufacturerDashboard />} />
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/calls" element={<CallLogs />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/transcripts" element={<Transcripts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;