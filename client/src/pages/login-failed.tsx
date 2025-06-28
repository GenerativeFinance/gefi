import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function LoginFailed() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-xl">Authentication Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We couldn't sign you in with the selected provider. This might happen if:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• You cancelled the authentication process</li>
              <li>• The provider account doesn't have an email address</li>
              <li>• There was a temporary connection issue</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Link href="/login">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}