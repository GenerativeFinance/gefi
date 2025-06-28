import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  BarChart3, 
  Star, 
  MessageCircle, 
  Download, 
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  X,
  HelpCircle
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  targetElement?: string;
  content: string;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to GeFi",
    description: "Your AI-powered financial analytics platform",
    icon: TrendingUp,
    content: "Welcome! Let's take a quick tour to show you the powerful features of our AI financial marketplace. This tour will help you discover, analyze, and subscribe to the best AI models for your financial needs."
  },
  {
    id: "search",
    title: "Search & Discovery",
    description: "Find the perfect AI models for your needs",
    icon: Search,
    targetElement: "[data-tour='search']",
    content: "Use the search bar to find specific AI models by name, description, or tags. You can search for terms like 'risk assessment', 'portfolio optimization', or 'market prediction' to find relevant models."
  },
  {
    id: "filters",
    title: "Smart Filtering",
    description: "Narrow down your choices with powerful filters",
    icon: Filter,
    targetElement: "[data-tour='filters']",
    content: "Use filters to refine your search by category, price range, risk level, and more. This helps you find models that match your specific requirements and budget."
  },
  {
    id: "performance",
    title: "Performance Metrics",
    description: "View detailed analytics and charts",
    icon: BarChart3,
    targetElement: "[data-tour='performance']",
    content: "Each model shows key performance metrics like accuracy, ROI, and Sharpe ratio. Click 'View Details' to see interactive charts showing historical performance trends."
  },
  {
    id: "ratings",
    title: "Ratings & Reviews",
    description: "See what other users think",
    icon: Star,
    targetElement: "[data-tour='ratings']",
    content: "Read user reviews and ratings to make informed decisions. You can also submit your own ratings and reviews after using a model to help the community."
  },
  {
    id: "comments",
    title: "Community Discussion",
    description: "Ask questions and share insights",
    icon: MessageCircle,
    targetElement: "[data-tour='comments']",
    content: "Join discussions about each model in the comments section. Ask questions, share experiences, or get advice from other users and developers."
  },
  {
    id: "export",
    title: "Export Data",
    description: "Download your findings",
    icon: Download,
    targetElement: "[data-tour='export']",
    content: "Export your research and model comparisons to CSV or PDF format. Perfect for sharing with colleagues or keeping records of your analysis."
  }
];

export default function GuidedTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    // Check if tour has been completed
    const completed = localStorage.getItem('guided_tour_completed');
    const completedTime = localStorage.getItem('guided_tour_completed_time');
    
    // Show tour if not completed or if completed more than 30 days ago
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const shouldShowTour = !completed || (completedTime && parseInt(completedTime) < thirtyDaysAgo);
    
    if (shouldShowTour && !tourCompleted) {
      // Delay to ensure page is loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [tourCompleted]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('guided_tour_completed', 'true');
    localStorage.setItem('guided_tour_completed_time', Date.now().toString());
    setTourCompleted(true);
    setIsOpen(false);
    setCurrentStep(0);
  };

  const skipTour = () => {
    completeTour();
  };

  const restartTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
    setTourCompleted(false);
  };

  // Public function to restart tour (can be called from Help button)
  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  // Add global function to window for Help button access
  useEffect(() => {
    (window as any).startGuidedTour = startTour;
    return () => {
      delete (window as any).startGuidedTour;
    };
  }, []);

  const currentStepData = tourSteps[currentStep];
  const IconComponent = currentStepData?.icon;

  return (
    <>
      {/* Help Button - always visible */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={startTour}
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg"
          title="Take a guided tour"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center space-x-3">
                {IconComponent && (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{currentStepData?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData?.description}
                  </p>
                </div>
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
              <div className="flex-1 bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step content */}
            <div className="py-4">
              <p className="text-sm leading-relaxed">
                {currentStepData?.content}
              </p>
            </div>

            {/* Visual indicators for specific tour steps */}
            {currentStep === 1 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Try searching for:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">risk assessment</Badge>
                  <Badge variant="outline" className="text-xs">portfolio optimization</Badge>
                  <Badge variant="outline" className="text-xs">market prediction</Badge>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Filter className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Available filters:</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>• Category</span>
                  <span>• Price Range</span>
                  <span>• Risk Level</span>
                  <span>• AI Technique</span>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Key metrics to look for:</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>• Accuracy %</span>
                  <span>• ROI %</span>
                  <span>• Sharpe Ratio</span>
                  <span>• Max Drawdown</span>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={skipTour}>
                  Skip Tour
                </Button>
              </div>

              <Button size="sm" onClick={nextStep}>
                {currentStep === tourSteps.length - 1 ? (
                  "Finish Tour"
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}