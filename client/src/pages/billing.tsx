import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, Calendar, TrendingUp, DollarSign, FileText, AlertCircle } from "lucide-react";

export default function Billing() {
  const currentPlan = {
    name: "Professional",
    price: 299,
    period: "month",
    features: ["Unlimited AI Models", "Advanced Analytics", "Priority Support", "Custom Integrations"],
    usage: {
      apiCalls: { used: 847000, limit: 1000000 },
      storage: { used: 2.3, limit: 5 }, // GB
      users: { used: 8, limit: 25 }
    }
  };

  const billingHistory = [
    {
      id: 1,
      date: "2024-12-01",
      description: "Professional Plan - December 2024",
      amount: 299.00,
      status: "Paid",
      invoice: "INV-2024-12-001"
    },
    {
      id: 2,
      date: "2024-11-01",
      description: "Professional Plan - November 2024",
      amount: 299.00,
      status: "Paid",
      invoice: "INV-2024-11-001"
    },
    {
      id: 3,
      date: "2024-10-01",
      description: "Professional Plan - October 2024",
      amount: 299.00,
      status: "Paid",
      invoice: "INV-2024-10-001"
    },
    {
      id: 4,
      date: "2024-09-01",
      description: "Additional API Credits",
      amount: 49.00,
      status: "Paid",
      invoice: "INV-2024-09-002"
    }
  ];

  const upcomingCharges = [
    {
      date: "2025-01-01",
      description: "Professional Plan - January 2025",
      amount: 299.00
    },
    {
      date: "2024-12-15",
      description: "Additional Storage (estimated)",
      amount: 25.00
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription, billing history, and payment methods
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
            <TabsTrigger value="usage">Usage & Limits</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Plan */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Your active subscription details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                        <p className="text-3xl font-bold text-primary">
                          ${currentPlan.price}
                          <span className="text-sm font-normal text-muted-foreground">/{currentPlan.period}</span>
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>

                    <div className="space-y-2 mb-6">
                      {currentPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="outline">Cancel Subscription</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Charges */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Upcoming Charges</CardTitle>
                    <CardDescription>Scheduled payments and renewals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingCharges.map((charge, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{charge.description}</div>
                            <div className="text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {new Date(charge.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-lg font-semibold">${charge.amount}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Current Month</span>
                        <span className="font-semibold">$299.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Additional Charges</span>
                        <span className="font-semibold">$25.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total</span>
                        <span>$324.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/25</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Update Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div>123 Business Street</div>
                      <div>San Francisco, CA 94105</div>
                      <div>United States</div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Update Address
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>Your payment and invoice history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{bill.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(bill.date).toLocaleDateString()} • {bill.invoice}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-semibold">${bill.amount}</div>
                          <Badge variant={bill.status === "Paid" ? "default" : "secondary"}>
                            {bill.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    API Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{currentPlan.usage.apiCalls.used.toLocaleString()} / {currentPlan.usage.apiCalls.limit.toLocaleString()}</span>
                    </div>
                    <Progress value={(currentPlan.usage.apiCalls.used / currentPlan.usage.apiCalls.limit) * 100} />
                    <p className="text-xs text-muted-foreground">
                      {Math.round((currentPlan.usage.apiCalls.used / currentPlan.usage.apiCalls.limit) * 100)}% of monthly limit
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Storage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used</span>
                      <span>{currentPlan.usage.storage.used} GB / {currentPlan.usage.storage.limit} GB</span>
                    </div>
                    <Progress value={(currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100} />
                    <p className="text-xs text-muted-foreground">
                      {Math.round((currentPlan.usage.storage.used / currentPlan.usage.storage.limit) * 100)}% of storage limit
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active</span>
                      <span>{currentPlan.usage.users.used} / {currentPlan.usage.users.limit}</span>
                    </div>
                    <Progress value={(currentPlan.usage.users.used / currentPlan.usage.users.limit) * 100} />
                    <p className="text-xs text-muted-foreground">
                      {Math.round((currentPlan.usage.users.used / currentPlan.usage.users.limit) * 100)}% of user limit
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/25</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="default">Primary</Badge>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Settings</CardTitle>
                  <CardDescription>Configure your billing preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-renewal</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Invoice delivery</span>
                      <span className="text-sm text-muted-foreground">Email</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Currency</span>
                      <span className="text-sm text-muted-foreground">USD</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Update Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}