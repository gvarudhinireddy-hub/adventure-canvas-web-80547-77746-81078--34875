import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, ArrowRight, Sparkles } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { destinations } from "@/data/destinations";
import { Price } from "@/components/Price";
import { WishlistButton } from "@/components/WishlistButton";
import { SocialShare } from "@/components/SocialShare";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  
  const wishlistDestinations = destinations.filter(d => wishlist.includes(d.id));

  return (
    <>
      <Helmet>
        <title>My Wishlist | WanderNest</title>
        <meta name="description" content="Your saved travel destinations and dream trips" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                My Wishlist
              </h1>
              <p className="text-muted-foreground mt-2">
                {wishlistDestinations.length} {wishlistDestinations.length === 1 ? 'destination' : 'destinations'} saved
              </p>
            </div>
            <SocialShare 
              title="Check out my travel wishlist on WanderNest!" 
              description="I'm dreaming about these amazing destinations"
              variant="outline"
            />
          </div>

          {wishlistDestinations.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring destinations and save your favorites by clicking the heart icon
              </p>
              <Link to="/destinations">
                <Button size="lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explore Destinations
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistDestinations.map((destination) => (
                <Card key={destination.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    <WishlistButton destination={destination} variant="overlay" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{destination.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {destination.rating}
                        </Badge>
                        <Badge variant="secondary" className="bg-primary/30 text-white">
                          {destination.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{destination.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{destination.country}</p>
                      </div>
                      <span className="text-primary font-bold">
                        <Price priceString={destination.price} />
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {destination.description}
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/destinations/${destination.id}`} className="flex-1">
                        <Button className="w-full" variant="default">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
