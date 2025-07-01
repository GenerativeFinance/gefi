import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/layout/Layout";
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Award, 
  Calendar,
  ExternalLink,
  Heart,
  Share2,
  Eye
} from "lucide-react";

export default function Community() {
  const discussions = [
    {
      id: 1,
      title: "Best AI models for crypto trading in 2025?",
      author: "CryptoAnalyst",
      avatar: "/api/placeholder/32/32",
      replies: 24,
      views: 156,
      likes: 12,
      category: "Trading",
      time: "2 hours ago",
      tags: ["AI Models", "Crypto", "Trading"]
    },
    {
      id: 2,
      title: "Portfolio optimization using reinforcement learning",
      author: "MLTrader",
      avatar: "/api/placeholder/32/32",
      replies: 18,
      views: 89,
      likes: 8,
      category: "Development",
      time: "4 hours ago",
      tags: ["Portfolio", "ML", "Optimization"]
    },
    {
      id: 3,
      title: "Risk management strategies for volatile markets",
      author: "RiskManager",
      avatar: "/api/placeholder/32/32",
      replies: 31,
      views: 203,
      likes: 15,
      category: "Risk",
      time: "6 hours ago",
      tags: ["Risk", "Strategy", "Markets"]
    }
  ];

  const topContributors = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "AI Researcher",
      posts: 89,
      reputation: 1250,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Quant Developer",
      posts: 67,
      reputation: 980,
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      role: "Portfolio Manager",
      posts: 54,
      reputation: 845,
      avatar: "/api/placeholder/40/40"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Community Hub
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Connect with fellow traders, developers, and AI enthusiasts. 
                Share insights, collaborate on projects, and learn from the community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Start Discussion
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  Join Groups
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="default">All</Badge>
                <Badge variant="outline">Trading</Badge>
                <Badge variant="outline">Development</Badge>
                <Badge variant="outline">Risk Management</Badge>
                <Badge variant="outline">AI Models</Badge>
                <Badge variant="outline">News</Badge>
              </div>

              {/* Discussions */}
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={discussion.avatar} />
                          <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                              {discussion.title}
                            </h3>
                            <Badge variant="outline">{discussion.category}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>by {discussion.author}</span>
                            <span>{discussion.time}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {discussion.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{discussion.replies}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{discussion.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-4 w-4" />
                                <span>{discussion.likes}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={contributor.id} className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">{contributor.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{contributor.reputation}</div>
                        <div className="text-xs text-muted-foreground">{contributor.posts} posts</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Members</span>
                    <span className="font-bold">12,458</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Today</span>
                    <span className="font-bold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Discussions</span>
                    <span className="font-bold">3,567</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">AI Models Shared</span>
                    <span className="font-bold">456</span>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">AI Trading Webinar</div>
                    <div className="text-xs text-muted-foreground">Tomorrow, 2:00 PM EST</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Model Development Workshop</div>
                    <div className="text-xs text-muted-foreground">Friday, 10:00 AM EST</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View All Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}