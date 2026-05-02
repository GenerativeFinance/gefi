import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Star,
  MessageCircle,
  User,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Filter
} from "lucide-react";

export default function DeveloperFeedback() {
  const [selectedRating, setSelectedRating] = useState("all");
  const [replyText, setReplyText] = useState("");

  // Sample feedback data
  const userRatings = [
    {
      id: 1,
      modelName: "High-Frequency Trading Algorithm",
      averageRating: 4.7,
      totalReviews: 45,
      ratingDistribution: {
        5: 32,
        4: 8,
        3: 3,
        2: 1,
        1: 1
      }
    },
    {
      id: 2,
      modelName: "Portfolio Risk Assessment",
      averageRating: 4.3,
      totalReviews: 28,
      ratingDistribution: {
        5: 18,
        4: 6,
        3: 3,
        2: 1,
        1: 0
      }
    },
    {
      id: 3,
      modelName: "ESG Investment Screener",
      averageRating: 4.5,
      totalReviews: 22,
      ratingDistribution: {
        5: 15,
        4: 5,
        3: 2,
        2: 0,
        1: 0
      }
    },
    {
      id: 4,
      modelName: "Market Sentiment Analyzer",
      averageRating: 4.2,
      totalReviews: 38,
      ratingDistribution: {
        5: 22,
        4: 10,
        3: 4,
        2: 2,
        1: 0
      }
    }
  ];

  const feedbackComments = [
    {
      id: 1,
      modelName: "High-Frequency Trading Algorithm",
      userName: "Alex Thompson",
      userRole: "Portfolio Manager",
      rating: 5,
      date: "2025-07-13",
      comment: "Excellent predictive power and extremely fast execution. The model has consistently outperformed my previous strategies with a 15% improvement in returns.",
      helpful: 12,
      replied: true,
      replyDate: "2025-07-14",
      reply: "Thank you for the positive feedback! We're constantly working on improving execution speed and accuracy."
    },
    {
      id: 2,
      modelName: "Portfolio Risk Assessment",
      userName: "Sarah Chen",
      userRole: "Risk Analyst",
      rating: 4,
      date: "2025-07-12",
      comment: "Great risk assessment capabilities. The VaR calculations are very accurate and the stress testing features are comprehensive. Could use more customizable risk factors.",
      helpful: 8,
      replied: false,
      replyDate: null,
      reply: null
    },
    {
      id: 3,
      modelName: "ESG Investment Screener",
      userName: "Michael Rodriguez",
      userRole: "ESG Analyst",
      rating: 5,
      date: "2025-07-10",
      comment: "Outstanding ESG scoring methodology. The model correctly identifies sustainable investment opportunities and has helped our fund improve its ESG ratings significantly.",
      helpful: 15,
      replied: true,
      replyDate: "2025-07-11",
      reply: "We appreciate your feedback! ESG compliance is crucial and we're glad our model is helping your investment decisions."
    },
    {
      id: 4,
      modelName: "Market Sentiment Analyzer",
      userName: "Emma Wilson",
      userRole: "Quantitative Analyst",
      rating: 4,
      date: "2025-07-09",
      comment: "Good sentiment analysis but could be more responsive to sudden market changes. The NLP processing is excellent for normal market conditions.",
      helpful: 6,
      replied: false,
      replyDate: null,
      reply: null
    },
    {
      id: 5,
      modelName: "High-Frequency Trading Algorithm",
      userName: "David Park",
      userRole: "Trader",
      rating: 5,
      date: "2025-07-08",
      comment: "Phenomenal algorithm! Reduced my trading losses by 20% and increased profit margins. The backtesting results were accurate to real-world performance.",
      helpful: 10,
      replied: true,
      replyDate: "2025-07-09",
      reply: "Thank you for sharing your results! Real-world performance validation is exactly what we aim for."
    }
  ];

  const overallMetrics = {
    averageRating: 4.4,
    totalReviews: 133,
    responseRate: 67,
    unrepliedFeedback: 8,
    positiveRatio: 89
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 dark:text-green-400";
    if (rating >= 4.0) return "text-blue-600 dark:text-blue-400";
    if (rating >= 3.5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredComments = feedbackComments.filter(comment => {
    if (selectedRating === "all") return true;
    return comment.rating.toString() === selectedRating;
  });

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Feedback</h1>
            <p className="text-muted-foreground">
              Monitor user ratings, comments, and response management
            </p>
          </div>
          <Button>
            <MessageCircle className="h-4 w-4 mr-2" />
            View All Feedback
          </Button>
        </div>

        {/* Feedback Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-yellow-600">{overallMetrics.averageRating}</p>
                    {renderStars(overallMetrics.averageRating)}
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{overallMetrics.totalReviews}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                  <p className="text-2xl font-bold text-green-600">{overallMetrics.responseRate}%</p>
                </div>
                <Reply className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Replies</p>
                  <p className="text-2xl font-bold text-orange-600">{overallMetrics.unrepliedFeedback}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Positive Ratio</p>
                  <p className="text-2xl font-bold text-green-600">{overallMetrics.positiveRatio}%</p>
                </div>
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Details */}
        <Tabs defaultValue="ratings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ratings">User Ratings</TabsTrigger>
            <TabsTrigger value="comments">Comments & Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Response Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="ratings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userRatings.map((rating) => (
                <Card key={rating.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{rating.modelName}</CardTitle>
                    <CardDescription>User ratings and distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Overall Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-3xl font-bold ${getRatingColor(rating.averageRating)}`}>
                            {rating.averageRating}
                          </span>
                          {renderStars(rating.averageRating, "w-5 h-5")}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {rating.totalReviews} reviews
                        </span>
                      </div>

                      {/* Rating Distribution */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm w-3">{stars}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${(rating.ratingDistribution[stars as keyof typeof rating.ratingDistribution] / rating.totalReviews) * 100}%`
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-6">
                              {rating.ratingDistribution[stars as keyof typeof rating.ratingDistribution]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            {/* Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by rating:</span>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedRating === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRating("all")}
                    >
                      All
                    </Button>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <Button
                        key={rating}
                        variant={selectedRating === rating.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRating(rating.toString())}
                        className="flex items-center gap-1"
                      >
                        {rating} <Star className="w-3 h-3 fill-current" />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Comment Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{comment.userName}</h3>
                            <p className="text-sm text-muted-foreground">{comment.userRole}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(comment.rating)}
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Model Name */}
                      <Badge variant="secondary">{comment.modelName}</Badge>

                      {/* Comment Text */}
                      <p className="text-sm leading-relaxed">{comment.comment}</p>

                      {/* Helpful & Reply Status */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {comment.helpful} helpful
                            </span>
                          </div>
                          {comment.replied ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Replied
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending Reply
                            </Badge>
                          )}
                        </div>
                        
                        {!comment.replied && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reply to {comment.userName}</DialogTitle>
                                <DialogDescription>
                                  Respond to feedback about {comment.modelName}
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Type your response..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <DialogFooter>
                                <Button onClick={() => setReplyText("")}>Send Reply</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>

                      {/* Developer Reply */}
                      {comment.replied && comment.reply && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              Developer Response
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {comment.replyDate && new Date(comment.replyDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.reply}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Performance</CardTitle>
                <CardDescription>Analysis of feedback response effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{overallMetrics.responseRate}%</p>
                      <p className="text-sm text-muted-foreground">Response Rate</p>
                      <p className="text-xs text-muted-foreground">
                        Percentage of feedback addressed by Developer
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">2.3</p>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
                      <p className="text-xs text-muted-foreground">Days to respond to feedback</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">94%</p>
                      <p className="text-sm text-muted-foreground">User Satisfaction</p>
                      <p className="text-xs text-muted-foreground">Users satisfied with responses</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Pending Actions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Unreplied feedback requiring attention</span>
                        <Badge variant="outline">{overallMetrics.unrepliedFeedback} items</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Follow-up responses needed</span>
                        <Badge variant="outline">3 items</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}