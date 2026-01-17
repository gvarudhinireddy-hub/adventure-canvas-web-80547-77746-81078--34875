import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Heart,
  Clock,
  Plane,
  LogIn,
  History,
  RotateCcw,
  Share2,
  Copy,
  Check,
  Link as LinkIcon,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { TripDetailsModal } from "@/components/TripDetailsModal";

interface SavedTrip {
  id: string;
  destination_name: string;
  destination_country: string;
  destination_image: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  budget: number | null;
  status: string;
  created_at: string;
}

interface TripHistoryEntry {
  id: string;
  trip_id: string;
  destination_name: string;
  destination_country: string;
  destination_image: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  budget: number | null;
  status: string | null;
  action: string;
  changed_at: string;
}

const SavedTrips = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [history, setHistory] = useState<TripHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<SavedTrip | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharingTrip, setSharingTrip] = useState<SavedTrip | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewingTrip, setViewingTrip] = useState<SavedTrip | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    destination_name: "",
    destination_country: "",
    destination_image: "",
    start_date: "",
    end_date: "",
    notes: "",
    budget: "",
    status: "planned"
  });

  const fetchTrips = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("saved_trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading trips",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchTrips();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchHistory = async () => {
    if (!user) return;

    setHistoryLoading(true);
    const { data, error } = await supabase
      .from("trip_history")
      .select("*")
      .order("changed_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading history",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setHistory(data || []);
    }
    setHistoryLoading(false);
  };

  const handleSaveTrip = async () => {
    if (!user) return;

    const tripData = {
      user_id: user.id,
      destination_name: formData.destination_name,
      destination_country: formData.destination_country,
      destination_image: formData.destination_image || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      notes: formData.notes || null,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      status: formData.status,
    };

    if (editingTrip) {
      const { error } = await supabase
        .from("saved_trips")
        .update(tripData)
        .eq("id", editingTrip.id);

      if (error) {
        toast({
          title: "Error updating trip",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Trip Updated",
          description: "Your trip has been updated successfully.",
        });
        fetchTrips();
      }
    } else {
      const { error } = await supabase
        .from("saved_trips")
        .insert([tripData]);

      if (error) {
        toast({
          title: "Error saving trip",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Trip Saved",
          description: "Your trip has been added to your dashboard.",
        });
        fetchTrips();
      }
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("saved_trips")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting trip",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTrips(trips.filter(trip => trip.id !== id));
      toast({
        title: "Trip Deleted",
        description: "Your trip has been removed from your dashboard.",
      });
    }
  };

  const handleEdit = (trip: SavedTrip) => {
    setEditingTrip(trip);
    setFormData({
      destination_name: trip.destination_name,
      destination_country: trip.destination_country,
      destination_image: trip.destination_image || "",
      start_date: trip.start_date || "",
      end_date: trip.end_date || "",
      notes: trip.notes || "",
      budget: trip.budget?.toString() || "",
      status: trip.status,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTrip(null);
    setFormData({
      destination_name: "",
      destination_country: "",
      destination_image: "",
      start_date: "",
      end_date: "",
      notes: "",
      budget: "",
      status: "planned"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
      case "booked":
        return <Plane className="h-4 w-4" />;
      case "completed":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <Heart className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "booked":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "";
    }
  };

  const filterTrips = (status: string) => {
    if (status === "all") return trips;
    if (status === "upcoming") return trips.filter(trip => trip.status === "planned" || trip.status === "booked");
    if (status === "past") return trips.filter(trip => trip.status === "completed");
    if (status === "wishlist") return trips.filter(trip => trip.status === "cancelled");
    return trips.filter(trip => trip.status === status);
  };

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return "Dates not set";
    const start = format(new Date(startDate), "MMM d, yyyy");
    if (!endDate) return start;
    const end = format(new Date(endDate), "MMM d, yyyy");
    return `${start} - ${end}`;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "updated":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "deleted":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  const HistoryCard = ({ entry }: { entry: TripHistoryEntry }) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{entry.destination_name}</CardTitle>
          <Badge className={getActionColor(entry.action)}>
            {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
          </Badge>
        </div>
        <CardDescription className="space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{entry.destination_country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(entry.changed_at), "MMM d, yyyy 'at' h:mm a")}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {entry.status && (
            <span className="flex items-center gap-1">
              Status: {entry.status}
            </span>
          )}
          {entry.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {entry.budget.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const handleShare = async (trip: SavedTrip) => {
    if (!user) return;

    setSharingTrip(trip);
    setShareDialogOpen(true);
    setShareLink(null);
    setCopied(false);

    // Check if a share already exists
    const { data: existingShare } = await supabase
      .from("shared_trips")
      .select("share_token")
      .eq("trip_id", trip.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingShare) {
      setShareLink(`${window.location.origin}/shared/${existingShare.share_token}`);
    } else {
      // Create new share
      const { data: newShare, error } = await supabase
        .from("shared_trips")
        .insert([{ trip_id: trip.id, user_id: user.id }])
        .select("share_token")
        .single();

      if (error) {
        toast({
          title: "Error creating share link",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setShareLink(`${window.location.origin}/shared/${newShare.share_token}`);
      }
    }
  };

  const copyToClipboard = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share this link with your friends",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const TripCard = ({ trip }: { trip: SavedTrip }) => (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => { setViewingTrip(trip); setViewModalOpen(true); }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.destination_image || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop`} 
          alt={trip.destination_name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge className={getStatusColor(trip.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(trip.status)}
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{trip.destination_name}</CardTitle>
        <CardDescription className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{trip.destination_country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
          </div>
          {trip.budget && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>${trip.budget.toLocaleString()}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {trip.notes && (
            <p className="text-sm text-muted-foreground truncate max-w-[100px]">
              {trip.notes}
            </p>
          )}
          <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => navigate(`/ai-concierge?refine=${encodeURIComponent(trip.destination_name)}&country=${encodeURIComponent(trip.destination_country)}&budget=${trip.budget || ''}&dates=${trip.start_date || ''}_${trip.end_date || ''}`)}
              title="Plan with AI"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Plan with AI
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleShare(trip)}
              title="Share trip"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEdit(trip)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDelete(trip.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ type }: { type: string }) => (
    <Card className="p-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">No {type} trips yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {type === "upcoming" && "Start planning your next adventure!"}
          {type === "past" && "Your travel memories will appear here"}
          {type === "wishlist" && "Add destinations you dream of visiting"}
          {type === "all" && "Create your first trip to get started"}
        </p>
        <Link to="/ai-concierge">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Trip
          </Button>
        </Link>
      </div>
    </Card>
  );

  const NotLoggedIn = () => (
    <Card className="p-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <LogIn className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Sign in to save trips</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Create an account or sign in to save your trips and access them from anywhere.
        </p>
        <Link to="/auth">
          <Button>
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </Link>
      </div>
    </Card>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Trips - WanderNest</title>
        <meta name="description" content="View and manage your saved trips, upcoming adventures, and travel wishlist." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                My Trips Dashboard
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Manage your upcoming adventures, past travels, and dream destinations
              </p>
              {user && (
                <Button size="lg" onClick={() => navigate('/ai-concierge')}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Trip
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Edit Trip Dialog - kept for editing existing trips */}
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTrip ? "Edit Trip" : "Create New Trip"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="destination_name">Destination Name *</Label>
                <Input
                  id="destination_name"
                  value={formData.destination_name}
                  onChange={(e) => setFormData({ ...formData, destination_name: e.target.value })}
                  placeholder="e.g., Paris"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination_country">Country *</Label>
                <Input
                  id="destination_country"
                  value={formData.destination_country}
                  onChange={(e) => setFormData({ ...formData, destination_country: e.target.value })}
                  placeholder="e.g., France"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination_image">Image URL</Label>
                <Input
                  id="destination_image"
                  value={formData.destination_image}
                  onChange={(e) => setFormData({ ...formData, destination_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., 2500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any notes about your trip..."
                />
              </div>
              <Button 
                onClick={handleSaveTrip} 
                className="w-full"
                disabled={!formData.destination_name || !formData.destination_country}
              >
                {editingTrip ? "Update Trip" : "Save Trip"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            {!user ? (
              <NotLoggedIn />
            ) : (
              <Tabs defaultValue="all" className="space-y-8">
                <TabsList className="grid w-full max-w-lg mx-auto grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="wishlist">Cancelled</TabsTrigger>
                  <TabsTrigger value="history" onClick={fetchHistory}>
                    <History className="h-4 w-4 mr-1" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {trips.length === 0 ? (
                    <EmptyState type="all" />
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trips.map(trip => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-6">
                  {filterTrips("upcoming").length === 0 ? (
                    <EmptyState type="upcoming" />
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterTrips("upcoming").map(trip => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-6">
                  {filterTrips("past").length === 0 ? (
                    <EmptyState type="past" />
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterTrips("past").map(trip => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-6">
                  {filterTrips("wishlist").length === 0 ? (
                    <EmptyState type="wishlist" />
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterTrips("wishlist").map(trip => (
                        <TripCard key={trip.id} trip={trip} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  {historyLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : history.length === 0 ? (
                    <Card className="p-12">
                      <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                          <RotateCcw className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">No history yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          Your trip changes will be logged here automatically
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {history.length} change{history.length !== 1 ? 's' : ''} to your trips
                      </p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map(entry => (
                          <HistoryCard key={entry.id} entry={entry} />
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Share Trip
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {sharingTrip && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{sharingTrip.destination_name}</p>
                    <p className="text-sm text-muted-foreground">{sharingTrip.destination_country}</p>
                  </div>
                </div>
              )}
              
              {shareLink ? (
                <div className="space-y-3">
                  <Label>Share Link</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={shareLink} 
                      readOnly 
                      className="text-sm"
                    />
                    <Button onClick={copyToClipboard} variant="outline">
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Anyone with this link can view your trip details
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <footer className="border-t py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; 2025 WanderNest. Your journey starts here.</p>
          </div>
        </footer>

        {/* Trip Details Modal */}
        <TripDetailsModal 
          open={viewModalOpen} 
          onOpenChange={setViewModalOpen} 
          trip={viewingTrip} 
        />
      </div>
    </>
  );
};

export default SavedTrips;
