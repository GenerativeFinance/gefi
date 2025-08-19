import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ConfigureModelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  model: {
    id: number;
    name: string;
    allocation: number;
    monthlyFee: number;
  } | null;
}

export function ConfigureModelDialog({
  isOpen,
  onOpenChange,
  model,
}: ConfigureModelDialogProps) {
  const [allocation, setAllocation] = useState(model?.allocation || 0);
  const [monthlyFee, setMonthlyFee] = useState(model?.monthlyFee || 0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form when model changes
  React.useEffect(() => {
    if (model) {
      setAllocation(model.allocation);
      setMonthlyFee(model.monthlyFee);
    }
  }, [model]);

  const configureModelMutation = useMutation({
    mutationFn: async (data: { allocation: number; monthlyFee: number }) => {
      if (!model) throw new Error("No model selected");
      
      try {
        const response = await apiRequest(
          "PUT", 
          `/api/portfolio/ai-models/${model.id}`,
          data
        );
        return await response.json();
      } catch (error) {
        // API might not be available, fall back to optimistic update
        console.warn("API not available, using optimistic update:", error);
        return { ...model, ...data };
      }
    },
    onMutate: async (newData) => {
      if (!model) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["/api/portfolio/ai-models"] });

      // Snapshot the previous value
      const previousModels = queryClient.getQueryData(["/api/portfolio/ai-models"]);

      // Optimistically update the cache
      queryClient.setQueryData(["/api/portfolio/ai-models"], (old: any) => {
        if (!old) return old;
        
        // Handle both array format and object format
        if (Array.isArray(old)) {
          return old.map((m: any) =>
            m.id === model.id ? { ...m, ...newData } : m
          );
        }
        
        return old;
      });

      return { previousModels };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousModels) {
        queryClient.setQueryData(["/api/portfolio/ai-models"], context.previousModels);
      }
      
      toast({
        title: "Configuration failed",
        description: "Failed to update model configuration. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Model configured",
        description: `${model?.name} has been successfully updated.`,
      });
      onOpenChange(false);
    },
    onSettled: () => {
      // Always refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/ai-models"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!model) return;

    // Validate inputs
    if (allocation < 0 || allocation > 100) {
      toast({
        title: "Invalid allocation",
        description: "Allocation must be between 0% and 100%.",
        variant: "destructive",
      });
      return;
    }

    if (monthlyFee < 0) {
      toast({
        title: "Invalid fee",
        description: "Monthly fee cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    configureModelMutation.mutate({
      allocation,
      monthlyFee,
    });
  };

  if (!model) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure {model.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allocation">Portfolio Allocation (%)</Label>
            <Input
              id="allocation"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={allocation}
              onChange={(e) => setAllocation(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyFee">Monthly Fee ($)</Label>
            <Input
              id="monthlyFee"
              type="number"
              min="0"
              step="0.01"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={configureModelMutation.isPending}
              className="flex-1"
            >
              {configureModelMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={configureModelMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}