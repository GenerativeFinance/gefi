import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  MapPin, 
  Briefcase, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Bell,
  Brain,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface ProfileSetupFormData {
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  bio?: string;
  investmentExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  preferredAssetTypes: string[];
  investmentGoals: string[];
  tradingFrequency: 'daily' | 'weekly' | 'monthly' | 'longterm';
  portfolioSize: 'under10k' | '10k-50k' | '50k-250k' | '250k-1m' | 'over1m';
  interestedInDeveloping: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    marketAlerts: boolean;
    portfolioUpdates: boolean;
  };
}

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<ProfileSetupFormData>({
    defaultValues: {
      notifications: {
        email: true,
        push: true,
        marketAlerts: true,
        portfolioUpdates: true
      }
    }
  });

  const setupProfileMutation = useMutation({
    mutationFn: async (data: ProfileSetupFormData) => {
      return await apiRequest('POST', '/api/profile/setup', {
        ...data,
        preferredAssetTypes: selectedAssetTypes,
        investmentGoals: selectedGoals
      });
    },
    onSuccess: async () => {
      toast({
        title: "Profile Setup Complete!",
        description: "Welcome to GeFi. Your dashboard is ready.",
      });
      
      // Invalidate both user and profile queries to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      
      // Small delay to ensure cache invalidation completes before navigation
      setTimeout(() => {
        navigate('/');
      }, 100);
    },
    onError: (error) => {
      console.error("Profile setup error:", error);
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSkip = async () => {
    toast({
      title: "Profile Setup Skipped",
      description: "You can complete your profile anytime from settings.",
    });
    
    // Invalidate queries to refresh user data
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    navigate('/');
  };

  const assetTypes = [
    { id: 'stocks', label: 'Stocks', icon: TrendingUp },
    { id: 'crypto', label: 'Cryptocurrency', icon: Brain },
    { id: 'forex', label: 'Forex', icon: DollarSign },
    { id: 'commodities', label: 'Commodities', icon: Target },
    { id: 'bonds', label: 'Bonds', icon: Shield },
    { id: 'etfs', label: 'ETFs', icon: Briefcase }
  ];

  const investmentGoals = [
    { id: 'wealth-building', label: 'Long-term Wealth Building' },
    { id: 'retirement', label: 'Retirement Planning' },
    { id: 'passive-income', label: 'Passive Income Generation' },
    { id: 'capital-preservation', label: 'Capital Preservation' },
    { id: 'speculation', label: 'Short-term Trading' },
    { id: 'diversification', label: 'Portfolio Diversification' }
  ];

  const toggleAssetType = (assetId: string) => {
    setSelectedAssetTypes(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const onSubmit = (data: ProfileSetupFormData) => {
    setupProfileMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GeFi</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help us personalize your financial dashboard</p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentStep === 1 && <><User className="h-5 w-5" /><span>Personal Information</span></>}
                {currentStep === 2 && <><Target className="h-5 w-5" /><span>Investment Profile</span></>}
                {currentStep === 3 && <><TrendingUp className="h-5 w-5" /><span>Preferences</span></>}
                {currentStep === 4 && <><Bell className="h-5 w-5" /><span>Notifications & Settings</span></>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register('firstName', { required: 'First name is required' })}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register('lastName', { required: 'Last name is required' })}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        {...register('company')}
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobTitle">Job Title (Optional)</Label>
                      <Input
                        id="jobTitle"
                        {...register('jobTitle')}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        {...register('location')}
                        placeholder="San Francisco, CA"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      {...register('bio')}
                      placeholder="Tell us a bit about yourself and your investment interests..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Investment Profile */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="investmentExperience">Investment Experience *</Label>
                      <Select onValueChange={(value) => setValue('investmentExperience', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                          <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                          <SelectItem value="expert">Expert (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="riskTolerance">Risk Tolerance *</Label>
                      <Select onValueChange={(value) => setValue('riskTolerance', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk tolerance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">Conservative</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Preferred Asset Types *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {assetTypes.map((asset) => {
                        const Icon = asset.icon;
                        const isSelected = selectedAssetTypes.includes(asset.id);
                        return (
                          <div
                            key={asset.id}
                            onClick={() => toggleAssetType(asset.id)}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                              {asset.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>Investment Goals *</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {investmentGoals.map((goal) => {
                        const isSelected = selectedGoals.includes(goal.id);
                        return (
                          <div
                            key={goal.id}
                            onClick={() => toggleGoal(goal.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <span className={`text-sm ${isSelected ? 'text-primary font-medium' : 'text-foreground'}`}>
                              {goal.label}
                            </span>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tradingFrequency">Trading Frequency *</Label>
                      <Select onValueChange={(value) => setValue('tradingFrequency', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="How often do you trade?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="longterm">Long-term Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="portfolioSize">Portfolio Size *</Label>
                      <Select onValueChange={(value) => setValue('portfolioSize', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Approximate portfolio value" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under10k">Under $10,000</SelectItem>
                          <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                          <SelectItem value="50k-250k">$50,000 - $250,000</SelectItem>
                          <SelectItem value="250k-1m">$250,000 - $1,000,000</SelectItem>
                          <SelectItem value="over1m">Over $1,000,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="interestedInDeveloping">Interested in AI Model Development?</Label>
                        <p className="text-sm text-muted-foreground">
                          Get access to developer tools and the AI model marketplace
                        </p>
                      </div>
                      <Switch
                        id="interestedInDeveloping"
                        onCheckedChange={(checked) => setValue('interestedInDeveloping', checked)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Notifications */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Notification Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive important updates via email
                          </p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          defaultChecked={true}
                          onCheckedChange={(checked) => setValue('notifications.email', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Get real-time alerts on your device
                          </p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          defaultChecked={true}
                          onCheckedChange={(checked) => setValue('notifications.push', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="marketAlerts">Market Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Alerts for significant market movements
                          </p>
                        </div>
                        <Switch
                          id="marketAlerts"
                          defaultChecked={true}
                          onCheckedChange={(checked) => setValue('notifications.marketAlerts', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="portfolioUpdates">Portfolio Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Daily/weekly portfolio performance summaries
                          </p>
                        </div>
                        <Switch
                          id="portfolioUpdates"
                          defaultChecked={true}
                          onCheckedChange={(checked) => setValue('notifications.portfolioUpdates', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!watch('firstName') || !watch('lastName'))) ||
                      (currentStep === 2 && (selectedAssetTypes.length === 0 || selectedGoals.length === 0)) ||
                      (currentStep === 3 && (!watch('tradingFrequency') || !watch('portfolioSize')))
                    }
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={setupProfileMutation.isPending}
                    className="gradient-primary"
                  >
                    {setupProfileMutation.isPending ? 'Setting up...' : 'Complete Setup'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="text-foreground border-border hover:bg-muted/50 transition-colors"
            type="button"
          >
            Skip for now - I'll complete this later
          </Button>
        </div>
      </div>
    </div>
  );
}