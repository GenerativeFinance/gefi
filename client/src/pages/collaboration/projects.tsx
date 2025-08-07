import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Settings,
  MessageCircle,
  FileText
} from "lucide-react";

export default function CollaborationProjects() {
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [manageProjectOpen, setManageProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();

  const projects = [
    {
      id: 1,
      name: "AI Trading Algorithm Development",
      description: "Collaborative development of advanced trading algorithms using machine learning",
      participants: 12,
      progress: 75,
      status: "active",
      deadline: "2025-08-15",
      budget: "$250,000",
      lead: "Sarah Chen"
    },
    {
      id: 2,
      name: "ESG Scoring Model",
      description: "Building comprehensive ESG scoring models for sustainable investing",
      participants: 8,
      progress: 45,
      status: "active",
      deadline: "2025-09-30",
      budget: "$150,000",
      lead: "Marcus Chen"
    },
    {
      id: 3,
      name: "Risk Assessment Framework",
      description: "Developing next-generation risk assessment tools for portfolio management",
      participants: 15,
      progress: 90,
      status: "review",
      deadline: "2025-07-20",
      budget: "$300,000",
      lead: "Elena Rodriguez"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateProject = () => {
    toast({
      title: "Project Created",
      description: "Your new collaboration project has been created successfully.",
    });
    setNewProjectOpen(false);
  };

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setViewDetailsOpen(true);
  };

  const handleManageProject = (project: any) => {
    setSelectedProject(project);
    setManageProjectOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collaboration Projects</h1>
            <p className="text-muted-foreground">
              Manage and track collaborative investment projects
            </p>
          </div>
          <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Collaboration Project</DialogTitle>
                <DialogDescription>
                  Start a new collaborative investment project and invite team members.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" placeholder="Enter project name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea id="project-description" placeholder="Describe your project goals and strategy" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-budget">Budget</Label>
                    <Input id="project-budget" placeholder="$100,000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-deadline">Deadline</Label>
                    <Input id="project-deadline" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-trading">AI Trading</SelectItem>
                      <SelectItem value="risk-management">Risk Management</SelectItem>
                      <SelectItem value="esg-investing">ESG Investing</SelectItem>
                      <SelectItem value="defi">DeFi Development</SelectItem>
                      <SelectItem value="quantitative">Quantitative Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="team-size">Expected Team Size</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">3-5 members</SelectItem>
                      <SelectItem value="10">6-10 members</SelectItem>
                      <SelectItem value="15">11-15 members</SelectItem>
                      <SelectItem value="20">16+ members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Investment</p>
                  <p className="text-2xl font-bold">$700K</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Participants</p>
                  <p className="text-2xl font-bold">35</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {project.participants} participants
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due {project.deadline}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{project.budget}</p>
                    <p className="text-sm text-muted-foreground">Budget</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Project Lead: {project.lead}</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(project)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleManageProject(project)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View Details Dialog */}
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
              <DialogDescription>
                {selectedProject ? `Detailed information about ${selectedProject.name}` : "Project information"}
              </DialogDescription>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Project Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(selectedProject.status)}>
                          {selectedProject.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">{selectedProject.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium">{selectedProject.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Lead:</span>
                        <span className="font-medium">{selectedProject.lead}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Progress & Metrics</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Progress</span>
                          <span>{selectedProject.progress}%</span>
                        </div>
                        <Progress value={selectedProject.progress} className="h-2" />
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{selectedProject.participants}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Project milestone completed</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>New team member added</span>
                      <span className="text-muted-foreground">1 week ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Budget review completed</span>
                      <span className="text-muted-foreground">2 weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setViewDetailsOpen(false);
                handleManageProject(selectedProject);
              }}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Project Dialog */}
        <Dialog open={manageProjectOpen} onOpenChange={setManageProjectOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Manage Project</DialogTitle>
              <DialogDescription>
                {selectedProject ? `Manage ${selectedProject.name} settings and team` : "Project management"}
              </DialogDescription>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Project Settings</h3>
                    <div className="space-y-3">
                      <div className="grid gap-2">
                        <Label htmlFor="manage-name">Project Name</Label>
                        <Input id="manage-name" defaultValue={selectedProject.name} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="manage-budget">Budget</Label>
                        <Input id="manage-budget" defaultValue={selectedProject.budget} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="manage-deadline">Deadline</Label>
                        <Input id="manage-deadline" type="date" defaultValue="2025-08-15" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="manage-status">Status</Label>
                        <Select defaultValue={selectedProject.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="review">Under Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Team Management</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="text-sm font-medium mb-2">Current Team ({selectedProject.participants} members)</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{selectedProject.lead} (Lead)</span>
                            <Button variant="ghost" size="sm">Remove</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">John Smith (Developer)</span>
                            <Button variant="ghost" size="sm">Remove</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Emily Chen (Analyst)</span>
                            <Button variant="ghost" size="sm">Remove</Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Invite Team Member
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Communications</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Team
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Send Update
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setManageProjectOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Project Updated",
                  description: "Project settings have been saved successfully.",
                });
                setManageProjectOpen(false);
              }}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}