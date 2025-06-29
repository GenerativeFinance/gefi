import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BookOpen, Search, Play, Clock, Award, Users, 
  TrendingUp, BarChart3, Code, Shield, Calendar,
  FileText, Video, Download, Star, CheckCircle
} from "lucide-react";

type ContentType = 'tutorial' | 'guide' | 'workshop' | 'project' | 'certification' | 'documentation' | 'get-started' | 'webinar' | 'blog' | 'faq';
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
type UserType = 'developer' | 'investor' | 'all';

interface LearningContent {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  difficulty: Difficulty;
  duration: string;
  category: string;
  tags: string[];
  rating: number;
  enrollments: number;
  isCompleted?: boolean;
  progress?: number;
  instructor?: string;
  thumbnail?: string;
  targetAudience: UserType;
}

const mockContent: LearningContent[] = [
  // Developer Content
  {
    id: "dev-1",
    title: "Getting Started with AI Financial Models",
    description: "Complete guide to creating your first AI financial model on GeFi platform.",
    type: "get-started",
    difficulty: "beginner",
    duration: "1h 30m",
    category: "Getting Started",
    tags: ["Setup", "First Steps", "Platform"],
    rating: 4.9,
    enrollments: 3200,
    instructor: "GeFi Team",
    isCompleted: false,
    progress: 0,
    targetAudience: "developer"
  },
  {
    id: "dev-2",
    title: "Building Portfolio Optimization Models",
    description: "Master the art of creating AI-powered portfolio optimization algorithms using modern portfolio theory.",
    type: "tutorial",
    difficulty: "intermediate",
    duration: "4h 15m",
    category: "Portfolio Management",
    tags: ["Portfolio", "Optimization", "Python"],
    rating: 4.9,
    enrollments: 1850,
    instructor: "Prof. Michael Torres",
    isCompleted: true,
    progress: 100,
    targetAudience: "developer"
  },
  {
    id: "dev-3",
    title: "Machine Learning for Risk Assessment",
    description: "Comprehensive tutorial on implementing ML-based risk assessment systems for financial institutions.",
    type: "tutorial",
    difficulty: "advanced",
    duration: "6h 00m",
    category: "Risk Management",
    tags: ["Risk", "ML", "Advanced"],
    rating: 4.7,
    enrollments: 980,
    instructor: "Dr. James Wilson",
    isCompleted: false,
    progress: 45,
    targetAudience: "developer"
  },
  {
    id: "dev-4",
    title: "AI Model Development Workshop",
    description: "Live workshop on developing and deploying AI financial models for the marketplace.",
    type: "webinar",
    difficulty: "intermediate",
    duration: "2h 00m",
    category: "Model Development",
    tags: ["Workshop", "Live", "Development"],
    rating: 4.8,
    enrollments: 1250,
    instructor: "Dr. Sarah Chen",
    isCompleted: false,
    progress: 0,
    targetAudience: "developer"
  },
  {
    id: "dev-5",
    title: "Advanced Backtesting Strategies",
    description: "Learn advanced backtesting techniques and performance optimization for trading algorithms.",
    type: "blog",
    difficulty: "advanced",
    duration: "30m",
    category: "Trading",
    tags: ["Backtesting", "Optimization", "Strategies"],
    rating: 4.6,
    enrollments: 890,
    instructor: "Alex Rodriguez",
    isCompleted: false,
    progress: 0,
    targetAudience: "developer"
  },
  
  // Investor Content
  {
    id: "inv-1",
    title: "Getting Started with GeFi Investment Platform",
    description: "Complete guide to using GeFi for portfolio management and AI model subscriptions.",
    type: "get-started",
    difficulty: "beginner",
    duration: "45m",
    category: "Getting Started",
    tags: ["Platform", "Portfolio", "Basics"],
    rating: 4.8,
    enrollments: 5600,
    instructor: "GeFi Team",
    isCompleted: false,
    progress: 0,
    targetAudience: "investor"
  },
  {
    id: "inv-2",
    title: "Understanding AI Investment Models",
    description: "Learn how to evaluate and select AI models for your investment strategy.",
    type: "tutorial",
    difficulty: "beginner",
    duration: "2h 00m",
    category: "Investment Strategy",
    tags: ["AI Models", "Selection", "Strategy"],
    rating: 4.7,
    enrollments: 2800,
    instructor: "Jennifer Park",
    isCompleted: false,
    progress: 20,
    targetAudience: "investor"
  },
  {
    id: "inv-3",
    title: "Portfolio Risk Management Webinar",
    description: "Live session on managing portfolio risk using AI-powered analytics.",
    type: "webinar",
    difficulty: "intermediate",
    duration: "1h 30m",
    category: "Risk Management",
    tags: ["Risk", "Portfolio", "Live"],
    rating: 4.9,
    enrollments: 1900,
    instructor: "Dr. Robert Kim",
    isCompleted: false,
    progress: 0,
    targetAudience: "investor"
  },
  {
    id: "inv-4",
    title: "Market Trends and AI Insights",
    description: "Stay updated with the latest market trends and how AI models are performing.",
    type: "blog",
    difficulty: "beginner",
    duration: "15m",
    category: "Market Analysis",
    tags: ["Trends", "Insights", "Performance"],
    rating: 4.5,
    enrollments: 4200,
    instructor: "Market Analysis Team",
    isCompleted: true,
    progress: 100,
    targetAudience: "investor"
  },
  {
    id: "faq-1",
    title: "Frequently Asked Questions",
    description: "Common questions and answers about using GeFi platform for investments.",
    type: "faq",
    difficulty: "beginner",
    duration: "Variable",
    category: "Support",
    tags: ["FAQ", "Help", "Support"],
    rating: 4.8,
    enrollments: 0,
    instructor: "Support Team",
    isCompleted: false,
    progress: 0,
    targetAudience: "all"
  }
];

