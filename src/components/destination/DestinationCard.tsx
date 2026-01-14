import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { Price } from "@/components/Price";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { supabase } from "@/integrations/supabase/client";
import { Destination } from "@/data/destinations";

interface DestinationCardProps {
  destination: Destination;
}

interface UnsplashImage {
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export const DestinationCard = ({ destination }: DestinationCardProps) => {
  const [imageData, setImageData] = useState<UnsplashImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        // Build search query with destination name and country for better results
        const searchQuery = `${destination.name} ${destination.country}`;
        console.log(`[DestinationCard] Fetching image for: ${searchQuery}`);

        const response = await supabase.functions.invoke("fetch-place-images", {
          body: { query: searchQuery }
        });

        if (!isMounted) return;

        if (response.error) {
          console.error(`[DestinationCard] Error for ${destination.name}:`, response.error);
          setHasError(true);
          setIsLoading(false);
          return;
        }

        const images = response.data?.images || [];
        console.log(`[DestinationCard] Received ${images.length} images for ${destination.name}`);

        if (images.length > 0 && images[0]?.url) {
          // Safely extract first image with HTTPS enforcement
          const firstImage = images[0];
          const imageUrl = firstImage.url?.replace(/^http:/, 'https:');
          
          console.log(`[DestinationCard] Image URL for ${destination.name}:`, imageUrl);

          // Validate it's a real Unsplash image (not a fallback placeholder)
          // Only show images from Unsplash API results, not fallbacks
          if (imageUrl && imageUrl.includes('unsplash.com') && !imageUrl.includes('source.unsplash.com')) {
            setImageData({
              url: imageUrl,
              alt: firstImage.alt || `${destination.name} travel photo`,
              photographer: firstImage.photographer || "Unsplash",
              photographerUrl: firstImage.photographerUrl || "https://unsplash.com"
            });
          } else {
            // This is a fallback image - per requirements, leave empty
            console.log(`[DestinationCard] Skipping fallback image for ${destination.name}`);
            setImageData(null);
          }
        } else {
          // No results from Unsplash - leave empty per requirements
          console.log(`[DestinationCard] No Unsplash results for ${destination.name}`);
          setImageData(null);
        }
      } catch (error) {
        console.error(`[DestinationCard] Fetch error for ${destination.name}:`, error);
        setHasError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [destination.name, destination.country]);

  return (
    <Card className="overflow-hidden hover-lift shadow-card">
      {/* Image Section - min-height ensures visibility */}
      <div className="h-64 bg-muted relative overflow-visible">
        {isLoading ? (
          // Loading state
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : imageData?.url ? (
          // Image loaded successfully
          <img
            src={imageData.url}
            alt={imageData.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              console.error(`[DestinationCard] Image load error for ${destination.name}`);
              // On image load error, hide the broken image
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          // No image available - show empty muted background (per requirements)
          <div className="absolute inset-0 bg-muted" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none" />
        
        {/* Location info overlay */}
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{destination.name}, {destination.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
              ★ {destination.rating}
            </Badge>
            <Badge variant="secondary" className="bg-primary/20 text-white backdrop-blur-sm">
              {destination.continent}
            </Badge>
          </div>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">{destination.name}</span>
              {destination.isVerified && (
                <VerifiedBadge 
                  source={destination.verificationSource || "trusted APIs"}
                  size="sm"
                />
              )}
            </div>
            <span className="text-sm font-normal text-muted-foreground">{destination.country}</span>
          </div>
          <span className="text-lg text-primary font-bold whitespace-nowrap ml-2">
            <Price priceString={destination.price} showOriginal />
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground mb-3 text-sm">{destination.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="outline" className="text-xs">{destination.bestSeason}</Badge>
          <Badge variant="outline" className="text-xs">{destination.budgetLevel} Budget</Badge>
        </div>
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Top Attractions:</p>
          <p className="text-xs">{destination.topAttractions.slice(0, 2).join(", ")}</p>
        </div>
        <Link to={`/destinations/${destination.id}`} className="block w-full">
          <Button className="w-full bg-primary hover:bg-primary-hover" aria-label={`View details for ${destination.name}`}>
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
