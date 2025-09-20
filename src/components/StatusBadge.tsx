import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "collected" | "shipped" | "delivered" | "analyzed" | "ready";
  className?: string;
}

const statusConfig = {
  collected: {
    label: "Sample Collected",
    variant: "bg-muted text-muted-foreground",
  },
  shipped: {
    label: "In Transit",
    variant: "bg-warning/20 text-warning-foreground border-warning/30",
  },
  delivered: {
    label: "Lab Received",
    variant: "bg-primary/20 text-primary border-primary/30",
  },
  analyzed: {
    label: "Analysis Complete",
    variant: "bg-success/20 text-success-foreground border-success/30",
  },
  ready: {
    label: "Results Ready",
    variant: "bg-gradient-success text-success-foreground border-success/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
        config.variant,
        className
      )}
    >
      {config.label}
    </span>
  );
}