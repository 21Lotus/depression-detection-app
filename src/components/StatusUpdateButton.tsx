import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

interface StatusUpdateButtonProps {
  userEmail: string;
  currentStatus: string;
}

export function StatusUpdateButton({ userEmail, currentStatus }: StatusUpdateButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateToCompleted = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.functions.invoke('update-sample-status', {
        body: {
          userEmail,
          status: 'analyzed'
        }
      });

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Sample status has been updated to completed. All progress items are now marked as complete.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (currentStatus === 'analyzed') {
    return (
      <div className="text-sm text-success font-medium">
        ✓ Completed
      </div>
    );
  }

  return (
    <Button
      onClick={updateToCompleted}
      disabled={isUpdating}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Settings className="h-4 w-4" />
      {isUpdating ? "Updating..." : "Mark as Complete"}
    </Button>
  );
}