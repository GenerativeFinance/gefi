import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Clock, 
  Users, 
  Star, 
  Play, 
  CheckCircle, 
  Award,
  Search,
  Filter,
  Target
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

const InvestorLearning = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const learningStats = [
    {
      label: 'Completed',
      value: 8,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      label: 'In Progress',
      value: 3,
      icon: Play,
      color: 'text-blue-400'
    },
    {
      label: 'Certificates',
      value: 5,
      icon: Award,
      color: 'text-purple-400'
    },
    {
      label: 'Hours Learned',
      value: 47.5,
      icon: Clock,
      color: 'text-orange-400'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: BookOpen },
    { id: 'portfolio', name: 'Portfolio Management', icon: BarChart3 },
    { id: 'risk', name: 'Risk Management', icon: Shield },
    { id: 'market', name: 'Market Analysis', icon: TrendingUp },
    { id: 'ai', name: 'AI & Technology', icon: Target },
  ];

  const learningContent = [
    {
      id: 1,
      title: 'Portfolio Diversification Strategies',
      description: 'Learn advanced portfolio diversification techniques to minimize risk while maximizing returns.',
      type: 'Course',
      level: 'Intermediate',
      duration: '2h 30m',
      category: 'portfolio',
      rating: 4.8,
      students: 1247,
      progress: 65,
      status: 'in-progress',
      instructor: 'Sarah Johnson',
      tags: ['Diversification', 'Risk Management', 'Asset Allocation']
    },
    {
      id: 2,
      title: 'Understanding Market Volatility',
      description: 'Master the concepts of market volatility and how to use it to your advantage in trading.',
      type: 'Tutorial',
      level: 'Beginner',
      duration: '1h 15m',
      category: 'market',
      rating: 4.9,
      students: 2156,
      progress: 100,
      status: 'completed',
      instructor: 'Michael Chen',
      tags: ['Volatility', 'Market Psychology', 'Trading']
    },
    {
      id: 3,
      title: 'AI-Powered Investment Analysis',
      description: 'Discover how artificial intelligence is revolutionizing investment decision-making.',
      type: 'Workshop',
      level: 'Advanced',
      duration: '3h 45m',
      category: 'ai',
      rating: 4.7,
      students: 856,
      progress: 0,
      status: 'not-started',
      instructor: 'Dr. Emily Rodriguez',
      tags: ['AI', 'Machine Learning', 'Investment Analysis']
    },
    {
      id: 4,
      title: 'Risk Assessment Fundamentals',
      description: 'Build a solid foundation in risk assessment methodologies for financial investments.',
      type: 'Course',
      level: 'Beginner',
      duration: '2h 10m',
      category: 'risk',
      rating: 4.6,
      students: 1543,
      progress: 25,
      status: 'in-progress',
      instructor: 'David Kim',
      tags: ['Risk Assessment', 'Financial Analysis', 'Due Diligence']
    },
    {
      id: 5,
      title: 'ESG Investing Masterclass',
      description: 'Comprehensive guide to Environmental, Social, and Governance investing principles.',
      type: 'Masterclass',
      level: 'Intermediate',
      duration: '4h 20m',
      category: 'portfolio',
      rating: 4.8,
      students: 967,
      progress: 100,
      status: 'completed',
      instructor: 'Lisa Wang',
      tags: ['ESG', 'Sustainable Investing', 'Impact Investing']
    },
    {
      id: 6,
      title: 'Technical Analysis for Beginners',
      description: 'Learn the fundamentals of technical analysis and chart reading for better investment decisions.',
      type: 'Course',
      level: 'Beginner',
      duration: '1h 50m',
      category: 'market',
      rating: 4.5,
      students: 2834,
      progress: 80,
      status: 'in-progress',
      instructor: 'Robert Martinez',
      tags: ['Technical Analysis', 'Chart Reading', 'Market Trends']
    }
  ];

  const filteredContent = learningContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    const matchesType = selectedType === 'all' || content.type.toLowerCase() === selectedType;
    const matchesLevel = selectedLevel === 'all' || content.level.toLowerCase() === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesType && matchesLevel;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'not-started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Start Learning';
      default: return 'Start Learning';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'course': return 'bg-blue-100 text-blue-800';
      case 'tutorial': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-orange-100 text-orange-800';
      case 'masterclass': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Investor Learning Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enhance your investment knowledge with comprehensive courses, tutorials, and expert insights. 
            Build expertise in portfolio management, risk assessment, and market analysis.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {learningStats.map((stat, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all-content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-content">All Content</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>

          <TabsContent value="all-content" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses, tutorials, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="masterclass">Masterclass</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-[140px]">
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

            {/* Learning Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((content) => (
                <Card key={content.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(content.level)}>
                          {content.level}
                        </Badge>
                        <Badge className={getTypeColor(content.type)}>
                          {content.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{content.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {content.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {content.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {content.students.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Instructor: {content.instructor}
                      </div>
                      
                      {content.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{content.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${content.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {content.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${getStatusColor(content.status)}`}
                        disabled={content.status === 'completed'}
                      >
                        {getStatusText(content.status)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.filter(content => content.status === 'in-progress').map((content) => (
                <Card key={content.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(content.level)}>
                          {content.level}
                        </Badge>
                        <Badge className={getTypeColor(content.type)}>
                          {content.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{content.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {content.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {content.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {content.students.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{content.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${content.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.filter(content => content.status === 'completed').map((content) => (
                <Card key={content.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(content.level)}>
                          {content.level}
                        </Badge>
                        <Badge className={getTypeColor(content.type)}>
                          {content.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Completed</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {content.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {content.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span>Certificate Earned</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          View Certificate
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recommended for You</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Based on your portfolio and learning history, we recommend these courses to enhance your investment skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.slice(0, 3).map((content) => (
                <Card key={content.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Recommended
                        </Badge>
                        <Badge className={getLevelColor(content.level)}>
                          {content.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{content.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {content.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {content.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {content.students.toLocaleString()}
                        </div>
                      </div>
                      
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InvestorLearning;