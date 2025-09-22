import { useState } from "react";
import { ArrowLeft, Send, Download, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function ShareWithDoctor() {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendReport = async () => {
    if (!doctorInfo.name || !doctorInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please provide doctor's name and email address.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would generate and send the PDF
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
  };

  const downloadReport = () => {
    // In a real implementation, this would generate and download the PDF
    toast({
      title: "Download Started",
      description: "Your full report is being downloaded.",
    });
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
            <Button onClick={downloadReport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
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
            
            <Button onClick={handleSendReport} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Report to Doctor
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
      </div>
    </div>
  );
}