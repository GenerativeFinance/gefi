import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Mail, Github, Linkedin, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatbotSignup from '@/components/ChatbotSignup';
import EmailSignIn from '@/components/EmailSignIn';
import EmailSignup from '@/components/EmailSignup';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'welcome' | 'chatbot-signup' | 'email-signup' | 'email-signin' | 'oauth';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  role: string;
}

export default function AuthFlow() {
  const [authMode, setAuthMode] = useState<AuthMode>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChatbotSignupComplete = async (userData: UserData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/email/signup', {
        ...userData,
        password: 'temp_password_' + Date.now() // Temporary password approach
      });

      if (response.ok) {
        toast({
          title: "Welcome to GeFi!",
          description: "Your account has been created successfully.",
        });
        // Redirect to dashboard
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        toast({
          title: "Signup failed",
          description: errorData.message || "Please try again.",
          variant: "destructive",
        });
        setAuthMode('welcome');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed", 
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setAuthMode('welcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  if (authMode === 'chatbot-signup') {
    return <ChatbotSignup onComplete={handleChatbotSignupComplete} />;
  }

  if (authMode === 'email-signup') {
    return (
      <EmailSignup 
        onSwitchToSignin={() => setAuthMode('email-signin')}
        onSwitchToOAuth={() => setAuthMode('oauth')}
      />
    );
  }

  if (authMode === 'email-signin') {
    return (
      <EmailSignIn 
        onSwitchToSignup={() => setAuthMode('email-signup')}
        onSwitchToOAuth={() => setAuthMode('oauth')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl border border-border bg-card">
          <CardHeader className="text-center space-y-4">
            {authMode === 'oauth' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthMode('welcome')}
                className="absolute top-4 left-4"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <Bot className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Welcome to GeFi
            </CardTitle>
            <CardDescription className="text-lg">
              {authMode === 'oauth' 
                ? 'Choose your preferred sign-in method'
                : 'Your AI-Powered Financial Platform'
              }
            </CardDescription>
            {authMode === 'welcome' && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                New Enhanced Authentication
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {authMode === 'welcome' && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* AI Chatbot Signup - Featured Option */}
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">AI Assistant Signup</h3>
                          <p className="text-sm text-muted-foreground">Personalized account creation</p>
                        </div>
                        <Badge className="ml-auto bg-green-600 text-white">Recommended</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Let our AI assistant guide you through creating your personalized account with intelligent questions.
                      </p>
                      <Button 
                        onClick={() => setAuthMode('chatbot-signup')}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Start with AI Assistant
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Traditional Email Signin */}
                  <Button
                    variant="outline"
                    onClick={() => setAuthMode('email-signin')}
                    className="w-full justify-start h-12 hover:bg-accent hover:text-accent-foreground border-border"
                  >
                    <Mail className="w-5 h-5 mr-3 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Sign in with Email</div>
                      <div className="text-xs text-muted-foreground">Already have an account?</div>
                    </div>
                  </Button>

                  {/* OAuth Options */}
                  <Button
                    variant="outline"
                    onClick={() => setAuthMode('oauth')}
                    className="w-full justify-start h-12 hover:bg-accent hover:text-accent-foreground border-border"
                  >
                    <div className="flex -space-x-1 mr-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                        <Github className="w-3 h-3 text-white" />
                      </div>
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Linkedin className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">OAuth Providers</div>
                      <div className="text-xs text-muted-foreground">Google, GitHub, LinkedIn</div>
                    </div>
                  </Button>
                </motion.div>
              )}

              {authMode === 'oauth' && (
                <motion.div
                  key="oauth"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3"
                >
                  <Button
                    onClick={() => handleOAuthLogin('google')}
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-accent hover:text-accent-foreground border-border"
                    disabled={isLoading}
                  >
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">G</span>
                    </div>
                    Continue with Google
                  </Button>

                  <Button
                    onClick={() => handleOAuthLogin('github')}
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-accent hover:text-accent-foreground border-border"
                    disabled={isLoading}
                  >
                    <Github className="w-5 h-5 mr-3" />
                    Continue with GitHub
                  </Button>

                  <Button
                    onClick={() => handleOAuthLogin('linkedin')}
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-accent hover:text-accent-foreground border-border"
                    disabled={isLoading}
                  >
                    <Linkedin className="w-5 h-5 mr-3 text-blue-600" />
                    Continue with LinkedIn
                  </Button>

                  <div className="pt-4 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setAuthMode('email-signin')}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Or sign in with email
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="pt-6 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}