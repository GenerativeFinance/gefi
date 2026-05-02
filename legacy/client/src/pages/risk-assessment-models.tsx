import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  BarChart3, 
  Star, 
  Shield, 
  CheckCircle2, 
  Pause,
  TrendingUp,
  Activity
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface RiskModel {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  isSubscribed: boolean;
  monthlyFee: number;
  
  // Subscribed model data
  performance?: string;
  accuracy?: string;
  totalTrades?: number;
  pnl?: string;
  portfolioAllocation?: number;
  status?: "active" | "paused";
  lastUpdated?: string;
  
  // Unsubscribed model data
  description?: string;
  rating?: number;
  subscribers?: number;
  tags?: string[];
  icon?: string;
}

const sampleRiskModels: RiskModel[] = [
  {
    id: "1",
    name: "Quantum Risk Predictor",
    category: "Risk Assessment",
    subcategory: "Credit Risk",
    isSubscribed: true,
    monthlyFee: 99,
    performance: "+12.5%",
    accuracy: "94.2%",
    totalTrades: 156,
    pnl: "$284,750",
    portfolioAllocation: 25,
    status: "active",
    lastUpdated: "2 hours ago",
    icon: "shield"
  },
  {
    id: "2", 
    name: "Momentum Tracker Pro",
    category: "Risk Assessment",
    subcategory: "Market Risk",
    isSubscribed: true,
    monthlyFee: 149,
    performance: "+8.7%",
    accuracy: "89.1%",
    totalTrades: 234,
    pnl: "$192,375",
    portfolioAllocation: 30,
    status: "active",
    lastUpdated: "15 minutes ago",
    icon: "trending-up"
  },
  {
    id: "3",
    name: "Crypto Sentiment Analyzer",
    category: "Risk Assessment", 
    subcategory: "Sentiment Analysis",
    isSubscribed: false,
    monthlyFee: 129,
    description: "Advanced NLP model for cryptocurrency sentiment analysis",
    rating: 4.8,
    accuracy: "91.5%",
    subscribers: 1247,
    tags: ["Crypto", "NLP", "Sentiment"],
    icon: "activity"
  },
  {
    id: "4",
    name: "Risk Shield",
    category: "Risk Assessment",
    subcategory: "Operational Risk", 
    isSubscribed: false,
    monthlyFee: 199,
    description: "Comprehensive operational risk monitoring and prediction",
    rating: 4.6,
    accuracy: "88.9%",
    subscribers: 892,
    tags: ["Operations", "Monitoring", "Alerts"],
    icon: "shield"
  },
  {
    id: "5",
    name: "Threat Analyzer",
    category: "Risk Assessment",
    subcategory: "Stress Testing",
    isSubscribed: false,
    monthlyFee: 179,
    description: "Advanced stress testing and scenario analysis for portfolios",
    rating: 4.7,
    accuracy: "92.3%", 
    subscribers: 634,
    tags: ["Stress Testing", "Scenarios", "VaR"],
    icon: "activity"
  }
];

const ModelIcon = ({ icon, isSubscribed }: { icon: string; isSubscribed: boolean }) => {
  const iconProps = {
    size: 24,
    className: isSubscribed ? "text-blue-400" : "text-purple-400"
  };

  switch (icon) {
    case "shield":
      return <Shield {...iconProps} />;
    case "trending-up":
      return <TrendingUp {...iconProps} />;
    case "activity":
      return <Activity {...iconProps} />;
    default:
      return <Shield {...iconProps} />;
  }
};

const SubscribedModelCard = ({ model }: { model: RiskModel }) => (
  <Card className="bg-gray-900 border-gray-800 text-white">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ModelIcon icon={model.icon || "shield"} isSubscribed={true} />
          <div>
            <h3 className="text-xl font-bold text-white">{model.name}</h3>
            <p className="text-gray-400 text-sm">{model.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Monthly Fee</p>
          <p className="text-white text-lg font-semibold">${model.monthlyFee}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <CheckCircle2 size={16} className="text-green-400" />
        <Badge variant="secondary" className="bg-green-900 text-green-300 border-green-700">
          {model.status}
        </Badge>
        <span className="text-gray-400 text-sm">Updated {model.lastUpdated}</span>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Performance</p>
          <p className="text-green-400 text-lg font-semibold">{model.performance}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Accuracy</p>
          <p className="text-white text-lg font-semibold">{model.accuracy}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-white text-lg font-semibold">{model.totalTrades}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">P&L</p>
          <p className="text-green-400 text-lg font-semibold">{model.pnl}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Portfolio Allocation</span>
          <span className="text-white">{model.portfolioAllocation}%</span>
        </div>
        <Progress value={model.portfolioAllocation} className="h-2 bg-gray-800" />
      </div>

      <div className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Pause size={16} />
          Pause
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <Settings size={16} />
          Configure
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-blue-600 border-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
        >
          <BarChart3 size={16} />
          Analytics
        </Button>
      </div>
    </CardContent>
  </Card>
);

const UnsubscribedModelCard = ({ model }: { model: RiskModel }) => (
  <Card className="bg-gray-900 border-gray-800 text-white hover:border-gray-700 transition-colors">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ModelIcon icon={model.icon || "shield"} isSubscribed={false} />
          <div>
            <h3 className="text-xl font-bold text-white">{model.name}</h3>
            <p className="text-gray-400 text-sm">{model.subcategory}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Monthly Fee</p>
          <p className="text-white text-lg font-semibold">${model.monthlyFee}/mo</p>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      <p className="text-gray-300 text-sm leading-relaxed">{model.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-400 text-sm">Rating</p>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <p className="text-white text-lg font-semibold">{model.rating}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Accuracy</p>
          <p className="text-white text-lg font-semibold">{model.accuracy}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Subscribers</p>
          <p className="text-white text-lg font-semibold">{model.subscribers?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Category</p>
          <p className="text-white text-sm font-semibold">{model.subcategory}</p>
        </div>
      </div>

      {model.tags && (
        <div className="flex flex-wrap gap-2">
          {model.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-gray-800 text-gray-300 border-gray-700 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
        >
          Subscribe
        </Button>
        <Button 
          variant="outline" 
          className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 flex items-center gap-2"
        >
          <BarChart3 size={16} />
          Details
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function RiskAssessmentModels() {
  const [filter, setFilter] = useState<string>("all");
  
  const filteredModels = sampleRiskModels.filter(model => {
    if (filter === "subscribed") return model.isSubscribed;
    if (filter === "unsubscribed") return !model.isSubscribed;
    return true;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={32} className="text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Risk Assessment AI Models</h1>
                <p className="text-gray-400">Advanced AI models for financial risk analysis and management</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-blue-600 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-800"}
              >
                All Models
              </Button>
              <Button
                variant={filter === "subscribed" ? "default" : "outline"}
                onClick={() => setFilter("subscribed")}
                className={filter === "subscribed" ? "bg-blue-600 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-800"}
              >
                My Subscriptions
              </Button>
              <Button
                variant={filter === "unsubscribed" ? "default" : "outline"}
                onClick={() => setFilter("unsubscribed")}
                className={filter === "unsubscribed" ? "bg-blue-600 text-white" : "border-gray-600 text-gray-300 hover:bg-gray-800"}
              >
                Available Models
              </Button>
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredModels.map((model) => (
              <div key={model.id}>
                {model.isSubscribed ? (
                  <SubscribedModelCard model={model} />
                ) : (
                  <UnsubscribedModelCard model={model} />
                )}
              </div>
            ))}
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <Shield size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No models found</h3>
              <p className="text-gray-500">Try adjusting your filter or browse all available models.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}