import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Calendar, ExternalLink, Mail, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

interface AccountPendingProps {
  userData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    areasOfFocus?: string[];
  };
}

export default function AccountPending({ userData: propUserData }: AccountPendingProps) {
  const [userData, setUserData] = useState(propUserData);

  useEffect(() => {
    // Try to get user data from sessionStorage if not provided as prop
    if (!userData) {
      const storedData = sessionStorage.getItem('pendingUserData');
      if (storedData) {
        try {
          setUserData(JSON.parse(storedData));
          // Clear it after use
          sessionStorage.removeItem('pendingUserData');
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Status Card */}
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Account Under Review
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Thank you for signing up, {userData?.firstName}! Your GeFi account is being reviewed by our team.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Details */}
            {userData && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Your Registration Details:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{userData.role}</Badge>
                  </div>
                  {userData.areasOfFocus && userData.areasOfFocus.length > 0 && (
                    <div className="col-span-full">
                      <p className="text-gray-600 dark:text-gray-300 mb-2">Areas of Interest:</p>
                      <div className="flex flex-wrap gap-1">
                        {userData.areasOfFocus.slice(0, 4).map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {userData.areasOfFocus.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{userData.areasOfFocus.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Account registration completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700 dark:text-gray-300">Account review in progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">Email confirmation pending approval</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Our team will review your application within 24-48 hours</li>
                <li>• You'll receive an email confirmation once approved</li>
                <li>• Upon approval, you'll gain full access to GeFi's AI financial models</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Demo Booking Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Book Your Personal Demo</span>
            </CardTitle>
            <CardDescription>
              While waiting for approval, schedule a personalized demo to see GeFi in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Free 30-Minute Consultation</h3>
              <p className="text-blue-100 mb-4">
                Get a personalized walkthrough of GeFi's AI financial models and see how they can transform your investment strategy.
              </p>
              <div className="space-y-2 text-sm text-blue-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Live demo of AI financial models</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Q&A with our financial experts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Personalized strategy recommendations</span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <a 
                href="https://calendly.com/generativefinance/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Your Demo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Opens in a new window • No commitment required
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Mail className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Email Support</p>
                  <a href="mailto:support@gefi.io" className="text-blue-600 hover:text-blue-800 text-sm">
                    support@gefi.io
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <MessageCircle className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Live Chat</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Available 9 AM - 6 PM EST</p>
                </div>
              </div>
              <div className="space-y-2">
                <Phone className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-sm">Phone Support</p>
                  <a href="tel:+1-555-GEFI-AI" className="text-blue-600 hover:text-blue-800 text-sm">
                    +1 (555) GEFI-AI
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}