import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, Loader2, FileText, CheckCircle, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

  const downloadItinerary = () => {
    if (!itinerary) return;

    const blob = new Blob([itinerary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${destination.replace(/[^a-z0-9]/gi, "_")}_itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Your itinerary has been downloaded",
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
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Professional Itinerary
          </DialogTitle>
        </DialogHeader>

        {!itinerary ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-6">
              Convert your chat conversation into a professional, downloadable travel itinerary.
            </p>
            <Button onClick={generateItinerary} disabled={isGenerating} size="lg">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
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
                  Click to edit your itinerary
                </span>
              </div>
              <Textarea
                value={itinerary}
                onChange={(e) => setItinerary(e.target.value)}
                className="h-[400px] font-mono text-sm resize-none"
                placeholder="Your itinerary will appear here..."
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={downloadItinerary}>
                <Download className="mr-2 h-4 w-4" />
                Download
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
