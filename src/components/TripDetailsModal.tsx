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
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colorful gradient header
    doc.setFillColor(20, 184, 166); // Teal
    doc.rect(0, 0, pageWidth, 55, 'F');
    doc.setFillColor(14, 165, 233); // Sky blue accent
    doc.rect(0, 0, pageWidth, 8, 'F');
    
    // Decorative accent stripe
    doc.setFillColor(245, 158, 11); // Amber accent
    doc.rect(0, 48, pageWidth, 7, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(trip.destination_name, 20, 30);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`📍 ${trip.destination_country}`, 20, 44);
    
    // Content area
    let y = 70;
    
    // Trip Details Cards - Colorful boxes
    const cardWidth = (pageWidth - 50) / 3;
    
    // Date Card - Orange
    doc.setFillColor(251, 146, 60);
    doc.roundedRect(15, y, cardWidth, 30, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("📅 DATES", 20, y + 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const dateText = formatDateRange();
    doc.text(dateText.length > 18 ? dateText.slice(0, 16) + ".." : dateText, 20, y + 22);
    
    // Budget Card - Green
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(20 + cardWidth, y, cardWidth, 30, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("💰 BUDGET", 25 + cardWidth, y + 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(trip.budget ? `$${trip.budget.toLocaleString()}` : "Flexible", 25 + cardWidth, y + 22);
    
    // Status Card - Purple
    doc.setFillColor(168, 85, 247);
    doc.roundedRect(25 + cardWidth * 2, y, cardWidth, 30, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("✈️ STATUS", 30 + cardWidth * 2, y + 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(trip.status.charAt(0).toUpperCase() + trip.status.slice(1), 30 + cardWidth * 2, y + 22);
    
    y += 45;
    
    // Overview Section
    if (aiDetails?.overview) {
      // Section header with colored accent
      doc.setFillColor(20, 184, 166);
      doc.roundedRect(15, y - 2, 4, 16, 1, 1, 'F');
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 184, 166);
      doc.text("✨ About This Destination", 25, y + 8);
      y += 18;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      const overviewText = aiDetails.overview.length > 280 ? aiDetails.overview.slice(0, 280) + "..." : aiDetails.overview;
      const overviewLines = doc.splitTextToSize(overviewText, pageWidth - 40);
      doc.text(overviewLines, 20, y);
      y += overviewLines.length * 5 + 15;
    }
    
    // Highlights Section
    if (aiDetails?.highlights?.length) {
      doc.setFillColor(251, 146, 60);
      doc.roundedRect(15, y - 2, 4, 16, 1, 1, 'F');
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(251, 146, 60);
      doc.text("🌟 Top Highlights", 25, y + 8);
      y += 18;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      aiDetails.highlights.forEach((highlight, i) => {
        const colors = [[20, 184, 166], [14, 165, 233], [168, 85, 247], [251, 146, 60]];
        const color = colors[i % colors.length];
        doc.setFillColor(color[0], color[1], color[2]);
        doc.circle(22, y - 1.5, 2, 'F');
        doc.setTextColor(75, 85, 99);
        const highlightText = highlight.length > 60 ? highlight.slice(0, 58) + "..." : highlight;
        doc.text(highlightText, 28, y);
        y += 8;
      });
      y += 10;
    }
    
    // Best Time Section
    if (aiDetails?.bestTimeToVisit) {
      doc.setFillColor(245, 245, 255);
      doc.roundedRect(15, y, pageWidth - 30, 22, 3, 3, 'F');
      doc.setFillColor(14, 165, 233);
      doc.roundedRect(15, y, 4, 22, 1, 1, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(14, 165, 233);
      doc.setFont("helvetica", "bold");
      doc.text("🕐 Best Time to Visit: ", 25, y + 14);
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "normal");
      doc.text(aiDetails.bestTimeToVisit, 75, y + 14);
      y += 32;
    }
    
    // Notes Section
    if (trip.notes && y < 240) {
      doc.setFillColor(168, 85, 247);
      doc.roundedRect(15, y - 2, 4, 16, 1, 1, 'F');
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(168, 85, 247);
      doc.text("📝 My Notes", 25, y + 8);
      y += 18;
      
      doc.setFillColor(250, 245, 255);
      doc.roundedRect(15, y - 3, pageWidth - 30, 25, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      const noteText = trip.notes.length > 150 ? trip.notes.slice(0, 148) + "..." : trip.notes;
      const noteLines = doc.splitTextToSize(noteText, pageWidth - 45);
      doc.text(noteLines, 22, y + 8);
    }
    
    // Colorful Footer
    doc.setFillColor(20, 184, 166);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    doc.setFillColor(14, 165, 233);
    doc.rect(0, pageHeight - 5, pageWidth, 5, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("WanderNest", 20, pageHeight - 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Your Travel Companion", pageWidth - 20, pageHeight - 8, { align: "right" });
    
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
