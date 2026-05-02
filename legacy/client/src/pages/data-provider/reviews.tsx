import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import {
  Star,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  BarChart3
} from "lucide-react";

export default function DataProviderReviews() {
  const [selectedRating, setSelectedRating] = useState("all");
  const [replyText, setReplyText] = useState("");

  // Sample reviews and feedback data
  const feedbackOverview = {
    averageRating: 4.6,
    totalReviews: 234,
    responseRate: 87,
    averageResponseTime: "4.2 hours",
    sentiment: "positive"
  };

  const ratingDistribution = [
    { stars: 5, count: 142, percentage: 61 },
    { stars: 4, count: 67, percentage: 29 },
    { stars: 3, count: 18, percentage: 8 },
    { stars: 2, count: 5, percentage: 2 },
    { stars: 1, count: 2, percentage: 1 }
  ];

  const reviews = [
    {
      id: 1,
      user: "AlgoTrade Corp",
      userType: "Institutional",
      dataset: "Financial Market Data Q3 2025",
      rating: 5,
      title: "Exceptional data quality and accuracy",
      review: "The financial market data provided has been instrumental in improving our algorithmic trading performance. The data accuracy is outstanding, and the API documentation is comprehensive. Highly recommended for serious quantitative analysis.",
      date: "2025-07-12",
      helpful: 23,
      replied: true,
      reply: "Thank you for the excellent feedback! We're thrilled that our data is helping improve your trading performance. We'll continue to maintain our high standards.",
      replyDate: "2025-07-13",
      tags: ["Data Quality", "API", "Documentation"]
    },
    {
      id: 2,
      user: "QuantFund Analytics",
      userType: "Hedge Fund",
      dataset: "Real Estate Pricing Analytics",
      rating: 4,
      title: "Good data coverage but could be more timely",
      review: "The real estate data covers a wide geographic range and provides valuable insights. However, some of the data points seem to be updated with a slight delay. Overall, still very useful for our portfolio analysis.",
      date: "2025-07-10",
      helpful: 18,
      replied: false,
      tags: ["Coverage", "Timeliness", "Geographic Data"]
    },
    {
      id: 3,
      user: "CryptoInsights Ltd",
      userType: "FinTech",
      dataset: "Cryptocurrency Trading Signals",
      rating: 5,
      title: "Game-changing crypto signals",
      review: "These trading signals have significantly improved our crypto trading strategy. The accuracy rate is impressive, and the real-time updates are exactly what we needed. The customer support team is also very responsive.",
      date: "2025-07-08",
      helpful: 31,
      replied: true,
      reply: "We're delighted to hear about your improved trading performance! Real-time accuracy is our top priority for crypto signals.",
      replyDate: "2025-07-09",
      tags: ["Trading Signals", "Accuracy", "Real-time", "Support"]
    },
    {
      id: 4,
      user: "Green Capital Partners",
      userType: "Asset Manager",
      dataset: "ESG Investment Data",
      rating: 4,
      title: "Comprehensive ESG metrics",
      review: "The ESG data provides a comprehensive view of sustainability metrics across various industries. The scoring methodology is transparent and well-documented. Would love to see more frequent updates on emerging markets.",
      date: "2025-07-05",
      helpful: 15,
      replied: false,
      tags: ["ESG", "Methodology", "Emerging Markets"]
    },
    {
      id: 5,
      user: "DataDriven Investments",
      userType: "Investment Firm",
      dataset: "Financial Market Data Q3 2025",
      rating: 3,
      title: "Good but room for improvement",
      review: "The data quality is generally good, but we've noticed some inconsistencies in the timestamp formatting. The API rate limits could also be higher for enterprise customers. Customer support has been helpful in addressing our concerns.",
      date: "2025-07-03",
      helpful: 9,
      replied: true,
      reply: "Thank you for the detailed feedback. We're working on standardizing timestamp formats and reviewing enterprise rate limits. Our team will reach out to discuss your specific requirements.",
      replyDate: "2025-07-04",
      tags: ["Data Format", "API Limits", "Enterprise"]
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reviews & Feedback</h1>
            <p className="text-muted-foreground">Manage customer reviews and feedback responses</p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Reviews
          </Button>
        </div>

        {/* Feedback Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{feedbackOverview.averageRating}</div>
                <div className="flex">{renderStars(Math.round(feedbackOverview.averageRating))}</div>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {feedbackOverview.totalReviews} reviews
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackOverview.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18</span> this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <Reply className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackOverview.responseRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackOverview.averageResponseTime}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-1.2h</span> improvement
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{feedbackOverview.sentiment}</div>
              <p className="text-xs text-muted-foreground">
                Overall customer sentiment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of customer ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating.stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${rating.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground w-16">
                    {rating.count} ({rating.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews and Feedback */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">Pending Response</TabsTrigger>
            <TabsTrigger value="analytics">Review Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Review Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{review.user}</span>
                            </div>
                            <Badge variant="secondary">{review.userType}</Badge>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.dataset}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{review.helpful} helpful</span>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="space-y-2">
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.review}</p>
                        <div className="flex gap-2">
                          {review.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Reply Section */}
                      {review.replied ? (
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Reply className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Your Reply</span>
                            <span className="text-xs text-muted-foreground">({review.replyDate})</span>
                          </div>
                          <p className="text-sm">{review.reply}</p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reply to Review</DialogTitle>
                                <DialogDescription>
                                  Respond to {review.user}'s review of {review.dataset}
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Write your response..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button>Send Reply</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-6">
              {reviews.filter(review => !review.replied).map((review) => (
                <Card key={review.id} className="border-yellow-200 bg-yellow-50/50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-600">Pending Response</span>
                      </div>
                      {/* Same review content structure as above */}
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{review.user}</span>
                            </div>
                            <Badge variant="secondary">{review.userType}</Badge>
                            <div className="flex">{renderStars(review.rating)}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.dataset}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.review}</p>
                      </div>
                      <Button variant="default" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review Trends</CardTitle>
                  <CardDescription>Review volume and ratings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Review trends chart would be implemented here
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Common Themes</CardTitle>
                  <CardDescription>Most mentioned topics in reviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Quality</span>
                      <Badge variant="secondary">89 mentions</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Performance</span>
                      <Badge variant="secondary">67 mentions</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Support</span>
                      <Badge variant="secondary">45 mentions</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documentation</span>
                      <Badge variant="secondary">34 mentions</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}