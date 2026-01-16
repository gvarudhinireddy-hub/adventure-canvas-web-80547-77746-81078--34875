import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, DollarSign, Download, Plane, Clock, FileText, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import jsPDF from "jspdf";

interface TripDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: {
    id: string;
    destination_name: string;
    destination_country: string;
    destination_image: string | null;
    start_date: string | null;
    end_date: string | null;
    notes: string | null;
    budget: number | null;
    status: string;
  } | null;
}

interface AIDetails {
  overview: string;
  highlights: string[];
  bestTimeToVisit: string;
  budgetTips: string[];
  mustTry: string[];
}

export const TripDetailsModal = ({ open, onOpenChange, trip }: TripDetailsModalProps) => {
  const [aiDetails, setAiDetails] = useState<AIDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open && trip) {
      fetchAIDetails();
      fetchImage();
    }
  }, [open, trip]);

  const fetchImage = async () => {
    if (!trip) return;
    
    try {
      const { data } = await supabase.functions.invoke('fetch-place-images', {
        body: { query: `${trip.destination_name} ${trip.destination_country}` }
      });
      
      if (data?.images?.[0]?.url) {
        let url = data.images[0].url;
        if (url.startsWith('http://')) url = url.replace('http://', 'https://');
        setImageUrl(url);
      }
    } catch (err) {
      console.error('Error fetching image:', err);
    }
  };

  const fetchAIDetails = async () => {
    if (!trip) return;
    
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('fetch-place-details', {
        body: { placeName: `${trip.destination_name}, ${trip.destination_country}` }
      });
      
      if (data && !data.error) {
        setAiDetails({
          overview: data.overview || data.description || `Discover the beauty of ${trip.destination_name}`,
          highlights: (data.topAttractions || []).slice(0, 4),
          bestTimeToVisit: data.bestSeason || 'Year-round',
          budgetTips: (data.safetyTips || []).slice(0, 3),
          mustTry: (data.localTransport || []).slice(0, 3),
        });
      }
    } catch (err) {
      console.error('Error fetching AI details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = () => {
    if (!trip?.start_date) return "Dates to be decided";
    const start = format(new Date(trip.start_date), "MMM d, yyyy");
    if (!trip.end_date) return start;
    const end = format(new Date(trip.end_date), "MMM d, yyyy");
    return `${start} – ${end}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned": return "bg-blue-500/10 text-blue-600";
      case "booked": return "bg-primary/10 text-primary";
      case "completed": return "bg-green-500/10 text-green-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const exportToPDF = () => {
    if (!trip) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(trip.destination_name, 20, 25);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(trip.destination_country, 20, 35);
    
    // Content
    let y = 60;
    doc.setTextColor(0, 0, 0);
    
    // Trip Details Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y - 5, pageWidth - 30, 35, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("DATES", 25, y + 5);
    doc.text("BUDGET", 90, y + 5);
    doc.text("STATUS", 155, y + 5);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(formatDateRange(), 25, y + 18);
    doc.text(trip.budget ? `$${trip.budget.toLocaleString()}` : "Flexible", 90, y + 18);
    doc.text(trip.status.charAt(0).toUpperCase() + trip.status.slice(1), 155, y + 18);
    
    y += 50;
    
    // Overview
    if (aiDetails?.overview) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text("Overview", 20, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const overviewLines = doc.splitTextToSize(aiDetails.overview.slice(0, 300) + "...", pageWidth - 40);
      doc.text(overviewLines, 20, y);
      y += overviewLines.length * 5 + 15;
    }
    
    // Highlights
    if (aiDetails?.highlights?.length) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text("Top Highlights", 20, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      aiDetails.highlights.forEach((highlight, i) => {
        doc.text(`• ${highlight}`, 25, y);
        y += 7;
      });
      y += 10;
    }
    
    // Notes
    if (trip.notes) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text("My Notes", 20, y);
      y += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const noteLines = doc.splitTextToSize(trip.notes, pageWidth - 40);
      doc.text(noteLines, 20, y);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by WanderNest • wandernest.app", pageWidth / 2, 285, { align: "center" });
    
    doc.save(`${trip.destination_name.replace(/\s+/g, '-')}-trip-plan.pdf`);
  };

  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* Hero Image */}
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          {imageUrl || trip.destination_image ? (
            <img 
              src={imageUrl || trip.destination_image || ''} 
              alt={trip.destination_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold">{trip.destination_name}</h2>
            <p className="text-white/80 flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {trip.destination_country}
            </p>
          </div>
          <Badge className={`absolute top-4 right-4 ${getStatusColor(trip.status)}`}>
            <Plane className="h-3 w-3 mr-1" />
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Dates</p>
                <p className="font-medium text-sm">{formatDateRange()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-medium text-sm">{trip.budget ? `$${trip.budget.toLocaleString()}` : "Flexible"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI-Generated Overview */}
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : aiDetails ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  About This Destination
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiDetails.overview.length > 200 ? aiDetails.overview.slice(0, 200) + "..." : aiDetails.overview}
                </p>
              </div>

              {aiDetails.highlights.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">✨ Top Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiDetails.highlights.map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {h.length > 25 ? h.slice(0, 25) + "..." : h}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm"><strong>Best Time:</strong> {aiDetails.bestTimeToVisit}</span>
              </div>
            </div>
          ) : null}

          {/* User Notes */}
          {trip.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  My Notes
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  {trip.notes}
                </p>
              </div>
            </>
          )}

          {/* Export Button */}
          <Button onClick={exportToPDF} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
