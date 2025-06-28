import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Clock, CheckCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Terms of Service</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our AI financial platform.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <Badge variant="outline" className="text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Last Updated: January 1, 2025
              </Badge>
              <Badge variant="outline" className="text-sm">
                <FileText className="h-4 w-4 mr-2" />
                Version 2.1
              </Badge>
            </div>
          </div>

          {/* Terms Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>1. Acceptance of Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  By accessing and using GeFi's AI financial platform, you accept and agree to be bound by the terms 
                  and provision of this agreement. These Terms of Service govern your use of our platform, including 
                  AI models, portfolio analytics, risk management tools, and all related services.
                </p>
                <p>
                  If you do not agree to abide by the above, please do not use this service. GeFi reserves the right 
                  to update these terms at any time without prior notice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>2. Service Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  GeFi provides an AI-powered financial platform that includes:
                </p>
                <ul>
                  <li>AI model marketplace for financial analytics</li>
                  <li>Portfolio management and optimization tools</li>
                  <li>Risk assessment and management systems</li>
                  <li>Compliance reporting and monitoring</li>
                  <li>Backtesting and performance analysis</li>
                  <li>Developer tools for AI model creation</li>
                </ul>
                <p>
                  Our services are designed for institutional investors, financial professionals, 
                  and qualified developers in the financial technology sector.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>3. User Responsibilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>As a user of our platform, you agree to:</p>
                <ul>
                  <li>Provide accurate and complete information when creating your account</li>
                  <li>Maintain the security of your login credentials</li>
                  <li>Use the platform only for lawful purposes and in compliance with applicable regulations</li>
                  <li>Not attempt to reverse engineer, decompile, or extract proprietary algorithms</li>
                  <li>Not share your account access with unauthorized parties</li>
                  <li>Comply with all financial regulations in your jurisdiction</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>4. Intellectual Property</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  All AI models, algorithms, software, and content on the GeFi platform are protected by 
                  intellectual property laws. Users are granted a limited, non-exclusive license to use 
                  the platform for its intended purposes.
                </p>
                <p>
                  AI models uploaded by developers remain the intellectual property of their creators, 
                  subject to the licensing terms agreed upon during the submission process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>5. Disclaimer of Warranties</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  GeFi provides the platform "as is" without warranties of any kind. While we strive for 
                  accuracy and reliability, AI models and financial predictions are inherently uncertain 
                  and should not be considered as investment advice.
                </p>
                <p>
                  Users acknowledge that all investment decisions are made at their own risk and GeFi 
                  is not liable for any financial losses resulting from the use of our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>6. Privacy and Data Protection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Your privacy is important to us. Our data handling practices are detailed in our 
                  Privacy Policy. We implement bank-grade security measures and comply with GDPR, 
                  CCPA, and other applicable data protection regulations.
                </p>
                <p>
                  Financial data is encrypted end-to-end and processed locally whenever possible to 
                  maintain the highest levels of security and privacy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>7. Termination</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Either party may terminate this agreement at any time. Upon termination, your access 
                  to the platform will be immediately revoked, and any data associated with your account 
                  will be handled according to our data retention policies.
                </p>
                <p>
                  GeFi reserves the right to suspend or terminate accounts that violate these terms or 
                  engage in prohibited activities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>8. Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <ul>
                  <li>Email: legal@gefi.ai</li>
                  <li>Address: GeFi Technologies, Inc.</li>
                  <li>Phone: 1-800-GEFI-LAW</li>
                </ul>
                <p>
                  For urgent legal matters, please contact our legal department directly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}