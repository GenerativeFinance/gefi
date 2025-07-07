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
import { Search, Filter, Eye, Plus } from "lucide-react";

const auditSchema = z.object({
  entityType: z.string().min(1, "Entity type is required"),
  entityId: z.string().min(1, "Entity ID is required"),
  auditorName: z.string().min(1, "Auditor name is required"),
  complianceFramework: z.string().min(1, "Compliance framework is required")
});

export default function RegulatorModelAudits() {
  const { toast } = useToast();
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);

  const auditForm = useForm<z.infer<typeof auditSchema>>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      entityType: "",
      entityId: "",
      auditorName: "",
      complianceFramework: ""
    }
  });

  const { data: audits, isLoading } = useQuery({
    queryKey: ["/api/regulator/model-audits"],
    initialData: []
  });

  const auditMutation = useMutation({
    mutationFn: async (data: z.infer<typeof auditSchema>) => {
      return apiRequest("POST", "/api/regulator/model-audits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/model-audits"] });
      setAuditDialogOpen(false);
      auditForm.reset();
      toast({
        title: "Success",
        description: "Audit created successfully"
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

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Model Audits</h1>
              <p className="text-muted-foreground">
                Compliance audits for AI models and algorithms
              </p>
            </div>
            <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Audit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Audit</DialogTitle>
                  <DialogDescription>
                    Initiate a new compliance audit for an AI model
                  </DialogDescription>
                </DialogHeader>
                <Form {...auditForm}>
                  <form onSubmit={auditForm.handleSubmit((data) => auditMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={auditForm.control}
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
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={auditForm.control}
                      name="entityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={auditForm.control}
                      name="auditorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auditor Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter auditor name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={auditForm.control}
                      name="complianceFramework"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compliance Framework</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select framework" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SEC">SEC</SelectItem>
                              <SelectItem value="GDPR">GDPR</SelectItem>
                              <SelectItem value="SOX">SOX</SelectItem>
                              <SelectItem value="MiFID">MiFID</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={auditMutation.isPending}>
                      {auditMutation.isPending ? "Creating..." : "Create Audit"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Search audits..."
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
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">AI Trading Model #{1000 + i}</CardTitle>
                        <CardDescription>
                          Model developed by {["TechCorp", "FinanceAI", "DataSoft", "AlgoTrade", "SmartFin"][i-1]}
                        </CardDescription>
                      </div>
                      <Badge variant={["default", "secondary", "destructive", "outline", "secondary"][i-1]}>
                        {["Compliant", "Under Review", "Non-Compliant", "Pending", "Approved"][i-1]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Audit Date:</span>
                        <span>{new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Auditor:</span>
                        <span>Compliance Team {i}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Framework:</span>
                        <span>{["SEC", "GDPR", "SOX", "MiFID", "CCPA"][i-1]}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-medium">{[92, 78, 45, 88, 95][i-1]}/100</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Download Report
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