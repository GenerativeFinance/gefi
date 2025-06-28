import { useState } from "react";
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

type ContentType = 'tutorial' | 'guide' | 'workshop' | 'project' | 'certification' | 'documentation';
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

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
}

const mockContent: LearningContent[] = [
  {
    id: "1",
    title: "Introduction to AI in Financial Markets",
    description: "Learn the fundamentals of applying artificial intelligence to financial market analysis and trading strategies.",
    type: "tutorial",
    difficulty: "beginner",
    duration: "2h 30m",
    category: "AI Fundamentals",
    tags: ["AI", "Finance", "Basics"],
    rating: 4.8,
    enrollments: 2340,
    instructor: "Dr. Sarah Chen",
    isCompleted: false,
    progress: 0
  },
  {
    id: "2",
    title: "Building Portfolio Optimization Models",
    description: "Master the art of creating AI-powered portfolio optimization algorithms using modern portfolio theory.",
    type: "guide",
    difficulty: "intermediate",
    duration: "4h 15m",
    category: "Portfolio Management",
    tags: ["Portfolio", "Optimization", "Python"],
    rating: 4.9,
    enrollments: 1850,
    instructor: "Prof. Michael Torres",
    isCompleted: true,
    progress: 100
  },
  {
    id: "3",
    title: "Risk Management with Machine Learning",
    description: "Comprehensive workshop on implementing ML-based risk assessment systems for financial institutions.",
    type: "workshop",
    difficulty: "advanced",
    duration: "6h 00m",
    category: "Risk Management",
    tags: ["Risk", "ML", "Advanced"],
    rating: 4.7,
    enrollments: 980,
    instructor: "Dr. James Wilson",
    isCompleted: false,
    progress: 45
  },
  {
    id: "4",
    title: "Algorithmic Trading Bot Project",
    description: "Build your first algorithmic trading bot from scratch using real market data and backtesting frameworks.",
    type: "project",
    difficulty: "intermediate",
    duration: "8h 30m",
    category: "Algorithmic Trading",
    tags: ["Trading", "Algorithms", "Project"],
    rating: 4.6,
    enrollments: 1520,
    instructor: "Alex Rodriguez",
    isCompleted: false,
    progress: 0
  },
  {
    id: "5",
    title: "Financial AI Certification Program",
    description: "Complete certification program covering all aspects of AI application in finance, from basics to advanced implementation.",
    type: "certification",
    difficulty: "expert",
    duration: "40h 00m",
    category: "Certification",
    tags: ["Certification", "Complete", "Professional"],
    rating: 4.9,
    enrollments: 650,
    instructor: "Multiple Instructors",
    isCompleted: false,
    progress: 0
  },
  {
    id: "6",
    title: "Platform API Documentation",
    description: "Complete reference guide for GeFi platform APIs, including authentication, data access, and model deployment.",
    type: "documentation",
    difficulty: "beginner",
    duration: "1h 00m",
    category: "Platform",
    tags: ["API", "Documentation", "Platform"],
    rating: 4.5,
    enrollments: 3200,
    isCompleted: false,
    progress: 0
  }
];

const typeColors = {
  tutorial: "bg-blue-100 text-blue-800",
  guide: "bg-green-100 text-green-800",
  workshop: "bg-purple-100 text-purple-800",
  project: "bg-orange-100 text-orange-800",
  certification: "bg-red-100 text-red-800",
  documentation: "bg-gray-100 text-gray-800"
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-orange-100 text-orange-800",
  expert: "bg-red-100 text-red-800"
};

export default function Learning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const categories = ["AI Fundamentals", "Portfolio Management", "Risk Management", "Algorithmic Trading", "Platform", "Certification"];
  
  const filteredContent = mockContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory;
    const matchesType = selectedType === "all" || content.type === selectedType;
    const matchesDifficulty = selectedDifficulty === "all" || content.difficulty === selectedDifficulty;
    
    if (activeTab === "completed") return matchesSearch && matchesCategory && matchesType && matchesDifficulty && content.isCompleted;
    if (activeTab === "in_progress") return matchesSearch && matchesCategory && matchesType && matchesDifficulty && content.progress && content.progress > 0 && content.progress < 100;
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
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
              <h1 className="text-3xl font-bold">Learning Center</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Master AI financial modeling through comprehensive tutorials, workshops, and hands-on projects.
              Build expertise and earn certifications.
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