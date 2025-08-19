import React, { useState, useEffect, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Shield, Eye, Settings, Plus, Search, X, Mail, UserPlus } from "lucide-react";

export default function UserAccess() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteSearchQuery, setInviteSearchQuery] = useState("");
  const [inviteSearchResults, setInviteSearchResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
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
  ]);
  
  const { toast } = useToast();

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

  // Debounced search for invite modal
  useEffect(() => {
    if (!inviteSearchQuery.trim()) {
      setInviteSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Try primary search endpoint
        let response = await fetch(`/api/search?q=${encodeURIComponent(inviteSearchQuery)}&type=user`);
        if (!response.ok) {
          // Fallback to secondary endpoint
          response = await fetch(`/api/search?q=${encodeURIComponent(inviteSearchQuery)}&types=users`);
        }
        
        if (response.ok) {
          const data = await response.json();
          const users = data.results?.users || data.users || [];
          setInviteSearchResults(users);
        } else {
          setInviteSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setInviteSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inviteSearchQuery]);

  // Filter team members based on search and role
  const filteredTeamMembers = useMemo(() => {
    return teamMembers.filter(user => {
      const matchesSearch = !searchQuery.trim() || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = selectedRole === "all" || 
        user.role.toLowerCase() === selectedRole.toLowerCase();
      
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchQuery, selectedRole]);

  // Check if search query is a valid email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle user selection in invite modal
  const handleSelectUser = (user: any) => {
    if (!selectedUsers.find(u => u.id === user.id || u.email === user.email)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Handle removing selected user
  const handleRemoveSelectedUser = (userToRemove: any) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userToRemove.id && u.email !== userToRemove.email));
  };

  // Handle inviting users by email
  const handleInviteByEmail = () => {
    if (isValidEmail(inviteSearchQuery)) {
      const emailUser = {
        id: `email_${Date.now()}`,
        name: inviteSearchQuery,
        email: inviteSearchQuery,
        isEmailInvite: true
      };
      handleSelectUser(emailUser);
      setInviteSearchQuery("");
    }
  };

  // Add selected users to team
  const handleAddToTeam = () => {
    const newMembers = selectedUsers.map(user => ({
      id: user.id || `new_${Date.now()}_${Math.random()}`,
      name: user.name || user.email,
      email: user.email,
      role: "Viewer",
      status: "Pending",
      lastLogin: "Never",
      permissions: ["Read Only"]
    }));

    setTeamMembers([...teamMembers, ...newMembers]);
    setSelectedUsers([]);
    setInviteModalOpen(false);
    setInviteSearchQuery("");
    
    toast({
      title: "Users invited",
      description: `${newMembers.length} user(s) have been invited to the team.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mobile-content-padding">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mobile-heading">User Access Management</h1>
            <p className="text-muted-foreground mobile-body-text">
              Manage user permissions and access controls across the platform
            </p>
          </div>
          <Button 
            onClick={() => setInviteModalOpen(true)}
            className="mobile-button mobile-touch-target w-full lg:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="mobile-search-container lg:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
          </div>
        </div>

        {/* Mobile Filter */}
        <div className="mobile-filter-container lg:hidden mb-6">
          <div 
            className={`mobile-filter-pill ${selectedRole === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedRole('all')}
          >
            All Roles
          </div>
          <div 
            className={`mobile-filter-pill ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            Admin
          </div>
          <div 
            className={`mobile-filter-pill ${selectedRole === 'developer' ? 'active' : ''}`}
            onClick={() => setSelectedRole('developer')}
          >
            Developer
          </div>
          <div 
            className={`mobile-filter-pill ${selectedRole === 'analyst' ? 'active' : ''}`}
            onClick={() => setSelectedRole('analyst')}
          >
            Analyst
          </div>
          <div 
            className={`mobile-filter-pill ${selectedRole === 'viewer' ? 'active' : ''}`}
            onClick={() => setSelectedRole('viewer')}
          >
            Viewer
          </div>
        </div>

        {/* Desktop Search and Filter */}
        <div className="hidden lg:flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Input
              placeholder="Search users..."
              className="w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* User List */}
          <div className="lg:col-span-2">
            <Card className="mobile-card">
              <CardHeader className="pb-4">
                <CardTitle className="mobile-subheading">Team Members</CardTitle>
                <CardDescription className="mobile-body-text">Manage user access and permissions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredTeamMembers.length === 0 ? (
                    <div className="text-center py-8 px-4 text-muted-foreground mobile-body-text">
                      {searchQuery.trim() || selectedRole !== "all" ? 
                        "No users match your search criteria." : 
                        "No team members found."
                      }
                    </div>
                  ) : (
                    filteredTeamMembers.map((user) => (
                      <div key={user.id} className="mobile-list-item flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium mobile-body-text truncate">{user.name}</div>
                            {user.email && (
                              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                            )}
                            <div className="text-xs text-muted-foreground">Last login: {user.lastLogin}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:space-x-2 sm:gap-0">
                          <Badge 
                            variant={user.status === "Active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {user.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{user.role}</Badge>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mobile-touch-target h-8 w-8 p-0"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roles & Permissions */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="mobile-card">
              <CardHeader className="pb-4">
                <CardTitle className="mobile-subheading">Roles & Permissions</CardTitle>
                <CardDescription className="mobile-body-text">Manage access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {roles.map((role, index) => (
                    <div key={index} className="p-3 border rounded-lg mobile-item-spacing">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h3 className="font-medium mobile-body-text">{role.name}</h3>
                        <Badge variant="secondary" className="text-xs self-start sm:self-center">{role.users} users</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                      <Button variant="outline" size="sm" className="w-full mobile-button-small mobile-touch-target">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mobile-card">
              <CardHeader className="pb-4">
                <CardTitle className="mobile-subheading">Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm mobile-body-text">Two-Factor Authentication</span>
                    <Badge variant="default" className="text-xs">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm mobile-body-text">Session Timeout</span>
                    <span className="text-sm text-muted-foreground">24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm mobile-body-text">Password Policy</span>
                    <Badge variant="default" className="text-xs">Enforced</Badge>
                  </div>
                  <Button variant="outline" className="w-full mobile-button mobile-touch-target">
                    <Shield className="h-4 w-4 mr-1" />
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invite User Modal */}
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Invite User
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="invite-search">Search for users</Label>
                <Input
                  id="invite-search"
                  placeholder="Search by email, username, or name..."
                  value={inviteSearchQuery}
                  onChange={(e) => setInviteSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Users</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id || user.email}
                        className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{user.name || user.email}</span>
                        <button
                          onClick={() => handleRemoveSelectedUser(user)}
                          className="hover:bg-primary/20 rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="space-y-2">
                {isSearching && (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                  </div>
                )}

                {!isSearching && inviteSearchQuery.trim() && (
                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    {inviteSearchResults.length > 0 ? (
                      <div className="p-2">
                        <p className="text-sm font-medium mb-2">Search Results</p>
                        {inviteSearchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
                            onClick={() => handleSelectUser(user)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Select
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-3">No users found</p>
                        {isValidEmail(inviteSearchQuery) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleInviteByEmail}
                            className="gap-2"
                          >
                            <Mail className="h-4 w-4" />
                            Invite {inviteSearchQuery}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setInviteModalOpen(false);
                    setSelectedUsers([]);
                    setInviteSearchQuery("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToTeam}
                  disabled={selectedUsers.length === 0}
                >
                  Add to Team ({selectedUsers.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}