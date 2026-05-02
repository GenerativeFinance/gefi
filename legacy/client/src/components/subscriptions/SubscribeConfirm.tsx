import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modelName: string;
  price: number;
  billingCycle?: 'monthly' | 'annually';
  onConfirm: () => void;
  isSubmitting?: boolean;
};

export default function SubscribeConfirm({
  open,
  onOpenChange,
  modelName,
  price,
  billingCycle = 'monthly',
  onConfirm,
  isSubmitting
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to {modelName}</DialogTitle>
          <DialogDescription>
            Confirm your subscription. You will be charged ${price}/{billingCycle}.
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          - Cancel anytime from My Subscriptions
          <br />
          - Access the model immediately after subscribing
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}