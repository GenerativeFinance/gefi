import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Chrome, 
  Linkedin,
  TrendingUp,
  Brain,
  Shield,
  BarChart3 
} from "lucide-react";

export default function Login() {
  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">GeFi</h1>
            </div>
            <h2 className="text-4xl font-bold gradient-text">
              AI-Powered Finance
            </h2>
            <p className="text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              Join thousands of investors using advanced AI models for smarter financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg mx-auto flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-sm text-muted-foreground">AI Models</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg mx-auto flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-sm text-muted-foreground">Analytics</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg mx-auto flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-sm text-muted-foreground">Risk Management</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="glass w-full max-w-md mx-auto">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">Welcome to GenoFi</CardTitle>
            <p className="text-muted-foreground">
              Sign in to access your financial analytics dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* OAuth Login Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleOAuthLogin('google')}
                variant="outline"
                className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-secondary/50 transition-colors"
              >
                <Chrome className="h-5 w-5 text-red-500" />
                <span>Continue with Google</span>
              </Button>

              <Button
                onClick={() => handleOAuthLogin('github')}
                variant="outline"
                className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-secondary/50 transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>Continue with GitHub</span>
              </Button>

              <Button
                onClick={() => handleOAuthLogin('linkedin')}
                variant="outline"
                className="w-full h-12 flex items-center justify-center space-x-3 hover:bg-secondary/50 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
                <span>Continue with LinkedIn</span>
              </Button>


            </div>

            <Separator />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            {/* Features Preview */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-3">What you'll get access to:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Real-time portfolio analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>AI-powered investment insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Advanced risk management tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Marketplace access to AI models</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}