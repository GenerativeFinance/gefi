import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import {
  FileText,
  Tag,
  Calendar,
  User,
  Database,
  Search,
  Plus,
  Edit,
  Save,
  Eye,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Lock,
  Shield,
  Trash2
} from "lucide-react";

export default function DataProviderMetadataManagement() {
  const [selectedDataset, setSelectedDataset] = useState("dataset-1");
  const [isEditing, setIsEditing] = useState(false);
  const [isNewSchemaOpen, setIsNewSchemaOpen] = useState(false);
  const [newSchema, setNewSchema] = useState({
    name: "",
    description: "",
    fields: [{ name: "", type: "", description: "", required: true }]
  });
  const { toast } = useToast();

  // Sample metadata for different datasets
  const metadataTemplates = {
    "dataset-1": {
      id: "dataset-1",
      name: "Global Stock Market Historical Data",
      description: "Complete historical stock data for 5000+ companies across major exchanges",
      category: "Market Data",
      subcategory: "Equities",
      dataFormat: "CSV/JSON",
      updateFrequency: "Daily",
      coverage: "Global",
      startDate: "2000-01-01",
      endDate: "2024-07-15",
      records: "50,000,000+",
      size: "2.3 TB",
      license: "Commercial",
      accessLevel: "Premium",
      tags: ["stocks", "historical", "global", "real-time", "OHLCV"],
      schema: {
        symbol: "Stock ticker symbol",
        date: "Trading date (YYYY-MM-DD)",
        open: "Opening price",
        high: "Highest price",
        low: "Lowest price",
        close: "Closing price",
        volume: "Trading volume",
        adjusted_close: "Dividend-adjusted closing price"
      },
      quality: {
        completeness: 98.5,
        accuracy: 99.2,
        consistency: 97.8,
        timeliness: 99.9
      },
      compliance: ["GDPR", "SOC 2", "ISO 27001"],
      lastValidated: "2024-07-15"
    }
  };

  const currentMetadata = metadataTemplates[selectedDataset];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Metadata Management</h1>
            <p className="text-muted-foreground">Manage dataset metadata, schemas, and documentation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Metadata
            </Button>
            <Dialog open={isNewSchemaOpen} onOpenChange={setIsNewSchemaOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Schema
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Schema</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schema-name">Schema Name</Label>
                      <Input
                        id="schema-name"
                        value={newSchema.name}
                        onChange={(e) => setNewSchema({...newSchema, name: e.target.value})}
                        placeholder="Financial Market Data Schema"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schema-description">Description</Label>
                      <Input
                        id="schema-description"
                        value={newSchema.description}
                        onChange={(e) => setNewSchema({...newSchema, description: e.target.value})}
                        placeholder="Schema for stock market data"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-semibold">Schema Fields</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewSchema({
                          ...newSchema,
                          fields: [...newSchema.fields, { name: "", type: "", description: "", required: true }]
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                    
                    {newSchema.fields.map((field, index) => (
                      <Card key={index} className="p-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Field Name</Label>
                            <Input
                              value={field.name}
                              onChange={(e) => {
                                const updatedFields = [...newSchema.fields];
                                updatedFields[index].name = e.target.value;
                                setNewSchema({...newSchema, fields: updatedFields});
                              }}
                              placeholder="symbol"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Data Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) => {
                                const updatedFields = [...newSchema.fields];
                                updatedFields[index].type = value;
                                setNewSchema({...newSchema, fields: updatedFields});
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="decimal">Decimal</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="datetime">DateTime</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="array">Array</SelectItem>
                                <SelectItem value="object">Object</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={field.description}
                              onChange={(e) => {
                                const updatedFields = [...newSchema.fields];
                                updatedFields[index].description = e.target.value;
                                setNewSchema({...newSchema, fields: updatedFields});
                              }}
                              placeholder="Stock ticker symbol"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Required</Label>
                            <div className="flex items-center justify-between">
                              <Select
                                value={field.required ? "true" : "false"}
                                onValueChange={(value) => {
                                  const updatedFields = [...newSchema.fields];
                                  updatedFields[index].required = value === "true";
                                  setNewSchema({...newSchema, fields: updatedFields});
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                              {newSchema.fields.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const updatedFields = newSchema.fields.filter((_, i) => i !== index);
                                    setNewSchema({...newSchema, fields: updatedFields});
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsNewSchemaOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Schema Created",
                        description: `${newSchema.name} schema has been successfully created.`,
                      });
                      setIsNewSchemaOpen(false);
                      setNewSchema({
                        name: "",
                        description: "",
                        fields: [{ name: "", type: "", description: "", required: true }]
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Schema
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dataset Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="dataset-select" className="text-sm font-medium">Select Dataset:</Label>
              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger className="w-96">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dataset-1">Global Stock Market Historical Data</SelectItem>
                  <SelectItem value="dataset-2">Cryptocurrency Trading Signals</SelectItem>
                  <SelectItem value="dataset-3">Economic Indicators Dataset</SelectItem>
                  <SelectItem value="dataset-4">Alternative Finance Data</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Save Changes" : "Edit Metadata"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metadata Tabs */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Dataset Name</Label>
                    <Input
                      id="name"
                      value={currentMetadata.name}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-muted"}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={currentMetadata.description}
                      disabled={!isEditing}
                      className={isEditing ? "" : "bg-muted"}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={currentMetadata.category} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Market Data">Market Data</SelectItem>
                          <SelectItem value="Crypto">Crypto</SelectItem>
                          <SelectItem value="Economics">Economics</SelectItem>
                          <SelectItem value="Alternative Finance">Alternative Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Input
                        id="subcategory"
                        value={currentMetadata.subcategory}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-muted"}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Format</Label>
                      <Input
                        value={currentMetadata.dataFormat}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-muted"}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Update Frequency</Label>
                      <Select value={currentMetadata.updateFrequency} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Real-time">Real-time</SelectItem>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Coverage</Label>
                      <Input
                        value={currentMetadata.coverage}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-muted"}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Records Count</Label>
                      <Input
                        value={currentMetadata.records}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-muted"}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Data Size</Label>
                      <Input
                        value={currentMetadata.size}
                        disabled={!isEditing}
                        className={isEditing ? "" : "bg-muted"}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Access Level</Label>
                      <Select value={currentMetadata.accessLevel} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Public">Public</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags & Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentMetadata.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                      {isEditing && (
                        <button className="ml-2 text-muted-foreground hover:text-foreground">
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input placeholder="Add new tag..." className="flex-1" />
                    <Button size="sm">Add Tag</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schema Tab */}
          <TabsContent value="schema">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Data Schema & Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(currentMetadata.schema).map(([field, description]) => (
                    <div key={field} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-32">
                        <Input
                          value={field}
                          disabled={!isEditing}
                          className={`font-mono ${isEditing ? "" : "bg-muted"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          value={description}
                          disabled={!isEditing}
                          className={isEditing ? "" : "bg-muted"}
                          placeholder="Field description..."
                        />
                      </div>
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Metrics Tab */}
          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(currentMetadata.quality).map(([metric, value]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="capitalize">{metric}</Label>
                        <span className="text-sm font-medium">{value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last validated: {currentMetadata.lastValidated}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Run Quality Check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Compliance Standards</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {currentMetadata.compliance.map((standard) => (
                      <div key={standard} className="flex items-center gap-2 p-3 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">{standard}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Data Classification</Label>
                    <Select value="confidential" disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="confidential">Confidential</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Retention Period</Label>
                    <Select value="7-years" disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="3-years">3 Years</SelectItem>
                        <SelectItem value="7-years">7 Years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation & Usage Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add detailed documentation, usage examples, API endpoints, and integration guides..."
                  rows={12}
                  disabled={!isEditing}
                  className={isEditing ? "" : "bg-muted"}
                  value={`## Dataset Overview

This dataset contains comprehensive historical stock market data covering 5000+ companies across major global exchanges including NYSE, NASDAQ, LSE, TSE, and more.

## Data Format

Data is available in both CSV and JSON formats with the following structure:

\`\`\`json
{
  "symbol": "AAPL",
  "date": "2024-07-15",
  "open": 225.50,
  "high": 227.20,
  "low": 224.80,
  "close": 226.40,
  "volume": 45623000,
  "adjusted_close": 226.40
}
\`\`\`

## API Endpoints

- GET /api/v1/stocks/{symbol}/historical
- GET /api/v1/stocks/{symbol}/realtime
- GET /api/v1/exchanges/{exchange}/symbols

## Usage Examples

### Python
\`\`\`python
import requests

response = requests.get(
    'https://api.example.com/v1/stocks/AAPL/historical',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
data = response.json()
\`\`\`

## Support

For technical support, contact: support@dataprovider.com`}
                />
                {isEditing && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline">Preview</Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}