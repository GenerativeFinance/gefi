import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginFailed() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const provider = searchParams.get('provider') || 'OAuth';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Login Failed</h1>
            <p className="text-muted-foreground">
              We couldn't sign you in with {provider}. This might happen if:
            </p>
          </div>
          
          <ul className="text-left text-sm text-muted-foreground space-y-1 bg-muted/50 p-4 rounded-lg">
            <li>• The OAuth application isn't properly configured</li>
            <li>• You denied permission during the login process</li>
            <li>• There was a temporary network issue</li>
            <li>• The redirect URL doesn't match the configured settings</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <a href="/api/login">
              Try Again
            </a>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <a href="/" className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          If the problem persists, please try a different login method or contact support.
        </div>
      </div>
    </div>
  );
}