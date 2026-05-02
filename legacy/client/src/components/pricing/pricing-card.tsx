import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
}

interface PricingCardProps {
  tier: PricingTier;
}

export default function PricingCard({ tier }: PricingCardProps) {
  const { isAuthenticated } = useAuth();

  const handleChoosePlan = () => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
    } else {
      // In a real implementation, this would integrate with a payment processor
      console.log(`Selecting plan: ${tier.id}`);
    }
  };

  return (
    <Card className={`glass card-hover relative ${
      tier.popular ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-transparent' : ''
    }`}>
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="gradient-primary px-4 py-1 text-sm font-semibold">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
          <div className="text-4xl font-bold mb-4">
            <span className="text-primary">${tier.price}</span>
            <span className="text-lg text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground">{tier.description}</p>
        </div>
        
        <div className="space-y-4 mb-8">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button 
          className={`w-full ${
            tier.popular 
              ? 'gradient-primary hover:opacity-90' 
              : 'border-primary text-primary hover:bg-primary hover:text-white'
          }`}
          variant={tier.popular ? 'default' : 'outline'}
          onClick={handleChoosePlan}
        >
          Choose Plan
        </Button>

        {tier.popular && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              🎁 Includes 7-day free trial
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
