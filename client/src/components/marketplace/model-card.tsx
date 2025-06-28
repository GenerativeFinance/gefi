import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Brain, ChartLine, Shield, TrendingUp, DollarSign, BarChart3, Activity, MessageCircle, ThumbsUp, Eye } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { analyticsService } from "@/lib/analytics";
import { RecommendationEngine } from "@/lib/recommendationEngine";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ModelCardProps {
  model: any;
  featured?: boolean;
}

export default function ModelCard({ model, featured = false }: ModelCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  // Generate mock performance data
  const generatePerformanceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const accuracy = [88, 91, 89, 94, 96, 95];
    const roi = [12, 15, 13, 18, 22, 20];
    const sharpeRatio = [1.2, 1.4, 1.3, 1.6, 1.8, 1.7];
    
    return {
      accuracy: { labels: months, data: accuracy },
      roi: { labels: months, data: roi },
      sharpeRatio: { labels: months, data: sharpeRatio }
    };
  };

  const performanceData = generatePerformanceData();

  // Load saved ratings and comments from localStorage
  useEffect(() => {
    const savedRating = localStorage.getItem(`rating_${model.id}`);
    const savedReview = localStorage.getItem(`review_${model.id}`);
    const savedComments = localStorage.getItem(`comments_${model.id}`);
    
    if (savedRating) setRating(parseInt(savedRating));
    if (savedReview) setReview(savedReview);
    if (savedComments) setComments(JSON.parse(savedComments));
  }, [model.id]);

  // Track model view when component mounts
  useEffect(() => {
    const startTime = Date.now();
    
    if (isAuthenticated && model.id) {
      analyticsService.startModelView(
        model.id, 
        model.name, 
        model.category || 'Uncategorized'
      );

      // Track view end when component unmounts or when user leaves
      return () => {
        const timeSpent = Date.now() - startTime;
        
        analyticsService.endModelView(
          model.id,
          model.name,
          model.category || 'Uncategorized',
          parseFloat(model.price || "0")
        );

        // Also track with recommendation engine
        RecommendationEngine.trackModelView(
          model.id,
          model.name,
          model.category || 'Uncategorized',
          model.tags || [],
          parseFloat(model.price || "0"),
          timeSpent
        );
      };
    }
  }, [model.id, model.name, model.category, model.price, isAuthenticated]);

  // Handle rating submission
  const handleRatingSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to rate models",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(`rating_${model.id}`, rating.toString());
    localStorage.setItem(`review_${model.id}`, review);
    
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    });
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    const comment = {
      id: Date.now(),
      text: newComment,
      author: "User",
      timestamp: new Date().toLocaleDateString(),
      likes: 0
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${model.id}`, JSON.stringify(updatedComments));
    setNewComment("");
    
    toast({
      title: "Comment Added",
      description: "Your comment has been posted",
    });
  };

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

    // Track subscription click
    analyticsService.trackInteraction(
      model.id,
      model.name,
      'click',
      model.category || 'Uncategorized',
      parseFloat(model.price || "0")
    );

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
        <div className="mb-4 p-3 bg-secondary/30 rounded-lg">
          <div className="text-xs text-muted-foreground mb-2">Performance Metrics</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="font-semibold text-green-400">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span>ROI:</span>
              <span className="font-semibold text-blue-400">+18.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Sharpe:</span>
              <span className="font-semibold text-purple-400">1.67</span>
            </div>
            <div className="flex justify-between">
              <span>Volatility:</span>
              <span className="font-semibold text-orange-400">12.3%</span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r ${getIconColor(model.category || 'default')}`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <span>{model.name}</span>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Accuracy Chart */}
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium mb-3">Accuracy Trend</h4>
                      <Line
                        data={{
                          labels: performanceData.accuracy.labels,
                          datasets: [{
                            label: 'Accuracy (%)',
                            data: performanceData.accuracy.data,
                            borderColor: 'rgb(34, 197, 94)',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            tension: 0.1
                          }]
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            y: { beginAtZero: false, min: 85 }
                          }
                        }}
                      />
                    </div>
                    
                    {/* ROI Chart */}
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium mb-3">ROI Trend</h4>
                      <Line
                        data={{
                          labels: performanceData.roi.labels,
                          datasets: [{
                            label: 'ROI (%)',
                            data: performanceData.roi.data,
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.1
                          }]
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            y: { beginAtZero: true }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Accuracy</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">94.2%</p>
                      <p className="text-xs text-muted-foreground">Last 6 months</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">ROI</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">+18.5%</p>
                      <p className="text-xs text-muted-foreground">Annualized</p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Sharpe Ratio</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">1.67</p>
                      <p className="text-xs text-muted-foreground">Risk-adjusted</p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Max Drawdown</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">-5.2%</p>
                      <p className="text-xs text-muted-foreground">Worst case</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4">
                  <div className="space-y-4">
                    {/* Rating System */}
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-sm font-medium mb-3">Rate this Model</h4>
                      <div className="flex items-center space-x-2 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {rating > 0 ? `${rating}/5 stars` : 'Click to rate'}
                        </span>
                      </div>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full p-2 border rounded text-sm"
                        rows={3}
                      />
                      <Button onClick={handleRatingSubmit} size="sm" className="mt-2">
                        Submit Review
                      </Button>
                    </div>
                    
                    {/* Average Rating Display */}
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="flex text-yellow-400">
                              ★★★★★
                            </div>
                            <span className="text-lg font-semibold">4.8</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Based on 245 reviews</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            <div>5★ (180)</div>
                            <div>4★ (52)</div>
                            <div>3★ (13)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="comments" className="space-y-4">
                  {/* Comment Input */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium mb-3">Discussion</h4>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ask a question or share your thoughts..."
                        className="flex-1 p-2 border rounded text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                      />
                      <Button onClick={handleCommentSubmit} size="sm">
                        Post
                      </Button>
                    </div>
                  </div>
                  
                  {/* Comments List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-primary">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No comments yet. Be the first to start the discussion!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Model Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Creator:</span>
                            <span>{model.creator || "AI Expert"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span>{model.category || "Financial AI"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Level:</span>
                            <Badge className={`text-xs ${
                              model.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                              model.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {model.riskLevel || "Medium"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const features = model.features;
                            let featureArray: string[] = [];
                            
                            if (Array.isArray(features)) {
                              featureArray = features;
                            } else if (typeof features === 'string') {
                              try {
                                const parsed = JSON.parse(features);
                                featureArray = Array.isArray(parsed) ? parsed : [features];
                              } catch {
                                featureArray = [features];
                              }
                            } else if (features && typeof features === 'object') {
                              featureArray = Object.values(features).filter(f => typeof f === 'string') as string[];
                            }
                            
                            if (featureArray.length === 0) {
                              featureArray = ['Real-time Analysis', 'Risk Assessment', 'Portfolio Optimization'];
                            }
                            
                            return featureArray.map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Usage Statistics</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-3 w-3" />
                            <span>1,247 views</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-3 w-3" />
                            <span>89 subscriptions</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Pricing</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Monthly:</span>
                            <span className="font-medium">${model.price || "299"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual:</span>
                            <span className="font-medium text-green-400">${(parseFloat(model.price || "299") * 10).toFixed(0)} (Save 17%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

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
