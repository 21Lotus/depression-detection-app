import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SamplePrep from "./pages/SamplePrep";
import MddInfo from "./pages/MddInfo";
import MailingSample from "./pages/MailingSample";
import Results from "./pages/Results";
import ActivityTracking from "./pages/ActivityTracking";
//import SendingInfo from "./pages/SendingInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sample-prep" element={<SamplePrep />} />
          <Route path="/mdd-info" element={<MddInfo />} />
          <Route path="/mailing-sample" element={<MailingSample />} />
          <Route path="/results" element={<Results />} />
          {/*<Route path="/sending-info" element={<SendingInfo />} />*/}
          <Route path="/activity-tracking" element={<ActivityTracking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
