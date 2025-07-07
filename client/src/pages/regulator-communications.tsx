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
import { Search, Filter, Eye, Plus, MessageSquare, Send } from "lucide-react";

const communicationSchema = z.object({
  recipientType: z.string().min(1, "Recipient type is required"),
  recipientId: z.string().min(1, "Recipient ID is required"),
  messageType: z.string().min(1, "Message type is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required")
});

export default function RegulatorCommunications() {
  const { toast } = useToast();
  const [communicationDialogOpen, setCommunicationDialogOpen] = useState(false);

  const communicationForm = useForm<z.infer<typeof communicationSchema>>({
    resolver: zodResolver(communicationSchema),
    defaultValues: {
      recipientType: "",
      recipientId: "",
      messageType: "",
      subject: "",
      message: ""
    }
  });

  const { data: communications, isLoading } = useQuery({
    queryKey: ["/api/regulator/communications"],
    initialData: []
  });

  const communicationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof communicationSchema>) => {
      return apiRequest("POST", "/api/regulator/communications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/regulator/communications"] });
      setCommunicationDialogOpen(false);
      communicationForm.reset();
      toast({
        title: "Success",
        description: "Communication sent successfully"
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

  const sampleCommunications = [
    {
      id: 1,
      recipientType: "developer",
      recipientId: "dev123",
      messageType: "warning",
      subject: "AI Model Compliance Warning",
      message: "Your AI model #1001 requires immediate attention for GDPR compliance.",
      status: "sent",
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      recipientType: "data_provider",
      recipientId: "dp456",
      messageType: "audit_request",
      subject: "Dataset Audit Required",
      message: "Please provide documentation for dataset #2001 privacy compliance audit.",
      status: "sent",
      sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      recipientType: "platform_admin",
      recipientId: "admin789",
      messageType: "policy_change",
      subject: "Updated Regulatory Standards",
      message: "New SEC compliance standards v2.1 are now in effect.",
      status: "draft",
      sentAt: new Date()
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Communications</h1>
              <p className="text-muted-foreground">
                Send regulatory communications and track correspondence
              </p>
            </div>
            <Dialog open={communicationDialogOpen} onOpenChange={setCommunicationDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Send Communication</DialogTitle>
                  <DialogDescription>
                    Send a regulatory communication or notification
                  </DialogDescription>
                </DialogHeader>
                <Form {...communicationForm}>
                  <form onSubmit={communicationForm.handleSubmit((data) => communicationMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={communicationForm.control}
                      name="recipientType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select recipient type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="data_provider">Data Provider</SelectItem>
                              <SelectItem value="platform_admin">Platform Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={communicationForm.control}
                      name="recipientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter recipient ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={communicationForm.control}
                      name="messageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select message type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="violation">Violation Notice</SelectItem>
                              <SelectItem value="compliance_update">Compliance Update</SelectItem>
                              <SelectItem value="audit_request">Audit Request</SelectItem>
                              <SelectItem value="policy_change">Policy Change</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={communicationForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={communicationForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <textarea 
                              className="w-full min-h-[100px] px-3 py-2 text-sm border border-input bg-background rounded-md" 
                              placeholder="Enter your message..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1" disabled={communicationMutation.isPending}>
                        <Send className="mr-2 h-4 w-4" />
                        {communicationMutation.isPending ? "Sending..." : "Send Message"}
                      </Button>
                      <Button type="button" variant="outline" className="flex-1">
                        Save Draft
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Search communications..."
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
              {sampleCommunications.map((comm) => (
                <Card key={comm.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 mt-0.5 text-blue-500" />
                        <div>
                          <CardTitle className="text-lg">{comm.subject}</CardTitle>
                          <CardDescription>
                            To: {comm.recipientType.replace('_', ' ')} #{comm.recipientId}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          comm.messageType === "warning" ? "destructive" :
                          comm.messageType === "violation" ? "destructive" :
                          comm.messageType === "audit_request" ? "secondary" :
                          "default"
                        }>
                          {comm.messageType.replace('_', ' ')}
                        </Badge>
                        <Badge variant={comm.status === "sent" ? "default" : "secondary"}>
                          {comm.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {comm.message}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sent:</span>
                        <span>{comm.sentAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Full
                        </Button>
                        {comm.status === "draft" && (
                          <Button size="sm" variant="outline">
                            Edit Draft
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Reply
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