const typeColors = {
  "tutorial": "bg-blue-100 text-blue-800",
  "guide": "bg-green-100 text-green-800",
  "workshop": "bg-purple-100 text-purple-800",
  "project": "bg-orange-100 text-orange-800",
  "certification": "bg-red-100 text-red-800",
  "documentation": "bg-gray-100 text-gray-800",
  "get-started": "bg-emerald-100 text-emerald-800",
  "webinar": "bg-purple-100 text-purple-800",
  "blog": "bg-yellow-100 text-yellow-800",
  "faq": "bg-gray-100 text-gray-800"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-orange-100 text-orange-800",
  expert: "bg-red-100 text-red-800"
};

export default function Learning() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const urlTab = urlParams.get('tab') || 'all';
  const urlType = urlParams.get('type') as UserType || 'all';

  // Set initial tab and type from URL
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
    
    // Set content type based on URL parameter
    if (urlTab === 'get-started') {
      setSelectedType('get-started');
    } else if (urlTab === 'tutorials') {
      setSelectedType('tutorial');
    } else if (urlTab === 'webinars') {
      setSelectedType('webinar');
    } else if (urlTab === 'blog') {
      setSelectedType('blog');
    } else if (urlTab === 'faq') {
      setSelectedType('faq');
    }
  }, [urlTab, activeTab]);

  const categories = ["Getting Started", "AI Fundamentals", "Portfolio Management", "Risk Management", "Investment Strategy", "Model Development", "Trading", "Market Analysis", "Support"];
  
  const filteredContent = mockContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory;
    const matchesType = selectedType === "all" || content.type === selectedType;
    const matchesDifficulty = selectedDifficulty === "all" || content.difficulty === selectedDifficulty;
    
    // Filter by target audience based on URL type parameter
    const matchesAudience = urlType === 'all' || content.targetAudience === urlType || content.targetAudience === 'all';
    
    if (activeTab === "completed") return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesAudience && content.isCompleted;
    if (activeTab === "in_progress") return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesAudience && content.progress && content.progress > 0 && content.progress < 100;
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesAudience;
  });

  const handleStartLearning = (contentId: string) => {
    console.log("Starting learning content:", contentId);
    // Implementation for starting content
  };

  const completedCount = mockContent.filter(c => c.isCompleted).length;
  const inProgressCount = mockContent.filter(c => c.progress && c.progress > 0 && c.progress < 100).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">
                Learning Center
                {urlType === 'developer' && (
                  <span className="text-lg text-muted-foreground ml-2">for Developers</span>
                )}
                {urlType === 'investor' && (
                  <span className="text-lg text-muted-foreground ml-2">for Investors</span>
                )}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {urlType === 'developer' ? (
                "Master AI financial model development through comprehensive tutorials, workshops, and hands-on projects. Build and deploy models on our platform."
              ) : urlType === 'investor' ? (
                "Learn how to maximize your investment returns using AI-powered financial models. Discover strategies and analytics tools."
              ) : (
                "Master AI financial modeling through comprehensive tutorials, workshops, and hands-on projects. Build expertise and earn certifications."
              )}
            </p>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                  <p className="text-2xl font-bold">24.5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search learning content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tutorial">Tutorials</SelectItem>
                  <SelectItem value="guide">Guides</SelectItem>
                  <SelectItem value="workshop">Workshops</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="certification">Certifications</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContent.map((content) => (
            <Card key={content.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={typeColors[content.type]}>
                    {content.type.toUpperCase()}
                  </Badge>
                  <Badge className={difficultyColors[content.difficulty]}>
                    {content.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {content.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{content.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{content.enrollments}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{content.rating}</span>
                    </div>
                    <span className="text-muted-foreground">{content.instructor}</span>
                  </div>
                  
                  {content.progress !== undefined && content.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{content.progress}%</span>
                      </div>
                      <Progress value={content.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {content.isCompleted ? (
                      <Button variant="outline" size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                        Completed
                      </Button>
                    ) : content.progress && content.progress > 0 ? (
                      <Button size="sm" className="flex-1" onClick={() => handleStartLearning(content.id)}>
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1" onClick={() => handleStartLearning(content.id)}>
                        <Play className="h-4 w-4 mr-1" />
                        Start Learning
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No content found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find learning content.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Featured Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Featured Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  <span>AI Developer Track</span>
                </CardTitle>
                <CardDescription>
                  Complete path from beginner to expert in AI financial modeling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>6 courses</span>
                    <span>~30 hours</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  <Button size="sm" className="w-full">Continue Path</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Risk Management</span>
                </CardTitle>
                <CardDescription>
                  Master risk assessment and management using AI techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>4 courses</span>
                    <span>~20 hours</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <Button size="sm" variant="outline" className="w-full">Start Path</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span>Trading Algorithms</span>
                </CardTitle>
                <CardDescription>
                  Build and deploy algorithmic trading strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>5 courses</span>
                    <span>~25 hours</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <Button size="sm" className="w-full">Continue Path</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}