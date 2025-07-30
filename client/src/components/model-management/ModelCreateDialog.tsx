import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, X, Bot, Code, Database, Settings, BarChart3 } from "lucide-react";

interface ModelCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelCreateDialog({ isOpen, onClose }: ModelCreateDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [modelData, setModelData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    tags: [] as string[],
    features: {
      realTimeAnalysis: false,
      backtesting: false,
      alertSystem: false,
      apiAccess: false,
      customDashboard: false
    },
    dataRequirements: [] as string[],
    riskLevel: "",
    aiTechnique: "",
    targetUserType: "",
    minInvestment: ""
  });
  const [newTag, setNewTag] = useState("");
  const [newDataRequirement, setNewDataRequirement] = useState("");

  const createModelMutation = useMutation({
    mutationFn: async (data: typeof modelData) => {
      return await apiRequest("POST", "/api/ai-models/create", data);
    },
    onSuccess: () => {
      toast({
        title: "Model Created",
        description: "Your AI model has been successfully created and submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/ai-models"] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create AI model. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCurrentStep(1);
    setModelData({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      price: "",
      tags: [],
      features: {
        realTimeAnalysis: false,
        backtesting: false,
        alertSystem: false,
        apiAccess: false,
        customDashboard: false
      },
      dataRequirements: [],
      riskLevel: "",
      aiTechnique: "",
      targetUserType: "",
      minInvestment: ""
    });
    setNewTag("");
    setNewDataRequirement("");
  };

  const addTag = () => {
    if (newTag.trim() && !modelData.tags.includes(newTag.trim())) {
      setModelData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setModelData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addDataRequirement = () => {
    if (newDataRequirement.trim() && !modelData.dataRequirements.includes(newDataRequirement.trim())) {
      setModelData(prev => ({
        ...prev,
        dataRequirements: [...prev.dataRequirements, newDataRequirement.trim()]
      }));
      setNewDataRequirement("");
    }
  };

  const removeDataRequirement = (reqToRemove: string) => {
    setModelData(prev => ({
      ...prev,
      dataRequirements: prev.dataRequirements.filter(req => req !== reqToRemove)
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    createModelMutation.mutate(modelData);
  };

  const categories = [
    "Risk Assessment", "Trading Strategies", "Portfolio Management", 
    "Fraud Detection", "Market Sentiment", "Credit Scoring", 
    "Insurance", "Personal Finance", "Compliance & Regulatory"
  ];

  const riskLevels = ["Low", "Medium", "High", "Very High"];
  const aiTechniques = ["Machine Learning", "Deep Learning", "NLP", "Reinforcement Learning", "Time Series Analysis"];
  const targetUserTypes = ["Individual Traders", "Asset Managers", "Banks", "Hedge Funds", "Insurance Companies"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Create New AI Model
            <Badge variant="secondary">Step {currentStep} of 3</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Model Name</Label>
                      <Input
                        id="name"
                        value={modelData.name}
                        onChange={(e) => setModelData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Quantum Risk Predictor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Monthly Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={modelData.price}
                        onChange={(e) => setModelData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="99"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={modelData.description}
                      onChange={(e) => setModelData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what your AI model does and its key benefits..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={modelData.category} onValueChange={(value) => setModelData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Select value={modelData.riskLevel} onValueChange={(value) => setModelData(prev => ({ ...prev, riskLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          {riskLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Technical Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="aiTechnique">AI Technique</Label>
                      <Select value={modelData.aiTechnique} onValueChange={(value) => setModelData(prev => ({ ...prev, aiTechnique: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI technique" />
                        </SelectTrigger>
                        <SelectContent>
                          {aiTechniques.map((technique) => (
                            <SelectItem key={technique} value={technique}>{technique}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="targetUserType">Target User Type</Label>
                      <Select value={modelData.targetUserType} onValueChange={(value) => setModelData(prev => ({ ...prev, targetUserType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target users" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetUserTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="minInvestment">Minimum Investment ($)</Label>
                    <Input
                      id="minInvestment"
                      type="number"
                      value={modelData.minInvestment}
                      onChange={(e) => setModelData(prev => ({ ...prev, minInvestment: e.target.value }))}
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {Object.entries(modelData.features).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => 
                              setModelData(prev => ({
                                ...prev,
                                features: { ...prev.features, [key]: checked }
                              }))
                            }
                          />
                          <Label className="text-sm">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {modelData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Requirements & Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Data Requirements</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newDataRequirement}
                        onChange={(e) => setNewDataRequirement(e.target.value)}
                        placeholder="e.g., Historical Stock Data"
                        onKeyPress={(e) => e.key === 'Enter' && addDataRequirement()}
                      />
                      <Button type="button" onClick={addDataRequirement} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {modelData.dataRequirements.map((req) => (
                        <Badge key={req} variant="outline" className="flex items-center gap-1">
                          {req}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeDataRequirement(req)} />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/20">
                    <h4 className="font-semibold mb-2">Model Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Name:</strong> {modelData.name}</div>
                      <div><strong>Price:</strong> ${modelData.price}/month</div>
                      <div><strong>Category:</strong> {modelData.category}</div>
                      <div><strong>Risk Level:</strong> {modelData.riskLevel}</div>
                      <div><strong>AI Technique:</strong> {modelData.aiTechnique}</div>
                      <div><strong>Target Users:</strong> {modelData.targetUserType}</div>
                      <div className="col-span-2"><strong>Description:</strong> {modelData.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={createModelMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createModelMutation.isPending ? "Creating..." : "Create Model"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}