import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type Model = any;

type Props = {
  open: boolean;
  model: Model | null;
  onClose: () => void;
  onSaved?: (updatedModel: Model) => void;
};

export default function ConfigureModelDialog({ open, model, onClose, onSaved }: Props) {
  const [allocation, setAllocation] = useState<number>(0);
  const [monthlyFee, setMonthlyFee] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (model) {
      setAllocation(Number(model.allocation ?? 0));
      setMonthlyFee(Number(model.monthlyFee ?? 0));
    } else {
      setAllocation(0);
      setMonthlyFee(0);
    }
  }, [model, open]);

  const handleSave = async () => {
    if (!model) return;
    setSaving(true);

    try {
      const payload = { allocation, monthlyFee };
      let updatedModel = { ...model, allocation, monthlyFee };

      try {
        const res = await fetch(`/api/portfolio/ai-models/${model.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const body = await res.json();
          updatedModel = body;
        } else {
          toast({
            title: "Saved locally",
            description: "Server update failed — changes applied locally.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Saved locally",
          description: "Could not contact server — changes applied locally.",
          variant: "destructive",
        });
      }

      // Update cache optimistically
      queryClient.setQueryData(["/api/portfolio/ai-models"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((m) => (m.id === updatedModel.id ? { ...m, ...updatedModel } : m));
      });

      onSaved?.(updatedModel);

      toast({
        title: "Configuration saved",
        description: `${model.name} configuration updated successfully.`,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Configure {model?.name ?? "Model"}</DialogTitle>
          <DialogDescription>
            Adjust portfolio allocation and monthly fee for this AI model.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Portfolio Allocation (%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={allocation}
              onChange={(e) => setAllocation(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-muted-foreground">0%</span>
              <span className="font-semibold text-primary">{allocation}%</span>
              <span className="text-muted-foreground">100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Monthly Fee ($)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(Number(e.target.value))}
              className="w-full p-3 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter monthly fee"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}