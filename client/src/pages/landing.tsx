import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Target, 
  Cog, 
  ChartLine, 
  Shield, 
  Calculator,
  TrendingUp,
  BarChart3,
  Bell,
  FileText,
  Star,
  Check
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">GenoFi</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#marketplace" className="text-muted-foreground hover:text-foreground transition-colors">Marketplace</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </nav>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="gradient-primary hover:opacity-90"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-blue-600/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Power Your Investments 
                  <span className="text-gradient block">
                    with AI
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Access top-tier AI-powered financial models designed by experts to optimize investment decisions and risk management.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="gradient-primary hover:opacity-90"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Models
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Card className="w-80 glass card-hover">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">AI Portfolio</h3>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Value</p>
                          <p className="text-xl font-bold">$247,580</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Live P&L</p>
                          <p className="text-xl font-bold text-green-400">+$12,430</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>AI Performance</span>
                          <span>94.2%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="gradient-primary h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Key Benefits & Features</h2>
            <p className="text-xl text-muted-foreground">What We Offer</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Deliver Precision Insights</h3>
                <p className="text-muted-foreground">AI models analyze vast financial data to provide highly accurate predictions.</p>
              </CardContent>
            </Card>
            
            <Card className="glass card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Optimize Decision-Making</h3>
                <p className="text-muted-foreground">Leverage machine learning to reduce risks and enhance financial strategies.</p>
              </CardContent>
            </Card>
            
            <Card className="glass card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <Cog className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Adapt to Your Needs</h3>
                <p className="text-muted-foreground">Customizable and scalable models built for hedge funds, VCs, traders, and enterprises.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section id="marketplace" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI Financial Models Marketplace</h2>
            <p className="text-xl text-muted-foreground">Discover cutting-edge AI models created by financial experts</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                    <ChartLine className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Active</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Quantum Risk Predictor</h3>
                <p className="text-sm text-muted-foreground mb-4">Advanced ML model for predicting market volatility with 94% accuracy</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">By TechnoCapital</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">$299/mo</span>
                  <Button size="sm" className="gradient-primary hover:opacity-90">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">New</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">DeFi Yield Optimizer</h3>
                <p className="text-sm text-muted-foreground mb-4">AI-powered yield farming strategies across multiple DeFi protocols</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">By CryptoGenius</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">4.9</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">$199/mo</span>
                  <Button size="sm" className="gradient-primary hover:opacity-90">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Premium</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">ESG Impact Scorer</h3>
                <p className="text-sm text-muted-foreground mb-4">Real-time ESG scoring and impact assessment for sustainable investing</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">By GreenAlpha</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">4.7</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">$399/mo</span>
                  <Button size="sm" className="gradient-primary hover:opacity-90">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="gradient-primary hover:opacity-90"
              onClick={() => window.location.href = '/api/login'}
            >
              View All Models
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Pricing</h2>
            <p className="text-xl text-muted-foreground">From Basic Risk Detection to Institutional-Grade AI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Tier 1 */}
            <Card className="glass card-hover">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Tier 1</h3>
                  <div className="text-4xl font-bold mb-4">
                    <span className="text-primary">$99</span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Basic Risk Assessment AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm"><strong>500K</strong> API Calls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm"><strong>5GB</strong> Secure Storage</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Weekly Reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  variant="outline"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
            
            {/* Tier 2 - Popular */}
            <Card className="glass card-hover border-primary/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="gradient-primary px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Tier 2</h3>
                  <div className="text-4xl font-bold mb-4">
                    <span className="text-primary">$499</span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Multi-Layered Risk AI</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm"><strong>2M</strong> API Calls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm"><strong>25GB</strong> Secure Storage</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Real-time Risk Monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Advanced Portfolio Testing</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full gradient-primary hover:opacity-90"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
            
            {/* Tier 3 */}
            <Card className="glass card-hover">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Tier 3</h3>
                  <div className="text-4xl font-bold mb-4">
                    <span className="text-primary">$1999</span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">AI-Driven Systemic Risk Modeling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm"><strong>Unlimited</strong> API Calls</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm"><strong>100GB</strong> Secure Storage</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Real-time Data Feeds</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Institutional-Grade Risk Management</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  variant="outline"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              🎁 Start with a 7-day free trial on any plan
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">GenoFi</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered financial platform for advanced analytics, predictive insights, and automated decision-making.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#marketplace" className="block text-muted-foreground hover:text-foreground transition-colors">Marketplace</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">AI Models</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Risk Management</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Developers</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">API Documentation</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Submit Model</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Developer Tools</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Community</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Contact Us</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Status Page</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2025 GenoFi. All rights reserved.</p>
            <p className="text-muted-foreground mt-4 md:mt-0">Powered by AI • Built for the Future</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
