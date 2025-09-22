import { useState } from "react";
import { 
  Brain, 
  Droplets, 
  Send, 
  BarChart3, 
  Activity,
  Bell,
  User,
  Menu
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const mockProgress = [
  { id: "1", label: "Sample Collected", completed: true },
  { id: "2", label: "Shipped to Lab", completed: true },
  { id: "3", label: "Lab Received", completed: true },
  { id: "4", label: "Analysis in Progress", completed: false, current: true },
  { id: "5", label: "Results Available", completed: false },
];

const dashboardItems = [
  {
    id: "mdd-info",
    title: "What is Major Depressive Disorder?",
    description: "Learn about MDD symptoms, causes, and how early detection can help",
    icon: <Brain className="h-6 w-6 text-primary" />,
    completed: false,
    variant: "default",
  },
  {
    id: "sample-prep",
    title: "How to Prepare a Saliva Sample",
    description: "Step-by-step guide with video instructions for accurate collection",
    icon: <Droplets className="h-6 w-6 text-primary" />,
    completed: true,
    variant: "default",
  },
  {
    id: "mailing",
    title: "Mailing Your Saliva Sample",
    description: "Shipping instructions, labels, and tracking information",
    icon: <Send className="h-6 w-6" />,
    completed: true,
    variant: "default" as const,
  },
  {
    id: "results",
    title: "Results: Data Insights & Analytics",
    description: "View your metabolomic analysis and personalized health insights",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    completed: false,
    variant: "default" as const,
  },
  {
    id: "activities",
    title: "Activity Recommendations",
    description: "Personalized wellness activities based on your mood patterns",
    icon: <Activity className="h-6 w-6 text-primary" />,
    completed: false,
    variant: "default" as const,
  },
];

export default function Dashboard() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">MindWell</h1>
                <p className="text-xs text-muted-foreground">Depression Detection</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Hero Section */}
        <Card className="overflow-hidden bg-gradient-primary text-primary-foreground border-0">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Medical technology interface"
                className="w-full h-32 object-cover opacity-20"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-center">
                <h2 className="text-lg font-bold mb-1">Welcome back, Sarah</h2>
                <p className="text-sm text-primary-foreground/80">
                  Your sample is being analyzed. Results expected in 2-3 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base">Sample Status</span>
              <StatusBadge status="analyzed" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressTracker steps={mockProgress} />
          </CardContent>
        </Card>

        {/* Dashboard Items */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Your Health Journey
          </h3>
          
          {dashboardItems.map((item) => (
            <DashboardCard
              key={item.id}
              {...item}
              onClick={() => {
                setActiveCard(item.id);
                // Navigate to appropriate pages
                if (item.id === "mdd-info") navigate("/mdd-info");
                else if (item.id === "sample-prep") navigate("/sample-prep");
                else if (item.id === "mailing") navigate("/mailing-sample");
                else if (item.id === "results") navigate("/results");
                else if (item.id === "activities") navigate("/activity-tracking");
              }}
              className= {'${item.className ?? ""} ${activeCard === item.id ? "ring-2 ring-primary" : ""}'}
              variant="default"
            />
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/activity-tracking')}
            >
              <Activity className="h-4 w-4 mr-2" />
              Log Today's Mood
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/activity-tracking')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Recent Trends
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/sending-info')}
            >
              <Send className="h-4 w-4 mr-2" />
              Share with Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}