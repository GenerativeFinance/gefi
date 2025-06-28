import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GuidedTour from "@/components/ui/guided-tour";
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  BarChart3,
  ArrowRight,
  Brain,
  Shield,
  FileText,
  Bell,
  Star,
  Sparkles,
  Eye
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { RecommendationEngine, type RecommendedModel } from "@/lib/recommendationEngine";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Investor'}
          </h1>
          <p className="text-muted-foreground">
            Here's your AI-powered financial overview
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-2xl font-bold">$247,580</p>
                  <p className="text-sm text-green-400">+5.2% today</p>
                </div>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Live P&L</p>
                  <p className="text-2xl font-bold text-green-400">+$12,430</p>
                  <p className="text-sm text-muted-foreground">+5.27% return</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-2xl font-bold">2.1</p>
                  <p className="text-sm text-yellow-400">Moderate risk</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Models</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-blue-400">Active models</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Overview */}
          <Card className="glass card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Portfolio Overview</CardTitle>
              <Link href="/portfolio">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Annual Returns</span>
                  <span className="font-semibold text-green-400">+18.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sharpe Ratio</span>
                  <span className="font-semibold">2.1</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Asset Allocation</span>
                    <span>Optimized</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="flex-1 h-2 bg-primary rounded"></div>
                    <div className="flex-1 h-2 bg-blue-400 rounded"></div>
                    <div className="w-1/5 h-2 bg-purple-400 rounded"></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stocks 60%</span>
                    <span>Bonds 30%</span>
                    <span>Crypto 10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="glass card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
              <Link href="/risk-management">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI predicts recessionary trend</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reduce tech stocks by 10%</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Crypto volatility detected</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/portfolio">
            <Card className="glass card-hover cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Portfolio</h3>
                <p className="text-sm text-muted-foreground">View detailed portfolio analytics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="glass card-hover cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Reports & Insights</h3>
                <p className="text-sm text-muted-foreground">AI-generated market insights</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/risk-management">
            <Card className="glass card-hover cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold mb-2">Risk Management</h3>
                <p className="text-sm text-muted-foreground">Monitor and assess risks</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/marketplace">
            <Card className="glass card-hover cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">AI Marketplace</h3>
                <p className="text-sm text-muted-foreground">Discover AI financial models</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
