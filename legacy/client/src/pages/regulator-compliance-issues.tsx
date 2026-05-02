import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Search, Filter, Eye, Plus, AlertTriangle } from "lucide-react";

const issueSchema = z.object({
  entityType: z.string().min(1, "Entity type is required"),
  entityId: z.string().min(1, "Entity ID is required"),
  issueType: z.string().min(1, "Issue type is required"),
  severity: z.string().min(1, "Severity is required"),
  description: z.string().min(1, "Description is required")
});

export default function RegulatorComplianceIssues() {
  const { toast } = useToast();
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  const issueForm = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      entityType: "",
      entityId: "",
      issueType: "",
      severity: "",
      description: ""
    }
  });

  const { data: issues, isLoading } = useQuery({
    queryKey: ["/api/regulator/compliance-issues"],
    initialData: []
  });

  const issueMutation = useMutation({
    mutationFn: async (data: z.infer<typeof issueSchema>) => {
      return apiRequest("POST", "/api/regulator/compliance-issues", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/compliance-issues"] });
      setIssueDialogOpen(false);
      issueForm.reset();
      toast({
        title: "Success",
        description: "Compliance issue reported successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const sampleIssues = [
    {
      id: 1,
      entityType: "model",
      entityId: "1001",
      issueType: "Data Privacy Violation",
      severity: "critical",
      status: "open",
      description: "Model uses personal data without proper consent mechanisms",
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      entityType: "dataset",
      entityId: "2001",
      issueType: "Algorithmic Bias",
      severity: "high",
      status: "investigating",
      description: "Dataset shows bias against certain demographic groups",
      reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      entityType: "model",
      entityId: "1003",
      issueType: "Lack of Transparency",
      severity: "medium",
      status: "resolved",
      description: "Model decisions are not sufficiently explainable",
      reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Compliance Issues</h1>
              <p className="text-muted-foreground">
                Track and manage compliance violations and concerns
              </p>
            </div>
            <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Report Compliance Issue</DialogTitle>
                  <DialogDescription>
                    Flag a compliance concern or violation
                  </DialogDescription>
                </DialogHeader>
                <Form {...issueForm}>
                  <form onSubmit={issueForm.handleSubmit((data) => issueMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={issueForm.control}
                      name="entityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entity Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select entity type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="model">AI Model</SelectItem>
                              <SelectItem value="dataset">Dataset</SelectItem>
                              <SelectItem value="platform">Platform</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={issueForm.control}
                      name="entityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entity ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter entity ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={issueForm.control}
                      name="issueType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select issue type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="data_privacy">Data Privacy</SelectItem>
                              <SelectItem value="bias">Algorithmic Bias</SelectItem>
                              <SelectItem value="transparency">Lack of Transparency</SelectItem>
                              <SelectItem value="security">Security Vulnerability</SelectItem>
                              <SelectItem value="accuracy">Accuracy Concerns</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={issueForm.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={issueForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <textarea 
                              className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md" 
                              placeholder="Describe the compliance issue in detail..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={issueMutation.isPending}>
                      {issueMutation.isPending ? "Reporting..." : "Report Issue"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Search issues..."
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid gap-4">
              {sampleIssues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                          issue.severity === "critical" ? "text-red-500" :
                          issue.severity === "high" ? "text-orange-500" :
                          issue.severity === "medium" ? "text-yellow-500" :
                          "text-blue-500"
                        }`} />
                        <div>
                          <CardTitle className="text-lg">{issue.issueType}</CardTitle>
                          <CardDescription>
                            {issue.entityType} #{issue.entityId}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          issue.severity === "critical" ? "destructive" :
                          issue.severity === "high" ? "destructive" :
                          issue.severity === "medium" ? "secondary" :
                          "outline"
                        }>
                          {issue.severity}
                        </Badge>
                        <Badge variant={
                          issue.status === "resolved" ? "default" :
                          issue.status === "investigating" ? "secondary" :
                          "outline"
                        }>
                          {issue.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {issue.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reported:</span>
                        <span>{issue.reportedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Entity
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}