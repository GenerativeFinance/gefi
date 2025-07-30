import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Bot, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Activity,
  BarChart3,
  Zap,
  Heart,
  Share2,
  Bookmark
} from "lucide-react";

interface ModelDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    id: number;
    name: string;
    category: string;
    rating: number;
    monthlyFee: number;
    description: string;
    accuracy: number;
    subscribers: number;
    tags: string[];
  };
}

export default function ModelDetailsDialog({ isOpen, onClose, model }: ModelDetailsDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/ai-models/${model.id}/subscribe`);
    },
    onSuccess: () => {
      toast({
        title: "Subscription Successful",
        description: `Successfully subscribed to ${model.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/ai-models"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Subscription Failed",
        description: "Failed to subscribe to the model. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mock detailed data for the model
  const modelDetails = {
    id: model.id,
    name: model.name,
    description: model.description,
    category: model.category,
    rating: model.rating,
    totalRatings: model.subscribers,
    monthlyFee: model.monthlyFee,
    accuracy: model.accuracy,
    subscribers: model.subscribers,
    tags: model.tags,
    creator: {
      name: model.id === 4 ? "CryptoInsight AI" : "ESG Analytics Corp",
      avatar: "",
      verified: true,
      modelsCount: model.id === 4 ? 7 : 12,
      totalSubscribers: model.id === 4 ? 5420 : 8960
    },
    features: {
      realTimeAnalysis: true,
      backtesting: true,
      alertSystem: true,
      apiAccess: true,
      customDashboard: model.id === 4 ? true : false
    },
    performance: {
      accuracy: model.accuracy,
      sharpeRatio: model.id === 4 ? 2.1 : 1.9,
      maxDrawdown: model.id === 4 ? -6.8 : -8.2,
      annualReturn: model.id === 4 ? 18.4 : 15.7,
      winRate: model.id === 4 ? 74.2 : 69.8,
      volatility: model.id === 4 ? 16.3 : 18.9
    },
    dataRequirements: model.id === 4 
      ? ["Social Media Data", "News Sentiment", "Blockchain Analytics", "Trading Volume"]
      : ["ESG Scores", "Corporate Reports", "Regulatory Filings", "Sustainability Metrics"],
    supportedRegions: ["North America", "Europe", "Asia-Pacific"],
    complianceFrameworks: model.id === 4 
      ? ["GDPR", "CCPA", "MiFID II"]
      : ["GDPR", "SEC", "ESMA", "TCFD"],
    pricingTiers: [
      { name: "Basic", price: model.monthlyFee, features: ["Real-time analysis", "Basic alerts", "Email support"] },
      { name: "Pro", price: model.monthlyFee * 1.5, features: ["Everything in Basic", "API access", "Advanced analytics", "Priority support"] },
      { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom integration", "Dedicated support", "SLA guarantee"] }
    ],
    reviews: [
      {
        id: 1,
        user: "John D.",
        rating: 5,
        comment: "Excellent accuracy and easy to integrate. Highly recommended!",
        date: "2025-07-15",
        verified: true
      },
      {
        id: 2,
        user: "Sarah M.",
        rating: 4,
        comment: "Great performance but could use better documentation.",
        date: "2025-07-10",
        verified: true
      },
      {
        id: 3,
        user: "Mike R.",
        rating: 5,
        comment: "Perfect for our trading strategy. ROI has improved significantly.",
        date: "2025-07-05",
        verified: false
      }
    ]
  };

  const handleSubscribe = () => {
    subscribeMutation.mutate();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: `${model.name} ${isLiked ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmarked",
      description: `${model.name} ${isBookmarked ? 'removed from' : 'added to'} your bookmarks`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Model link copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[700px] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{modelDetails.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{modelDetails.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{modelDetails.rating}</span>
                    <span className="text-muted-foreground">({modelDetails.totalRatings})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleLike}>
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleBookmark}>
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {modelDetails.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {modelDetails.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">Accuracy</div>
                            <div className="text-2xl font-bold text-blue-500">{modelDetails.performance.accuracy}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium">Annual Return</div>
                            <div className="text-2xl font-bold text-green-500">{modelDetails.performance.annualReturn}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="font-medium">Sharpe Ratio</div>
                            <div className="text-2xl font-bold text-purple-500">{modelDetails.performance.sharpeRatio}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="font-medium">Max Drawdown</div>
                            <div className="text-2xl font-bold text-orange-500">{modelDetails.performance.maxDrawdown}%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Creator</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {modelDetails.creator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{modelDetails.creator.name}</span>
                            {modelDetails.creator.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {modelDetails.creator.modelsCount} models • {modelDetails.creator.totalSubscribers} subscribers
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold">${modelDetails.monthlyFee}</div>
                        <div className="text-muted-foreground">per month</div>
                        <Button 
                          className="w-full mt-4" 
                          onClick={handleSubscribe}
                          disabled={subscribeMutation.isPending}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          {subscribeMutation.isPending ? "Subscribing..." : "Subscribe Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Subscribers</span>
                        <span className="font-medium">{modelDetails.subscribers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Win Rate</span>
                        <span className="font-medium text-green-500">{modelDetails.performance.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Volatility</span>
                        <span className="font-medium">{modelDetails.performance.volatility}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accuracy</span>
                        <span className="font-medium">{modelDetails.performance.accuracy}%</span>
                      </div>
                      <Progress value={modelDetails.performance.accuracy} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Win Rate</span>
                        <span className="font-medium">{modelDetails.performance.winRate}%</span>
                      </div>
                      <Progress value={modelDetails.performance.winRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Annual Return</div>
                        <div className="text-xl font-bold text-green-500">+{modelDetails.performance.annualReturn}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                        <div className="text-xl font-bold">{modelDetails.performance.sharpeRatio}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Max Drawdown</div>
                        <div className="text-xl font-bold text-red-500">{modelDetails.performance.maxDrawdown}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Volatility</div>
                        <div className="text-xl font-bold">{modelDetails.performance.volatility}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {modelDetails.dataRequirements.map((req) => (
                        <div key={req} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Supported Regions</h4>
                      <div className="flex flex-wrap gap-2">
                        {modelDetails.supportedRegions.map((region) => (
                          <Badge key={region} variant="outline">{region}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Compliance</h4>
                      <div className="flex flex-wrap gap-2">
                        {modelDetails.complianceFrameworks.map((framework) => (
                          <Badge key={framework} variant="secondary">{framework}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {Object.entries(modelDetails.features).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          {value ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className={value ? "" : "text-muted-foreground"}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Integration Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">REST API</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">WebSocket</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Python SDK</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Support</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">24/7 Support</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Documentation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Community Forum</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {modelDetails.pricingTiers.map((tier, index) => (
                  <Card key={tier.name} className={index === 1 ? "border-primary" : ""}>
                    <CardHeader>
                      <CardTitle className="text-center">
                        {tier.name}
                        {index === 1 && <Badge className="ml-2">Popular</Badge>}
                      </CardTitle>
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                        </div>
                        {typeof tier.price === 'number' && (
                          <div className="text-muted-foreground">per month</div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {tier.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className={`w-full mt-4 ${index === 1 ? '' : 'variant-outline'}`}
                        onClick={handleSubscribe}
                        disabled={subscribeMutation.isPending}
                      >
                        {tier.price === 'Custom' ? 'Contact Sales' : 'Subscribe'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Reviews</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">{modelDetails.rating}</span>
                      <span className="text-muted-foreground">out of 5</span>
                    </div>
                    <span className="text-muted-foreground">({modelDetails.totalRatings} reviews)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modelDetails.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.user}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button 
            onClick={handleSubscribe}
            disabled={subscribeMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            <Zap className="h-4 w-4 mr-2" />
            {subscribeMutation.isPending ? "Subscribing..." : `Subscribe for $${model.monthlyFee}/mo`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}