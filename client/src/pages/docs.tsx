import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { 
  Book, 
  Search, 
  Code, 
  Play, 
  Download,
  ExternalLink,
  FileText,
  Terminal,
  Database,
  Brain,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

export default function Documentation() {
  const docCategories = [
    {
      title: "Getting Started",
      icon: Play,
      description: "Quick start guides and basic concepts",
      docs: [
        { title: "Platform Overview", level: "Beginner", time: "5 min read" },
        { title: "Setting Up Your Account", level: "Beginner", time: "3 min read" },
        { title: "Your First AI Model", level: "Beginner", time: "10 min read" }
      ]
    },
    {
      title: "API Reference",
      icon: Code,
      description: "Complete API documentation and endpoints",
      docs: [
        { title: "Authentication", level: "Intermediate", time: "8 min read" },
        { title: "REST API Guide", level: "Intermediate", time: "15 min read" },
        { title: "WebSocket Streaming", level: "Advanced", time: "12 min read" }
      ]
    },
    {
      title: "AI Models",
      icon: Brain,
      description: "Build, train, and deploy AI financial models",
      docs: [
        { title: "Model Architecture", level: "Intermediate", time: "20 min read" },
        { title: "Training Data", level: "Intermediate", time: "15 min read" },
        { title: "Model Deployment", level: "Advanced", time: "25 min read" }
      ]
    },
    {
      title: "Trading & Portfolio",
      icon: TrendingUp,
      description: "Portfolio management and trading strategies",
      docs: [
        { title: "Portfolio Optimization", level: "Intermediate", time: "18 min read" },
        { title: "Risk Management", level: "Advanced", time: "22 min read" },
        { title: "Trading Algorithms", level: "Advanced", time: "30 min read" }
      ]
    },
    {
      title: "Risk Management",
      icon: Shield,
      description: "Compliance, security, and risk assessment",
      docs: [
        { title: "Compliance Framework", level: "Advanced", time: "25 min read" },
        { title: "Security Best Practices", level: "Intermediate", time: "12 min read" },
        { title: "Audit & Reporting", level: "Advanced", time: "20 min read" }
      ]
    },
    {
      title: "Integration",
      icon: Database,
      description: "Third-party integrations and data sources",
      docs: [
        { title: "Data Providers", level: "Intermediate", time: "10 min read" },
        { title: "Webhook Configuration", level: "Advanced", time: "15 min read" },
        { title: "Custom Integrations", level: "Expert", time: "35 min read" }
      ]
    }
  ];

  const quickLinks = [
    { title: "API Keys & Authentication", icon: Terminal, href: "/docs/auth" },
    { title: "Code Examples", icon: Code, href: "/docs/examples" },
    { title: "SDK Downloads", icon: Download, href: "/docs/sdk" },
    { title: "Changelog", icon: FileText, href: "/docs/changelog" }
  ];

  const getLevelColor = (level: string) => {
    switch ((level ?? '').toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Documentation
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Comprehensive guides, API references, and tutorials to help you build 
                powerful AI-driven financial applications on our platform.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    placeholder="Search documentation..." 
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap justify-center gap-4">
                {quickLinks.map((link, index) => (
                  <Button key={index} variant="outline" size="lg" className="gap-2">
                    <link.icon className="h-5 w-5" />
                    {link.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Documentation Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.docs.map((doc, docIndex) => (
                      <div key={docIndex} className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{doc.title}</h4>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`text-xs ${getLevelColor(doc.level)}`}>
                            {doc.level}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{doc.time}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4 gap-2">
                      <Book className="h-4 w-4" />
                      View All {category.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Popular Resources */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Quick Start Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get up and running in 5 minutes
                </p>
                <Button variant="outline" size="sm">Read Guide</Button>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Code Examples</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready-to-use code snippets
                </p>
                <Button variant="outline" size="sm">Browse Examples</Button>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Model Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pre-built AI model templates
                </p>
                <Button variant="outline" size="sm">View Templates</Button>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Terminal className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold mb-2">CLI Tools</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Command-line interface guide
                </p>
                <Button variant="outline" size="sm">Download CLI</Button>
              </Card>
            </div>
          </section>

          {/* Support Section */}
          <section className="mt-16 text-center">
            <div className="bg-accent/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help 
                you get the most out of the GeFi platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Contact Support
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}