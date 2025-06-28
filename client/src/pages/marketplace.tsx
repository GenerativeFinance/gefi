import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import Footer from "@/components/layout/footer";
import ModelCard from "@/components/marketplace/model-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Star, TrendingUp, Shield, PieChart, Brain, Building, LineChart, FileCheck, MessageCircle, Users, Download, FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV, exportToPDF, generateSampleExportData } from "@/utils/exportUtils";

interface AiModelCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

interface AiModel {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId: number;
  subcategoryId: number;
  price: string;
  rating: string;
  totalRatings: number;
  creator: string;
  tags: string[];
  aiTechnique: string;
  targetUserType: string;
  financialInstrument: string;
  riskLevel: string;
  isFeatured: boolean;
  features: any;
  performance: any;
}

const iconMap: Record<string, any> = {
  Shield,
  TrendingUp,
  PieChart,
  Brain,
  Building,
  LineChart,
  FileCheck,
  MessageCircle,
  Users,
  Search,
  Filter,
  Star
};

export default function Marketplace() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [riskLevel, setRiskLevel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("browse");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<AiModelCategory[]>({
    queryKey: ["/api/ai-model-categories"],
    retry: false,
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ["/api/ai-model-subcategories"],
    retry: false,
  });

  const { data: models = [], isLoading: modelsLoading, error: modelsError } = useQuery<AiModel[]>({
    queryKey: ["/api/ai-models", { 
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      subcategory: selectedSubcategory !== "all" ? selectedSubcategory : undefined,
      riskLevel: riskLevel !== "all" ? riskLevel : undefined
    }],
    retry: false,
  });

  // Export functions
  const handleExportCSV = () => {
    try {
      const exportData = generateSampleExportData(filteredModels as any);
      exportToCSV(exportData, 'gefi_marketplace_models');
      toast({
        title: "Export Successful",
        description: `Exported ${filteredModels.length} models to CSV`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    try {
      const exportData = generateSampleExportData(filteredModels as any);
      exportToPDF(exportData, 'gefi_marketplace_report');
      toast({
        title: "Report Generated",
        description: `Generated PDF report with ${filteredModels.length} models`,
      });
    } catch (error) {
      toast({
        title: "Export Failed", 
        description: "Unable to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredModels = models?.filter((model: AiModel) => {
    const matchesSearch = searchQuery === "" || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPrice = priceRange === "all" || 
      (priceRange === "free" && parseFloat(model.price) === 0) ||
      (priceRange === "0-100" && parseFloat(model.price) <= 100) ||
      (priceRange === "100-500" && parseFloat(model.price) > 100 && parseFloat(model.price) <= 500) ||
      (priceRange === "500+" && parseFloat(model.price) > 500);
    
    return matchesSearch && matchesPrice;
  }) || [];

  const featuredModels = filteredModels.filter(model => model.isFeatured);
  const categoryFilteredSubcategories = selectedCategory !== "all" 
    ? (subcategories as any[]).filter((sub: any) => sub.categoryId === parseInt(selectedCategory))
    : subcategories;

  if (categoriesLoading || modelsLoading) {
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
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('marketplace.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {t('marketplace.subtitle')}
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder={t('marketplace.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">{t('marketplace.allModels')}</TabsTrigger>
            <TabsTrigger value="categories">{t('marketplace.categories')}</TabsTrigger>
            <TabsTrigger value="featured">{t('marketplace.featured')}</TabsTrigger>
          </TabsList>

          {/* Categories Overview Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Explore AI Model Categories</h2>
              <p className="text-muted-foreground">
                Browse our comprehensive collection of AI financial models organized by expertise
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || Shield;
                const categoryModels = models.filter(model => model.categoryId === category.id);
                
                return (
                  <Card 
                    key={category.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedCategory(category.id.toString());
                      setActiveTab("browse");
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription>{categoryModels.length} models</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Featured Models Tab */}
          <TabsContent value="featured" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured AI Models</h2>
              <p className="text-muted-foreground">
                Hand-picked models with exceptional performance and reliability
              </p>
            </div>
            
            {featuredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Featured Models Yet</h3>
                <p className="text-muted-foreground">
                  Featured models will appear here once they're selected by our team
                </p>
              </div>
            )}
          </TabsContent>

          {/* Browse Models Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subcategory</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {(categoryFilteredSubcategories as any[]).map((subcategory: any) => (
                        <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="0-100">$0 - $100</SelectItem>
                      <SelectItem value="100-500">$100 - $500</SelectItem>
                      <SelectItem value="500+">$500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Select value={riskLevel} onValueChange={setRiskLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="All risk levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="Low">Low Risk</SelectItem>
                      <SelectItem value="Medium">Medium Risk</SelectItem>
                      <SelectItem value="High">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions</label>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedSubcategory("all");
                      setPriceRange("all");
                      setRiskLevel("all");
                      setSearchQuery("");
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results Header with Export Options */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">
                  {filteredModels.length} Model{filteredModels.length !== 1 ? 's' : ''} Found
                </h3>
                
                {filteredModels.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCSV}
                      className="flex items-center space-x-2"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export CSV</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportPDF}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export PDF</span>
                    </Button>
                  </div>
                )}
              </div>
              
              {(searchQuery || selectedCategory !== "all" || selectedSubcategory !== "all" || priceRange !== "all" || riskLevel !== "all") && (
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary">
                      {categories.find(c => c.id.toString() === selectedCategory)?.name}
                    </Badge>
                  )}
                  {selectedSubcategory !== "all" && (
                    <Badge variant="secondary">
                      {(subcategories as any[]).find((s: any) => s.id.toString() === selectedSubcategory)?.name}
                    </Badge>
                  )}
                  {priceRange !== "all" && <Badge variant="secondary">Price: {priceRange}</Badge>}
                  {riskLevel !== "all" && <Badge variant="secondary">Risk: {riskLevel}</Badge>}
                </div>
              )}
            </div>

            {filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Models Found</h3>
                <p className="text-muted-foreground mb-4">
                  No results found. Try broader search terms or different filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSubcategory("all");
                    setPriceRange("all");
                    setRiskLevel("all");
                    setSearchQuery("");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}