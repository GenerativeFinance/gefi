import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Login() {
  const handleLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">GeFi</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Login */}
            <Button
              onClick={() => handleLogin('google')}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center space-x-3"
              variant="outline"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span>Continue with Google</span>
            </Button>

            {/* GitHub Login */}
            <Button
              onClick={() => handleLogin('github')}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center space-x-3"
            >
              <FaGithub className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>

            {/* LinkedIn Login */}
            <Button
              onClick={() => handleLogin('linkedin')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-3"
            >
              <FaLinkedin className="h-5 w-5" />
              <span>Continue with LinkedIn</span>
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Secure Authentication
                </span>
              </div>
            </div>

            {/* Security Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Your data is protected with enterprise-grade security.</p>
              <p className="mt-1">We never store your login credentials.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <a href="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}