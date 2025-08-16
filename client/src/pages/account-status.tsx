import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Ban, Mail, Phone, MessageCircle, Shield } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

export default function AccountStatus() {
  const { user, isLoading } = useAuth();
  const [statusInfo, setStatusInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setStatusInfo({
        status: user.status,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />;
      case 'suspended':
        return <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />;
      case 'banned':
        return <Ban className="w-8 h-8 text-red-800 dark:text-red-600" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
      case 'suspended':
        return 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      case 'banned':
        return 'bg-red-200 dark:bg-red-900/40 border-red-300 dark:border-red-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Account Under Review',
          description: 'Your account is currently being reviewed by our team.',
          details: [
            'Our team will review your application within 24-48 hours',
            'You\'ll receive an email confirmation once approved',
            'Upon approval, you\'ll gain full access to GeFi\'s platform'
          ]
        };
      case 'suspended':
        return {
          title: 'Account Suspended',
          description: 'Your account has been temporarily suspended.',
          details: [
            'This may be due to a policy violation or security concern',
            'Contact our support team to resolve this issue',
            'Provide any requested documentation for account restoration'
          ]
        };
      case 'banned':
        return {
          title: 'Account Banned',
          description: 'Your account has been permanently banned.',
          details: [
            'This action was taken due to serious policy violations',
            'Contact our support team if you believe this is an error',
            'Review our terms of service for more information'
          ]
        };
      default:
        return {
          title: 'Account Status Unknown',
          description: 'We\'re unable to determine your account status.',
          details: [
            'Please contact our support team for assistance',
            'Have your account information ready',
            'We\'ll help resolve this issue quickly'
          ]
        };
    }
  };

  if (!user || !statusInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="w-12 h-12 mx-auto text-red-600 dark:text-red-400 mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Unable to retrieve account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Return to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusMessage = getStatusMessage(statusInfo.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Status Card */}
        <Card className={`text-center border-2 ${getStatusColor(statusInfo.status)}`}>
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
              {getStatusIcon(statusInfo.status)}
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                {statusMessage.title}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {statusMessage.description}
              </CardDescription>
            </div>
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-1 ${
                statusInfo.status === 'pending' ? 'border-orange-400 text-orange-700 dark:text-orange-300' :
                statusInfo.status === 'suspended' ? 'border-red-400 text-red-700 dark:text-red-300' :
                statusInfo.status === 'banned' ? 'border-red-600 text-red-800 dark:text-red-200' :
                'border-gray-400 text-gray-700 dark:text-gray-300'
              }`}
            >
              {statusInfo.status.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Details */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Account Information:</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium">{statusInfo.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium">{statusInfo.firstName} {statusInfo.lastName}</span>
                </div>
                {statusInfo.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Member Since:</span>
                    <span className="font-medium">{new Date(statusInfo.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Details */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What This Means:</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                {statusMessage.details.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>
              Our support team is here to assist you
            </CardDescription>
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

        {/* Logout Option */}
        <div className="text-center">
          <Link href="/api/logout">
            <Button variant="outline" size="lg">
              Sign Out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}