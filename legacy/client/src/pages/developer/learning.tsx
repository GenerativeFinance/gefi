import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  PlayCircle, 
  Award, 
  Clock, 
  Search, 
  Brain, 
  TrendingUp, 
  Zap, 
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Download,
  Video,
  FileText,
  Cpu,
  GitBranch,
  Terminal,
  Layers
} from "lucide-react";

export default function DeveloperLearning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Sample learning data - replace with API call
  const learningStats = {
    completed: 12,
    inProgress: 4,
    certificates: 3,
    hoursLearned: 68.5
  };

  const courses = [
    {
      id: 1,
      title: "Getting Started with AI Financial Models",
      description: "Complete guide to creating your first AI financial model on GeFi platform",
      type: "course",
      level: "beginner",
      category: "fundamentals",
      duration: "3.5 hours",
      progress: 100,
      status: "completed",
      rating: 4.9,
      students: 2847,
      badge: "GET STARTED",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      title: "Building Portfolio Optimization Models",
      description: "Master the art of creating AI-powered portfolio optimization algorithms using modern portfolio theory",
      type: "tutorial",
      level: "intermediate",
      category: "portfolio",
      duration: "5 hours",
      progress: 75,
      status: "in-progress",
      rating: 4.8,
      students: 1892,
      badge: "TUTORIAL",
      color: "bg-orange-100 text-orange-800"
    },
    {
      id: 3,
      title: "Machine Learning for Risk Assessment",
      description: "Comprehensive tutorial on implementing ML-based risk assessment systems for financial institutions",
      type: "project",
      level: "advanced",
      category: "risk-management",
      duration: "8 hours",
      progress: 0,
      status: "not-started",
      rating: 4.7,
      students: 1254,
      badge: "ADVANCED",
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: 4,
      title: "Deep Learning for Market Prediction",
      description: "Advanced neural network architectures for financial market forecasting",
      type: "workshop",
      level: "advanced",
      category: "deep-learning",
      duration: "6 hours",
      progress: 40,
      status: "in-progress",
      rating: 4.6,
      students: 923,
      badge: "WORKSHOP",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 5,
      title: "API Development for Financial Services",
      description: "Build robust and scalable APIs for financial data and model serving",
      type: "certification",
      level: "intermediate",
      category: "backend",
      duration: "7 hours",
      progress: 100,
      status: "completed",
      rating: 4.9,
      students: 1756,
      badge: "CERTIFICATION",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 6,
      title: "Algorithmic Trading Bot Development",
      description: "Create sophisticated trading algorithms with backtesting and live deployment",
      type: "project",
      level: "advanced",
      category: "trading",
      duration: "10 hours",
      progress: 25,
      status: "in-progress",
      rating: 4.8,
      students: 1345,
      badge: "PROJECT",
      color: "bg-indigo-100 text-indigo-800"
    },
    {
      id: 7,
      title: "Model Deployment and MLOps",
      description: "Learn to deploy, monitor, and maintain AI models in production",
      type: "course",
      level: "intermediate",
      category: "mlops",
      duration: "4.5 hours",
      progress: 0,
      status: "not-started",
      rating: 4.7,
      students: 987,
      badge: "COURSE",
      color: "bg-teal-100 text-teal-800"
    },
    {
      id: 8,
      title: "Federated Learning Implementation",
      description: "Build privacy-preserving ML systems using federated learning techniques",
      type: "tutorial",
      level: "advanced",
      category: "federated-learning",
      duration: "6.5 hours",
      progress: 0,
      status: "not-started",
      rating: 4.9,
      students: 654,
      badge: "TUTORIAL",
      color: "bg-cyan-100 text-cyan-800"
    }
  ];

  const certificates = [
    {
      id: 1,
      title: "Certified AI Financial Model Developer",
      issueDate: "2024-10-22",
      validUntil: "2026-10-22",
      credentialId: "AFMD-2024-2847",
      skills: ["Machine Learning", "Financial Modeling", "Python", "TensorFlow"]
    },
    {
      id: 2,
      title: "Financial API Development Expert",
      issueDate: "2024-11-18",
      validUntil: "2026-11-18",
      credentialId: "FADE-2024-1756",
      skills: ["REST APIs", "GraphQL", "Microservices", "Authentication"]
    },
    {
      id: 3,
      title: "Advanced Risk Assessment Specialist",
      issueDate: "2024-12-05",
      validUntil: "2026-12-05",
      credentialId: "ARAS-2024-1254",
      skills: ["Risk Models", "Monte Carlo", "Stress Testing", "Backtesting"]
    }
  ];

  const learningPaths = [
    {
      id: 1,
      title: "AI Financial Developer Fundamentals",
      description: "Complete journey from beginner to professional AI model developer",
      courses: 8,
      duration: "28 hours",
      progress: 62,
      level: "Beginner to Intermediate"
    },
    {
      id: 2,
      title: "Advanced ML for Finance",
      description: "Master advanced machine learning techniques for financial applications",
      courses: 6,
      duration: "24 hours",
      progress: 33,
      level: "Intermediate to Advanced"
    },
    {
      id: 3,
      title: "Production ML Systems",
      description: "Build and deploy scalable ML systems for financial services",
      courses: 5,
      duration: "20 hours",
      progress: 0,
      level: "Advanced"
    },
    {
      id: 4,
      title: "Algorithmic Trading Mastery",
      description: "Complete guide to building profitable trading algorithms",
      courses: 7,
      duration: "32 hours",
      progress: 14,
      level: "Intermediate to Expert"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesType = selectedType === "all" || course.type === selectedType;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesType && matchesLevel;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <Brain className="w-4 h-4" />;
      case "tutorial":
        return <Video className="w-4 h-4" />;
      case "project":
        return <Code className="w-4 h-4" />;
      case "workshop":
        return <Users className="w-4 h-4" />;
      case "certification":
        return <Award className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Developer Learning Center</h1>
          </div>
          <p className="text-muted-foreground">
            Master AI financial modeling through comprehensive tutorials, workshops, and hands-on projects. Build expertise and earn certifications.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.certificates}</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{learningStats.hoursLearned}</p>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-content">All Content</TabsTrigger>
            <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          {/* All Content Tab */}
          <TabsContent value="all-content" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search learning content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="fundamentals">Fundamentals</SelectItem>
                      <SelectItem value="portfolio">Portfolio Optimization</SelectItem>
                      <SelectItem value="risk-management">Risk Management</SelectItem>
                      <SelectItem value="deep-learning">Deep Learning</SelectItem>
                      <SelectItem value="backend">Backend Development</SelectItem>
                      <SelectItem value="trading">Algorithmic Trading</SelectItem>
                      <SelectItem value="mlops">MLOps</SelectItem>
                      <SelectItem value="federated-learning">Federated Learning</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="course">Courses</SelectItem>
                      <SelectItem value="tutorial">Tutorials</SelectItem>
                      <SelectItem value="project">Projects</SelectItem>
                      <SelectItem value="workshop">Workshops</SelectItem>
                      <SelectItem value="certification">Certifications</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={course.color}>
                        {course.badge}
                      </Badge>
                      {getStatusIcon(course.status)}
                    </div>
                    <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {course.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(course.type)}
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{course.students.toLocaleString()} students</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant={course.status === "completed" ? "outline" : "default"}
                      >
                        {course.status === "completed" ? "Review" : 
                         course.status === "in-progress" ? "Continue" : "Start Learning"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="learning-paths" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {path.title}
                    </CardTitle>
                    <p className="text-muted-foreground">{path.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Courses:</span>
                          <span className="font-medium ml-2">{path.courses}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium ml-2">{path.duration}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                      
                      <Badge variant="outline">{path.level}</Badge>
                      
                      <Button className="w-full">
                        {path.progress > 0 ? "Continue Path" : "Start Path"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Issued on {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Valid Until:</span>
                          <p className="font-medium">{new Date(cert.validUntil).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Credential ID:</span>
                          <p className="font-medium font-mono text-xs">{cert.credentialId}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground text-sm">Skills Verified:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {cert.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Zap className="w-4 h-4 mr-2" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommended Tab */}
          <TabsContent value="recommended" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <p className="text-muted-foreground">
                  Based on your development experience and learning history
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.slice(0, 4).map((course) => (
                    <div key={course.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(course.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium line-clamp-2">{course.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{course.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {course.rating}
                          </div>
                        </div>
                        <Button size="sm" className="mt-2">
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Terminal className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Practice Environment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access interactive coding environment for hands-on practice
                  </p>
                  <Button size="sm" className="w-full">
                    Launch IDE
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <GitBranch className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Code Repository</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse example projects and template repositories
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Browse Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Layers className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Model Templates</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start with pre-built AI model templates and frameworks
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Templates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}