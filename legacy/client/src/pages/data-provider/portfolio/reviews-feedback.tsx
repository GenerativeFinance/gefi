import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Reply, 
  Filter,
  Search,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Send
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function ReviewsFeedback() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Sample reviews and feedback data
  const feedbackOverview = {
    averageRating: 4.6,
    totalReviews: 156,
    responseRate: 87.2,
    responsiveTime: "4.2 hours",
    satisfactionScore: 94.3,
    positiveReviews: 89.1
  };

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 57.1 },
    { stars: 4, count: 45, percentage: 28.8 },
    { stars: 3, count: 15, percentage: 9.6 },
    { stars: 2, count: 5, percentage: 3.2 },
    { stars: 1, count: 2, percentage: 1.3 }
  ];

  const detailedReviews = [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "AC",
      company: "FinTech Solutions",
      dataset: "Cryptocurrency Trading Pairs",
      rating: 5,
      title: "Exceptional real-time data quality",
      review: "The cryptocurrency trading pair data is incredibly accurate and has minimal latency. We've been using it for our high-frequency trading algorithms and the results have been outstanding. The API documentation is clear and the support team is very responsive.",
      date: "2025-07-14",
      verified: true,
      helpful: 23,
      category: "Data Quality",
      status: "Published",
      response: null,
      tags: ["Real-time", "Accurate", "Well-documented"]
    },
    {
      id: 2,
      user: "Sarah Johnson",
      avatar: "SJ",
      company: "Investment Analytics Corp",
      dataset: "Federal Reserve Economic Data",
      rating: 5,
      title: "Reliable and comprehensive economic indicators",
      review: "This dataset has become essential for our economic forecasting models. The data is consistently updated and covers all the key indicators we need. The historical depth is impressive and helps us build more robust predictive models.",
      date: "2025-07-13",
      verified: true,
      helpful: 18,
      category: "Data Coverage",
      status: "Published",
      response: {
        date: "2025-07-13",
        text: "Thank you for the positive feedback! We're glad our economic data is helping with your forecasting models. We continue to expand our coverage and improve update frequency."
      },
      tags: ["Comprehensive", "Historical", "Updated"]
    },
    {
      id: 3,
      user: "Mike Rodriguez",
      avatar: "MR",
      company: "Quantum Analytics",
      dataset: "S&P 500 Historical Data",
      rating: 4,
      title: "Good data but missing some dividend information",
      review: "Overall excellent historical coverage of S&P 500 companies with good price and volume data. However, I noticed some gaps in dividend adjustment data for certain stocks, particularly in the 2018-2020 period. Would be great if this could be addressed.",
      date: "2025-07-12",
      verified: true,
      helpful: 12,
      category: "Data Completeness",
      status: "Published",
      response: {
        date: "2025-07-12",
        text: "Thanks for pointing this out! We're currently working on filling those dividend data gaps for the 2018-2020 period. Expect an update within the next two weeks."
      },
      tags: ["Historical", "Price Data", "Improvement Needed"]
    },
    {
      id: 4,
      user: "Emma Watson",
      avatar: "EW",
      company: "DataDriven Investments",
      dataset: "Corporate Bond Yields",
      rating: 3,
      title: "Decent data but inconsistent quality",
      review: "The bond yield data is useful but I've noticed inconsistencies in the credit rating classifications and some missing data points for smaller corporate issuers. The data quality varies significantly between different bond categories.",
      date: "2025-07-10",
      verified: true,
      helpful: 8,
      category: "Data Quality",
      status: "Published",
      response: null,
      tags: ["Bond Data", "Inconsistent", "Quality Issues"]
    },
    {
      id: 5,
      user: "David Kim",
      avatar: "DK",
      company: "AlgoTrade Systems",
      dataset: "Cryptocurrency Trading Pairs",
      rating: 5,
      title: "Perfect for algorithmic trading",
      review: "We've integrated this data into our algorithmic trading platform and it works flawlessly. The WebSocket feeds are stable, the data format is consistent, and the coverage of trading pairs is comprehensive. Highly recommended for any serious crypto trading operation.",
      date: "2025-07-09",
      verified: true,
      helpful: 31,
      category: "Integration",
      status: "Published",
      response: {
        date: "2025-07-09",
        text: "We're thrilled to hear about your successful integration! Thank you for choosing our data for your algorithmic trading platform."
      },
      tags: ["WebSocket", "Algorithmic", "Comprehensive"]
    },
    {
      id: 6,
      user: "Lisa Zhang",
      avatar: "LZ",
      company: "Risk Management Solutions",
      dataset: "Federal Reserve Economic Data",
      rating: 4,
      title: "Great for risk modeling but needs more frequency",
      review: "The economic indicators are perfect for our risk models, but we'd love to see more frequent updates for some of the key metrics. Currently some data points are updated monthly when weekly would be more valuable for our use case.",
      date: "2025-07-08",
      verified: false,
      helpful: 6,
      category: "Update Frequency",
      status: "Pending Review",
      response: null,
      tags: ["Risk Modeling", "Frequency", "Economic"]
    }
  ];

  const responseTemplates = [
    "Thank you for your valuable feedback! We're glad our data is meeting your needs.",
    "We appreciate you taking the time to review our dataset. Your feedback helps us improve.",
    "Thanks for pointing this out. We're working on addressing this issue and will update you soon.",
    "We're sorry to hear about this issue. Our team is investigating and will provide a resolution shortly."
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending Review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Flagged": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const filteredReviews = detailedReviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && !review.response;
    if (activeTab === "responded") return matchesSearch && review.response;
    if (activeTab === "high-rated") return matchesSearch && review.rating >= 4;
    if (activeTab === "needs-attention") return matchesSearch && (review.rating <= 3 || !review.response);
    
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reviews & Feedback</h1>
            <p className="text-muted-foreground">Monitor developer ratings, comments, and your response rate to maintain high satisfaction.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export Reviews
            </Button>
            <Button className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Feedback Overview */}
        <div className="grid gap-6 md:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getRatingColor(feedbackOverview.averageRating)}`}>
                {feedbackOverview.averageRating}
              </div>
              <p className="text-xs text-muted-foreground">Out of 5 stars</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackOverview.totalReviews}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <Reply className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{feedbackOverview.responseRate}%</div>
              <p className="text-xs text-muted-foreground">Feedback addressed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackOverview.responsiveTime}</div>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{feedbackOverview.satisfactionScore}%</div>
              <p className="text-xs text-muted-foreground">User satisfaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{feedbackOverview.positiveReviews}%</div>
              <p className="text-xs text-muted-foreground">4+ star ratings</p>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of user ratings across all datasets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating.stars}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <Progress value={rating.percentage} className="h-3" />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium">{rating.count}</span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm text-muted-foreground">{rating.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Review Filters and Tabs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Review Management</CardTitle>
            <CardDescription>Filter and respond to developer feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reviews by title, content, or reviewer..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant={activeTab === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("all")}
                >
                  All Reviews
                </Button>
                <Button 
                  variant={activeTab === "pending" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("pending")}
                >
                  Pending Response
                </Button>
                <Button 
                  variant={activeTab === "responded" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("responded")}
                >
                  Responded
                </Button>
                <Button 
                  variant={activeTab === "high-rated" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("high-rated")}
                >
                  High Rated
                </Button>
                <Button 
                  variant={activeTab === "needs-attention" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("needs-attention")}
                >
                  Needs Attention
                </Button>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{review.user}</h4>
                          {review.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <Badge variant="outline">{review.company}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Dataset: {review.dataset}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(review.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className={getStatusColor(review.status)}>
                        {review.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">{review.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{review.review}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{review.category}</Badge>
                      {review.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpful} helpful</span>
                      </div>
                    </div>
                  </div>

                  {review.response ? (
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Your Response</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(review.response.date)}
                        </span>
                      </div>
                      <p className="text-sm">{review.response.text}</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Response Required</span>
                      </div>
                      <p className="text-sm text-muted-foreground">This review hasn't been responded to yet.</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Dialog open={replyDialogOpen && selectedReview?.id === review.id} onOpenChange={setReplyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedReview(review)}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          {review.response ? "Edit Response" : "Respond"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {review.response ? "Edit Response" : "Respond to Review"}
                          </DialogTitle>
                          <DialogDescription>
                            Write a thoughtful response to address the reviewer's feedback.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{review.title}</span>
                            </div>
                            <p className="text-sm">{review.review}</p>
                          </div>
                          
                          <div>
                            <Label htmlFor="response">Your Response</Label>
                            <Textarea 
                              id="response" 
                              placeholder="Write your response here..."
                              rows={4}
                              defaultValue={review.response?.text || ""}
                            />
                          </div>

                          <div>
                            <Label>Quick Templates</Label>
                            <div className="grid gap-2 mt-2">
                              {responseTemplates.map((template, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="text-left justify-start h-auto p-3"
                                  onClick={() => {
                                    const textarea = document.getElementById("response");
                                    if (textarea) textarea.value = template;
                                  }}
                                >
                                  {template}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setReplyDialogOpen(false)}>
                            <Send className="h-4 w-4 mr-1" />
                            Send Response
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No reviews found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search criteria" : "No reviews match the selected filter"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}