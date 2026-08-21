import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import {
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  Phone,
  Video,
  Mail,
  TrendingUp,
  Handshake,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Send
} from "lucide-react";

export default function DeveloperCollaborationInvestorInteractions() {
  const [isNewInteractionOpen, setIsNewInteractionOpen] = useState(false);

  // Sample investor interactions data
  const investorInteractions = [
    {
      id: 1,
      investorName: "Sarah Chen",
      investorTitle: "Senior Portfolio Manager",
      company: "TechVenture Capital",
      avatar: "/api/placeholder/40/40",
      initialContact: "July 12, 2025",
      lastInteraction: "July 14, 2025",
      interactionType: "Funding Discussion",
      status: "Active",
      fundingAmount: "$75,000",
      modelsFocused: ["AI Trading Bot Alpha", "DeFi Prediction Model"],
      nextMeeting: "July 18, 2025",
      priority: "High",
      notes: "Interested in scaling bot for institutional use. Requested backtesting data for Q2 2025.",
      communicationHistory: [
        {
          date: "July 14, 2025",
          type: "email",
          subject: "Backtesting Results Review",
          summary: "Shared Q2 performance metrics and discussed scaling opportunities"
        },
        {
          date: "July 12, 2025",
          type: "video-call",
          subject: "Initial Funding Meeting",
          summary: "Presented AI Trading Bot Alpha, discussed funding requirements"
        }
      ]
    },
    {
      id: 2,
      investorName: "Michael Rodriguez",
      investorTitle: "Investment Director",
      company: "Alpha Fund Management",
      avatar: "/api/placeholder/40/40",
      initialContact: "June 28, 2025",
      lastInteraction: "July 10, 2025",
      interactionType: "Partnership Discussion",
      status: "In Review",
      fundingAmount: "$150,000",
      modelsFocused: ["Macro Trading Strategy", "Risk Assessment Model"],
      nextMeeting: "July 20, 2025",
      priority: "Medium",
      notes: "Evaluating strategic partnership for European market expansion. Due diligence in progress.",
      communicationHistory: [
        {
          date: "July 10, 2025",
          type: "phone",
          subject: "Due Diligence Follow-up",
          summary: "Provided additional documentation, discussed compliance requirements"
        },
        {
          date: "July 3, 2025",
          type: "meeting",
          subject: "Partnership Proposal",
          summary: "Outlined partnership structure and revenue sharing model"
        }
      ]
    },
    {
      id: 3,
      investorName: "Emily Watson",
      investorTitle: "Head of AI Investments",
      company: "Future Capital Partners",
      avatar: "/api/placeholder/40/40",
      initialContact: "May 15, 2025",
      lastInteraction: "July 8, 2025",
      interactionType: "Strategic Advisory",
      status: "Completed",
      fundingAmount: "$50,000",
      modelsFocused: ["P2P Risk Assessment"],
      nextMeeting: "N/A",
      priority: "Low",
      notes: "Successful investment completed. Ongoing advisory role for product development.",
      communicationHistory: [
        {
          date: "July 8, 2025",
          type: "email",
          subject: "Monthly Progress Update",
          summary: "Shared monthly performance report and roadmap updates"
        },
        {
          date: "June 20, 2025",
          type: "meeting",
          subject: "Investment Completion",
          summary: "Finalized investment terms and signed agreements"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500 text-white";
      case "In Review": return "bg-yellow-500 text-white";
      case "Completed": return "bg-blue-500 text-white";
      case "On Hold": return "bg-gray-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "video-call": return <Video className="h-4 w-4" />;
      case "phone": return <Phone className="h-4 w-4" />;
      case "meeting": return <Users className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Investor Interactions</h1>
            <p className="text-muted-foreground">Manage communications and relationships with potential and current investors</p>
          </div>
          <Dialog open={isNewInteractionOpen} onOpenChange={setIsNewInteractionOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Log New Interaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Log New Investor Interaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Investor Name</label>
                    <input className="w-full p-2 border rounded-md" placeholder="Enter investor name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <input className="w-full p-2 border rounded-md" placeholder="Enter company name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interaction Summary</label>
                  <Textarea 
                    placeholder="Summarize the key points discussed..."
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewInteractionOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsNewInteractionOpen(false)}>
                    <Send className="h-4 w-4 mr-2" />
                    Save Interaction
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Investors</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                  <p className="text-2xl font-bold text-green-600">$275K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">75%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investor Interactions */}
        <div className="space-y-6">
          {investorInteractions.map((interaction) => (
            <Card key={interaction.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={interaction.avatar} />
                      <AvatarFallback>{interaction.investorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{interaction.investorName}</CardTitle>
                      <p className="text-muted-foreground">{interaction.investorTitle}</p>
                      <p className="text-sm text-muted-foreground">{interaction.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(interaction.priority)} border`}>
                      {interaction.priority} Priority
                    </Badge>
                    <Badge className={getStatusColor(interaction.status)}>
                      {interaction.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Funding Amount</p>
                    <p className="text-lg font-bold text-green-600">{interaction.fundingAmount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Interaction Type</p>
                    <p className="font-medium">{interaction.interactionType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Next Meeting</p>
                    <p className="font-medium">{interaction.nextMeeting}</p>
                  </div>
                </div>

                {/* Models of Interest */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Models of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {interaction.modelsFocused.map((model, index) => (
                      <Badge key={index} variant="secondary">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Recent Notes</p>
                  <p className="text-sm text-muted-foreground">{interaction.notes}</p>
                </div>

                {/* Communication History */}
                <div>
                  <p className="text-sm font-medium mb-3">Recent Communications</p>
                  <div className="space-y-2">
                    {interaction.communicationHistory.map((comm, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="p-2 bg-muted rounded-lg">
                          {getCommunicationIcon(comm.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{comm.subject}</p>
                            <span className="text-sm text-muted-foreground">{comm.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{comm.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    SC
                  </div>
                  <div>
                    <p className="font-medium">Sarah Chen - TechVenture Capital</p>
                    <p className="text-sm text-muted-foreground">Follow-up on scaling opportunities</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">July 18, 2025</p>
                  <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                    MR
                  </div>
                  <div>
                    <p className="font-medium">Michael Rodriguez - Alpha Fund Management</p>
                    <p className="text-sm text-muted-foreground">Partnership evaluation meeting</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">July 20, 2025</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - 11:30 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}