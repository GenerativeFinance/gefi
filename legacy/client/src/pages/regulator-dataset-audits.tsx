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

const datasetAuditSchema = z.object({
  datasetId: z.string().min(1, "Dataset ID is required"),
  auditorName: z.string().min(1, "Auditor name is required"),
  complianceFramework: z.string().min(1, "Compliance framework is required"),
  auditType: z.string().min(1, "Audit type is required")
});

export default function RegulatorDatasetAudits() {
  const { toast } = useToast();
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);

  const auditForm = useForm<z.infer<typeof datasetAuditSchema>>({
    resolver: zodResolver(datasetAuditSchema),
    defaultValues: {
      datasetId: "",
      auditorName: "",
      complianceFramework: "",
      auditType: ""
    }
  });

  const { data: audits, isLoading } = useQuery({
    queryKey: ["/api/regulator/dataset-audits"],
    initialData: []
  });

  const auditMutation = useMutation({
    mutationFn: async (data: z.infer<typeof datasetAuditSchema>) => {
      return apiRequest("POST", "/api/regulator/dataset-audits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/dataset-audits"] });
      setAuditDialogOpen(false);
      auditForm.reset();
      toast({
        title: "Success",
        description: "Dataset audit created successfully"
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
              <h1 className="text-3xl font-bold mb-2">Dataset Audits</h1>
              <p className="text-muted-foreground">
                Privacy and compliance audits for financial datasets
              </p>
            </div>
            <Dialog open={auditDialogOpen} onOpenChange={setAuditDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Dataset Audit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Dataset Audit</DialogTitle>
                  <DialogDescription>
                    Initiate a new privacy and compliance audit for a dataset
                  </DialogDescription>
                </DialogHeader>
                <Form {...auditForm}>
                  <form onSubmit={auditForm.handleSubmit((data) => auditMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={auditForm.control}
                      name="datasetId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dataset ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter dataset ID" {...field} />
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
                      name="auditType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audit Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select audit type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="privacy">Privacy Assessment</SelectItem>
                              <SelectItem value="data_quality">Data Quality Review</SelectItem>
                              <SelectItem value="compliance">Compliance Check</SelectItem>
                              <SelectItem value="security">Security Audit</SelectItem>
                            </SelectContent>
                          </Select>
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
                              <SelectItem value="GDPR">GDPR</SelectItem>
                              <SelectItem value="CCPA">CCPA</SelectItem>
                              <SelectItem value="LGPD">LGPD</SelectItem>
                              <SelectItem value="PIPEDA">PIPEDA</SelectItem>
                              <SelectItem value="DPA">DPA</SelectItem>
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
                placeholder="Search dataset audits..."
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
                        <CardTitle className="text-lg">Financial Dataset #{2000 + i}</CardTitle>
                        <CardDescription>
                          Dataset provided by {["DataCorp", "FinanceData", "MarketInfo", "TradingData", "InfoSys"][i-1]}
                        </CardDescription>
                      </div>
                      <Badge variant={["default", "secondary", "destructive", "outline", "secondary"][i-1]}>
                        {["Privacy Compliant", "Under Review", "Privacy Risk", "Pending", "Approved"][i-1]}
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
                        <span className="text-muted-foreground">Data Controller:</span>
                        <span>Privacy Team {i}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Framework:</span>
                        <span>{["GDPR", "CCPA", "LGPD", "PIPEDA", "DPA"][i-1]}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Privacy Score:</span>
                        <span className="font-medium">{[95, 82, 67, 91, 88][i-1]}/100</span>
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