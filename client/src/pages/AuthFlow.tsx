import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Mail, Github, Linkedin, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatbotSignup from '@/components/ChatbotSignup';
import EmailSignIn from '@/components/EmailSignIn';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'welcome' | 'chatbot-signup' | 'email-signin' | 'oauth';

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

  if (authMode === 'email-signin') {
    return (
      <EmailSignIn 
        onSwitchToSignup={() => setAuthMode('chatbot-signup')}
        onSwitchToOAuth={() => setAuthMode('oauth')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
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
            
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to GeFi
            </CardTitle>
            <CardDescription className="text-lg">
              {authMode === 'oauth' 
                ? 'Choose your preferred sign-in method'
                : 'Your AI-Powered Financial Platform'
              }
            </CardDescription>
            {authMode === 'welcome' && (
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200">
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
                  <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-800 dark:text-blue-200">AI Assistant Signup</h3>
                          <p className="text-sm text-blue-600 dark:text-blue-300">Personalized account creation</p>
                        </div>
                        <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white">Recommended</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Let our AI assistant guide you through creating your personalized account with intelligent questions.
                      </p>
                      <Button 
                        onClick={() => setAuthMode('chatbot-signup')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
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
                    className="w-full justify-start h-12 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  >
                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Sign in with Email</div>
                      <div className="text-xs text-gray-500">Already have an account?</div>
                    </div>
                  </Button>

                  {/* OAuth Options */}
                  <Button
                    variant="outline"
                    onClick={() => setAuthMode('oauth')}
                    className="w-full justify-start h-12 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                      <div className="text-xs text-gray-500">Google, GitHub, LinkedIn</div>
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
                    className="w-full justify-start h-12 hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800"
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
                    className="w-full justify-start h-12 hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-800"
                    disabled={isLoading}
                  >
                    <Github className="w-5 h-5 mr-3 text-gray-800" />
                    Continue with GitHub
                  </Button>

                  <Button
                    onClick={() => handleOAuthLogin('linkedin')}
                    variant="outline"
                    className="w-full justify-start h-12 hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                    disabled={isLoading}
                  >
                    <Linkedin className="w-5 h-5 mr-3 text-blue-600" />
                    Continue with LinkedIn
                  </Button>

                  <div className="pt-4 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setAuthMode('email-signin')}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Or sign in with email
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="pt-6 text-center space-y-2">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}