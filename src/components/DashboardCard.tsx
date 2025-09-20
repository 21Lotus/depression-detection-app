import { ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  completed?: boolean;
  variant?: "default" | "primary" | "success" | "warning";
  onClick?: () => void;
  className?: string;
}

const variantStyles = {
  default: "bg-gradient-secondary border-border hover:shadow-card",
  primary: "bg-gradient-primary text-primary-foreground hover:shadow-medical",
  success: "bg-gradient-success text-success-foreground hover:shadow-medical",
  warning: "bg-warning/10 border-warning/20 hover:bg-warning/15",
};

export function DashboardCard({ 
  title, 
  description, 
  icon, 
  completed = false, 
  variant = "default",
  onClick,
  className 
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-lg border transition-all duration-200 cursor-pointer group",
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      {completed && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="h-5 w-5 text-success" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-lg transition-colors",
          variant === "primary" || variant === "success" 
            ? "bg-white/20" 
            : "bg-primary/10"
        )}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-base mb-2 leading-tight",
            variant === "primary" || variant === "success"
              ? "text-current"
              : "text-foreground"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-sm leading-relaxed",
            variant === "primary" || variant === "success"
              ? "text-current/80"
              : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}