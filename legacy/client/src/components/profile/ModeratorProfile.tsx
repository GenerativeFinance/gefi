import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  MessageSquare, 
  Flag, 
  Star, 
  Activity, 
  Settings,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Scale,
  FileText,
  Gavel,
  BookOpen,
  UserCheck,
  Calendar,
  ExternalLink,
  Download,
  Filter,
  Search,
  MoreHorizontal
} from "lucide-react";

interface ModeratorProfileProps {
  moderatorId: string;
  data?: any;
}

export default function ModeratorProfile({ moderatorId, data }: ModeratorProfileProps) {
  // Mock data for moderator profile
  const moderatorData = {
    id: moderatorId,
    name: moderatorId === 'community-mod' ? 'Jordan Smith' : 'Riley Chen',
    pseudonym: moderatorId === 'community-mod' ? '@CommunityGuardian' : '@FairPlay',
    avatar: `/avatars/${moderatorId}.png`,
    verified: true,
    joinedDate: '2024-03-20',
    lastActive: '30 minutes ago',
    
    // Core Moderator Fields
    moderationScope: [
      'Community Forums',
      'Bounty Disputes',
      'Funding Process',
      'User Reports',
      'Content Review',
      'Dispute Resolution'
    ],
    
    activeCases: [
      {
        id: 1,
        type: 'Bounty Dispute',
        title: 'Payment disagreement for AI Risk Model',
        parties: ['developer-alex', 'investor-quantum'],
        priority: 'High',
        status: 'In Progress',
        created: '2025-07-14',
        deadline: '2025-07-18'
      },
      {
        id: 2,
        type: 'Content Report',
        title: 'Inappropriate model description',
        parties: ['reporter-anonymous', 'developer-sarah'],
        priority: 'Medium',
        status: 'Under Review',
        created: '2025-07-13',
        deadline: '2025-07-17'
      },
      {
        id: 3,
        type: 'Funding Dispute',
        title: 'Milestone completion disagreement',
        parties: ['startup-finai', 'investor-group'],
        priority: 'High',
        status: 'Escalated',
        created: '2025-07-12',
        deadline: '2025-07-16'
      }
    ],

    disputesResolved: [
      {
        id: 1,
        type: 'Bounty Payment',
        title: 'Late payment for market prediction model',
        resolution: 'Mediated payment schedule agreement',
        resolvedDate: '2025-07-10',
        satisfactionRating: 4.5,
        outcome: 'Successful'
      },
      {
        id: 2,
        type: 'Content Violation',
        title: 'Spam posts in developer forum',
        resolution: 'User warned and posts removed',
        resolvedDate: '2025-07-08',
        satisfactionRating: 4.8,
        outcome: 'Successful'
      },
      {
        id: 3,
        type: 'Funding Disagreement',
        title: 'Intellectual property dispute',
        resolution: 'Referred to legal arbitration',
        resolvedDate: '2025-07-05',
        satisfactionRating: 4.0,
        outcome: 'Escalated'
      }
    ],

    flagsHandled: [
      {
        id: 1,
        type: 'Spam',
        content: 'Promotional post in technical forum',
        action: 'Removed',
        date: '2025-07-15',
        reporterId: 'user-12345'
      },
      {
        id: 2,
        type: 'Harassment',
        content: 'Inappropriate comments toward developer',
        action: 'User Warning',
        date: '2025-07-14',
        reporterId: 'developer-sarah'
      },
      {
        id: 3,
        type: 'Fraud',
        content: 'Suspicious AI model performance claims',
        action: 'Under Investigation',
        date: '2025-07-13',
        reporterId: 'investor-quantum'
      }
    ],

    reputation: {
      score: 4.7,
      totalReviews: 89,
      responseTime: '2.3 hours',
      resolutionRate: '94%',
      satisfactionRate: '96%'
    },

    communicationLog: [
      {
        id: 1,
        type: 'Warning',
        recipient: 'user-trader123',
        subject: 'Community Guidelines Violation',
        date: '2025-07-15',
        status: 'Sent'
      },
      {
        id: 2,
        type: 'Resolution',
        recipient: 'developer-alex',
        subject: 'Bounty Dispute Resolution',
        date: '2025-07-14',
        status: 'Acknowledged'
      },
      {
        id: 3,
        type: 'Inquiry',
        recipient: 'investor-quantum',
        subject: 'Evidence Request for Dispute',
        date: '2025-07-13',
        status: 'Pending Response'
      }
    ],

    moderatorNotes: [
      {
        id: 1,
        type: 'Private',
        content: 'User shows repeated pattern of aggressive behavior in forums',
        subject: 'user-trader123',
        date: '2025-07-15',
        visibility: 'Private'
      },
      {
        id: 2,
        type: 'Public',
        content: 'Excellent developer with strong community engagement',
        subject: 'developer-alex',
        date: '2025-07-14',
        visibility: 'Public'
      },
      {
        id: 3,
        type: 'Internal',
        content: 'Complex IP dispute requiring legal consultation',
        subject: 'case-funding-dispute-003',
        date: '2025-07-13',
        visibility: 'Internal'
      }
    ],

    // Optional Moderator Fields
    conflictInterests: [
      {
        id: 1,
        type: 'Financial',
        description: 'No financial interests in moderated entities',
        declared: '2025-01-15',
        status: 'Clear'
      },
      {
        id: 2,
        type: 'Personal',
        description: 'No personal relationships with active users',
        declared: '2025-01-15',
        status: 'Clear'
      },
      {
        id: 3,
        type: 'Professional',
        description: 'Former employee of TechCorp (not active on platform)',
        declared: '2025-01-15',
        status: 'Disclosed'
      }
    ],

    moderationGuidelines: [
      {
        id: 1,
        title: 'Community Standards Enforcement',
        category: 'Content Moderation',
        lastUpdated: '2025-07-01',
        casesApplied: 23
      },
      {
        id: 2,
        title: 'Dispute Resolution Process',
        category: 'Conflict Resolution',
        lastUpdated: '2025-06-15',
        casesApplied: 15
      },
      {
        id: 3,
        title: 'Escalation Procedures',
        category: 'Case Management',
        lastUpdated: '2025-06-01',
        casesApplied: 8
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-purple-100 text-purple-800';
      case 'Escalated': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Removed': return 'bg-red-100 text-red-800';
      case 'User Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Under Investigation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={moderatorData.avatar} />
                <AvatarFallback className="text-lg font-semibold">
                  {moderatorData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {moderatorData.name}
                  </h1>
                  <span className="text-lg text-gray-500">{moderatorData.pseudonym}</span>
                  {moderatorData.verified && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Moderator
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{moderatorData.reputation.score}/5.0</span>
                  <span className="text-sm text-gray-500">({moderatorData.reputation.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {moderatorData.joinedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    Active {moderatorData.lastActive}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Moderation Scope & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Moderation Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {moderatorData.moderationScope.map((scope, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{scope}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resolution Rate</span>
                  <Badge className="bg-green-100 text-green-800">{moderatorData.reputation.resolutionRate}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Satisfaction Rate</span>
                  <Badge className="bg-blue-100 text-blue-800">{moderatorData.reputation.satisfactionRate}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium">{moderatorData.reputation.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Cases</span>
                  <Badge className="bg-orange-100 text-orange-800">{moderatorData.activeCases.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {moderatorData.flagsHandled.slice(0, 3).map((flag) => (
                  <div key={flag.id} className="p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{flag.type}</span>
                      <Badge className={getActionColor(flag.action)} variant="outline">
                        {flag.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{flag.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{flag.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="cases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cases">Active Cases</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-orange-600" />
                  Active Cases & Disputes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moderatorData.activeCases.map((case_) => (
                    <div key={case_.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{case_.title}</h4>
                          <p className="text-sm text-gray-600">Type: {case_.type}</p>
                          <p className="text-sm text-gray-600">Parties: {case_.parties.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(case_.priority)}>
                            {case_.priority}
                          </Badge>
                          <Badge className={getStatusColor(case_.status)}>
                            {case_.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Created: {case_.created}</span>
                          <span>Deadline: {case_.deadline}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Resolved Disputes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moderatorData.disputesResolved.map((dispute) => (
                    <div key={dispute.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{dispute.title}</h4>
                          <p className="text-sm text-gray-600">Type: {dispute.type}</p>
                          <p className="text-sm text-gray-700 mt-2">{dispute.resolution}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={dispute.outcome === 'Successful' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                            {dispute.outcome}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Resolved: {dispute.resolvedDate}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{dispute.satisfactionRating}/5.0</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          View Case
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Communication Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moderatorData.communicationLog.map((comm) => (
                    <div key={comm.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${comm.type === 'Warning' ? 'bg-red-500' : comm.type === 'Resolution' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <div>
                          <p className="font-medium text-sm">{comm.subject}</p>
                          <p className="text-xs text-gray-600">To: {comm.recipient}</p>
                          <p className="text-xs text-gray-500">Type: {comm.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={comm.status === 'Sent' ? 'bg-green-100 text-green-800' : comm.status === 'Acknowledged' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>
                          {comm.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{comm.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Moderator Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moderatorData.moderatorNotes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-sm">Subject: {note.subject}</h5>
                          <p className="text-xs text-gray-500">{note.date}</p>
                        </div>
                        <Badge className={note.visibility === 'Private' ? 'bg-red-100 text-red-800' : note.visibility === 'Public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {note.visibility}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Moderation Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {moderatorData.moderationGuidelines.map((guideline) => (
                      <div key={guideline.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-medium text-sm">{guideline.title}</h5>
                            <p className="text-xs text-gray-600">{guideline.category}</p>
                          </div>
                          <Badge variant="outline">
                            {guideline.casesApplied} cases
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">Last updated: {guideline.lastUpdated}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    Conflict of Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {moderatorData.conflictInterests.map((conflict) => (
                      <div key={conflict.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-medium text-sm">{conflict.type}</h5>
                            <p className="text-xs text-gray-600">{conflict.description}</p>
                          </div>
                          <Badge className={conflict.status === 'Clear' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {conflict.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">Declared: {conflict.declared}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}