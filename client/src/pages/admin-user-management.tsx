import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useState } from "react";
import Layout from "@/components/layout/Layout";

interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  status: 'active' | 'suspended' | 'pending' | 'verified';
  verified: boolean;
  lastLogin: string;
  totalTrades: number;
  joinDate: string;
  riskScore: number;
  complianceStatus: string;
}

export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - in real implementation, these would come from API calls
  const users: UserManagement[] = [
    {
      id: "github_55703540",
      email: "alex.johnson@example.com",
      firstName: "Alex",
      lastName: "Johnson",
      userType: "Developer",
      status: "active",
      verified: true,
      lastLogin: "2025-07-14T12:30:00Z",
      totalTrades: 234,
      joinDate: "2024-03-15",
      riskScore: 25,
      complianceStatus: "compliant"
    },
    {
      id: "google_123456789",
      email: "sarah.chen@example.com",
      firstName: "Sarah",
      lastName: "Chen",
      userType: "Investor",
      status: "active",
      verified: true,
      lastLogin: "2025-07-14T10:15:00Z",
      totalTrades: 89,
      joinDate: "2024-05-22",
      riskScore: 15,
      complianceStatus: "compliant"
    },
    {
      id: "linkedin_987654321",
      email: "mike.rodriguez@example.com",
      firstName: "Mike",
      lastName: "Rodriguez",
      userType: "Data Provider",
      status: "pending",
      verified: false,
      lastLogin: "2025-07-13T16:45:00Z",
      totalTrades: 12,
      joinDate: "2025-07-10",
      riskScore: 45,
      complianceStatus: "under_review"
    },
    {
      id: "github_111222333",
      email: "emma.wilson@example.com",
      firstName: "Emma",
      lastName: "Wilson",
      userType: "Regulator",
      status: "verified",
      verified: true,
      lastLogin: "2025-07-14T09:20:00Z",
      totalTrades: 0,
      joinDate: "2024-01-15",
      riskScore: 5,
      complianceStatus: "compliant"
    },
    {
      id: "google_444555666",
      email: "david.lee@example.com",
      firstName: "David",
      lastName: "Lee",
      userType: "Investor",
      status: "suspended",
      verified: true,
      lastLogin: "2025-07-12T14:30:00Z",
      totalTrades: 456,
      joinDate: "2023-11-08",
      riskScore: 85,
      complianceStatus: "flagged"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      verified: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    };
    return <Badge className={variants[status] || variants.pending}>{status}</Badge>;
  };

  const getRiskBadge = (score: number) => {
    if (score <= 30) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Low Risk</Badge>;
    if (score <= 60) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium Risk</Badge>;
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">High Risk</Badge>;
  };

  const getComplianceBadge = (status: string) => {
    const variants: Record<string, string> = {
      compliant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      under_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      flagged: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return <Badge className={variants[status] || variants.under_review}>{status.replace('_', ' ')}</Badge>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = userFilter === "all" || user.userType.toLowerCase() === userFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    pendingUsers: users.filter(u => u.status === 'pending').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    highRiskUsers: users.filter(u => u.riskScore > 60).length,
    complianceIssues: users.filter(u => u.complianceStatus !== 'compliant').length
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">All registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingUsers}</div>
                <p className="text-xs text-muted-foreground">Awaiting verification</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.suspendedUsers}</div>
                <p className="text-xs text-muted-foreground">Account suspended</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.highRiskUsers}</div>
                <p className="text-xs text-muted-foreground">Risk score &gt;60</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.complianceIssues}</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All User Types</SelectItem>
                  <SelectItem value="investor">Investors</SelectItem>
                  <SelectItem value="developer">Developers</SelectItem>
                  <SelectItem value="data provider">Data Providers</SelectItem>
                  <SelectItem value="regulator">Regulators</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
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
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.firstName[0]}{user.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{user.userType}</Badge>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{user.riskScore}</span>
                            {getRiskBadge(user.riskScore)}
                          </div>
                        </td>
                        <td className="p-4">
                          {getComplianceBadge(user.complianceStatus)}
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Activity className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          {user.totalTrades} trades
                          <div className="text-xs text-muted-foreground">
                            Joined {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit User">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Flag User">
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
      </div>
    </Layout>
  );
}