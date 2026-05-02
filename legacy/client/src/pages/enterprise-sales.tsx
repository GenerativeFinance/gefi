import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, TrendingUp, Shield, CheckCircle, Phone, Mail, Calendar } from "lucide-react";

export default function EnterpriseSales() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <MobileNav />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Building2 className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Enterprise Solutions</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Scale your financial operations with our enterprise-grade AI platform. Trusted by leading financial institutions worldwide.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <Badge variant="default" className="text-sm">
                <Users className="h-4 w-4 mr-2" />
                500+ Enterprise Clients
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Bank-Grade Security
              </Badge>
              <Badge variant="outline" className="text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                99.9% Uptime SLA
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Get Started Today</span>
                </CardTitle>
                <CardDescription>
                  Schedule a demo or speak with our enterprise sales team to learn how GeFi can transform your financial operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input id="email" type="email" placeholder="john.doe@company.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input id="company" placeholder="Acme Financial Corp" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input id="jobTitle" placeholder="CTO, Risk Manager, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                          <SelectItem value="1001-5000">1,001-5,000 employees</SelectItem>
                          <SelectItem value="5000+">5,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banking">Banking & Finance</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="asset-management">Asset Management</SelectItem>
                        <SelectItem value="hedge-funds">Hedge Funds</SelectItem>
                        <SelectItem value="fintech">FinTech</SelectItem>
                        <SelectItem value="consulting">Financial Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="useCase">Primary Use Case</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="What interests you most?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portfolio-optimization">Portfolio Optimization</SelectItem>
                        <SelectItem value="risk-management">Risk Management</SelectItem>
                        <SelectItem value="compliance">Compliance & Reporting</SelectItem>
                        <SelectItem value="ai-models">AI Model Development</SelectItem>
                        <SelectItem value="market-analysis">Market Analysis</SelectItem>
                        <SelectItem value="all">All Features</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your specific requirements, timeline, or any questions..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Demo
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Enterprise Features & Contact Info */}
            <div className="space-y-8">
              {/* Enterprise Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Enterprise Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Dedicated Infrastructure</h4>
                        <p className="text-sm text-muted-foreground">Private cloud deployment with guaranteed resources and 99.9% uptime SLA</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Advanced Security</h4>
                        <p className="text-sm text-muted-foreground">SOC 2 Type II, ISO 27001, bank-grade encryption, and SSO integration</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Custom AI Models</h4>
                        <p className="text-sm text-muted-foreground">Bespoke AI model development tailored to your specific business needs</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">API & Integrations</h4>
                        <p className="text-sm text-muted-foreground">REST APIs, webhooks, and pre-built integrations with major financial platforms</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">24/7 Support</h4>
                        <p className="text-sm text-muted-foreground">Dedicated customer success manager and priority technical support</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Compliance Ready</h4>
                        <p className="text-sm text-muted-foreground">Built-in compliance tools for Basel III, MiFID II, Solvency II, and more</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Direct Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>Direct Contact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Sales Hotline</p>
                        <p className="text-sm text-muted-foreground">+1-800-GEFI-ENT (1-800-433-4368)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Enterprise Sales</p>
                        <p className="text-sm text-muted-foreground">enterprise@gefi.ai</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">Book a Meeting</p>
                        <p className="text-sm text-muted-foreground">calendly.com/gefi-enterprise</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Response Times</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sales inquiries: Within 2 hours</li>
                      <li>• Technical questions: Within 4 hours</li>
                      <li>• Demo scheduling: Same business day</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Success Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Enterprise Success</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-2xl font-bold text-primary">500+</p>
                      <p className="text-xs text-muted-foreground">Enterprise Clients</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">99.9%</p>
                      <p className="text-xs text-muted-foreground">Uptime SLA</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">$50B+</p>
                      <p className="text-xs text-muted-foreground">Assets Under Management</p>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">24/7</p>
                      <p className="text-xs text-muted-foreground">Support Coverage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}