import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import PortfolioOverview from "@/components/portfolio/portfolio-overview";
import RiskDistribution from "@/components/portfolio/risk-distribution";
import AiModels from "@/components/portfolio/ai-models";
import { useAuth } from "@/hooks/useAuth";

export default function Portfolio() {
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

  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ["/api/portfolio"],
    retry: false,
  });

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ["/api/portfolio/assets"],
    retry: false,
  });

  const { data: aiModels, isLoading: modelsLoading } = useQuery({
    queryKey: ["/api/portfolio/ai-models"],
    retry: false,
  });

  if (portfolioLoading || assetsLoading || modelsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-64 bg-secondary rounded-lg"></div>
                <div className="h-64 bg-secondary rounded-lg"></div>
              </div>
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
          <h1 className="text-3xl font-bold mb-2">AI Portfolio</h1>
          <p className="text-muted-foreground">
            Portfolio Overview and AI-Powered Management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <PortfolioOverview portfolio={portfolio} />
            <RiskDistribution assets={assets} />
          </div>
          
          <AiModels models={aiModels} />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
