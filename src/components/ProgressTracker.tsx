import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  className?: string;
}

export function ProgressTracker({ steps, className }: ProgressTrackerProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  step.completed
                    ? "bg-success border-success text-success-foreground"
                    : step.current
                    ? "bg-primary border-primary text-primary-foreground animate-pulse"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.current ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 h-8 mt-2 transition-colors",
                    step.completed ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
            
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  step.completed
                    ? "text-success"
                    : step.current
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
            </div>
            
            {step.current && (
              <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
}