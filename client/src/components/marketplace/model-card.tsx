import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Brain, ChartLine, Shield, TrendingUp, DollarSign } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";

interface ModelCardProps {
  model: any;
  featured?: boolean;
}

export default function ModelCard({ model, featured = false }: ModelCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const subscribeMutation = useMutation({
    mutationFn: async (modelId: number) => {
      await apiRequest("POST", "/api/ai-models/subscribe", { modelId });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully subscribed to AI model",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-models"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to subscribe to model",
        variant: "destructive",
      });
    },
  });

  const getModelIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'risk':
        return Shield;
      case 'portfolio':
        return ChartLine;
      case 'prediction':
        return TrendingUp;
      case 'sentiment':
        return Brain;
      default:
        return DollarSign;
    }
  };

  const getIconColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'risk':
        return 'from-red-500 to-orange-500';
      case 'portfolio':
        return 'from-primary to-blue-500';
      case 'prediction':
        return 'from-green-500 to-teal-500';
      case 'sentiment':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (isActive: boolean, isNew?: boolean) => {
    if (isNew) {
      return <Badge className="bg-blue-500/20 text-blue-400">New</Badge>;
    }
    if (isActive) {
      return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to AI models",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    // Navigate to checkout page with model data
    window.location.href = `/checkout?modelId=${model.id}&name=${encodeURIComponent(model.name)}&price=${model.price}`;
  };

  const IconComponent = getModelIcon(model.category || 'default');
  
  return (
    <Card className={`glass card-hover ${featured ? 'border-primary/50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${getIconColor(model.category || 'default')}`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          {getStatusBadge(model.isActive, featured)}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{model.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
          {model.description || "Advanced AI model for financial analysis and predictions"}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            By {model.creator || "AI Expert"}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">
              {model.rating ? parseFloat(model.rating).toFixed(1) : "4.8"}
            </span>
            {model.totalRatings && (
              <span className="text-xs text-muted-foreground">
                ({model.totalRatings})
              </span>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        {model.performance && (
          <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Performance</div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Accuracy</span>
              <span className="text-sm font-semibold text-green-400">
                {model.performance.accuracy || "94.2%"}
              </span>
            </div>
          </div>
        )}

        {/* Features */}
        {model.features && Array.isArray(model.features) && model.features.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">Key Features</div>
            <div className="flex flex-wrap gap-1">
              {model.features.slice(0, 3).map((feature: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Pricing Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                ${model.price ? parseFloat(model.price).toFixed(0) : "299"}
              </span>
              <span className="text-sm text-muted-foreground ml-1">/month</span>
            </div>
            {model.isFeatured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                Featured
              </Badge>
            )}
          </div>

          {/* Pricing Plans */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Monthly:</span>
              <span className="font-medium">${model.price ? parseFloat(model.price).toFixed(0) : "299"}/mo</span>
            </div>
            <div className="flex justify-between">
              <span>Annual:</span>
              <span className="font-medium text-green-400">
                ${model.price ? (parseFloat(model.price) * 10).toFixed(0) : "2990"}/yr
                <span className="text-xs ml-1">(2 months free)</span>
              </span>
            </div>
            {parseFloat(model.price || "299") > 100 && (
              <div className="flex justify-between">
                <span>Enterprise:</span>
                <span className="font-medium">Contact us</span>
              </div>
            )}
          </div>

          {/* Risk Level & Min Investment */}
          {(model.riskLevel || model.minInvestment) && (
            <div className="flex items-center space-x-2 text-xs">
              {model.riskLevel && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    model.riskLevel === 'Low' ? 'border-green-500 text-green-400' :
                    model.riskLevel === 'Medium' ? 'border-yellow-500 text-yellow-400' :
                    'border-red-500 text-red-400'
                  }`}
                >
                  {model.riskLevel} Risk
                </Badge>
              )}
              {model.minInvestment && (
                <Badge variant="outline" className="text-xs">
                  Min: ${parseFloat(model.minInvestment).toLocaleString()}
                </Badge>
              )}
            </div>
          )}

          <Button 
            className="w-full gradient-primary hover:opacity-90"
            onClick={handleSubscribe}
            disabled={subscribeMutation.isPending}
          >
            {subscribeMutation.isPending ? "Processing..." : "Start Subscription"}
          </Button>
          
          {/* Free Trial Info */}
          <div className="text-center">
            <span className="text-xs text-muted-foreground">
              14-day free trial • Cancel anytime
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="mt-4 pt-3 border-t border-border">
          <Badge variant="outline" className="text-xs">
            {model.category ? model.category.charAt(0).toUpperCase() + model.category.slice(1) : "AI Model"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
