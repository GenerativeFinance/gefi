import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  PlayCircle, 
  Brain, 
  TrendingUp, 
  Shield, 
  Clock,
  ExternalLink,
  Users,
  Award,
  ChevronRight
} from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { useBadgeSystem } from "@/hooks/useBadgeSystem";
import { useEffect } from "react";

export default function LearningCenter() {
  const { t } = useI18n();
  const { trackAction } = useBadgeSystem();

  // Track learning center visit for badge system
  useEffect(() => {
    trackAction('learning_center_visit');
  }, [trackAction]);

  const featuredArticles = [
    {
      id: 1,
      title: "Introduction to AI in Financial Modeling",
      excerpt: "Learn the fundamentals of how artificial intelligence is revolutionizing financial analysis and risk assessment.",
      category: "AI Fundamentals",
      readTime: "8 min read",
      level: "Beginner",
      author: "Dr. Sarah Chen",
      publishedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Building Your First Risk Assessment Model",
      excerpt: "Step-by-step guide to creating machine learning models for portfolio risk evaluation and management.",
      category: "Risk Management",
      readTime: "12 min read",
      level: "Intermediate",
      author: "Michael Rodriguez",
      publishedDate: "2024-01-20"
    },
    {
      id: 3,
      title: "Advanced Portfolio Optimization Techniques",
      excerpt: "Deep dive into modern portfolio theory enhanced with AI-driven optimization algorithms.",
      category: "Portfolio Management",
      readTime: "15 min read",
      level: "Advanced",
      author: "Prof. Emily Watson",
      publishedDate: "2024-01-25"
    },
    {
      id: 4,
      title: "Regulatory Compliance in AI Finance",
      excerpt: "Understanding compliance requirements when implementing AI solutions in financial services.",
      category: "Compliance",
      readTime: "10 min read",
      level: "Intermediate",
      author: "James Thompson",
      publishedDate: "2024-02-01"
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: "Getting Started with GeFi Platform",
      duration: "12:45",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      category: "Platform Basics"
    },
    {
      id: 2,
      title: "Creating Your First AI Model",
      duration: "18:30",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      category: "Model Development"
    },
    {
      id: 3,
      title: "Portfolio Risk Analysis Deep Dive",
      duration: "25:15",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      videoId: "dQw4w9WgXcQ",
      category: "Risk Management"
    }
  ];

  const learningPaths = [
    {
      id: 1,
      title: "AI Financial Modeling Fundamentals",
      description: "Complete beginner's path to understanding AI in finance",
      courses: 5,
      duration: "6 weeks",
      level: "Beginner",
      icon: Brain
    },
    {
      id: 2,
      title: "Advanced Risk Management",
      description: "Master sophisticated risk assessment techniques",
      courses: 8,
      duration: "10 weeks",
      level: "Advanced",
      icon: Shield
    },
    {
      id: 3,
      title: "Portfolio Optimization Expert",
      description: "Professional-level portfolio management strategies",
      courses: 6,
      duration: "8 weeks",
      level: "Expert",
      icon: TrendingUp
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
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Learning Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Master AI-powered financial modeling with comprehensive tutorials, expert insights, 
              and hands-on learning experiences designed for all skill levels.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="articles" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <PlayCircle className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="paths" className="gap-2">
              <Award className="h-4 w-4" />
              Learning Paths
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <Badge className={getLevelColor(article.level)}>
                        {article.level}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </span>
                      <span>{article.author}</span>
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videoTutorials.map((video) => (
                <Card key={video.id} className="hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <iframe
                      className="w-full h-48 rounded-t-lg"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{video.category}</Badge>
                      <PlayCircle className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      {video.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {learningPaths.map((path) => {
                const IconComponent = path.icon;
                return (
                  <Card key={path.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <Badge className={getLevelColor(path.level)}>
                          {path.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {path.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {path.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{path.courses} courses</span>
                        <span>{path.duration}</span>
                      </div>
                      <Button className="w-full gap-2">
                        Start Path
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    External Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <a
                      href="https://www.investopedia.com/terms/m/modern-portfolio-theory.asp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">Modern Portfolio Theory - Investopedia</div>
                      <div className="text-sm text-muted-foreground">
                        Comprehensive guide to portfolio optimization fundamentals
                      </div>
                    </a>
                    <a
                      href="https://www.federalreserve.gov/supervisionreg/srletters/sr0319.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">Federal Reserve AI Guidance</div>
                      <div className="text-sm text-muted-foreground">
                        Official regulatory guidance on AI in financial services
                      </div>
                    </a>
                    <a
                      href="https://www.sec.gov/news/public-statement/iastaffbulletin031021"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">SEC AI Staff Bulletin</div>
                      <div className="text-sm text-muted-foreground">
                        Investment advisor compliance considerations for AI
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Developer Forum</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Connect with other developers building AI financial models
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Users className="h-4 w-4" />
                        Join Discussion
                      </Button>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Expert Office Hours</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Weekly Q&A sessions with financial modeling experts
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Schedule Session
                      </Button>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Study Groups</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Join peer learning groups for collaborative study
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Users className="h-4 w-4" />
                        Find Groups
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}