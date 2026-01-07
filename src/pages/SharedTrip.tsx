import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, Clock, Plane, ArrowLeft, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SharedTripData {
  id: string;
  destination_name: string;
  destination_country: string;
  destination_image: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  budget: number | null;
  status: string;
}

const SharedTrip = () => {
  const { token } = useParams<{ token: string }>();
  const [trip, setTrip] = useState<SharedTripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      if (!token) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      // First get the shared_trips entry
      const { data: shareData, error: shareError } = await supabase
        .from("shared_trips")
        .select("trip_id, is_public, expires_at")
        .eq("share_token", token)
        .maybeSingle();

      if (shareError || !shareData) {
        setError("This shared trip doesn't exist or has been removed");
        setLoading(false);
        return;
      }

      // Check if expired
      if (shareData.expires_at && new Date(shareData.expires_at) < new Date()) {
        setError("This share link has expired");
        setLoading(false);
        return;
      }

      if (!shareData.is_public) {
        setError("This trip is no longer shared");
        setLoading(false);
        return;
      }

      // Fetch the trip data
      const { data: tripData, error: tripError } = await supabase
        .from("saved_trips")
        .select("id, destination_name, destination_country, destination_image, start_date, end_date, notes, budget, status")
        .eq("id", shareData.trip_id)
        .maybeSingle();

      if (tripError || !tripData) {
        setError("The trip associated with this link no longer exists");
        setLoading(false);
        return;
      }

      setTrip(tripData);
      setLoading(false);
    };

    fetchSharedTrip();
  }, [token]);

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return "Dates not set";
    const start = format(new Date(startDate), "MMM d, yyyy");
    if (!endDate) return start;
    const end = format(new Date(endDate), "MMM d, yyyy");
    return `${start} - ${end}`;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4 mx-auto">
              <Share2 className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Trip Not Found</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{trip.destination_name} Trip - Shared via WanderNest</title>
        <meta name="description" content={`Check out this trip to ${trip.destination_name}, ${trip.destination_country}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-80 overflow-hidden">
          <img
            src={trip.destination_image || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop`}
            alt={trip.destination_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
                <Share2 className="h-3 w-3 mr-1" />
                Shared Trip
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {trip.destination_name}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{trip.destination_country}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trip Details */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-primary" />
                    Trip Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`${getStatusColor(trip.status)} text-lg py-2 px-4`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </Badge>
                </CardContent>
              </Card>

              {/* Dates Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Travel Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{formatDateRange(trip.start_date, trip.end_date)}</p>
                </CardContent>
              </Card>

              {/* Budget Card */}
              {trip.budget && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">${trip.budget.toLocaleString()}</p>
                  </CardContent>
                </Card>
              )}

              {/* Notes Card */}
              {trip.notes && (
                <Card className={trip.budget ? "" : "md:col-span-2"}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{trip.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* CTA */}
            <Card className="mt-8 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Want to plan your own adventure?</h3>
                <p className="text-muted-foreground mb-4">
                  Create an account to save and share your trips with WanderNest
                </p>
                <div className="flex gap-4 justify-center">
                  <Link to="/auth">
                    <Button>Get Started</Button>
                  </Link>
                  <Link to="/destinations">
                    <Button variant="outline">Explore Destinations</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default SharedTrip;