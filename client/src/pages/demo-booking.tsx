import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, CheckCircle, ArrowRight, ExternalLink, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  experienceLevel?: string;
  platformIntent?: string;
  areasOfFocus?: string[];
}

export default function DemoBooking() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Get user data from session storage if available
    const storedData = sessionStorage.getItem('pendingUserData');
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const openCalendlyBooking = () => {
    setIsBookingOpen(true);
    // Open Calendly in a new tab
    window.open('https://calendly.com/generativefinance', '_blank');
    
    // Optional: Show embedded Calendly widget
    // This would require adding Calendly's embed script
  };

  const skipDemo = () => {
    // Redirect to account status page
    window.location.href = '/account-pending';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Account Created Successfully!
                </CardTitle>
                {userData?.firstName && (
                  <CardDescription className="text-lg mt-2">
                    Welcome to GeFi, {userData.firstName}!
                  </CardDescription>
                )}
              </div>

              {userData && (
                <div className="flex flex-wrap justify-center gap-2">
                  {userData.experienceLevel && (
                    <Badge variant="secondary" className="text-sm">
                      <User className="w-3 h-3 mr-1" />
                      {userData.experienceLevel} Level
                    </Badge>
                  )}
                  {userData.platformIntent && (
                    <Badge variant="outline" className="text-sm">
                      {userData.platformIntent}
                    </Badge>
                  )}
                  {userData.areasOfFocus && userData.areasOfFocus.length > 0 && (
                    <Badge variant="outline" className="text-sm">
                      +{userData.areasOfFocus.length} Focus Areas
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Account Status */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Account Under Review
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Your account is currently being reviewed by our team. You'll receive an email confirmation 
                  once approved (typically within 24-48 hours).
                </p>
              </div>

              {/* Demo Booking Section */}
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Book Your Personal Demo</h2>
                  <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    While waiting for account approval, schedule a personalized demo to explore GeFi's 
                    AI-powered financial tools and see how they can transform your workflow.
                  </p>
                </div>

                {/* Demo Benefits */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <Video className="w-8 h-8 mx-auto text-blue-600" />
                      <h3 className="font-semibold">Live Demo</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        See GeFi's AI models in action with real-time demonstrations
                      </p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <User className="w-8 h-8 mx-auto text-green-600" />
                      <h3 className="font-semibold">Personalized</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Tailored presentation based on your experience and interests
                      </p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <Clock className="w-8 h-8 mx-auto text-purple-600" />
                      <h3 className="font-semibold">30 Minutes</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Quick but comprehensive overview of key features
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Booking Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={openCalendlyBooking}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Demo Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <Button
                    onClick={skipDemo}
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Skip for Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Additional Information */}
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                  <p>
                    Demo sessions are available Monday-Friday, 9 AM - 6 PM EST
                  </p>
                  <p>
                    Can't find a suitable time? Email us at{' '}
                    <a 
                      href="mailto:demo@gefi.com" 
                      className="text-blue-600 hover:underline"
                    >
                      demo@gefi.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  What Happens Next?
                </h3>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Account review and approval (24-48 hours)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Email confirmation with login instructions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Access to AI financial models and tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Personalized dashboard setup</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}