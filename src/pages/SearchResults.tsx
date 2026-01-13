import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Star,
  Calendar,
  DollarSign,
  ArrowLeft,
  Plane,
  Shield,
  ChevronRight,
  Map,
  Info,
} from "lucide-react";
import { SearchBarWithAutocomplete } from "@/components/SearchBarWithAutocomplete";
import { supabase } from "@/integrations/supabase/client";

interface PlaceDetails {
  name: string;
  country: string;
  description: string;
  bestSeason: string;
  topAttractions: string[];
  currency: string;
  budgetLevel: string;
  safetyTips: string[];
  localTransport: string[];
  overview: string;
}

interface UnsplashImage {
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get("q") || "").trim();

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    void fetchPlaceData(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchPlaceData = async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch details first (it often corrects spelling/capitalization)
      const detailsResult = await fetchPlaceDetails(searchTerm);
      setPlaceDetails(detailsResult);

      const canonicalName = (detailsResult?.name || searchTerm).trim();
      const canonicalCountry = (detailsResult?.country || "").trim();
      const imageQuery = canonicalCountry
        ? `${canonicalName} ${canonicalCountry}`
        : canonicalName;

      let imagesResult = await fetchUnsplashImages(imageQuery);

      // If we corrected the name and still got nothing, try just the canonical name
      if (
        imagesResult.length === 0 &&
        canonicalName.toLowerCase() !== searchTerm.toLowerCase()
      ) {
        imagesResult = await fetchUnsplashImages(canonicalName);
      }

      setImages(imagesResult);
    } catch (err: any) {
      console.error("Error fetching place data:", err);
      setError(err.message || "Failed to load place information");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnsplashImages = async (placeName: string): Promise<UnsplashImage[]> => {
    try {
      const response = await supabase.functions.invoke("fetch-place-images", {
        body: { query: placeName }
      });

      if (response.error) throw response.error;
      return response.data?.images || [];
    } catch (err) {
      console.error("Error fetching images:", err);
      return [];
    }
  };

  const fetchPlaceDetails = async (placeName: string): Promise<PlaceDetails | null> => {
    try {
      const response = await supabase.functions.invoke("fetch-place-details", {
        body: { placeName }
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (err) {
      console.error("Error fetching details:", err);
      // Return basic structure if API fails
      return {
        name: placeName,
        country: "",
        description: `Explore the beauty and culture of ${placeName}.`,
        bestSeason: "Year-round",
        topAttractions: [],
        currency: "",
        budgetLevel: "Varies",
        safetyTips: [],
        localTransport: [],
        overview: `${placeName} is a destination waiting to be explored. Search for more details or ask our AI Concierge for personalized recommendations.`
      };
    }
  };

  const handleNewSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Search for a Destination</h1>
          <p className="text-muted-foreground mb-8">Enter a place name to discover it</p>
          <div className="max-w-xl mx-auto">
            <SearchBarWithAutocomplete 
              onSearch={handleNewSearch}
              placeholder="Search any place in the world..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4 pt-20">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/destinations" className="hover:text-primary">Destinations</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium capitalize">{query}</span>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState error={error} onRetry={() => fetchPlaceData(query)} />
      ) : (
        <>
          {/* Hero Section with Image */}
          <section className="relative h-[60vh] overflow-hidden">
            {images.length > 0 ? (
              <img 
                src={images[0].url} 
                alt={images[0].alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <MapPin className="h-24 w-24 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 capitalize">
                  {placeDetails?.name || query}
                </h1>
                {placeDetails?.country && (
                  <p className="text-xl text-white/80 mb-4">{placeDetails.country}</p>
                )}
                <p className="text-lg text-white/90 max-w-2xl">
                  {placeDetails?.description}
                </p>
                
                {images.length > 0 && (
                  <p className="text-xs text-white/50 mt-4">
                    Photo by{" "}
                    <a 
                      href={images[0].photographerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-white/70"
                    >
                      {images[0].photographer}
                    </a>
                    {" "}on Unsplash
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Quick Info Cards */}
          <section className="py-8 bg-card/30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Best Season</p>
                        <p className="font-semibold">{placeDetails?.bestSeason || "Year-round"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Budget Level</p>
                        <p className="font-semibold">{placeDetails?.budgetLevel || "Varies"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Plane className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Currency</p>
                        <p className="font-semibold">{placeDetails?.currency || "Local"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Info className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Need More Info?</p>
                        <Link to="/ai-concierge" className="text-primary font-semibold hover:underline">
                          Ask AI Concierge
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {placeDetails?.overview}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Top Attractions */}
                  {placeDetails?.topAttractions && placeDetails.topAttractions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <MapPin className="h-6 w-6 text-primary" />
                          Top Attractions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {placeDetails.topAttractions.map((attraction, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-smooth">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {index + 1}
                              </div>
                              <p className="font-medium">{attraction}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Photo Gallery */}
                  {images.length > 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Photo Gallery</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {images.slice(1, 7).map((image, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={image.alt}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Safety Tips */}
                  {placeDetails?.safetyTips && placeDetails.safetyTips.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <Shield className="h-6 w-6 text-primary" />
                          Safety Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {placeDetails.safetyTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Plan Your Trip</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full" onClick={() => navigate("/ai-concierge")}>
                        <Star className="h-4 w-4 mr-2" />
                        Ask AI Concierge
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => navigate("/itinerary-builder")}>
                        Build Itinerary
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => navigate("/book")}>
                        Book Hotels
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => navigate("/map")}>
                        <Map className="h-4 w-4 mr-2" />
                        View on Map
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Local Transport */}
                  {placeDetails?.localTransport && placeDetails.localTransport.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Getting Around</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {placeDetails.localTransport.map((transport, index) => (
                            <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                              {transport}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Search Again */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Explore More</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SearchBarWithAutocomplete 
                        onSearch={handleNewSearch}
                        placeholder="Search another place..."
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton className="h-[60vh] w-full mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
    <p className="text-muted-foreground mb-6">{error}</p>
    <Button onClick={onRetry}>Try Again</Button>
  </div>
);

export default SearchResults;
