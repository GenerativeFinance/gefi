/**
 * Subscription Confirmation Dialog Component
 * 
 * Displays pricing and billing information before confirming a model subscription.
 * Used by model listing (ai-models.tsx) and model detail (model-detail.tsx).
 */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar } from "lucide-react";

interface SubscribeConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelName: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  isSubmitting: boolean;
  onConfirm: () => void;
  developerName?: string;
}

export default function SubscribeConfirm({
  open,
  onOpenChange,
  modelName,
  price,
  billingCycle,
  isSubmitting,
  onConfirm,
  developerName
}: SubscribeConfirmProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const formatPrice = (price: number, cycle: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
    
    return `${formatted}/${cycle === 'annual' ? 'year' : 'month'}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to AI Model</DialogTitle>
          <DialogDescription>
            Confirm your subscription to start using this AI model in your portfolio.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Model Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{modelName}</h3>
            {developerName && (
              <p className="text-sm text-muted-foreground">by {developerName}</p>
            )}
          </div>

          {/* Pricing Info */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Subscription Price</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {formatPrice(price, billingCycle)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Billing Cycle</span>
              </div>
              <Badge variant={billingCycle === 'annual' ? 'default' : 'secondary'}>
                {billingCycle === 'annual' ? 'Annual' : 'Monthly'}
              </Badge>
            </div>

            {billingCycle === 'annual' && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                💡 Save 20% with annual billing
              </div>
            )}
          </div>

          {/* Features Included */}
          <div className="space-y-2">
            <h4 className="font-medium">What's included:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Real-time model predictions</li>
              <li>• Performance analytics dashboard</li>
              <li>• Email alerts and notifications</li>
              <li>• Cancel anytime</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : `Subscribe Now - ${formatPrice(price, billingCycle)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}