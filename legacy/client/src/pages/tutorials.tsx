import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  PlayCircle, 
  Download,
  Heart,
  Share2,
  Bookmark,
  Award,
  Target,
  Brain,
  BarChart3,
  Shield,
  Bot,
  Calculator,
  Eye,
  AlertTriangle,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/layout/Layout";

interface Tutorial {
  id: number;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    title: string;
    rating: number;
  };
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number; // in minutes
  lessons: number;
  rating: number;
  studentsEnrolled: number;
  price: number;
  isFree: boolean;
  isPopular: boolean;
  isNew: boolean;
  completionRate: number;
  thumbnail: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  lastUpdated: string;
  language: string;
  hasSubtitles: boolean;
  downloadable: boolean;
  certificate: boolean;
  progress?: number; // User's progress if enrolled
}

interface TutorialStats {
  totalTutorials: number;
  totalHours: number;
  averageRating: number;
  totalStudents: number;
  completionRate: number;
  popularCategory: string;
}

export default function Tutorials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  // Sample tutorial data
  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Introduction to AI Financial Models",
      description: "Learn the fundamentals of artificial intelligence in finance, including machine learning basics, data preprocessing, and model evaluation techniques.",
      instructor: {
        name: "Dr. Sarah Chen",
        avatar: "/api/placeholder/100/100",
        title: "Senior Quantitative Analyst",
        rating: 4.9
      },
      category: "AI Fundamentals",
      difficulty: "Beginner",
      duration: 180,
      lessons: 12,
      rating: 4.8,
      studentsEnrolled: 2847,
      price: 0,
      isFree: true,
      isPopular: true,
      isNew: false,
      completionRate: 85,
      thumbnail: "/api/placeholder/400/200",
      tags: ["Machine Learning", "Finance", "Python", "Data Science"],
      prerequisites: ["Basic Programming Knowledge"],
      learningObjectives: [
        "Understand AI applications in finance",
        "Learn data preprocessing techniques",
        "Build your first financial model",
        "Evaluate model performance"
      ],
      lastUpdated: "2024-06-15",
      language: "English",
      hasSubtitles: true,
      downloadable: true,
      certificate: true,
      progress: 35
    },
    {
      id: 2,
      title: "Advanced Portfolio Optimization with AI",
      description: "Master advanced techniques for portfolio optimization using artificial intelligence, including deep learning approaches and real-time optimization strategies.",
      instructor: {
        name: "Prof. Michael Rodriguez",
        avatar: "/api/placeholder/100/100",
        title: "Portfolio Management Expert",
        rating: 4.7
      },
      category: "Portfolio Management",
      difficulty: "Advanced",
      duration: 320,
      lessons: 18,
      rating: 4.9,
      studentsEnrolled: 1523,
      price: 149,
      isFree: false,
      isPopular: true,
      isNew: false,
      completionRate: 78,
      thumbnail: "/api/placeholder/400/200",
      tags: ["Portfolio", "Optimization", "Deep Learning", "Risk Management"],
      prerequisites: ["Linear Algebra", "Python Programming", "Financial Markets Knowledge"],
      learningObjectives: [
        "Implement modern portfolio theory with AI",
        "Build deep learning optimization models",
        "Handle real-time market data",
        "Develop risk-adjusted strategies"
      ],
      lastUpdated: "2024-06-10",
      language: "English",
      hasSubtitles: true,
      downloadable: false,
      certificate: true
    },
    {
      id: 3,
      title: "Risk Assessment Using Machine Learning",
      description: "Comprehensive guide to building machine learning models for financial risk assessment, covering credit risk, market risk, and operational risk.",
      instructor: {
        name: "Dr. Emma Thompson",
        avatar: "/api/placeholder/100/100",
        title: "Risk Management Specialist",
        rating: 4.8
      },
      category: "Risk Management",
      difficulty: "Intermediate",
      duration: 240,
      lessons: 15,
      rating: 4.7,
      studentsEnrolled: 1891,
      price: 99,
      isFree: false,
      isPopular: false,
      isNew: true,
      completionRate: 82,
      thumbnail: "/api/placeholder/400/200",
      tags: ["Risk Assessment", "Machine Learning", "Credit Risk", "Compliance"],
      prerequisites: ["Statistics", "Python", "Financial Risk Basics"],
      learningObjectives: [
        "Build credit risk models",
        "Implement market risk analytics",
        "Develop operational risk frameworks",
        "Create risk monitoring dashboards"
      ],
      lastUpdated: "2024-06-20",
      language: "English",
      hasSubtitles: true,
      downloadable: true,
      certificate: true,
      progress: 60
    },
    {
      id: 4,
      title: "Algorithmic Trading Strategies",
      description: "Learn to develop and implement algorithmic trading strategies using Python, including backtesting, optimization, and live trading deployment.",
      instructor: {
        name: "James Park",
        avatar: "/api/placeholder/100/100",
        title: "Quantitative Trader",
        rating: 4.6
      },
      category: "Algorithmic Trading",
      difficulty: "Intermediate",
      duration: 280,
      lessons: 16,
      rating: 4.6,
      studentsEnrolled: 2156,
      price: 119,
      isFree: false,
      isPopular: true,
      isNew: false,
      completionRate: 73,
      thumbnail: "/api/placeholder/400/200",
      tags: ["Trading", "Algorithms", "Backtesting", "Python"],
      prerequisites: ["Python Programming", "Financial Markets", "Basic Statistics"],
      learningObjectives: [
        "Develop trading algorithms",
        "Implement backtesting frameworks",
        "Optimize strategy parameters",
        "Deploy live trading systems"
      ],
      lastUpdated: "2024-05-28",
      language: "English",
      hasSubtitles: false,
      downloadable: true,
      certificate: true
    },
    {
      id: 5,
      title: "ESG Analytics and Sustainable Finance",
      description: "Explore Environmental, Social, and Governance (ESG) analytics using AI and machine learning to build sustainable investment strategies.",
      instructor: {
        name: "Dr. Lisa Anderson",
        avatar: "/api/placeholder/100/100",
        title: "Sustainable Finance Expert",
        rating: 4.9
      },
      category: "ESG Analytics",
      difficulty: "Beginner",
      duration: 200,
      lessons: 10,
      rating: 4.8,
      studentsEnrolled: 1654,
      price: 0,
      isFree: true,
      isPopular: false,
      isNew: true,
      completionRate: 88,
      thumbnail: "/api/placeholder/400/200",
      tags: ["ESG", "Sustainability", "Impact Investing", "Data Analytics"],
      prerequisites: ["Basic Finance Knowledge"],
      learningObjectives: [
        "Understand ESG frameworks",
        "Analyze sustainability metrics",
        "Build ESG scoring models",
        "Create impact investment strategies"
      ],
      lastUpdated: "2024-06-25",
      language: "English",
      hasSubtitles: true,
      downloadable: true,
      certificate: true,
      progress: 0
    },
    {
      id: 6,
      title: "Fraud Detection with Deep Learning",
      description: "Advanced course on building fraud detection systems using deep learning techniques, neural networks, and real-time monitoring systems.",
      instructor: {
        name: "Dr. Robert Kim",
        avatar: "/api/placeholder/100/100",
        title: "Machine Learning Engineer",
        rating: 4.7
      },
      category: "Fraud Detection",
      difficulty: "Advanced",
      duration: 360,
      lessons: 20,
      rating: 4.9,
      studentsEnrolled: 987,
      price: 189,
      isFree: false,
      isPopular: false,
      isNew: false,
      completionRate: 71,
      thumbnail: "/api/placeholder/400/200",
      tags: ["Fraud Detection", "Deep Learning", "Neural Networks", "Security"],
      prerequisites: ["Deep Learning", "Python", "SQL", "Statistics"],
      learningObjectives: [
        "Build neural network fraud models",
        "Implement real-time detection",
        "Handle imbalanced datasets",
        "Deploy production systems"
      ],
      lastUpdated: "2024-05-15",
      language: "English",
      hasSubtitles: true,
      downloadable: false,
      certificate: true
    }
  ];

  const categories = [
    "All Categories",
    "AI Fundamentals",
    "Portfolio Management",
    "Risk Management",
    "Algorithmic Trading",
    "ESG Analytics",
    "Fraud Detection"
  ];

  const tutorialStats: TutorialStats = {
    totalTutorials: tutorials.length,
    totalHours: Math.round(tutorials.reduce((sum, tutorial) => sum + tutorial.duration, 0) / 60),
    averageRating: tutorials.reduce((sum, tutorial) => sum + tutorial.rating, 0) / tutorials.length,
    totalStudents: tutorials.reduce((sum, tutorial) => sum + tutorial.studentsEnrolled, 0),
    completionRate: tutorials.reduce((sum, tutorial) => sum + tutorial.completionRate, 0) / tutorials.length,
    popularCategory: "AI Fundamentals"
  };

  // Filter and sort tutorials
  const filteredTutorials = useMemo(() => {
    let filtered = tutorials.filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || tutorial.difficulty === selectedDifficulty;
      const matchesEnrolled = !showEnrolledOnly || tutorial.progress !== undefined;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesEnrolled;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.studentsEnrolled - a.studentsEnrolled;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case "duration":
          return a.duration - b.duration;
        case "price":
          return a.price - b.price;
        default:
          return 0;
      }
    });
  }, [tutorials, searchTerm, selectedCategory, selectedDifficulty, sortBy, showEnrolledOnly]);

  function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Financial AI Tutorials</h1>
          <p className="text-muted-foreground">
            Master AI and machine learning in finance with expert-led tutorials
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tutorials</p>
                  <p className="text-2xl font-bold">{tutorialStats.totalTutorials}</p>
                </div>
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{tutorialStats.totalHours}h</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{tutorialStats.averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{tutorialStats.totalStudents.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{Math.round(tutorialStats.completionRate)}%</p>
                </div>
                <Award className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enrolled-only"
                checked={showEnrolledOnly}
                onChange={(e) => setShowEnrolledOnly(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="enrolled-only" className="text-sm">Show only enrolled tutorials</label>
            </div>
          </CardContent>
        </Card>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {tutorial.isFree && (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Free
                    </Badge>
                  )}
                  {tutorial.isPopular && (
                    <Badge className="bg-orange-600 hover:bg-orange-700">
                      Popular
                    </Badge>
                  )}
                  {tutorial.isNew && (
                    <Badge className="bg-blue-600 hover:bg-blue-700">
                      New
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <Button variant="secondary" size="sm" className="opacity-90">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {formatDuration(tutorial.duration)}
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getDifficultyColor(tutorial.difficulty)}>
                    {tutorial.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tutorial.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({tutorial.studentsEnrolled.toLocaleString()})
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{tutorial.title}</CardTitle>
                <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={tutorial.instructor.avatar} />
                    <AvatarFallback>{tutorial.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{tutorial.instructor.name}</p>
                    <p className="text-xs text-muted-foreground">{tutorial.instructor.title}</p>
                  </div>
                </div>

                {/* Progress (if enrolled) */}
                {tutorial.progress !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{tutorial.progress}%</span>
                    </div>
                    <Progress value={tutorial.progress} className="h-2" />
                  </div>
                )}

                {/* Tutorial Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{tutorial.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{tutorial.studentsEnrolled.toLocaleString()}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {tutorial.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tutorial.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tutorial.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div>
                    {tutorial.isFree ? (
                      <span className="text-lg font-bold text-green-600">Free</span>
                    ) : (
                      <span className="text-lg font-bold">${tutorial.price}</span>
                    )}
                  </div>
                  <Button className="flex-1 ml-3">
                    {tutorial.progress !== undefined ? "Continue" : tutorial.isFree ? "Start Free" : "Enroll Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTutorials.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tutorials found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}