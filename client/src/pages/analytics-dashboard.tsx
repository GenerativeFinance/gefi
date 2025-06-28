import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import { Line, Pie, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Eye, 
  Clock, 
  ShoppingCart, 
  Target, 
  BarChart3,
  PieChart,
  Activity,
  Users,
  DollarSign,
  Zap,
  RefreshCw
} from "lucide-react";
import { analyticsService, type UserAnalytics } from "@/lib/analytics";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

export default function AnalyticsDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useI18n();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    // Load analytics regardless of auth status for dashboard access
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    const data = analyticsService.getAnalytics();
    setAnalytics(data);
  };

  const generateSampleData = () => {
    analyticsService.generateSampleData();
    loadAnalytics();
  };

  const clearData = () => {
    analyticsService.clearAnalytics();
    loadAnalytics();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('auth.authRequired')}</CardTitle>
            <CardDescription>{t('auth.loginMessage')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/api/login"} className="w-full">
              {t('auth.signIn')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dailyData = analytics ? analyticsService.getDailyAnalytics(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90) : [];
  const categoryData = analytics ? analyticsService.getCategoryAnalytics() : [];
  const topModels = analytics ? analyticsService.getTopModels(5) : [];

  // Chart configurations
  const lineChartData = {
    labels: dailyData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Model Views',
        data: dailyData.map(d => d.views),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Subscriptions',
        data: dailyData.map(d => d.subscriptions),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const timeSpentChartData = {
    labels: dailyData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Time Spent (minutes)',
        data: dailyData.map(d => d.timeSpent),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
      }
    ]
  };

  const categoryPieData = {
    labels: categoryData.map(d => d.category),
    datasets: [
      {
        data: categoryData.map(d => d.views),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(147, 51, 234)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('dashboard.title')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={generateSampleData}>
                <Zap className="h-4 w-4 mr-2" />
                {t('dashboard.generateSampleData')}
              </Button>
              <Button variant="outline" size="sm" onClick={clearData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('dashboard.clearData')}
              </Button>
              <Button variant="outline" size="sm" onClick={loadAnalytics}>
                <Activity className="h-4 w-4 mr-2" />
                {t('common.refresh')}
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <Tabs value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <TabsList>
              <TabsTrigger value="7d">{t('dashboard.last7Days')}</TabsTrigger>
              <TabsTrigger value="30d">{t('dashboard.last30Days')}</TabsTrigger>
              <TabsTrigger value="90d">{t('dashboard.last90Days')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Analytics Grid */}
        <div className="analytics-grid">
          {/* KPI Cards */}
          <div className="kpi-section">
            <div className="kpi-grid">
              <Card className="kpi-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                      <p className="text-3xl font-bold text-primary">
                        {analytics?.totalViews.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-xs">
                      {dailyData.reduce((sum, d) => sum + d.views, 0)} this period
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="kpi-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                      <p className="text-3xl font-bold text-primary">
                        {analytics?.totalTimeSpent || 0}<span className="text-sm font-normal text-muted-foreground">m</span>
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-xs">
                      {dailyData.reduce((sum, d) => sum + d.timeSpent, 0)}m this period
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="kpi-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Subscriptions</p>
                      <p className="text-3xl font-bold text-primary">
                        {analytics?.totalSubscriptions || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-xs">
                      {dailyData.reduce((sum, d) => sum + d.subscriptions, 0)} this period
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="kpi-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Model Price</p>
                      <p className="text-3xl font-bold text-primary">
                        ${analytics?.averageModelPrice || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-xs">
                      {analytics?.favoriteCategory || 'No data'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Activity Trends Chart */}
          <Card className="chart-large">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Activity Trends
              </CardTitle>
              <CardDescription>
                Daily views and subscriptions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container-large">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Time Spent Chart */}
          <Card className="chart-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Time Engagement
              </CardTitle>
              <CardDescription>
                Daily time spent exploring models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container-medium">
                <Bar data={timeSpentChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="chart-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Category Interest
              </CardTitle>
              <CardDescription>
                Views by AI model category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="chart-container-medium">
                {categoryData.length > 0 ? (
                  <Pie data={categoryPieData} options={pieChartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No category data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Models */}
          <Card className="models-list">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Most Viewed Models
              </CardTitle>
              <CardDescription>
                Your top 5 most viewed AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topModels.length > 0 ? (
                <div className="space-y-4">
                  {topModels.map((model, index) => (
                    <div key={model.modelId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{model.modelName}</div>
                          <div className="text-sm text-muted-foreground">{model.category}</div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {model.views} views
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No model views yet</p>
                  <p className="text-sm">Start exploring the marketplace to see analytics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <MobileNav />

      <style>{`
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto auto auto;
          gap: 1.5rem;
          grid-template-areas:
            "kpi kpi kpi kpi kpi kpi kpi kpi kpi kpi kpi kpi"
            "chart-large chart-large chart-large chart-large chart-large chart-large chart-large chart-large models models models models"
            "chart-med-1 chart-med-1 chart-med-1 chart-med-1 chart-med-1 chart-med-1 chart-med-2 chart-med-2 chart-med-2 chart-med-2 chart-med-2 chart-med-2";
        }

        .kpi-section {
          grid-area: kpi;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .chart-large {
          grid-area: chart-large;
        }

        .chart-medium:nth-of-type(4) {
          grid-area: chart-med-1;
        }

        .chart-medium:nth-of-type(5) {
          grid-area: chart-med-2;
        }

        .models-list {
          grid-area: models;
        }

        .chart-container-large {
          height: 400px;
          width: 100%;
        }

        .chart-container-medium {
          height: 300px;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .analytics-grid {
            grid-template-columns: repeat(6, 1fr);
            grid-template-areas:
              "kpi kpi kpi kpi kpi kpi"
              "chart-large chart-large chart-large chart-large chart-large chart-large"
              "models models models models models models"
              "chart-med-1 chart-med-1 chart-med-1 chart-med-2 chart-med-2 chart-med-2";
          }

          .chart-container-large {
            height: 300px;
          }

          .chart-container-medium {
            height: 250px;
          }
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "kpi"
              "chart-large"
              "models"
              "chart-med-1"
              "chart-med-2";
          }

          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chart-container-large {
            height: 250px;
          }

          .chart-container-medium {
            height: 200px;
          }
        }

        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}