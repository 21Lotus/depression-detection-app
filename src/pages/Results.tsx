import { ArrowLeft, Brain, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const analysisResults = {
  diagnosisRisk: "Moderate Risk",
  riskLevel: 65, // percentage
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
};

const recommendations = [
  {
    title: "Consult Healthcare Provider",
    description: "Schedule an appointment to discuss these results with a mental health professional",
    priority: "high",
    icon: <AlertTriangle className="h-5 w-5" />
  },
  {
    title: "Stress Management",
    description: "Begin stress reduction techniques such as meditation, yoga, or deep breathing exercises",
    priority: "medium", 
    icon: <Brain className="h-5 w-5" />
  },
  {
    title: "Lifestyle Modifications",
    description: "Focus on regular sleep schedule, exercise, and balanced nutrition",
    priority: "medium",
    icon: <TrendingUp className="h-5 w-5" />
  }
];

export default function Results() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const downloadReport = () => {
    // Create a simple text report for download
    const reportContent = `
MindWell Depression Detection Report
===================================

Analysis Date: ${new Date().toLocaleDateString()}
Sample ID: MDD-2024-001285

DIAGNOSIS RISK: ${analysisResults.diagnosisRisk}
Risk Level: ${analysisResults.riskLevel}%
Confidence: ${analysisResults.confidence}%

KEY BIOMARKERS:
${analysisResults.keyBiomarkers.map(marker => 
  `• ${marker.name}: ${marker.level} (${marker.result}, Normal: ${marker.normal})`
).join('\n')}

METABOLOMICS INSIGHTS:
${analysisResults.metabolomicsInsights.map(insight => `• ${insight}`).join('\n')}

RECOMMENDATIONS:
${recommendations.map(rec => `• ${rec.title}: ${rec.description}`).join('\n')}

Laboratory: ASU Mass Spectrometry Facility
Method: LC-MS/MS Metabolomics
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindWell_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your full analysis report has been downloaded successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "text-destructive";
      case "low": return "text-warning"; 
      case "normal": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getRiskColor = (level: number) => {
    if (level >= 70) return "bg-destructive";
    if (level >= 40) return "bg-warning";
    return "bg-success";
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
              <h1 className="text-lg font-semibold text-foreground">Your Results</h1>
              <p className="text-xs text-muted-foreground">Metabolomic Analysis Complete</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Main Diagnosis Result */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Depression Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold text-foreground">
                {analysisResults.diagnosisRisk}
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={analysisResults.riskLevel} 
                  className={`h-3 ${getRiskColor(analysisResults.riskLevel)}`}
                />
                <p className="text-xs text-muted-foreground">
                  {analysisResults.riskLevel}% risk indicators detected with {analysisResults.confidence}% confidence
                </p>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-xs text-default-foreground">
                  <strong>Important:</strong> These results are for screening purposes only. 
                  Please consult with a healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biomarker Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Key Biomarkers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResults.keyBiomarkers.map((biomarker, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-sm">{biomarker.name}</h4>
                    <p className="text-xs text-muted-foreground">Normal: {biomarker.normal}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{biomarker.result}</p>
                    <p className={`text-xs font-medium ${getStatusColor(biomarker.status)}`}>
                      {biomarker.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metabolomics Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Metabolomic Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResults.metabolomicsInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    rec.priority === "high" ? "bg-destructive/10" :
                    rec.priority === "medium" ? "bg-warning/10" : "bg-success/10"
                  }`}>
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full" onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Full Report
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/activity-tracking')}
          >
            Start Activity Tracking
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/')}
          >
            Return to Dashboard
          </Button>
        </div>

        {/* Analysis Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Analysis Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Sample ID:</strong> MDD-2024-001285</p>
              <p><strong>Analysis Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Laboratory:</strong> ASU Mass Spectrometry Facility</p>
              <p><strong>Method:</strong> LC-MS/MS Metabolomics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}