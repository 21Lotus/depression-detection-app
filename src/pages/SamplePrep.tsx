import { useState, useEffect } from "react";
import { ArrowLeft, Play, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import labImage from "@/assets/lab-analysis.jpg";

const preparationSteps = [
  {
    id: 1,
    title: "Prepare for Collection",
    duration: "2 minutes",
    instructions: [
      "Avoid eating, drinking, or smoking for 30 minutes before collection",
      "Rinse your mouth with water 10 minutes before collection",
      "Ensure hands are clean and collection tube is ready"
    ],
    completed: false,
  },
  {
    id: 2,
    title: "Collect Saliva Sample",
    duration: "5 minutes",
    instructions: [
      "Remove the cap and funnel from the collection tube",
      "Spit directly into the tube until saliva reaches the fill line",
      "Avoid bubbles - they don't count toward the required volume",
      "Replace the cap tightly and shake 5 times"
    ],
    completed: false,
  },
  {
    id: 3,
    title: "Label and Package",
    duration: "3 minutes",
    instructions: [
      "Write your name and date on the provided label",
      "Attach label securely to the collection tube",
      "Place tube in the protective sleeve",
      "Put everything in the pre-paid shipping envelope"
    ],
    completed: false,
  },
];

export default function SamplePrep() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Check if all steps are completed and mark sample as collected
    if (completedSteps.length === preparationSteps.length && completedSteps.length > 0) {
      localStorage.setItem('sampleCollected', 'true');
    }
  }, [completedSteps]);

  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (currentStep < preparationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = (completedSteps.length / preparationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-card">

        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Sample Preparation</h1>
              <p className="text-xs text-muted-foreground">Follow these steps carefully</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-base">Preparation Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedSteps.length}/{preparationSteps.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-muted-foreground">
              {completedSteps.length === preparationSteps.length 
                ? "All steps completed! Ready to ship." 
                : `Step ${currentStep + 1} of ${preparationSteps.length}`
              }
            </p>
          </CardContent>
        </Card>

        {/* Video Tutorial */}
        <Card>
          <CardContent className="p-0">
            <div className="relative">
              <iframe
                className="w-full h-48 rounded-t-lg"
                src="https://www.youtube.com/embed/VtweFyMC9Ag"
                title="Saliva Collection Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Video Guide</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.youtube.com/watch?v=VtweFyMC9Ag', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open in YouTube
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Step-by-step visual instructions for proper saliva collection
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Video source: YouTube - Educational content for medical sample collection
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preparation Steps */}
        <div className="space-y-4">
          {preparationSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = index === currentStep;
            
            return (
              <Card 
                key={step.id}
                className={`transition-all duration-200 ${
                  isCurrent ? "ring-2 ring-primary" : ""
                } ${isCompleted ? "bg-success/5 border-success/20" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                          isCompleted
                            ? "bg-success border-success text-success-foreground"
                            : isCurrent
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : isCurrent ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{step.id}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.duration}</p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {(isCurrent || isCompleted) && (
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {step.instructions.map((instruction, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {!isCompleted && isCurrent && (
                      <Button 
                        onClick={() => markStepComplete(step.id)}
                        className="w-full"
                      >
                        Mark Complete
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Important Notes */}
        <Card className="bg-warning border-warning/40 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-warning-foreground mb-2">Important Notes</h4>
                <ul className="text-sm text-warning-foreground space-y-1">
                  <li>• Collection must be done on an empty stomach</li>
                  <li>• Avoid contamination from food particles</li>
                  <li>• Ship within 24 hours of collection</li>
                  <li>• Keep sample at room temperature</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Next Steps */}
        {completedSteps.length === preparationSteps.length && (
          <Card className="bg-gradient-success text-success-foreground border-0">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Ready to Ship!</h3>
              <p className="text-sm mb-4 text-success-foreground/80">
                Your sample is properly prepared. Now let's get it to our lab.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="secondary" 
                  className="w-full bg-white/20 text-current border-white/30 hover:bg-white/30"
                  onClick={() => window.location.href = '/mailing-sample'}
                >
                  Continue to Shipping
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 text-current border-white/30 hover:bg-white/20"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        
      </div>
    </div>
  );
}