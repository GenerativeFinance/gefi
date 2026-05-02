import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Download,
  ExternalLink,
  Video,
  Star,
  BookOpen,
  TrendingUp,
  Brain,
  Shield,
  Zap
} from "lucide-react";

export default function Webinars() {
  const upcomingWebinars = [
    {
      id: 1,
      title: "Advanced Portfolio Optimization with AI",
      description: "Learn how to leverage machine learning algorithms for optimal portfolio allocation and risk management.",
      presenter: "Dr. Sarah Chen",
      presenterRole: "Head of AI Research",
      presenterAvatar: "/api/placeholder/40/40",
      date: "2025-07-05",
      time: "2:00 PM EST",
      duration: "60 minutes",
      attendees: 245,
      level: "Advanced",
      category: "Portfolio Management",
      tags: ["AI", "Portfolio", "Risk Management"]
    },
    {
      id: 2,
      title: "Building Your First Trading Bot",
      description: "Step-by-step guide to creating automated trading strategies using our platform's AI tools.",
      presenter: "Michael Rodriguez",
      presenterRole: "Senior Developer",
      presenterAvatar: "/api/placeholder/40/40",
      date: "2025-07-08",
      time: "10:00 AM EST",
      duration: "90 minutes",
      attendees: 189,
      level: "Beginner",
      category: "Development",
      tags: ["Trading Bots", "Automation", "Tutorial"]
    },
    {
      id: 3,
      title: "Market Sentiment Analysis Deep Dive",
      description: "Explore how to use AI-powered sentiment analysis to predict market movements and optimize trading decisions.",
      presenter: "Alex Thompson",
      presenterRole: "Quantitative Analyst",
      presenterAvatar: "/api/placeholder/40/40",
      date: "2025-07-12",
      time: "3:00 PM EST",
      duration: "75 minutes",
      attendees: 156,
      level: "Intermediate",
      category: "Analysis",
      tags: ["Sentiment", "Market Analysis", "AI"]
    }
  ];

  const recordedWebinars = [
    {
      id: 1,
      title: "Introduction to AI Financial Modeling",
      presenter: "Dr. Emily Davis",
      duration: "45 minutes",
      views: 2456,
      rating: 4.8,
      thumbnail: "/api/placeholder/300/200",
      category: "Getting Started",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Risk Assessment Strategies for 2025",
      presenter: "James Wilson",
      duration: "55 minutes",
      views: 1834,
      rating: 4.9,
      thumbnail: "/api/placeholder/300/200",
      category: "Risk Management",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Cryptocurrency Trading with AI Models",
      presenter: "Lisa Kumar",
      duration: "65 minutes",
      views: 3201,
      rating: 4.7,
      thumbnail: "/api/placeholder/300/200",
      category: "Trading",
      level: "Advanced"
    },
    {
      id: 4,
      title: "Compliance and Regulatory Frameworks",
      presenter: "Robert Chen",
      duration: "40 minutes",
      views: 987,
      rating: 4.6,
      thumbnail: "/api/placeholder/300/200",
      category: "Compliance",
      level: "Intermediate"
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Webinars & Events
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Join expert-led webinars and live events to enhance your AI financial modeling skills. 
                Learn from industry leaders and connect with the community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  View Schedule
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Video className="h-5 w-5" />
                  Browse Recordings
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="upcoming" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Webinars</TabsTrigger>
              <TabsTrigger value="recorded">Recorded Sessions</TabsTrigger>
            </TabsList>

            {/* Upcoming Webinars */}
            <TabsContent value="upcoming" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Add to Calendar
                </Button>
              </div>

              <div className="grid gap-6">
                {upcomingWebinars.map((webinar) => (
                  <Card key={webinar.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getLevelColor(webinar.level)}>
                                  {webinar.level}
                                </Badge>
                                <Badge variant="secondary">{webinar.category}</Badge>
                              </div>
                              <h3 className="text-xl font-semibold">{webinar.title}</h3>
                              <p className="text-muted-foreground">{webinar.description}</p>
                            </div>
                          </div>

                          {/* Presenter Info */}
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={webinar.presenterAvatar} />
                              <AvatarFallback>{webinar.presenter.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{webinar.presenter}</div>
                              <div className="text-sm text-muted-foreground">{webinar.presenterRole}</div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {webinar.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Event Details & Actions */}
                        <div className="lg:col-span-1 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(webinar.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{webinar.attendees} registered</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Button className="w-full gap-2">
                              <Calendar className="h-4 w-4" />
                              Register
                            </Button>
                            <Button variant="outline" className="w-full gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Recorded Webinars */}
            <TabsContent value="recorded" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recorded Sessions</h2>
                <div className="flex gap-2">
                  <Badge variant="outline">All</Badge>
                  <Badge variant="outline">Getting Started</Badge>
                  <Badge variant="outline">Trading</Badge>
                  <Badge variant="outline">Risk Management</Badge>
                  <Badge variant="outline">Development</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recordedWebinars.map((webinar) => (
                  <Card key={webinar.id} className="hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={webinar.thumbnail} 
                        alt={webinar.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-t-lg">
                        <Button size="lg" className="rounded-full h-16 w-16 p-0">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className={getLevelColor(webinar.level)}>
                          {webinar.level}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2 mb-1">{webinar.title}</h3>
                        <p className="text-sm text-muted-foreground">by {webinar.presenter}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{webinar.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{webinar.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{webinar.rating}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2">
                          <Play className="h-4 w-4" />
                          Watch
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Newsletter Signup */}
          <section className="mt-16">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Never Miss an Event</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Subscribe to our newsletter to get notified about upcoming webinars, 
                  exclusive events, and new recorded content.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
                  />
                  <Button className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
}