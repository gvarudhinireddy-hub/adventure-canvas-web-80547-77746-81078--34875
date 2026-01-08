import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star, Clock, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const packages = [
  {
    id: 1,
    title: "Bali Adventure Package",
    destination: "Bali, Indonesia",
    duration: "7 Days, 6 Nights",
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg",
    highlights: ["Rice Terrace Tours", "Temple Visits", "Beach Relaxation", "Cultural Workshops"],
    includes: ["Accommodation", "Daily Breakfast", "Airport Transfers", "Guided Tours"]
  },
  {
    id: 2,
    title: "Greek Island Hopping",
    destination: "Santorini & Mykonos",
    duration: "10 Days, 9 Nights", 
    price: 1599,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg",
    highlights: ["Sunset Views", "Traditional Villages", "Beach Clubs", "Local Cuisine"],
    includes: ["Accommodation", "Ferry Transfers", "Breakfast", "Wine Tasting"]
  },
  {
    id: 3,
    title: "Tokyo Cultural Experience",
    destination: "Tokyo, Japan",
    duration: "5 Days, 4 Nights",
    price: 1299,
    originalPrice: 1599,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg", 
    highlights: ["Sushi Making Class", "Temple Tours", "Modern Districts", "Traditional Gardens"],
    includes: ["Hotel Stay", "JR Pass", "Cultural Activities", "Local Guide"]
  },
  {
    id: 4,
    title: "Patagonia Trekking",
    destination: "Torres del Paine, Chile",
    duration: "12 Days, 11 Nights",
    price: 2299,
    originalPrice: 2799,
    rating: 4.6,
    reviews: 67,
    image: "/placeholder.svg",
    highlights: ["Glacier Hiking", "Wildlife Spotting", "Mountain Views", "Expert Guides"],
    includes: ["Camping Gear", "All Meals", "Park Permits", "Professional Guide"]
  }
];

const BookTrip = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-sunset-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Book Your Dream Trip
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-90">
            Curated travel packages designed by experts for unforgettable experiences
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
            <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
              <Plane className="h-4 w-4 mr-2" />
              All-Inclusive Packages
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Expert Local Guides
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
              <Calendar className="h-4 w-4 mr-2" />
              Flexible Booking
            </Badge>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Travel Packages</h2>
            <p className="text-xl text-muted-foreground">
              Handpicked adventures with everything included for your perfect getaway
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover-lift shadow-card">
                <div className="h-64 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge variant="destructive" className="bg-accent">
                      Save ${pkg.originalPrice - pkg.price}
                    </Badge>
                  </div>
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
            ))}
          </div>
        </div>
      </section>

      {/* Custom Trip Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need a Custom Trip?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our travel experts can create a personalized itinerary tailored to your preferences, budget, and timeline.
            </p>
            
            <Card className="shadow-travel">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Expert Consultation</h3>
                    <p className="text-sm text-muted-foreground">Free 30-minute call with our travel specialists</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Personalized Itinerary</h3>
                    <p className="text-sm text-muted-foreground">Custom route based on your interests and timeline</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">Round-the-clock assistance during your trip</p>
                  </div>
                </div>
                
                <Link to="/ai-concierge">
                  <Button size="lg" className="bg-primary hover:bg-primary-hover">
                    Plan My Custom Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to book your perfect trip</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose Package", desc: "Browse and select your perfect travel package" },
              { step: "2", title: "Customize", desc: "Adjust dates, activities, and accommodations" },
              { step: "3", title: "Secure Payment", desc: "Book with confidence using our secure payment" },
              { step: "4", title: "Start Adventure", desc: "Receive your itinerary and travel documents" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookTrip;