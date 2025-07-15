import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Star, 
  Code, 
  Database, 
  Share2, 
  FileText, 
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function DeveloperCollaboration() {
  const [activeTab, setActiveTab] = useState("projects");
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample collaboration data
  const collaborationProjects = [
    {
      id: 1,
      title: "High-Frequency Trading Algorithm",
      description: "Building an advanced HFT system with machine learning optimization for cryptocurrency markets.",
      status: "active",
      progress: 75,
      participants: 4,
      leader: "Alex Chen",
      budget: "$150,000",
      deadline: "2025-09-15",
      tags: ["Trading", "ML", "Crypto"],
      participants_list: [
        { name: "Alex Chen", avatar: "AC", role: "Lead Developer" },
        { name: "Sarah Johnson", avatar: "SJ", role: "Data Scientist" },
        { name: "Mike Rodriguez", avatar: "MR", role: "Quant Analyst" },
        { name: "You", avatar: "YU", role: "AI Engineer" }
      ]
    },
    {
      id: 2,
      title: "ESG Risk Assessment Model",
      description: "Developing comprehensive ESG scoring system for institutional investment decision-making.",
      status: "planning",
      progress: 25,
      participants: 3,
      leader: "Emma Watson",
      budget: "$85,000",
      deadline: "2025-11-30",
      tags: ["ESG", "Risk", "Compliance"],
      participants_list: [
        { name: "Emma Watson", avatar: "EW", role: "Project Lead" },
        { name: "David Kim", avatar: "DK", role: "Risk Analyst" },
        { name: "You", avatar: "YU", role: "ML Engineer" }
      ]
    },
    {
      id: 3,
      title: "DeFi Yield Optimization",
      description: "Smart contract system for automated yield farming with risk management across multiple protocols.",
      status: "completed",
      progress: 100,
      participants: 5,
      leader: "Carlos Martinez",
      budget: "$200,000",
      deadline: "2025-06-30",
      tags: ["DeFi", "Smart Contracts", "Yield"],
      participants_list: [
        { name: "Carlos Martinez", avatar: "CM", role: "Blockchain Lead" },
        { name: "Lisa Zhang", avatar: "LZ", role: "Smart Contract Dev" },
        { name: "Tom Wilson", avatar: "TW", role: "Frontend Dev" },
        { name: "Nina Patel", avatar: "NP", role: "Security Auditor" },
        { name: "You", avatar: "YU", role: "DeFi Specialist" }
      ]
    }
  ];

  const availableProjects = [
    {
      id: 4,
      title: "Cross-Chain Arbitrage Bot",
      description: "Automated arbitrage opportunities across different blockchain networks with minimal latency.",
      budget: "$120,000",
      duration: "4 months",
      skills: ["Blockchain", "Arbitrage", "Python", "Web3"],
      postedBy: "BlockTech Solutions",
      applicants: 12
    },
    {
      id: 5,
      title: "Credit Scoring AI for Microfinance",
      description: "Machine learning model for credit assessment in emerging markets using alternative data sources.",
      budget: "$95,000",
      duration: "6 months",
      skills: ["Credit Analysis", "ML", "Alternative Data"],
      postedBy: "MicroFin Global",
      applicants: 8
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Alex Chen",
      avatar: "AC",
      role: "Senior AI Engineer",
      specialties: ["Machine Learning", "Trading Algorithms", "Python"],
      rating: 4.9,
      projects: 15,
      location: "San Francisco, CA",
      status: "Available"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "SJ",
      role: "Data Scientist",
      specialties: ["Statistical Analysis", "Risk Modeling", "R"],
      rating: 4.8,
      projects: 12,
      location: "New York, NY",
      status: "Busy"
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      avatar: "MR",
      role: "Quantitative Analyst",
      specialties: ["Financial Modeling", "Derivatives", "C++"],
      rating: 4.7,
      projects: 18,
      location: "London, UK",
      status: "Available"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "planning": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Busy": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Developer Collaboration</h1>
            <p className="text-muted-foreground">Connect with developers, join projects, and build innovative AI financial solutions together.</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Collaboration Project</DialogTitle>
                  <DialogDescription>
                    Start a new project and invite other developers to collaborate.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input id="project-title" placeholder="Enter project title" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea id="project-description" placeholder="Describe your project goals and requirements" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input id="budget" placeholder="$50,000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input id="deadline" type="date" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="skills">Required Skills</Label>
                    <Input id="skills" placeholder="Python, Machine Learning, Trading" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="team-size">Team Size</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-3">2-3 developers</SelectItem>
                        <SelectItem value="4-6">4-6 developers</SelectItem>
                        <SelectItem value="7-10">7-10 developers</SelectItem>
                        <SelectItem value="10+">10+ developers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
                  <Button onClick={() => setNewProjectOpen(false)}>Create Project</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Team
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="team">Team Network</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="grid gap-6">
              {collaborationProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{project.title}</CardTitle>
                          <Badge variant="outline" className={`${getStatusColor(project.status)} text-white`}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">{project.description}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{project.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{project.participants} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>Led by {project.leader}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {project.participants_list.map((participant, idx) => (
                            <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="text-xs">{participant.avatar}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                          <Button variant="outline" size="sm">
                            <GitBranch className="h-4 w-4 mr-1" />
                            Repository
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid gap-6">
              {availableProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                        <CardDescription className="text-base">{project.description}</CardDescription>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{project.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{project.applicants} applicants</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span>{project.postedBy}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="text-lg">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusBadge(member.status)}>
                          {member.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{member.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Projects:</span>
                        <span>{member.projects}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <p>{member.location}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Specialties:</span>
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Users className="h-4 w-4 mr-1" />
                          Invite
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Stay connected with your collaboration teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { sender: "Alex Chen", message: "Ready to start the testing phase of the HFT algorithm?", time: "2 hours ago", unread: true },
                    { sender: "Emma Watson", message: "Updated the ESG scoring methodology document", time: "5 hours ago", unread: true },
                    { sender: "Sarah Johnson", message: "The backtesting results look promising!", time: "1 day ago", unread: false },
                    { sender: "Mike Rodriguez", message: "Can we schedule a code review session?", time: "2 days ago", unread: false }
                  ].map((msg, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${msg.unread ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : 'bg-background'}`}>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{msg.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium">{msg.sender}</h4>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </div>
                      {msg.unread && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline">View All Messages</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}