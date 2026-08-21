import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, MessageSquare, CheckCircle, XCircle, AlertCircle, User, Clock, GitCommit, Eye, ThumbsUp, ThumbsDown } from "lucide-react";

export default function CodeReview() {
  const pendingReviews = [
    {
      id: "PR-47",
      title: "Implement advanced backtesting metrics",
      author: "Guillaume Lauzier",
      avatar: "/api/placeholder/40/40",
      requestedBy: "AI Team",
      priority: "high",
      files: 8,
      additions: 234,
      deletions: 45,
      created: "2 days ago",
      deadline: "Tomorrow",
      description: "Add comprehensive backtesting metrics including Sharpe ratio, max drawdown, and win rate calculations"
    },
    {
      id: "PR-46",
      title: "Fix portfolio rebalancing algorithm",
      author: "Data Science Team",
      avatar: "/api/placeholder/40/40",
      requestedBy: "Guillaume Lauzier",
      priority: "urgent",
      files: 3,
      additions: 89,
      deletions: 12,
      created: "1 day ago",
      deadline: "Today",
      description: "Critical fix for portfolio rebalancing logic that was causing incorrect asset allocation"
    },
    {
      id: "PR-45",
      title: "Add cryptocurrency support",
      author: "Blockchain Team",
      avatar: "/api/placeholder/40/40",
      requestedBy: "Product Team",
      priority: "medium",
      files: 15,
      additions: 567,
      deletions: 23,
      created: "5 days ago",
      deadline: "Next week",
      description: "Integrate cryptocurrency trading capabilities with support for Bitcoin, Ethereum, and major altcoins"
    }
  ];

  const completedReviews = [
    {
      id: "PR-44",
      title: "Optimize model training performance",
      author: "ML Team",
      avatar: "/api/placeholder/40/40",
      reviewer: "Guillaume Lauzier",
      status: "approved",
      completed: "1 hour ago",
      feedback: "Excellent optimization work. Training time reduced by 40%.",
      rating: 5
    },
    {
      id: "PR-43",
      title: "Update risk calculation methodology",
      author: "Risk Team",
      avatar: "/api/placeholder/40/40",
      reviewer: "Guillaume Lauzier",
      status: "changes_requested",
      completed: "3 hours ago",
      feedback: "Good approach but needs unit tests and better error handling.",
      rating: 3
    },
    {
      id: "PR-42",
      title: "Implement real-time data streaming",
      author: "Data Team",
      avatar: "/api/placeholder/40/40",
      reviewer: "Guillaume Lauzier",
      status: "approved",
      completed: "1 day ago",
      feedback: "Solid implementation with good error handling and performance.",
      rating: 4
    }
  ];

  const myReviews = [
    {
      id: "PR-41",
      title: "Enhanced portfolio analytics dashboard",
      reviewer: "Senior Developer",
      status: "approved",
      completed: "2 hours ago",
      feedback: "Great work on the analytics implementation. Code is clean and well-documented.",
      rating: 5
    },
    {
      id: "PR-40",
      title: "API security improvements",
      reviewer: "Security Team",
      status: "changes_requested",
      completed: "1 day ago",
      feedback: "Security measures are good but need additional input validation.",
      rating: 3
    }
  ];

  const reviewMetrics = [
    {
      label: "Reviews Completed",
      value: "28",
      change: "+3 this week",
      color: "text-green-600"
    },
    {
      label: "Average Review Time",
      value: "4.2 hours",
      change: "-0.8 hours",
      color: "text-green-600"
    },
    {
      label: "Approval Rate",
      value: "85%",
      change: "+5%",
      color: "text-green-600"
    },
    {
      label: "Pending Reviews",
      value: "3",
      change: "+1 today",
      color: "text-yellow-600"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Code Review</h1>
            <p className="text-muted-foreground mt-2">
              Review and manage code changes for AI model development
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Eye className="h-4 w-4 mr-2" />
              Start Review
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Review Guidelines
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {reviewMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-xs ${metric.color}`}>{metric.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending Reviews ({pendingReviews.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Input placeholder="Search reviews..." className="max-w-sm" />
              <select className="p-2 border rounded-md">
                <option>All Priorities</option>
                <option>Urgent</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="grid gap-4">
              {pendingReviews.map((review, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-600">{review.id}</span>
                            <CardTitle className="text-lg">{review.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>by {review.author}</span>
                            <span>requested by {review.requestedBy}</span>
                            <span>{review.created}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          review.priority === "urgent" ? "destructive" : 
                          review.priority === "high" ? "default" : 
                          "secondary"
                        }>
                          {review.priority}
                        </Badge>
                        <Badge variant="outline">Due: {review.deadline}</Badge>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{review.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{review.files} files</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">+{review.additions}</span>
                        <span className="text-red-600">-{review.deletions}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Created {review.created}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid gap-4">
              {completedReviews.map((review, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-600">{review.id}</span>
                            <CardTitle className="text-lg">{review.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>by {review.author}</span>
                            <span>reviewed by {review.reviewer}</span>
                            <span>{review.completed}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={review.status === "approved" ? "success" : "secondary"}>
                          {review.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {review.status === "changes_requested" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {review.status === "approved" ? "Approved" : "Changes Requested"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-${i < review.rating ? 'yellow' : 'gray'}-400`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground italic">"{review.feedback}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-reviews" className="space-y-6">
            <div className="grid gap-4">
              {myReviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">{review.id}</span>
                          <span className="font-semibold">{review.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>reviewed by {review.reviewer}</span>
                          <span>{review.completed}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 italic">"{review.feedback}"</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={review.status === "approved" ? "success" : "secondary"}>
                          {review.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {review.status === "changes_requested" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {review.status === "approved" ? "Approved" : "Changes Requested"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-${i < review.rating ? 'yellow' : 'gray'}-400`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your code review preferences and notification settings
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-assign Reviews</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Based on expertise</option>
                    <option>Round-robin</option>
                    <option>Manual assignment only</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Notifications</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Immediate</option>
                    <option>Daily digest</option>
                    <option>Weekly summary</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Review Template</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Standard checklist</option>
                    <option>Security focused</option>
                    <option>Performance focused</option>
                    <option>Custom template</option>
                  </select>
                </div>
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}