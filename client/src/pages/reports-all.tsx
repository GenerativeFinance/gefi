import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Shield, Brain, Download, Calendar } from "lucide-react";

export default function ReportsAll() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports"],
    retry: false,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "monthly_performance":
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case "risk_compliance":
        return <Shield className="h-5 w-5 text-blue-400" />;
      case "portfolio_optimization":
        return <Brain className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const defaultReports = [
    {
      type: "monthly_performance",
      title: "Monthly AI Performance Review",
      status: "generated",
      lastUpdated: new Date().toISOString(),
      description: "Comprehensive analysis of AI model performance across all portfolios"
    },
    {
      type: "risk_compliance",
      title: "Risk & Compliance Analysis",
      status: "generated", 
      lastUpdated: new Date().toISOString(),
      description: "Detailed risk assessment and regulatory compliance report"
    },
    {
      type: "portfolio_optimization",
      title: "Portfolio Optimization Report",
      status: "generated",
      lastUpdated: new Date().toISOString(),
      description: "AI-powered portfolio optimization recommendations"
    },
    {
      type: "comprehensive_analysis",
      title: "Comprehensive Portfolio Analysis",
      status: "generated",
      lastUpdated: new Date().toISOString(),
      description: "Full spectrum analysis including performance, risk, and recommendations"
    }
  ];

  const reportsList = reports && reports.length > 0 ? reports : defaultReports;

  if (reportsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-secondary rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Reports</h1>
          <p className="text-muted-foreground">
            Complete collection of your portfolio reports and analytics
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {reportsList.map((report, index) => (
            <Card key={index} className="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getIcon(report.type)}
                    <span>{report.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      report.status === 'generated' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {report.status === 'generated' ? 'Ready' : 'Processing'}
                    </span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {report.description || "Detailed analysis and insights for your portfolio"}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last updated: {new Date(report.lastUpdated).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}