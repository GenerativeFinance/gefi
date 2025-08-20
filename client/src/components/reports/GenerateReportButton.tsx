import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateReport, downloadReport, ReportTemplate, ReportInput } from "@/lib/reportGenerator";
import { FileText, Download, Loader2 } from "lucide-react";

interface GenerateReportButtonProps {
  template: ReportTemplate;
  defaultData?: Partial<ReportInput>;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  buttonSize?: "sm" | "default" | "lg";
  className?: string;
}

export default function GenerateReportButton({
  template,
  defaultData = {},
  buttonText = "Generate Report",
  buttonVariant = "default",
  buttonSize = "default",
  className
}: GenerateReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ReportInput>({
    title: "",
    period: "",
    summary: "",
    ...defaultData
  });
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.title?.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a report title.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await generateReport(template, formData);
      
      toast({
        title: "Report Generated",
        description: `${result.title} has been created successfully.`,
      });

      // Auto-download the report
      downloadReport(result.id, result.metadata.filename);
      
      setOpen(false);
      
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "An error occurred while generating the report.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTemplateDisplayName = (template: ReportTemplate) => {
    switch (template) {
      case "performance": return "Performance Report";
      case "risk": return "Risk Assessment";
      case "compliance": return "Compliance Report";
      case "custom": return "Custom Report";
      default: return "Report";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          className={className}
        >
          <FileText className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate {getTemplateDisplayName(template)}</DialogTitle>
          <DialogDescription>
            Configure your report settings and generate a PDF document.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`${getTemplateDisplayName(template)} - ${new Date().toLocaleDateString()}`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="period">Reporting Period</Label>
            <Select
              value={formData.period}
              onValueChange={(value) => setFormData({ ...formData, period: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="custom">Custom Period</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Executive Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Brief overview of the report contents..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Generate & Download
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}