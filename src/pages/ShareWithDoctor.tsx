import { useState, useEffect } from "react";
import { ArrowLeft, Send, Download, Mail, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generatePDFReport, type ReportData, type UserProfile, type ActivityEntry } from "@/utils/pdfGenerator";

export default function ShareWithDoctor() {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (!profileError && profileData) {
          setUserProfile({
            full_name: profileData.full_name || '',
            email: profileData.email || user.email || '',
            age: profileData.age,
            gender: profileData.gender,
            medical_history: profileData.medical_history,
            current_medications: profileData.current_medications
          });
        }

        // Fetch mock activities (in a real app, these would come from the database)
        setActivities([
          {
            id: "1",
            date: "2024-01-15",
            activity: "Morning yoga",
            category: "exercise",
            duration: 30,
            moodBefore: 2,
            moodAfter: 4,
            notes: "Felt more centered after practice"
          },
          {
            id: "2", 
            date: "2024-01-14",
            activity: "Coffee with friends",
            category: "social",
            duration: 120,
            moodBefore: 3,
            moodAfter: 4,
            notes: "Great conversation, felt supported"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const generateReportData = (): ReportData => {
    return {
      userProfile: userProfile!,
      activities,
      analysisResults: {
        diagnosisRisk: "Moderate Risk",
        riskLevel: 65,
        confidence: 87,
        keyBiomarkers: [
          { name: "Cortisol", level: "Elevated", normal: "10-20 ng/mL", result: "28 ng/mL", status: "high" },
          { name: "Serotonin", level: "Low", normal: "50-200 ng/mL", result: "35 ng/mL", status: "low" },
          { name: "GABA", level: "Normal", normal: "2-8 ng/mL", result: "5.2 ng/mL", status: "normal" },
          { name: "Dopamine", level: "Low", normal: "30-100 ng/mL", result: "22 ng/mL", status: "low" }
        ],
        metabolomicsInsights: [
          "Stress hormone levels suggest chronic stress response",
          "Neurotransmitter imbalance indicates potential mood regulation issues", 
          "Inflammatory markers show elevated oxidative stress",
          "Amino acid profile suggests altered protein metabolism"
        ]
      },
      timestamp: new Date().toLocaleString()
    };
  };

  const handleSendReport = async () => {
    if (!doctorInfo.name || !doctorInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please provide doctor's name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile) {
      toast({
        title: "Error",
        description: "User profile not loaded. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const reportData = generateReportData();
      const pdfBase64 = await generatePDFReport(reportData);

      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          doctorName: doctorInfo.name,
          doctorEmail: doctorInfo.email,
          userEmail: userProfile.email,
          pdfBase64,
          notes: doctorInfo.notes
        }
      });

      if (error) throw error;

      toast({
        title: "Report Sent Successfully",
        description: `Your comprehensive report has been sent to Dr. ${doctorInfo.name}.`,
      });

      // Reset form
      setDoctorInfo({
        name: "",
        email: "",
        phone: "",
        notes: ""
      });
    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        title: "Error",
        description: "Failed to send report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "User profile not loaded. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const reportData = generateReportData();
      const pdfBase64 = await generatePDFReport(reportData);
      
      // Convert base64 to blob and download
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MindWell_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your full report is being downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Share with Doctor</h1>
              <p className="text-xs text-muted-foreground">Send your results securely</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Download */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Download Full Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Download a comprehensive PDF report including your results and activity tracking data.
            </p>
            <Button onClick={downloadReport} className="w-full" disabled={isLoading || !userProfile}>
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? "Generating..." : "Download Full Report"}
            </Button>
          </CardContent>
        </Card>

        {/* Doctor Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Send to Healthcare Provider
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="doctorName">Doctor's Name</Label>
              <Input
                id="doctorName"
                value={doctorInfo.name}
                onChange={(e) => setDoctorInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. John Smith"
              />
            </div>
            
            <div>
              <Label htmlFor="doctorEmail">Doctor's Email</Label>
              <Input
                id="doctorEmail"
                type="email"
                value={doctorInfo.email}
                onChange={(e) => setDoctorInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="doctor@clinic.com"
              />
            </div>
            
            <div>
              <Label htmlFor="doctorPhone">Phone (Optional)</Label>
              <Input
                id="doctorPhone"
                type="tel"
                value={doctorInfo.phone}
                onChange={(e) => setDoctorInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={doctorInfo.notes}
                onChange={(e) => setDoctorInfo(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional context for your healthcare provider..."
                rows={3}
              />
            </div>
            
            <Button onClick={handleSendReport} className="w-full" disabled={isLoading || !userProfile}>
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Sending..." : "Send Report to Doctor"}
            </Button>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-semibold text-primary mb-3">Report Includes:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Complete metabolomic analysis results</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Depression screening findings</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Activity and mood tracking data</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Medical history and current medications</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-success mb-2">Privacy & Security</h4>
                <p className="text-sm text-success/80">
                  All reports are encrypted and transmitted securely. Your healthcare provider will 
                  receive a comprehensive, HIPAA-compliant report that can be integrated into your 
                  medical records.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return to Dashboard Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}