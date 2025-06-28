import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import ModelCard from "@/components/marketplace/model-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: models, isLoading } = useQuery({
    queryKey: ["/api/ai-models"],
    retry: false,
  });

  const categories = [
    { id: "all", label: "All Models" },
    { id: "risk", label: "Risk Management" },
    { id: "portfolio", label: "Portfolio Optimization" },
    { id: "prediction", label: "Market Prediction" },
    { id: "sentiment", label: "Sentiment Analysis" },
  ];

  const filteredModels = models?.filter((model: any) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-secondary rounded-lg"></div>
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
          <h1 className="text-3xl font-bold mb-2">AI Financial Models Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and subscribe to cutting-edge AI models created by financial experts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Models Grid */}
        {filteredModels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No AI models found matching your criteria.</p>
            <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredModels.map((model: any) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Featured AI Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models?.slice(0, 3).map((model: any) => (
              <ModelCard key={`featured-${model.id}`} model={model} featured />
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
