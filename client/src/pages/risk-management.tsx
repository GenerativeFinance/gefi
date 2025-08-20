import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import RiskMonitoring from "@/components/risk/risk-monitoring";
import RecentAlerts from "@/components/risk/recent-alerts";
import GenerateReportButton from "@/components/reports/GenerateReportButton";
import { ReportDataExtractor } from "@/lib/reportGenerator";

export default function RiskManagement() {
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

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/risk-alerts"],
    retry: false,
  });

  if (alertsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-secondary rounded-lg"></div>
              <div className="h-96 bg-secondary rounded-lg"></div>
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Risk Management</h1>
              <p className="text-muted-foreground">
                AI-powered risk monitoring and real-time alerts
              </p>
            </div>
            <GenerateReportButton
              template="risk"
              defaultData={ReportDataExtractor.extractRiskData({
                period: "Current Assessment",
                var: "$-125,000",
                riskScore: "72",
                critical: "2",
                totalReports: "15",
                stressTest: "Portfolio shows resilience under adverse market conditions with controlled downside risk."
              })}
              buttonText="Generate Risk Report"
              buttonVariant="outline"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RiskMonitoring />
          <RecentAlerts alerts={alerts} />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
