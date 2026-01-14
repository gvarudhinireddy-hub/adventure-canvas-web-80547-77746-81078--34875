import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, Loader2, FileText, CheckCircle, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import jsPDF from "jspdf";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ItineraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
}

export const ItineraryModal = ({ open, onOpenChange, messages }: ItineraryModalProps) => {
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [destination, setDestination] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateItinerary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate itinerary");
      }

      const data = await response.json();
      setItinerary(data.itinerary);
      setDestination(data.destination);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate itinerary",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPDF = () => {
    if (!itinerary) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      pdf.setTextColor(color[0], color[1], color[2]);
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      for (const line of lines) {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += fontSize * 0.4;
      }
    };

    // Add header
    pdf.setFillColor(34, 139, 87); // Primary green color
    pdf.rect(0, 0, pageWidth, 35, "F");
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("WanderNest Travel Itinerary", margin, 15);
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Destination: ${destination}`, margin, 25);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 31);
    
    yPosition = 45;

    // Parse and format the itinerary content
    const lines = itinerary.split("\n");
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines but add spacing
      if (!trimmedLine) {
        yPosition += 3;
        continue;
      }

      // Main title (lines with === or the document title)
      if (trimmedLine.includes("================") || trimmedLine.includes("TRAVEL ITINERARY DOCUMENT")) {
        if (trimmedLine.includes("TRAVEL ITINERARY DOCUMENT")) {
          yPosition += 5;
          addText(trimmedLine, 14, true, [34, 139, 87]);
          yPosition += 3;
        }
        continue;
      }

      // Section headers (numbered sections like "1. EXECUTIVE SUMMARY")
      if (/^\d+\.\s+[A-Z]/.test(trimmedLine)) {
        yPosition += 5;
        addText(trimmedLine, 12, true, [34, 139, 87]);
        yPosition += 2;
        continue;
      }

      // Sub-headers with dashes
      if (trimmedLine.match(/^[-]{2,}$/)) {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
        yPosition += 2;
        continue;
      }

      // Day headers (DAY 1:, DAY 2:, etc.)
      if (trimmedLine.match(/^(│\s*)?DAY\s+\d+:/i) || trimmedLine.match(/^DAY\s+\d+:/i)) {
        yPosition += 4;
        const cleanLine = trimmedLine.replace(/[│┌└├┤┬┴┼─]/g, "").trim();
        addText(cleanLine, 11, true, [0, 100, 150]);
        yPosition += 2;
        continue;
      }

      // Time period headers (Morning, Afternoon, Evening)
      if (trimmedLine.match(/^(│\s*)?(Morning|Afternoon|Evening)\s*\(/i)) {
        yPosition += 2;
        const cleanLine = trimmedLine.replace(/[│┌└├┤┬┴┼─]/g, "").trim();
        addText(cleanLine, 10, true, [80, 80, 80]);
        continue;
      }

      // Bullet points
      if (trimmedLine.startsWith("•") || trimmedLine.startsWith("□") || trimmedLine.startsWith("-")) {
        const cleanLine = trimmedLine.replace(/[│┌└├┤┬┴┼─]/g, "").trim();
        addText(cleanLine, 9, false, [60, 60, 60]);
        continue;
      }

      // Table-like content (budget breakdown)
      if (trimmedLine.includes("│") && trimmedLine.includes("$")) {
        const cleanLine = trimmedLine.replace(/[│┌└├┤┬┴┼─]/g, " ").replace(/\s+/g, " ").trim();
        addText(cleanLine, 9, false, [60, 60, 60]);
        continue;
      }

      // Skip box drawing characters only lines
      if (trimmedLine.match(/^[│┌└├┤┬┴┼─┐┘]+$/)) {
        continue;
      }

      // Regular text
      const cleanLine = trimmedLine.replace(/[│┌└├┤┬┴┼─┐┘]/g, "").trim();
      if (cleanLine) {
        addText(cleanLine, 9, false, [40, 40, 40]);
      }
    }

    // Add footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${totalPages} | WanderNest AI Travel Concierge`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    const fileName = `${destination.replace(/[^a-z0-9]/gi, "_")}_itinerary.pdf`;
    pdf.save(fileName);

    toast({
      title: "PDF Downloaded",
      description: "Your professional itinerary has been downloaded as a PDF",
    });
  };

  const saveToTrips = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save trips",
        variant: "destructive",
      });
      return;
    }

    if (!itinerary) return;

    setIsSaving(true);
    try {
      // Extract country from destination (simple heuristic)
      const destinationParts = destination.split(",").map((s) => s.trim());
      const country = destinationParts.length > 1 ? destinationParts[destinationParts.length - 1] : destination;

      const { error } = await supabase.from("saved_trips").insert({
        user_id: user.id,
        destination_name: destination,
        destination_country: country,
        notes: itinerary,
        status: "planned",
      });

      if (error) throw error;

      setSaved(true);
      toast({
        title: "Saved!",
        description: "Itinerary saved to your trips",
      });
    } catch (error) {
      console.error("Error saving trip:", error);
      toast({
        title: "Error",
        description: "Failed to save trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setItinerary(null);
      setDestination("");
      setSaved(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Professional Itinerary (PRD Format)
          </DialogTitle>
        </DialogHeader>

        {!itinerary ? (
          <div className="py-8 text-center">
            <div className="mb-6">
              <FileText className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">PRD-Style Travel Document</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Convert your conversation into a comprehensive, professionally structured travel itinerary 
                with executive summary, detailed daily plans, budget breakdown, and more.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <p className="text-sm font-medium mb-2">Document includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Executive Summary</li>
                <li>✓ Trip Objectives</li>
                <li>✓ Detailed Day-by-Day Itinerary</li>
                <li>✓ Budget Breakdown</li>
                <li>✓ Logistics & Requirements</li>
                <li>✓ Packing Checklist</li>
                <li>✓ Emergency Information</li>
              </ul>
            </div>
            <Button onClick={generateItinerary} disabled={isGenerating} size="lg">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PRD Document...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Pencil className="h-3 w-3" />
                  Click to edit your itinerary before exporting
                </span>
              </div>
              <Textarea
                value={itinerary}
                onChange={(e) => setItinerary(e.target.value)}
                className="h-[450px] font-mono text-xs resize-none"
                placeholder="Your itinerary will appear here..."
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={downloadAsPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                onClick={saveToTrips}
                disabled={isSaving || saved}
                variant={saved ? "secondary" : "default"}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Saved to Trips
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save to My Trips
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
