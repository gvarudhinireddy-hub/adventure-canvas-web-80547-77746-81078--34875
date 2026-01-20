import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, Info, Sparkles } from "lucide-react";
import { Price } from "@/components/Price";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { WishlistButton } from "@/components/WishlistButton";
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
  const [showQuickFacts, setShowQuickFacts] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      setIsLoading(true);

      try {
        const searchQuery = `${destination.name} ${destination.country}`;
        const response = await supabase.functions.invoke("fetch-place-images", {
          body: { query: searchQuery }
        });

        if (!isMounted) return;

        if (response.error) {
          setIsLoading(false);
          return;
        }

        const images = response.data?.images || [];
        if (images.length > 0 && images[0]?.url) {
          const firstImage = images[0];
          const imageUrl = firstImage.url?.replace(/^http:/, 'https:');
          
          if (imageUrl && imageUrl.includes('unsplash.com') && !imageUrl.includes('source.unsplash.com')) {
            setImageData({
              url: imageUrl,
              alt: firstImage.alt || `${destination.name} travel photo`,
              photographer: firstImage.photographer || "Unsplash",
              photographerUrl: firstImage.photographerUrl || "https://unsplash.com"
            });
          }
        }
      } catch (error) {
        console.error(`[DestinationCard] Fetch error for ${destination.name}:`, error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [destination.name, destination.country]);

  const quickFacts = destination.quickFacts || [
    `Best Season: ${destination.bestSeason}`,
    `Budget: ${destination.budgetLevel}`,
    `Currency: ${destination.currency}`
  ];

  return (
    <Card 
      className="overflow-hidden shadow-card group transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
      onMouseEnter={() => setShowQuickFacts(true)}
      onMouseLeave={() => setShowQuickFacts(false)}
    >
      <div className="h-64 bg-muted relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : imageData?.url ? (
          <img
            src={imageData.url}
            alt={imageData.alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
        
        {destination.isHiddenGem && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className="bg-amber-500/90 text-white border-0 gap-1">
              <Sparkles className="h-3 w-3" />
              Hidden Gem
            </Badge>
          </div>
        )}
        
        <div className="absolute top-4 right-4 z-20">
          <WishlistButton destination={destination} size="sm" />
        </div>
        
        <div className={`absolute inset-0 bg-black/70 z-15 flex items-center justify-center p-4 transition-opacity duration-300 ${
          showQuickFacts ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="text-white text-center space-y-2">
            <Info className="h-6 w-6 mx-auto mb-3 text-primary" />
            <h4 className="font-semibold text-lg">Quick Facts</h4>
            <ul className="text-sm space-y-1 text-white/90">
              {quickFacts.slice(0, 4).map((fact, i) => (
                <li key={i}>• {fact}</li>
              ))}
            </ul>
          </div>
        </div>
        
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
                <VerifiedBadge source={destination.verificationSource || "trusted APIs"} size="sm" />
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
        <p className="text-muted-foreground mb-3 text-sm line-clamp-2">{destination.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="outline" className="text-xs">{destination.bestSeason}</Badge>
          <Badge variant="outline" className="text-xs">{destination.budgetLevel} Budget</Badge>
        </div>
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Top Attractions:</p>
          <p className="text-xs">{destination.topAttractions.slice(0, 2).join(", ")}</p>
        </div>
        <Link to={`/destinations/${destination.id}`} className="block w-full">
          <Button className="w-full bg-primary hover:bg-primary-hover transition-all duration-300 group-hover:shadow-lg">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
