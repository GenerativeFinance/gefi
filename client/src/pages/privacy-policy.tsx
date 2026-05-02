import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  FileText, 
  Clock,
  Globe,
  CheckCircle2
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated: June 28, 2025
              </p>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Your Privacy is Our Priority</h3>
                  <p className="text-sm text-muted-foreground">
                    GeFi is committed to protecting your personal information and financial data. 
                    This policy explains how we collect, use, and safeguard your information when 
                    using our AI-powered financial platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center text-center p-4 bg-secondary/30 rounded-lg">
            <Lock className="h-8 w-8 text-blue-500 mb-2" />
            <div className="text-sm font-medium">256-bit SSL</div>
            <div className="text-xs text-muted-foreground">Encryption</div>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-secondary/30 rounded-lg">
            <Database className="h-8 w-8 text-green-500 mb-2" />
            <div className="text-sm font-medium">SOC 2</div>
            <div className="text-xs text-muted-foreground">Compliant</div>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-secondary/30 rounded-lg">
            <UserCheck className="h-8 w-8 text-purple-500 mb-2" />
            <div className="text-sm font-medium">GDPR</div>
            <div className="text-xs text-muted-foreground">Compliant</div>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-secondary/30 rounded-lg">
            <Globe className="h-8 w-8 text-orange-500 mb-2" />
            <div className="text-sm font-medium">Global</div>
            <div className="text-xs text-muted-foreground">Privacy</div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Professional details and company information</li>
                  <li>Authentication data from third-party providers (GitHub, Google, etc.)</li>
                  <li>Profile preferences and account settings</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Financial Information</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Payment method details (processed securely by Stripe)</li>
                  <li>Subscription and billing information</li>
                  <li>Transaction history and usage records</li>
                  <li>Portfolio data and investment preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>AI model interactions and preferences</li>
                  <li>Platform usage analytics and performance metrics</li>
                  <li>Device information and browser data</li>
                  <li>IP address and location data (if consented)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Service Delivery</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Provide AI model recommendations</li>
                    <li>Process subscriptions and payments</li>
                    <li>Generate personalized insights</li>
                    <li>Maintain platform security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Platform Improvement</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Analyze usage patterns</li>
                    <li>Enhance AI model performance</li>
                    <li>Develop new features</li>
                    <li>Provide customer support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Technical</Badge>
                    Encryption & Storage
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>256-bit SSL/TLS encryption in transit</li>
                    <li>AES-256 encryption at rest</li>
                    <li>Secure database hosting on AWS/Neon</li>
                    <li>Regular security audits and monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Access</Badge>
                    Data Access Controls
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Role-based access control</li>
                    <li>Multi-factor authentication</li>
                    <li>Regular access reviews</li>
                    <li>Principle of least privilege</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Data Control</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                    <li>Export your data (data portability)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Privacy Choices</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Opt-out of marketing communications</li>
                    <li>Manage cookie preferences</li>
                    <li>Control data sharing settings</li>
                    <li>Request processing restrictions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Trusted Partners</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <div className="font-medium text-sm">Stripe</div>
                    <div className="text-xs text-muted-foreground">Payment Processing</div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <div className="font-medium text-sm">GitHub/Google</div>
                    <div className="text-xs text-muted-foreground">Authentication</div>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <div className="font-medium text-sm">Neon Database</div>
                    <div className="text-xs text-muted-foreground">Data Storage</div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                We carefully vet all third-party services and ensure they meet our security 
                standards. We only share the minimum data necessary for service functionality.
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Active Accounts</h4>
                    <p className="text-sm text-muted-foreground">
                      We retain your data as long as your account is active and for 
                      legitimate business purposes, including analytics and compliance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Account Deletion</h4>
                    <p className="text-sm text-muted-foreground">
                      When you delete your account, we remove personal data within 30 days, 
                      except where legal obligations require longer retention.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you have questions about this Privacy Policy or how we handle your data, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Privacy Officer</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Email: privacy@gefi.ai</div>
                      <div>Response time: 48 hours</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Data Protection</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Email: dpo@gefi.ai</div>
                      <div>For GDPR inquiries</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy periodically to reflect changes in our practices 
                or applicable laws. We will notify you of material changes via email or platform 
                notification at least 30 days before they take effect.
              </p>
              
              <Separator className="my-4" />
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Version 1.0 - Effective June 28, 2025</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}