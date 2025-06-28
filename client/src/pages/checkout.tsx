import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Shield, Check, Star, Brain, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  plan: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  agreedToTerms: boolean;
  marketingEmails: boolean;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Mock model data - in real app, this would come from URL params or state
  const mockModel = {
    id: 1,
    name: "Quantum Risk Predictor",
    creator: "TechnoCapital",
    price: "299",
    rating: "4.8",
    totalRatings: 156,
    category: "Risk Assessment",
    riskLevel: "Medium",
    minInvestment: "10000",
    isFeatured: true,
    description: "Advanced ML model for predicting market volatility with 94% accuracy using quantum-inspired algorithms",
    features: ["Real-time Analysis", "Risk Alerts", "Backtesting", "API Access"],
    performance: {
      accuracy: 94.2,
      sharpe_ratio: 2.1,
      max_drawdown: 8.5
    }
  };

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    company: "",
    phone: "",
    plan: "monthly",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    },
    agreedToTerms: false,
    marketingEmails: false
  });

  const [processingPayment, setProcessingPayment] = useState(false);

  const subscriptionMutation = useMutation({
    mutationFn: async (subscriptionData: any) => {
      await apiRequest("POST", "/api/ai-models/subscribe", subscriptionData);
    },
    onSuccess: () => {
      toast({
        title: "Subscription Successful!",
        description: "Welcome to your AI model subscription. Check your email for details.",
      });
      setLocation("/marketplace");
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: "Please check your payment details and try again.",
        variant: "destructive",
      });
    },
  });

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CheckoutFormData] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your subscription",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }

    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      subscriptionMutation.mutate({
        modelId: mockModel.id,
        plan: formData.plan,
        userDetails: formData
      });
    }, 2000);
  };

  const getPlanPrice = () => {
    const basePrice = parseFloat(mockModel.price);
    switch (formData.plan) {
      case "annual":
        return basePrice * 10; // 2 months free
      case "enterprise":
        return basePrice * 15;
      default:
        return basePrice;
    }
  };

  const getPlanDiscount = () => {
    switch (formData.plan) {
      case "annual":
        return "Save 17% (2 months free)";
      case "enterprise":
        return "Custom pricing + priority support";
      default:
        return "Billed monthly";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/marketplace")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{mockModel.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{mockModel.creator}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">{mockModel.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({mockModel.totalRatings} reviews)
                        </span>
                      </div>
                      {mockModel.isFeatured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mockModel.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Plan Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Plan</Label>
                  <RadioGroup
                    value={formData.plan}
                    onValueChange={(value) => updateFormData('plan', value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Monthly</div>
                            <div className="text-xs text-muted-foreground">Billed monthly</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${mockModel.price}/mo</div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="annual" id="annual" />
                      <Label htmlFor="annual" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Annual</div>
                            <div className="text-xs text-green-400">Save 17% (2 months free)</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${(parseFloat(mockModel.price) * 10).toFixed(0)}/yr</div>
                            <div className="text-xs text-muted-foreground line-through">
                              ${(parseFloat(mockModel.price) * 12).toFixed(0)}/yr
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="enterprise" id="enterprise" />
                      <Label htmlFor="enterprise" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Enterprise</div>
                            <div className="text-xs text-muted-foreground">Priority support + custom terms</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">Contact us</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getPlanPrice().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>14-day free trial</span>
                    <span>-${getPlanPrice().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total due today</span>
                    <span>$0.00</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getPlanDiscount()}
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-lg">
                  <Shield className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium">Secure Checkout</div>
                    <div className="text-xs text-muted-foreground">
                      256-bit SSL encryption • PCI compliant
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Payment Details</span>
                </CardTitle>
                <CardDescription>
                  Complete your subscription to start your 14-day free trial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => updateFormData('company', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Payment Method</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => updateFormData('cardNumber', e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => updateFormData('expiryDate', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={(e) => updateFormData('cvv', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Billing Address</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={formData.billingAddress.street}
                          onChange={(e) => updateFormData('billingAddress.street', e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.billingAddress.city}
                            onChange={(e) => updateFormData('billingAddress.city', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={formData.billingAddress.state}
                            onChange={(e) => updateFormData('billingAddress.state', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => updateFormData('billingAddress.zipCode', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select
                            value={formData.billingAddress.country}
                            onValueChange={(value) => updateFormData('billingAddress.country', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="DE">Germany</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Terms and Marketing */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => updateFormData('agreedToTerms', checked)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={formData.marketingEmails}
                        onCheckedChange={(checked) => updateFormData('marketingEmails', checked)}
                      />
                      <Label htmlFor="marketing" className="text-sm">
                        Send me product updates and marketing emails
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    size="lg"
                    disabled={processingPayment || subscriptionMutation.isPending}
                  >
                    {processingPayment ? (
                      <>Processing Payment...</>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Start Free Trial
                      </>
                    )}
                  </Button>

                  <div className="text-center text-xs text-muted-foreground">
                    Free for 14 days, then ${getPlanPrice().toFixed(0)}/{formData.plan === 'annual' ? 'year' : 'month'}. Cancel anytime.
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}