import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TravelPackage {
  id: number;
  title: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  highlights: string[];
  includes: string[];
}

interface PackageCardProps {
  pkg: TravelPackage;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log(`[PackageCard] Fetching image for: ${pkg.destination}`);
        
        const { data, error } = await supabase.functions.invoke('fetch-place-images', {
          body: { query: pkg.destination }
        });

        if (error) {
          console.error(`[PackageCard] Edge function error for ${pkg.destination}:`, error);
          setIsLoading(false);
          return;
        }

        console.log(`[PackageCard] API response for ${pkg.destination}:`, data);

        if (data?.images && data.images.length > 0) {
          // Ensure HTTPS
          let url = data.images[0].url;
          if (url && url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
          }
          console.log(`[PackageCard] Setting image URL for ${pkg.destination}:`, url);
          setImageUrl(url);
        } else {
          console.log(`[PackageCard] No images found for ${pkg.destination}`);
        }
      } catch (err) {
        console.error(`[PackageCard] Error fetching image for ${pkg.destination}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [pkg.destination]);

  return (
    <Card className="overflow-hidden hover-lift shadow-card">
      <div className="h-64 bg-muted relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        
        {/* Image */}
        {isLoading ? (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={pkg.destination}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error(`[PackageCard] Image failed to load for ${pkg.destination}`);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        
        {/* Save badge */}
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="destructive" className="bg-accent">
            Save ${pkg.originalPrice - pkg.price}
          </Badge>
        </div>
        
        {/* Destination info */}
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{pkg.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{pkg.rating}</span>
              <span className="text-xs opacity-75">({pkg.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{pkg.title}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>{pkg.duration}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${pkg.price}</div>
            <div className="text-sm text-muted-foreground line-through">${pkg.originalPrice}</div>
            <div className="text-xs text-muted-foreground">per person</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Package Highlights:</h4>
          <div className="flex flex-wrap gap-2">
            {pkg.highlights.map((highlight, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Includes:</h4>
          <ul className="text-sm text-muted-foreground">
            {pkg.includes.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary-hover">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
