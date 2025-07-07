import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, Eye, Settings, Plus, Search } from "lucide-react";

export default function UserAccess() {
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2 hours ago",
      permissions: ["Full Access", "User Management", "Billing"]
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      role: "Developer",
      status: "Active",
      lastLogin: "1 day ago",
      permissions: ["Model Access", "API Access", "Reports"]
    },
    {
      id: 3,
      name: "Emma Williams",
      email: "emma.williams@example.com",
      role: "Analyst",
      status: "Pending",
      lastLogin: "Never",
      permissions: ["Read Only", "Basic Reports"]
    }
  ];

  const roles = [
    {
      name: "Admin",
      users: 2,
      description: "Full platform access and user management"
    },
    {
      name: "Developer",
      users: 5,
      description: "AI model development and deployment"
    },
    {
      name: "Analyst",
      users: 8,
      description: "Data analysis and reporting access"
    },
    {
      name: "Viewer",
      users: 12,
      description: "Read-only access to reports and dashboards"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Access Management</h1>
            <p className="text-muted-foreground">
              Manage user permissions and access controls across the platform
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Search users..."
              className="w-80"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage user access and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground">Last login: {user.lastLogin}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                        <Badge variant="outline">{user.role}</Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roles & Permissions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>Manage access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.map((role, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{role.name}</h3>
                        <Badge variant="secondary">{role.users} users</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Badge variant="default">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout</span>
                    <span className="text-sm text-muted-foreground">24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Password Policy</span>
                    <Badge variant="default">Enforced</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-1" />
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}