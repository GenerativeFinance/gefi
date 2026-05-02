import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Settings, Plus, Edit, Trash2, Eye, BarChart3, Brain, Shield,
  Globe, DollarSign, Users, Activity, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Search, Filter, Download, Upload, RefreshCw
} from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface AIModel {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  complexity: string;
  isActive: boolean;
  pricing: string;
  developerId?: string;
  subscriptions: number;
  performance: number;
  lastUpdated: string;
  status: 'active' | 'pending' | 'suspended' | 'under_review';
}

export default function AdminAIModels() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch AI models with admin privileges
  const { data: models = [], isLoading } = useQuery({
    queryKey: ['/api/admin/ai-models'],
    queryFn: () => apiRequest('/api/admin/ai-models').then(res => res.json())
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/ai-model-categories'],
    queryFn: () => apiRequest('/api/ai-model-categories').then(res => res.json())
  });

  // Model management mutations
  const updateModelStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest(`/api/admin/ai-models/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-models'] });
      toast({ title: "Model status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update model status", variant: "destructive" });
    }
  });

  const deleteModel = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/ai-models/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-models'] });
      toast({ title: "Model deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete model", variant: "destructive" });
    }
  });

  // Filter models based on search and filters
  const filteredModels = models.filter((model: AIModel) => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || model.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      'suspended': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      'under_review': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    };
    return colors[status] || colors['pending'];
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'active': <CheckCircle className="w-4 h-4" />,
      'pending': <Clock className="w-4 h-4" />,
      'suspended': <AlertTriangle className="w-4 h-4" />,
      'under_review': <Eye className="w-4 h-4" />
    };
    return icons[status] || icons['pending'];
  };

  return (
    <Layout>
      <div className="space-y-6 p-3 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              AI Models Management
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
              Manage and monitor all AI models in the marketplace
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Model
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search Models</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Models Management Tabs */}
        <Tabs defaultValue="all-models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="all-models">All Models</TabsTrigger>
            <TabsTrigger value="pending-review">Pending Review</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all-models">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredModels.map((model: AIModel) => (
                  <Card key={model.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {model.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(model.status)} variant="secondary">
                          {getStatusIcon(model.status)}
                          <span className="ml-1 capitalize">{model.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Category:</span>
                          <p className="text-gray-600 dark:text-gray-300">{model.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">Complexity:</span>
                          <p className="text-gray-600 dark:text-gray-300">{model.complexity}</p>
                        </div>
                        <div>
                          <span className="font-medium">Subscriptions:</span>
                          <p className="text-gray-600 dark:text-gray-300">{model.subscriptions || 0}</p>
                        </div>
                        <div>
                          <span className="font-medium">Performance:</span>
                          <p className="text-gray-600 dark:text-gray-300">{model.performance || 0}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={model.isActive}
                            onCheckedChange={(checked) => 
                              updateModelStatus.mutate({
                                id: model.id,
                                status: checked ? 'active' : 'suspended'
                              })
                            }
                          />
                          <span className="text-sm">Active</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingModel(model)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteModel.mutate(model.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending-review">
            <Card>
              <CardHeader>
                <CardTitle>Models Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredModels
                    .filter((model: AIModel) => model.status === 'pending' || model.status === 'under_review')
                    .map((model: AIModel) => (
                    <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{model.description}</p>
                        <Badge className={getStatusColor(model.status)} variant="secondary">
                          {model.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateModelStatus.mutate({ id: model.id, status: 'active' })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateModelStatus.mutate({ id: model.id, status: 'suspended' })}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{models.length}</div>
                  <div className="text-sm text-gray-500">Total Models</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {models.filter((m: AIModel) => m.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-500">Active Models</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {models.filter((m: AIModel) => m.status === 'pending' || m.status === 'under_review').length}
                  </div>
                  <div className="text-sm text-gray-500">Pending Review</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {models.filter((m: AIModel) => m.status === 'suspended').length}
                  </div>
                  <div className="text-sm text-gray-500">Suspended</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>AI Models Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Auto-approve models from verified developers</Label>
                    <Switch />
                  </div>
                  <div>
                    <Label>Require manual review for high-complexity models</Label>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <Label>Send notifications for new model submissions</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}