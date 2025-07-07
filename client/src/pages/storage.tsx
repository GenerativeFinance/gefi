import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HardDrive, 
  Database, 
  FileText, 
  Image, 
  Video, 
  Music,
  Archive,
  Download,
  Upload,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  FolderOpen,
  File
} from "lucide-react";

export default function Storage() {
  const storageOverview = {
    total: 5, // GB
    used: 2.3, // GB
    available: 2.7, // GB
    percentage: 46
  };

  const storageBreakdown = [
    { type: "AI Models", size: 1.2, color: "bg-blue-500", percentage: 52 },
    { type: "Datasets", size: 0.8, color: "bg-green-500", percentage: 35 },
    { type: "Reports", size: 0.2, color: "bg-yellow-500", percentage: 9 },
    { type: "Backups", size: 0.1, color: "bg-purple-500", percentage: 4 }
  ];

  const files = [
    {
      id: 1,
      name: "trading_model_v2.pkl",
      type: "AI Model",
      size: "456 MB",
      modified: "2 hours ago",
      category: "Models",
      icon: FileText
    },
    {
      id: 2,
      name: "stock_data_2024.csv",
      type: "Dataset",
      size: "234 MB",
      modified: "1 day ago",
      category: "Data",
      icon: Database
    },
    {
      id: 3,
      name: "performance_report.pdf",
      type: "Report",
      size: "12 MB",
      modified: "3 days ago",
      category: "Reports",
      icon: FileText
    },
    {
      id: 4,
      name: "sentiment_analyzer.h5",
      type: "AI Model",
      size: "678 MB",
      modified: "1 week ago",
      category: "Models",
      icon: FileText
    },
    {
      id: 5,
      name: "backup_20241201.zip",
      type: "Backup",
      size: "89 MB",
      modified: "2 weeks ago",
      category: "Backups",
      icon: Archive
    }
  ];

  const folders = [
    { name: "AI Models", files: 23, size: "1.2 GB" },
    { name: "Datasets", files: 15, size: "800 MB" },
    { name: "Reports", files: 8, size: "200 MB" },
    { name: "Backups", files: 5, size: "100 MB" }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Storage Management</h1>
            <p className="text-muted-foreground">
              Manage your files, datasets, and storage usage
            </p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Storage Usage */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Usage</CardTitle>
                    <CardDescription>Current storage consumption across your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{storageOverview.used} GB</div>
                        <div className="text-muted-foreground">of {storageOverview.total} GB used</div>
                        <Progress value={storageOverview.percentage} className="w-full mt-4" />
                        <div className="text-sm text-muted-foreground mt-2">
                          {storageOverview.available} GB available
                        </div>
                      </div>

                      <div className="space-y-3">
                        {storageBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                              <span className="text-sm font-medium">{item.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">{item.size} GB</span>
                              <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest file operations and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { action: "Uploaded", file: "trading_model_v2.pkl", time: "2 hours ago" },
                        { action: "Modified", file: "stock_data_2024.csv", time: "1 day ago" },
                        { action: "Downloaded", file: "performance_report.pdf", time: "3 days ago" },
                        { action: "Deleted", file: "old_backup.zip", time: "1 week ago" }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm">{activity.action} <span className="font-medium">{activity.file}</span></span>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Create Folder
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Bulk Download
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Archive className="mr-2 h-4 w-4" />
                        Create Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Storage Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Current Plan</span>
                        <Badge variant="default">Professional</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Storage Limit</span>
                        <span className="text-sm font-medium">5 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Additional Storage</span>
                        <span className="text-sm text-muted-foreground">$5/GB</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Upgrade Storage
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Storage Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Optimization</span>
                        <Badge variant="default">Good</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Redundancy</span>
                        <Badge variant="default">Protected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Backup</span>
                        <span className="text-sm text-muted-foreground">2 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files">
            {/* Search and Filter */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search files..."
                  className="w-80"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="models">AI Models</SelectItem>
                    <SelectItem value="datasets">Datasets</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                    <SelectItem value="backups">Backups</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="modified">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modified">Last Modified</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>All files in your storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <file.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {file.size} • Modified {file.modified}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{file.type}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="folders">
            <Card>
              <CardHeader>
                <CardTitle>Folders</CardTitle>
                <CardDescription>Organize your files into folders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {folders.map((folder, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3 mb-3">
                        <FolderOpen className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="font-medium">{folder.name}</div>
                          <div className="text-sm text-muted-foreground">{folder.files} files</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{folder.size}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Storage Settings</CardTitle>
                  <CardDescription>Configure your storage preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-backup</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Compression</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Versioning</span>
                      <Badge variant="secondary">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retention Period</span>
                      <span className="text-sm text-muted-foreground">90 days</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Update Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cleanup Tools</CardTitle>
                  <CardDescription>Manage and optimize your storage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Old Backups
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Archive className="mr-2 h-4 w-4" />
                      Compress Large Files
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Remove Duplicates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <HardDrive className="mr-2 h-4 w-4" />
                      Optimize Storage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}