import { Link } from "wouter";
import { useI18n } from "@/hooks/useI18n";
import { 
  Shield, 
  Lock, 
  Database, 
  UserCheck, 
  Award,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-background border-t border-border">
      {/* Trust Indicators Bar */}
      <div className="bg-secondary/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4 text-green-500" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Database className="h-4 w-4 text-blue-500" />
              <span>SOC 2 Type II Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserCheck className="h-4 w-4 text-purple-500" />
              <span>GDPR & CCPA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 text-orange-500" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>99.9% Uptime SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  GeFi
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered financial platform for institutional-grade investment analytics, 
                risk management, and portfolio optimization.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Enterprise Security
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Database className="h-3 w-3 mr-1" />
                  Bank-Grade Encryption
                </Badge>
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/marketplace" className="hover:text-primary transition-colors">
                    AI Model Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-primary transition-colors">
                    Portfolio Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/risk-management" className="hover:text-primary transition-colors">
                    Risk Management
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="hover:text-primary transition-colors">
                    Compliance Reports
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-primary transition-colors">
                    Pricing Plans
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Privacy */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Legal & Privacy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy-policy" className="hover:text-primary transition-colors flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/data-processing-agreement" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    Data Processing Agreement
                  </Link>
                </li>
                <li>
                  <Link href="/security-compliance" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Security Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/bug-bounty-program" className="hover:text-primary transition-colors flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Bug Bounty Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Support & Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:support@gefi.ai" className="hover:text-primary transition-colors">
                    General Support
                  </a>
                </li>
                <li>
                  <a href="mailto:privacy@gefi.ai" className="hover:text-primary transition-colors">
                    Privacy Officer
                  </a>
                </li>
                <li>
                  <a href="mailto:security@gefi.ai" className="hover:text-primary transition-colors">
                    Security Team
                  </a>
                </li>
                <li>
                  <a href="mailto:compliance@gefi.ai" className="hover:text-primary transition-colors">
                    Compliance Team
                  </a>
                </li>
                <li>
                  <Link href="/enterprise-sales" className="hover:text-primary transition-colors">
                    Enterprise Sales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Data Privacy Statement */}
      <div className="border-t border-border bg-secondary/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Your data is encrypted and never shared with third parties</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Zero Data Retention</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>AI Models Run Locally</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4 text-purple-500" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2025 GeFi Technologies. All rights reserved.</span>
              <Badge variant="outline" className="text-xs">
                Version 1.0
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span>Built with ❤️ for financial professionals</span>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-xs">Trusted by 10,000+ users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}