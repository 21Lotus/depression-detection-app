import { useState, useEffect } from "react";
import { 
  Brain, 
  Droplets, 
  Send, 
  BarChart3, 
  Activity,
  Bell,
  User,
  Menu,
  Share2
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-medical.jpg";

const getProgressSteps = (status: string, hasSubmitted: boolean) => {
  if (!hasSubmitted) {
    return [
      { id: "1", label: "Sample Collected", completed: false },
      { id: "2", label: "Shipped to Lab", completed: false },
      { id: "3", label: "Lab Received", completed: false },
      { id: "4", label: "Analysis in Progress", completed: false },
      { id: "5", label: "Results Available", completed: false },
    ];
  }

  const baseSteps = [
    { id: "1", label: "Sample Collected", completed: true },
    { id: "2", label: "Shipped to Lab", completed: true },
    { id: "3", label: "Lab Received", completed: true },
  ];

  if (status === "analyzed") {
    return [
      ...baseSteps,
      { id: "4", label: "Analysis in Progress", completed: true },
      { id: "5", label: "Results Available", completed: true, current: true },
    ];
  } else {
    return [
      ...baseSteps,
      { id: "4", label: "Analysis in Progress", completed: false, current: true },
      { id: "5", label: "Results Available", completed: false },
    ];
  }
};

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
  {
    id: "share",
    title: "Share with Doctor",
    description: "Securely share your results and reports with your healthcare provider",
    icon: <Share2 className="h-6 w-6 text-primary" />,
    completed: false,
    variant: "default" as const,
  },
];

export default function Dashboard() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string>("pending");
  const [hasSubmission, setHasSubmission] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchSubmissionStatus();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('user_id', user.id)
          .single();
        
        if (!error && data) {
          setUserProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchSubmissionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('submissions')
          .select('status')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (!error && data && data.length > 0) {
          setSubmissionStatus(data[0].status);
          setHasSubmission(true);
        }
      }
    } catch (error) {
      console.error('Error fetching submission status:', error);
    }
  };

  const userName = userProfile?.full_name || "there";
  const progressSteps = getProgressSteps(submissionStatus, hasSubmission);

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
                <h2 className="text-lg font-bold mb-1">Welcome back, {userName}</h2>
                <p className="text-sm text-primary-foreground/80">
                  {submissionStatus === "analyzed" 
                    ? "Your results are ready! Check out your analysis below."
                    : hasSubmission 
                    ? "Your sample is being analyzed. Results expected in 2-3 days."
                    : "Ready to begin your health journey? Start by preparing your sample."
                  }
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
              <StatusBadge status={hasSubmission ? (submissionStatus as "pending" | "analyzed") : "pending"} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressTracker steps={progressSteps} />
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
                else if (item.id === "share") navigate("/share-with-doctor");
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
              onClick={() => navigate('/share-with-doctor')}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share with Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}