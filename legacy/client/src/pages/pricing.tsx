import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import PricingCard from "@/components/pricing/pricing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Gift } from "lucide-react";

export default function Pricing() {
  const pricingTiers = [
    {
      id: "tier1",
      name: "Tier 1",
      price: 99,
      description: "Basic Risk Assessment AI",
      features: [
        "Basic Risk Assessment AI",
        "500K API Calls",
        "5GB Secure Storage",
        "Custom Cloud Services",
        "Weekly Risk & Financial Reports",
        "24/7 Support"
      ],
      popular: false,
    },
    {
      id: "tier2",
      name: "Tier 2",
      price: 499,
      description: "Multi-Layered Risk AI",
      features: [
        "Multi-Layered Risk AI",
        "2M API Calls",
        "25GB Secure Storage",
        "Real-time Market Risk Monitoring",
        "Advanced Portfolio Stress Testing",
        "Weekly Risk & Financial Reports",
        "24/7 Support"
      ],
      popular: true,
    },
    {
      id: "tier3",
      name: "Tier 3",
      price: 1999,
      description: "AI-Driven Systemic Risk & Liquidity Modeling",
      features: [
        "AI-Driven Systemic Risk & Liquidity Modeling",
        "Unlimited API Calls",
        "100GB Secure Storage",
        "Real-time Data Feeds & AI-Driven Risk Adjustments",
        "Institutional-Grade Portfolio & Liquidity Risk Management",
        "Weekly Risk & Financial Reports",
        "24/7 Support"
      ],
      popular: false,
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription anytime from your account settings. Your access will remain active until the end of your current billing cycle, and you won't be charged for the next period."
    },
    {
      question: "Which payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise clients. If you need alternative payment options, please reach out to our support team."
    },
    {
      question: "How can I manage my Account?",
      answer: "You can manage your subscription, update billing details, and modify AI model preferences directly from your dashboard. If you need assistance, our support team is available 24/7."
    },
    {
      question: "Is my credit card information secure?",
      answer: "Yes, we use industry-standard encryption and PCI-compliant payment processing to ensure your payment information is safe and secure."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we provide a 7-day free trial for new users to explore our AI financial models before committing to a subscription. Cancel anytime within the trial period to avoid charges."
    },
    {
      question: "Do I need technical expertise to use the platform?",
      answer: "No, our AI models are designed to be user-friendly and intuitive. Whether you're a retail investor, financial analyst, or hedge fund manager, our platform provides clear insights and actionable recommendations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Pricing</h1>
          <p className="text-xl text-muted-foreground">
            From Basic Risk Detection to Institutional-Grade AI for Financial Protection and Decision-Making
          </p>
        </div>
        
        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
        
        {/* Free Trial Notice */}
        <div className="text-center mb-16">
          <Card className="glass inline-block">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2">
                <Gift className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground">
                  Start with a 7-day free trial on any plan
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">FAQ</h2>
            <p className="text-xl text-muted-foreground">
              If you don't see an answer to your question, you can send us an email from our contact form
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
