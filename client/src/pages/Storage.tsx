import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import {
  FileText,
  Database,
  Brain,
  File,
  Download,
  Trash2,
  Search,
  Upload,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  HardDrive
} from "lucide-react";

interface StorageFile {
  id: string;
  name: string;
  path: string;
  relativePath: string;
  size: number;
  modifiedAt: string;
  ext: string;
  type: "Report" | "Dataset" | "AI Model" | "Document" | "Other";
  isGenerated?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getFileIcon(type: string) {
  switch (type) {
    case "Report": return <FileText className="h-4 w-4 text-blue-600" />;
    case "Dataset": return <Database className="h-4 w-4 text-green-600" />;
    case "AI Model": return <Brain className="h-4 w-4 text-purple-600" />;
    case "Document": return <File className="h-4 w-4 text-gray-600" />;
    default: return <File className="h-4 w-4 text-gray-400" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "Report": return "bg-blue-100 text-blue-800";
    case "Dataset": return "bg-green-100 text-green-800";
    case "AI Model": return "bg-purple-100 text-purple-800";
    case "Document": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-600";
  }
}

export default function Storage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("modified");
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch storage files
  const { data: files = [], isLoading, refetch } = useQuery<StorageFile[]>({
    queryKey: ["/api/storage/files"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      return await apiRequest("DELETE", `/api/storage/files/${fileId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/storage/files"] });
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error?.message || "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  // Filter and sort files
  const filteredFiles = files
    .filter((file: StorageFile) => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || file.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a: StorageFile, b: StorageFile) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "type":
          return a.type.localeCompare(b.type);
        case "modified":
        default:
          return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
      }
    });

  // Get storage stats
  const stats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum: number, file: StorageFile) => sum + file.size, 0),
    byType: files.reduce((acc: Record<string, number>, file: StorageFile) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {}),
  };

  const handleDownload = (file: StorageFile) => {
    if (file.isGenerated && file.type === "Report") {
      // For generated reports, use the reports API download endpoint
      const reportId = file.name.match(/report-(.+)\.pdf$/)?.[1];
      if (reportId) {
        window.open(`/api/reports/${reportId}/download`, '_blank');
        return;
      }
    }
    
    // For other files, create a download link
    const link = document.createElement("a");
    link.href = `/api/storage/files/${file.id}/download`;
    link.download = file.name;
    link.click();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Storage Management</h1>
            <p className="text-muted-foreground">Manage your files, datasets, and storage usage</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Files</p>
                    <p className="text-2xl font-bold">{stats.totalFiles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                    <p className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Reports</p>
                    <p className="text-2xl font-bold">{stats.byType.Report || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">AI Models</p>
                    <p className="text-2xl font-bold">{stats.byType["AI Model"] || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Report">Reports</SelectItem>
                <SelectItem value="Dataset">Datasets</SelectItem>
                <SelectItem value="AI Model">AI Models</SelectItem>
                <SelectItem value="Document">Documents</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modified">Last Modified</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Files List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Files</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {filteredFiles.length} of {files.length} files
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading files...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {files.length === 0 ? "No files found" : "No files match your search criteria"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{file.name}</p>
                            <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                            {file.isGenerated && (
                              <Badge variant="outline">Generated</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • Modified {formatDate(file.modifiedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(file.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* File Details Dialog */}
      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(selectedFile.type)}
                {selectedFile.name}
              </DialogTitle>
              <DialogDescription>File details and information</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedFile.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Size</Label>
                  <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Modified</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedFile.modifiedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Extension</Label>
                  <p className="text-sm text-muted-foreground">{selectedFile.ext || 'None'}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Path</Label>
                <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                  {selectedFile.relativePath}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedFile)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(selectedFile.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}