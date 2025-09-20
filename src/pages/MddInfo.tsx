import { ArrowLeft, Brain, Heart, Users, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const symptoms = [
  "Persistent sad, anxious, or empty mood",
  "Loss of interest in activities once enjoyed",
  "Significant weight loss or gain",
  "Sleeping too much or too little",
  "Fatigue or loss of energy",
  "Feelings of worthlessness or guilt",
  "Difficulty concentrating or making decisions",
  "Thoughts of death or suicide"
];

const causes = [
  {
    title: "Biological Factors",
    description: "Chemical imbalances in the brain, genetics, and hormonal changes",
    icon: <Brain className="h-5 w-5" />
  },
  {
    title: "Psychological Factors", 
    description: "Trauma, stress, low self-esteem, and personality traits",
    icon: <Heart className="h-5 w-5" />
  },
  {
    title: "Environmental Factors",
    description: "Life events, social isolation, and chronic medical conditions",
    icon: <Users className="h-5 w-5" />
  }
];

const treatments = [
  "Psychotherapy (talk therapy)",
  "Antidepressant medications",
  "Lifestyle changes (exercise, nutrition, sleep)",
  "Support groups and peer support",
  "Mindfulness and meditation practices",
  "Light therapy for seasonal depression"
];

export default function MddInfo() {
  const navigate = useNavigate();

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
              <h1 className="text-lg font-semibold text-foreground">Major Depressive Disorder</h1>
              <p className="text-xs text-muted-foreground">Understanding MDD</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              What is Major Depressive Disorder?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Major Depressive Disorder (MDD) is a serious mental health condition that significantly impacts 
              how you feel, think, and handle daily activities. It's characterized by persistent feelings of 
              sadness and loss of interest that last for at least two weeks.
            </p>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle>Common Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {symptoms.map((symptom, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{symptom}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-xs text-default-foreground">
                <strong>Note:</strong> If you experience 5 or more of these symptoms for two weeks or longer, 
                consult with a healthcare professional.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Causes */}
        <Card>
          <CardHeader>
            <CardTitle>What Causes MDD?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {causes.map((cause, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {cause.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{cause.title}</h4>
                    <p className="text-xs text-muted-foreground">{cause.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Treatment Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Treatment Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {treatments.map((treatment, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="text-sm text-foreground">{treatment}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-xs text-default-foreground">
                <strong>Hope:</strong> MDD is highly treatable. With proper care, most people with depression 
                can recover and return to fulfilling lives.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Early Detection Benefits */}
        <Card className="bg-gradient-primary text-primary-foreground border-0">
          <CardContent className="p-4">
            <h3 className="font-bold text-base mb-2">Why Early Detection Matters</h3>
            <p className="text-sm text-primary-foreground/80 mb-3">
              Our saliva-based test can help identify biomarkers associated with depression, 
              enabling earlier intervention and better outcomes.
            </p>
            <Button 
              variant="secondary" 
              className="w-full bg-white/20 text-current border-white/30 hover:bg-white/30"
              onClick={() => navigate('/')}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}