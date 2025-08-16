import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Search,
  Eye,
  Edit,
  Flag,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  Activity
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  status: 'active' | 'suspended' | 'pending' | 'banned';
  verified: boolean;
  lastLogin: string;
  totalTrades: number;
  joinDate: string;
  riskScore: number;
  complianceStatus: string;
  provider?: string;
  role?: string;
}

export default function AdminUserManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Edit user modal states
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    userType: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch real users from API
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: !!user && (user.role === 'admin' || user.role === 'moderator')
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/admin/users/stats'],
    enabled: !!user && (user.role === 'admin' || user.role === 'moderator')
  });

  // Show access denied if not admin/moderator
  if (user && user.role !== 'admin' && user.role !== 'moderator') {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              You need admin or moderator privileges to access user management.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading users...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Error Loading Users</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              {error instanceof Error ? error.message : 'Failed to load user data'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Status and role update mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      return apiRequest('PUT', `/api/admin/users/${userId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/stats'] });
      toast({ title: "User status updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating user status", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiRequest('PUT', `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/stats'] });
      toast({ title: "User role updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating user role", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    }
  });

  // Available user types for editing
  const userTypes = [
    "Investor",
    "Portfolio Manager", 
    "Fund Manager",
    "Wealth Manager / Financial Advisor",
    "Trader",
    "Analyst (Equity / Credit / Quant)",
    "Risk Manager",
    "Treasury Manager", 
    "Institutional Allocator",
    "Venture Capitalist",
    "Private Equity Partner",
    "Angel Investor",
    "Family Office Representative",
    "Corporate Finance Executive",
    "Developer",
    "Data Provider",
    "Regulator"
  ];

  // Available statuses for editing
  const statusOptions = [
    { value: "active", label: "Active", description: "Currently active" },
    { value: "pending", label: "Pending", description: "Awaiting verification" },
    { value: "suspended", label: "Suspended", description: "Account suspended" },
    { value: "banned", label: "Banned", description: "Account banned" }
  ];

  // Handle edit user action
  const handleEditUser = (userToEdit: UserManagement) => {
    setEditingUser(userToEdit);
    setEditForm({
      status: userToEdit.status,
      userType: userToEdit.userType || userToEdit.role || "Investor",
    });
    setIsEditDialogOpen(true);
  };

  // Handle suspend/unsuspend user action
  const handleSuspendUser = (userToSuspend: UserManagement) => {
    const newStatus = userToSuspend.status === 'suspended' ? 'active' : 'suspended';
    const action = newStatus === 'suspended' ? 'suspend' : 'unsuspend';
    
    updateStatusMutation.mutate({
      userId: userToSuspend.id,
      status: newStatus
    }, {
      onSuccess: () => {
        toast({ 
          title: `User ${action}ed successfully`,
          description: `${userToSuspend.firstName} ${userToSuspend.lastName} has been ${action}ed.`
        });
      }
    });
  };

  // Handle save user changes
  const handleSaveUserChanges = () => {
    if (!editingUser) return;
    
    const promises = [];
    
    // Update status if changed
    if (editForm.status !== editingUser.status) {
      promises.push(
        updateStatusMutation.mutateAsync({
          userId: editingUser.id,
          status: editForm.status
        })
      );
    }
    
    // Update role if changed
    const currentRole = editingUser.userType || editingUser.role || "User";
    const newRole = editForm.userType;
    
    if (newRole !== currentRole) {
      promises.push(
        updateRoleMutation.mutateAsync({
          userId: editingUser.id,
          role: newRole
        })
      );
    }
    
    // Execute all updates
    Promise.all(promises)
      .then(() => {
        setIsEditDialogOpen(false);
        setEditingUser(null);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
    
    // Execute all updates
    Promise.all(promises)
      .then(() => {
        setIsEditDialogOpen(false);
        setEditingUser(null);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  // Helper functions for UI actions
  const handleStatusChange = (userId: string, newStatus: string) => {
    updateStatusMutation.mutate({ userId, status: newStatus });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  // Filter users based on search and filters
  const filteredUsers = (users as UserManagement[]).filter((user) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserFilter = userFilter === "all" || user.userType?.toLowerCase() === userFilter.toLowerCase();
    const matchesStatusFilter = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesUserFilter && matchesStatusFilter;
  });

  // Calculate stats from real data or use API data
  const stats = userStats || {
    total: users.length,
    active: users.filter((u: any) => u.status === 'active').length,
    pending: users.filter((u: any) => u.status === 'pending').length,
    suspended: users.filter((u: any) => u.status === 'suspended').length,
    banned: users.filter((u: any) => u.status === 'banned').length
  };

  // Helper functions for badges
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: { variant: "default", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      pending: { variant: "secondary", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      suspended: { variant: "destructive", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
      banned: { variant: "destructive", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" }
    };
    const config = variants[status] || variants.active;
    return <Badge className={config.color}>{status}</Badge>;
  };

  const getRiskBadge = (score: number) => {
    if (score <= 20) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low Risk</Badge>;
    if (score <= 50) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium Risk</Badge>;
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High Risk</Badge>;
  };

  const getComplianceBadge = (status: string) => {
    const variants: Record<string, any> = {
      compliant: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      under_review: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      high_risk: { color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" }
    };
    const config = variants[status] || variants.compliant;
    return <Badge className={config.color}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-2">Manage and monitor all platform users</p>
            </div>
            <Button className="bg-primary text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || users.length}</div>
                <p className="text-xs text-muted-foreground">All registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.active || users.filter((u: any) => u.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats?.pending || users.filter((u: any) => u.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting verification</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats?.suspended || users.filter((u: any) => u.status === 'suspended').length}
                </div>
                <p className="text-xs text-muted-foreground">Account suspended</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Banned</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats?.banned || users.filter((u: any) => u.status === 'banned').length}
                </div>
                <p className="text-xs text-muted-foreground">Account banned</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search & Filter Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All User Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All User Types</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="data provider">Data Provider</SelectItem>
                    <SelectItem value="regulator">Regulator</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Risk Score</th>
                      <th className="text-left p-4 font-medium">Compliance</th>
                      <th className="text-left p-4 font-medium">Last Login</th>
                      <th className="text-left p-4 font-medium">Activity</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                              {user.provider && (
                                <div className="text-xs text-muted-foreground">
                                  via {user.provider}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{user.userType || user.role || 'User'}</Badge>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="p-4">
                          {getRiskBadge(user.riskScore || 0)}
                        </td>
                        <td className="p-4">
                          {getComplianceBadge(user.complianceStatus || 'compliant')}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Activity className="h-3 w-3 text-muted-foreground" />
                            <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          {user.totalTrades || 0} trades
                          <div className="text-xs text-muted-foreground">
                            Joined {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Unknown'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title="Edit User"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              title={user.status === 'suspended' ? 'Unsuspend User' : 'Suspend User'}
                              onClick={() => handleSuspendUser(user)}
                              className={user.status === 'suspended' ? 'border-orange-500 text-orange-600 hover:bg-orange-50' : 'hover:bg-red-50 hover:border-red-500 hover:text-red-600'}
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user status and type for {editingUser?.firstName} {editingUser?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.status}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{status.label}</span>
                            <span className="text-xs text-muted-foreground">{status.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userType" className="text-right">
                  Type
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.userType}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, userType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSaveUserChanges}
                disabled={updateStatusMutation.isPending || updateRoleMutation.isPending}
              >
                {(updateStatusMutation.isPending || updateRoleMutation.isPending) ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}