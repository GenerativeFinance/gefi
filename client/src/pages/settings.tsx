import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Settings as SettingsIcon, Bell, Shield, Globe, 
  Sun, Moon, Monitor, Eye, Volume2, Smartphone, 
  CreditCard, Key, FileText, HelpCircle, LogOut 
} from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // User settings state  
  const [settings, setSettings] = useState({
    // Profile settings
    firstName: (user as any)?.firstName || "",
    lastName: (user as any)?.lastName || "",
    email: (user as any)?.email || "",
    bio: "",
    company: "",
    jobTitle: "",
    website: "",
    location: "",
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    portfolioUpdates: true,
    priceAlerts: true,
    weeklyReports: true,
    
    // Privacy settings
    profileVisibility: "public",
    showPortfolio: false,
    showActivity: true,
    dataSharing: false,
    analyticsTracking: true,
    
    // Display settings
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    numberFormat: "1,234.56",
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
    deviceManagement: true,
    
    // Trading settings
    riskTolerance: "moderate",
    defaultInvestment: "1000",
    autoRebalance: false,
    stopLossPercentage: "10",
    takeProfitPercentage: "20",
  });

  const handleSave = () => {
    // In a real app, you would save these settings to the backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={(user as any)?.profileImageUrl} alt={(user as any)?.firstName} />
                  <AvatarFallback className="text-lg">
                    {(user as any)?.firstName?.[0]}{(user as any)?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => setSettings(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => setSettings(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={settings.bio}
                  onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => setSettings(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={settings.jobTitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, jobTitle: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <CardTitle>Display Settings</CardTitle>
              </div>
              <CardDescription>Customize your viewing experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange("light")}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange("dark")}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="zh">🇨🇳 中文</SelectItem>
                      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      <SelectItem value="EST">Eastern Time (GMT-5)</SelectItem>
                      <SelectItem value="PST">Pacific Time (GMT-8)</SelectItem>
                      <SelectItem value="GMT">London (GMT+0)</SelectItem>
                      <SelectItem value="CET">Central Europe (GMT+1)</SelectItem>
                      <SelectItem value="JST">Japan (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">$ USD</SelectItem>
                      <SelectItem value="EUR">€ EUR</SelectItem>
                      <SelectItem value="GBP">£ GBP</SelectItem>
                      <SelectItem value="JPY">¥ JPY</SelectItem>
                      <SelectItem value="CAD">$ CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="portfolioUpdates">Portfolio Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified about portfolio changes</p>
                  </div>
                  <Switch
                    id="portfolioUpdates"
                    checked={settings.portfolioUpdates}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, portfolioUpdates: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="priceAlerts">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alerts for significant price movements</p>
                  </div>
                  <Switch
                    id="priceAlerts"
                    checked={settings.priceAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, priceAlerts: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly portfolio summaries</p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.twoFactorAuth ? "default" : "secondary"}>
                    {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {settings.twoFactorAuth ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Manage Devices
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Account Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trading Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <CardTitle>Trading Preferences</CardTitle>
              </div>
              <CardDescription>Configure your default trading settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                  <Select value={settings.riskTolerance} onValueChange={(value) => setSettings(prev => ({ ...prev, riskTolerance: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultInvestment">Default Investment Amount</Label>
                  <Input
                    id="defaultInvestment"
                    type="number"
                    value={settings.defaultInvestment}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultInvestment: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoRebalance">Auto-Rebalancing</Label>
                  <p className="text-sm text-muted-foreground">Automatically rebalance portfolio monthly</p>
                </div>
                <Switch
                  id="autoRebalance"
                  checked={settings.autoRebalance}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoRebalance: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <CardTitle>Account Actions</CardTitle>
              </div>
              <CardDescription>Manage your account and get help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/help">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                </Link>
                
                <Link href="/privacy-policy">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                </Link>
              </div>
              
              <Separator />
              
              <Button variant="destructive" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}