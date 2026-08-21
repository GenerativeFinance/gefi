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
import { Search, Filter, Eye, Plus, BookOpen, Calendar } from "lucide-react";

const standardSchema = z.object({
  name: z.string().min(1, "Standard name is required"),
  framework: z.string().min(1, "Framework is required"),
  version: z.string().min(1, "Version is required"),
  description: z.string().min(1, "Description is required"),
  effectiveDate: z.string().min(1, "Effective date is required")
});

export default function RegulatorStandards() {
  const { toast } = useToast();
  const [standardDialogOpen, setStandardDialogOpen] = useState(false);

  const standardForm = useForm<z.infer<typeof standardSchema>>({
    resolver: zodResolver(standardSchema),
    defaultValues: {
      name: "",
      framework: "",
      version: "",
      description: "",
      effectiveDate: ""
    }
  });

  const { data: standards, isLoading } = useQuery({
    queryKey: ["/api/regulator/standards"],
    initialData: []
  });

  const standardMutation = useMutation({
    mutationFn: async (data: z.infer<typeof standardSchema>) => {
      return apiRequest("POST", "/api/regulator/standards", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/standards"] });
      setStandardDialogOpen(false);
      standardForm.reset();
      toast({
        title: "Success",
        description: "Regulatory standard created successfully"
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

  const sampleStandards = [
    {
      id: 1,
      name: "AI Model Transparency Requirements",
      framework: "SEC",
      version: "2.1",
      description: "Requirements for explainable AI in financial trading models",
      status: "active",
      effectiveDate: new Date("2024-01-01"),
      updatedAt: new Date("2024-11-01")
    },
    {
      id: 2,
      name: "Data Privacy Protection Standard",
      framework: "GDPR",
      version: "1.3",
      description: "Privacy protection requirements for financial datasets",
      status: "active",
      effectiveDate: new Date("2023-05-01"),
      updatedAt: new Date("2024-06-15")
    },
    {
      id: 3,
      name: "Algorithmic Bias Prevention",
      framework: "SEC",
      version: "1.0",
      description: "Standards for preventing discrimination in AI financial models",
      status: "draft",
      effectiveDate: new Date("2025-01-01"),
      updatedAt: new Date("2024-12-01")
    },
    {
      id: 4,
      name: "Risk Management Framework",
      framework: "MiFID",
      version: "3.2",
      description: "Comprehensive risk assessment standards for AI trading systems",
      status: "active",
      effectiveDate: new Date("2023-01-01"),
      updatedAt: new Date("2024-09-30")
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Regulatory Standards</h1>
              <p className="text-muted-foreground">
                Manage and maintain regulatory compliance standards
              </p>
            </div>
            <Dialog open={standardDialogOpen} onOpenChange={setStandardDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Standard
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Regulatory Standard</DialogTitle>
                  <DialogDescription>
                    Add a new regulatory standard or compliance requirement
                  </DialogDescription>
                </DialogHeader>
                <Form {...standardForm}>
                  <form onSubmit={standardForm.handleSubmit((data) => standardMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={standardForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Standard Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter standard name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={standardForm.control}
                      name="framework"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Regulatory Framework</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select framework" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SEC">SEC</SelectItem>
                              <SelectItem value="GDPR">GDPR</SelectItem>
                              <SelectItem value="MiFID">MiFID</SelectItem>
                              <SelectItem value="SOX">SOX</SelectItem>
                              <SelectItem value="CCPA">CCPA</SelectItem>
                              <SelectItem value="BASEL">Basel III</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={standardForm.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1.0, 2.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={standardForm.control}
                      name="effectiveDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Effective Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={standardForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <textarea 
                              className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md" 
                              placeholder="Describe the regulatory standard..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={standardMutation.isPending}>
                      {standardMutation.isPending ? "Creating..." : "Create Standard"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Search standards..."
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                {sampleStandards.filter(s => s.status === "active").length} Active
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                {sampleStandards.filter(s => s.status === "draft").length} Draft
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid gap-4">
              {sampleStandards.map((standard) => (
                <Card key={standard.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <BookOpen className="h-5 w-5 mt-0.5 text-blue-500" />
                        <div>
                          <CardTitle className="text-lg">{standard.name}</CardTitle>
                          <CardDescription>
                            {standard.framework} - Version {standard.version}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={standard.status === "active" ? "default" : "secondary"}>
                        {standard.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {standard.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Effective:</span>
                            <span className="ml-1">{standard.effectiveDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Updated:</span>
                            <span className="ml-1">{standard.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Standard
                        </Button>
                        <Button size="sm" variant="outline">
                          Download PDF
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