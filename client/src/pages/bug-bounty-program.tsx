import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Target, DollarSign, Shield, AlertTriangle, CheckCircle, Users, Trophy, ExternalLink } from "lucide-react";

export default function BugBountyProgram() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Target className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Bug Bounty Program</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help us keep GeFi secure. Report vulnerabilities responsibly and earn rewards for making our platform safer.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <Badge variant="default" className="text-sm">
                <DollarSign className="h-4 w-4 mr-2" />
                Up to $50,000 Rewards
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Responsible Disclosure
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Users className="h-4 w-4 mr-2" />
                1000+ Security Researchers
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">$50,000</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Maximum reward for critical vulnerabilities</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                <CardTitle className="text-lg">127</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Vulnerabilities fixed in 2024</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">1,247</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Active security researchers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">24 hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Program Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Program Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The GeFi Bug Bounty Program rewards security researchers who help us identify and fix 
                  vulnerabilities in our AI financial platform. We believe in working with the security 
                  community to maintain the highest standards of protection for our users' financial data.
                </p>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All testing must be conducted in accordance with our responsible disclosure policy. 
                    Unauthorized access to user data or systems is strictly prohibited.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Reward Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span>Reward Structure</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="text-center">
                      <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-red-800 dark:text-red-200">Critical</h4>
                      <p className="text-2xl font-bold text-red-600">$25,000 - $50,000</p>
                      <p className="text-xs text-red-600 mt-1">RCE, SQL Injection, Authentication Bypass</p>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="text-center">
                      <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">High</h4>
                      <p className="text-2xl font-bold text-orange-600">$5,000 - $15,000</p>
                      <p className="text-xs text-orange-600 mt-1">XSS, CSRF, Privilege Escalation</p>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="text-center">
                      <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Medium</h4>
                      <p className="text-2xl font-bold text-yellow-600">$1,000 - $3,000</p>
                      <p className="text-xs text-yellow-600 mt-1">Information Disclosure, Business Logic</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="text-center">
                      <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">Low</h4>
                      <p className="text-2xl font-bold text-blue-600">$250 - $750</p>
                      <p className="text-xs text-blue-600 mt-1">Low Impact Issues, Minor Bugs</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reward amounts are determined by the severity, impact, and quality of the report. 
                  Exceptional reports may receive bonus rewards.
                </p>
              </CardContent>
            </Card>

            {/* Scope */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Program Scope</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">✅ In Scope</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• app.gefi.ai (main application)</li>
                      <li>• api.gefi.ai (API endpoints)</li>
                      <li>• models.gefi.ai (AI model platform)</li>
                      <li>• auth.gefi.ai (authentication services)</li>
                      <li>• Mobile applications (iOS/Android)</li>
                      <li>• Developer dashboard and tools</li>
                      <li>• Payment processing flows</li>
                      <li>• AI model execution environment</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3">❌ Out of Scope</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Social engineering attacks</li>
                      <li>• Physical security testing</li>
                      <li>• Denial of Service (DoS/DDoS)</li>
                      <li>• Spam or content injection</li>
                      <li>• Third-party services (AWS, Stripe, etc.)</li>
                      <li>• Test/staging environments</li>
                      <li>• Issues requiring user interaction</li>
                      <li>• Self-XSS vulnerabilities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerability Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Priority Vulnerability Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">🔴 Critical Priority</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Remote Code Execution (RCE)</li>
                      <li>• SQL Injection leading to data access</li>
                      <li>• Authentication/Authorization bypass</li>
                      <li>• Financial data exposure</li>
                      <li>• AI model poisoning/manipulation</li>
                      <li>• Privilege escalation to admin</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">🟡 High Priority</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Cross-Site Scripting (XSS)</li>
                      <li>• Cross-Site Request Forgery (CSRF)</li>
                      <li>• Insecure Direct Object References</li>
                      <li>• Payment processing vulnerabilities</li>
                      <li>• Session management flaws</li>
                      <li>• API security issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Submission Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>To ensure we can quickly validate and fix your findings, please include:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Required Information</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Detailed vulnerability description</li>
                      <li>• Step-by-step reproduction steps</li>
                      <li>• Impact assessment and CVSS score</li>
                      <li>• Screenshots or proof-of-concept</li>
                      <li>• Affected URLs or endpoints</li>
                      <li>• Browser/platform information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Bonus Points</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Suggested remediation steps</li>
                      <li>• Code snippets showing the fix</li>
                      <li>• Multiple attack vectors</li>
                      <li>• Business impact analysis</li>
                      <li>• Clear, professional communication</li>
                      <li>• Timeline for disclosure</li>
                    </ul>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <Button className="flex-1">
                    <Target className="h-4 w-4 mr-2" />
                    Submit Vulnerability Report
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Submission Portal
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Contact & Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Security Team</h4>
                    <ul className="space-y-2 text-sm">
                      <li>📧 security@gefi.ai</li>
                      <li>🔐 PGP Key: 4B2E 8F9A 1C3D 5E7F</li>
                      <li>⏱️ Response: Within 24 hours</li>
                      <li>📞 Emergency: +1-800-GEFI-SEC</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Program Manager</h4>
                    <ul className="space-y-2 text-sm">
                      <li>📧 bugbounty@gefi.ai</li>
                      <li>💬 Slack: #security-researchers</li>
                      <li>🐦 Twitter: @GeFiSecurity</li>
                      <li>📋 Status: status.gefi.ai</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}