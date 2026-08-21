import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/layout/Layout";
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Award,
  Target,
  TrendingUp,
  Database,
  Shield,
  CheckCircle,
  Star,
  Search,
  Filter,
  Download,
  ExternalLink,
  Video,
  FileText,
  Code,
  Zap,
  Globe,
  DollarSign,
  BarChart3,
  AlertCircle,
  Lightbulb,
  Calendar,
  User,
  ChevronRight,
  PlayCircle
} from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  category: 'fundamentals' | 'data-quality' | 'compliance' | 'monetization' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  format: 'video' | 'interactive' | 'document' | 'webinar';
  instructor: string;
  rating: number;
  students: number;
  progress: number;
  isCompleted: boolean;
  isFeatured: boolean;
  tags: string[];
  lastUpdated: string;
  thumbnail?: string;
}

interface LearningPath {
  id: number;
  title: string;
  description: string;
  courses: number[];
  estimatedTime: string;
  difficulty: string;
  completionRate: number;
  enrolledUsers: number;
}

interface Certificate {
  id: number;
  name: string;
  description: string;
  requirements: string[];
  validity: string;
  creditsRequired: number;
  isEarned: boolean;
  earnedDate?: string;
}

export default function DataProviderLearning() {
  const [activeTab, setActiveTab] = useState("courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Mock data for courses
  const courses: Course[] = [
    {
      id: 1,
      title: "Data Quality Fundamentals for Financial Markets",
      description: "Learn the essential principles of maintaining high-quality financial data, including validation techniques, cleansing methods, and quality metrics.",
      category: 'data-quality',
      difficulty: 'beginner',
      duration: '2h 45m',
      format: 'video',
      instructor: 'Dr. Sarah Chen',
      rating: 4.8,
      students: 1247,
      progress: 75,
      isCompleted: false,
      isFeatured: true,
      tags: ['Data Quality', 'Fundamentals', 'Best Practices'],
      lastUpdated: '2024-07-10',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop'
    },
    {
      id: 2,
      title: "GDPR Compliance for Financial Data Providers",
      description: "Comprehensive guide to GDPR compliance requirements, data protection principles, and implementation strategies for financial data providers.",
      category: 'compliance',
      difficulty: 'intermediate',
      duration: '3h 20m',
      format: 'interactive',
      instructor: 'Maria Rodriguez, CIPP/E',
      rating: 4.9,
      students: 892,
      progress: 0,
      isCompleted: false,
      isFeatured: true,
      tags: ['GDPR', 'Compliance', 'Data Protection'],
      lastUpdated: '2024-07-08'
    },
    {
      id: 3,
      title: "Pricing Strategies for Data Products",
      description: "Master the art of pricing your data products effectively using market-based, cost-plus, and value-based pricing models.",
      category: 'monetization',
      difficulty: 'intermediate',
      duration: '1h 55m',
      format: 'video',
      instructor: 'Michael Zhang',
      rating: 4.6,
      students: 634,
      progress: 100,
      isCompleted: true,
      isFeatured: false,
      tags: ['Pricing', 'Monetization', 'Business Strategy'],
      lastUpdated: '2024-07-05'
    },
    {
      id: 4,
      title: "API Design for Financial Data Distribution",
      description: "Learn to design robust, scalable APIs for distributing financial data with proper authentication, rate limiting, and documentation.",
      category: 'advanced',
      difficulty: 'advanced',
      duration: '4h 15m',
      format: 'interactive',
      instructor: 'Alex Thompson',
      rating: 4.7,
      students: 445,
      progress: 25,
      isCompleted: false,
      isFeatured: false,
      tags: ['API Design', 'Technical', 'Integration'],
      lastUpdated: '2024-07-12'
    },
    {
      id: 5,
      title: "Building Trust: Data Provider Reputation Management",
      description: "Strategies for building and maintaining a strong reputation as a reliable data provider in the financial markets.",
      category: 'fundamentals',
      difficulty: 'beginner',
      duration: '1h 30m',
      format: 'webinar',
      instructor: 'Jennifer Lee',
      rating: 4.5,
      students: 789,
      progress: 0,
      isCompleted: false,
      isFeatured: false,
      tags: ['Reputation', 'Trust', 'Business Development'],
      lastUpdated: '2024-07-14'
    },
    {
      id: 6,
      title: "Advanced Data Analytics and Insights Generation",
      description: "Transform raw data into valuable insights using advanced analytics techniques, machine learning, and statistical methods.",
      category: 'advanced',
      difficulty: 'advanced',
      duration: '5h 40m',
      format: 'interactive',
      instructor: 'Dr. Robert Kim',
      rating: 4.9,
      students: 312,
      progress: 0,
      isCompleted: false,
      isFeatured: true,
      tags: ['Analytics', 'Machine Learning', 'Insights'],
      lastUpdated: '2024-07-11'
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 1,
      title: "Data Provider Essentials",
      description: "Complete foundation for new data providers covering quality, compliance, and basic monetization.",
      courses: [1, 2, 5],
      estimatedTime: "8-10 hours",
      difficulty: "Beginner to Intermediate",
      completionRate: 65,
      enrolledUsers: 234
    },
    {
      id: 2,
      title: "Advanced Data Monetization",
      description: "Master advanced strategies for maximizing revenue from your data assets and building sustainable business models.",
      courses: [3, 4, 6],
      estimatedTime: "12-15 hours", 
      difficulty: "Intermediate to Advanced",
      completionRate: 45,
      enrolledUsers: 156
    }
  ];

  const certificates: Certificate[] = [
    {
      id: 1,
      name: "Certified Data Quality Specialist",
      description: "Demonstrates expertise in data quality management, validation, and improvement processes.",
      requirements: ["Complete Data Quality Fundamentals", "Pass final assessment with 85%+", "Submit quality improvement case study"],
      validity: "2 years",
      creditsRequired: 15,
      isEarned: true,
      earnedDate: "2024-06-15"
    },
    {
      id: 2,
      name: "Data Protection & Compliance Expert",
      description: "Validates knowledge of data protection regulations and compliance requirements for financial data.",
      requirements: ["Complete GDPR Compliance course", "Complete additional compliance module", "Pass comprehensive exam"],
      validity: "1 year",
      creditsRequired: 20,
      isEarned: false
    },
    {
      id: 3,
      name: "Advanced Data Monetization Professional",
      description: "Recognizes mastery of data product pricing, business model design, and revenue optimization.",
      requirements: ["Complete monetization learning path", "Demonstrate revenue growth case study", "Peer review participation"],
      validity: "3 years",
      creditsRequired: 25,
      isEarned: false
    }
  ];

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      fundamentals: BookOpen,
      'data-quality': Shield,
      compliance: AlertCircle,
      monetization: DollarSign,
      advanced: Zap
    };
    return icons[category] || BookOpen;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return colors[difficulty] || colors.beginner;
  };

  const getFormatIcon = (format: string) => {
    const icons: Record<string, any> = {
      video: Video,
      interactive: Code,
      document: FileText,
      webinar: Users
    };
    return icons[format] || FileText;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || course.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const totalLearningCredits = 45;
  const earnedCredits = certificates.filter(cert => cert.isEarned).reduce((sum, cert) => sum + cert.creditsRequired, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Data Provider Learning Center</h1>
            <p className="text-muted-foreground mt-2">
              Enhance your skills and knowledge to become a successful data provider
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Learning Progress</div>
            <div className="text-2xl font-bold">{earnedCredits}/{totalLearningCredits}</div>
            <div className="text-sm text-muted-foreground">credits earned</div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Courses</p>
                  <p className="text-2xl font-bold">{courses.filter(c => c.isCompleted).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{courses.filter(c => c.progress > 0 && !c.isCompleted).length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificates Earned</p>
                  <p className="text-2xl font-bold">{certificates.filter(c => c.isEarned).length}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Learning Hours</p>
                  <p className="text-2xl font-bold">12.5</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="paths" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Learning Paths
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses">
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Categories</option>
                    <option value="fundamentals">Fundamentals</option>
                    <option value="data-quality">Data Quality</option>
                    <option value="compliance">Compliance</option>
                    <option value="monetization">Monetization</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Featured Courses */}
            {courses.some(c => c.isFeatured) && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {courses.filter(c => c.isFeatured).map((course) => {
                    const CategoryIcon = getCategoryIcon(course.category);
                    const FormatIcon = getFormatIcon(course.format);
                    
                    return (
                      <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="h-5 w-5 text-primary" />
                              <Badge variant="outline">{course.category.replace('-', ' ')}</Badge>
                              <Badge className={getDifficultyColor(course.difficulty)}>
                                {course.difficulty}
                              </Badge>
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {course.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <FormatIcon className="h-4 w-4" />
                              {course.format}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {course.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.students}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {course.rating}
                            </div>
                          </div>

                          {course.progress > 0 && (
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm text-muted-foreground">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {course.instructor.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{course.instructor}</span>
                            </div>
                            <Button>
                              {course.progress > 0 && !course.isCompleted ? (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Continue
                                </>
                              ) : course.isCompleted ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Start Course
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Courses */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">All Courses</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const CategoryIcon = getCategoryIcon(course.category);
                  const FormatIcon = getFormatIcon(course.format);
                  
                  return (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CategoryIcon className="h-4 w-4 text-primary" />
                          <Badge variant="outline" className="text-xs">{course.category.replace('-', ' ')}</Badge>
                          <Badge className={`${getDifficultyColor(course.difficulty)} text-xs`}>
                            {course.difficulty}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </div>
                        </div>

                        {course.progress > 0 && (
                          <div className="mb-3">
                            <Progress value={course.progress} className="h-1" />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{course.instructor}</span>
                          <Button size="sm" variant="outline">
                            {course.isCompleted ? 'Review' : course.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Learning Paths Tab */}
          <TabsContent value="paths">
            <div className="space-y-6">
              {learningPaths.map((path) => (
                <Card key={path.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{path.title}</h3>
                        <p className="text-muted-foreground mb-4">{path.description}</p>
                      </div>
                      <Button>
                        Enroll
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-medium">{path.estimatedTime}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Difficulty</div>
                        <div className="font-medium">{path.difficulty}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Completion Rate</div>
                        <div className="font-medium">{path.completionRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Enrolled</div>
                        <div className="font-medium">{path.enrolledUsers} users</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Included Courses:</div>
                      <div className="flex flex-wrap gap-2">
                        {path.courses.map((courseId) => {
                          const course = courses.find(c => c.id === courseId);
                          return course ? (
                            <Badge key={courseId} variant="secondary" className="text-xs">
                              {course.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <div className="space-y-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className={certificate.isEarned ? "border-green-200 bg-green-50/50 dark:bg-green-900/10" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${certificate.isEarned ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{certificate.name}</h3>
                          <p className="text-muted-foreground mb-2">{certificate.description}</p>
                          <div className="text-sm text-muted-foreground">
                            Valid for {certificate.validity} • {certificate.creditsRequired} credits required
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {certificate.isEarned ? (
                          <div>
                            <Badge className="bg-green-100 text-green-800 mb-2">Earned</Badge>
                            <div className="text-sm text-muted-foreground">
                              {certificate.earnedDate && `Earned: ${new Date(certificate.earnedDate).toLocaleDateString()}`}
                            </div>
                          </div>
                        ) : (
                          <Button variant="outline">Start Requirements</Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Requirements:</div>
                      <ul className="space-y-1">
                        {certificate.requirements.map((requirement, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className={`h-4 w-4 ${certificate.isEarned ? 'text-green-600' : 'text-gray-400'}`} />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentation & Guides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Data Provider API Reference</div>
                      <div className="text-sm text-muted-foreground">Complete API documentation</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Best Practices Guide</div>
                      <div className="text-sm text-muted-foreground">Industry best practices for data providers</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Compliance Checklist</div>
                      <div className="text-sm text-muted-foreground">Regulatory compliance requirements</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Webinars
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">Data Quality in Practice</div>
                    <div className="text-sm text-muted-foreground mb-2">July 20, 2024 • 2:00 PM EST</div>
                    <Button size="sm">Register</Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">Regulatory Updates Q3 2024</div>
                    <div className="text-sm text-muted-foreground mb-2">July 25, 2024 • 11:00 AM EST</div>
                    <Button size="sm">Register</Button>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium mb-1">Monetization Strategies Panel</div>
                    <div className="text-sm text-muted-foreground mb-2">August 1, 2024 • 3:00 PM EST</div>
                    <Button size="sm">Register</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Data Provider Forum</div>
                      <div className="text-sm text-muted-foreground">Connect with other data providers</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Technical Support</div>
                      <div className="text-sm text-muted-foreground">Get help with technical issues</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Success Stories</div>
                      <div className="text-sm text-muted-foreground">Learn from successful data providers</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Tools & Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Data Quality Assessment Tool</div>
                      <div className="text-sm text-muted-foreground">Evaluate your data quality</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Pricing Calculator</div>
                      <div className="text-sm text-muted-foreground">Calculate optimal pricing for your data</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Contract Templates</div>
                      <div className="text-sm text-muted-foreground">Legal templates for data agreements</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
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