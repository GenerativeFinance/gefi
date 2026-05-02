import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Star,
  MessageCircle,
  TrendingUp,
  Plus,
  Crown,
  Shield
} from "lucide-react";

export default function CollaborationTeams() {
  const teams = [
    {
      id: 1,
      name: "AI Trading Pioneers",
      description: "Expert team focused on cutting-edge AI trading algorithms",
      members: [
        { name: "Sarah Chen", role: "Lead Developer", avatar: "/api/placeholder/32/32", online: true },
        { name: "Mike Johnson", role: "Data Scientist", avatar: "/api/placeholder/32/32", online: false },
        { name: "Elena Rodriguez", role: "Quantitative Analyst", avatar: "/api/placeholder/32/32", online: true }
      ],
      totalMembers: 24,
      performance: "92%",
      activeProjects: 3,
      status: "active"
    },
    {
      id: 2,
      name: "ESG Investment Collective",
      description: "Sustainable finance and ESG-focused investment team",
      members: [
        { name: "Marcus Chen", role: "Team Lead", avatar: "/api/placeholder/32/32", online: true },
        { name: "Lisa Wang", role: "ESG Analyst", avatar: "/api/placeholder/32/32", online: true },
        { name: "David Park", role: "Risk Manager", avatar: "/api/placeholder/32/32", online: false }
      ],
      totalMembers: 18,
      performance: "88%",
      activeProjects: 2,
      status: "active"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Collaboration Teams</h1>
            <p className="text-muted-foreground">
              Connect with investment teams and experts
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Join Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Teams</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Performance</p>
                  <p className="text-2xl font-bold">90%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        {team.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{team.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{team.performance}</p>
                    <p className="text-sm text-muted-foreground">Performance</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Key Members</span>
                    <span className="text-sm text-muted-foreground">{team.totalMembers} total members</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {team.members.map((member, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{team.activeProjects}</p>
                      <p className="text-xs text-muted-foreground">Active Projects</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold">{team.performance}</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message Team
                    </Button>
                    <Button className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}