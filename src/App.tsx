import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SamplePrep from "./pages/SamplePrep";
import MddInfo from "./pages/MddInfo";
import MailingSample from "./pages/MailingSample";
import Results from "./pages/Results";
import ActivityTracking from "./pages/ActivityTracking";
import ShareWithDoctor from "./pages/ShareWithDoctor";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<AuthWrapper />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sample-prep" element={<SamplePrep />} />
            <Route path="/mdd-info" element={<MddInfo />} />
            <Route path="/mailing-sample" element={<MailingSample />} />
            <Route path="/results" element={<Results />} />
            <Route path="/activity-tracking" element={<ActivityTracking />} />
            <Route path="/share-with-doctor" element={<ShareWithDoctor />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
