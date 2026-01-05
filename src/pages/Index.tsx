import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Users, Award, Plane, Shield, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-beach.jpg";
import baliImage from "@/assets/bali-destination.jpg";
import santoriniImage from "@/assets/santorini-destination.jpg";
import tokyoImage from "@/assets/tokyo-destination.jpg";
import { CurrencySelector } from "@/components/CurrencySelector";
import { Price } from "@/components/Price";
import { SearchBar } from "@/components/SearchBar";

const featuredDestinations = [
  {
    id: 1,
    name: "Bali, Indonesia",
    image: baliImage,
    price: "From $89/night",
    rating: 4.8,
    description: "Tropical paradise with rice terraces, ancient temples, and pristine beaches"
  },
  {
    id: 2,
    name: "Santorini, Greece", 
    image: santoriniImage,
    price: "From $156/night",
    rating: 4.9,
    description: "Iconic blue domes, dramatic sunsets, and charming whitewashed villages"
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    image: tokyoImage,
    price: "From $78/night", 
    rating: 4.7,
    description: "Vibrant metropolis blending ancient traditions with cutting-edge innovation"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    text: "WanderNest planned the most incredible 2-week adventure through Southeast Asia. Every detail was perfect, and the local guides were amazing!",
    trip: "Southeast Asia Adventure"
  },
  {
    name: "Michael Chen",
    location: "Toronto, Canada", 
    rating: 5,
    text: "As a solo traveler, I was nervous about my first international trip. WanderNest made everything seamless and I felt safe every step of the way.",
    trip: "Solo European Journey"
  },
  {
    name: "Emma & David Wilson",
    location: "London, UK",
    rating: 5,
    text: "Our honeymoon in the Maldives was absolutely magical. The overwater villa and sunset dinners exceeded all our expectations!",
    trip: "Maldives Honeymoon"
  }
];

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "24/7 support and vetted local partners ensure your safety"
  },
  {
    icon: Award,
    title: "Expert Guides",
    description: "Local experts with deep cultural knowledge and passion"
  },
  {
    icon: Heart,
    title: "Authentic Experiences", 
    description: "Real connections with people, culture, and nature"
  },
  {
    icon: Plane,
    title: "Seamless Planning",
    description: "We handle every detail so you can focus on the adventure"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 animate-fade-in">
            Discover Your Next
            <span className="block text-gradient-white">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 animate-slide-up opacity-90">
            Curated travel experiences that connect you with the world's most incredible destinations
          </p>
          
          {/* Search Bar */}
          <div className="animate-slide-up">
            <SearchBar variant="hero" placeholder="Where do you want to go?" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-slide-up">
            <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
              50,000+ Happy Travelers
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
              120+ Countries
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
              4.9★ Average Rating
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WanderNest?</h2>
            <p className="text-xl text-muted-foreground">
              We're more than just a travel company - we're your adventure partners
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Destinations</h2>
            <p className="text-xl text-muted-foreground">
              Handpicked locations that will take your breath away
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <Card key={destination.id} className="overflow-hidden hover-lift shadow-travel">
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">{destination.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{destination.rating}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        <Price priceString={destination.price} />
                      </span>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{destination.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{destination.description}</p>
                  <Link to="/destinations">
                    <Button className="w-full bg-primary hover:bg-primary-hover">
                      Explore Destination
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/destinations">
              <Button variant="outline" size="lg" className="hover-lift">
                View All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
            <p className="text-xl text-muted-foreground">
              Real stories from real adventures
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-foreground/60">{testimonial.location}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">"{testimonial.text}"</p>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.trip}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your Adventure Awaits
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Join thousands of travelers who've discovered the world with WanderNest
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Start Planning
              </Button>
            </Link>
            <Link to="/destinations">
              <Button size="lg" className="bg-white/20 text-white border-2 border-white hover:bg-white hover:text-primary">
                Browse Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-travel">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Stay Inspired</CardTitle>
              <p className="text-muted-foreground">
                Get travel tips, destination guides, and exclusive deals delivered to your inbox
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  type="email" 
                  placeholder="Enter your email address..."
                  className="flex-1"
                />
                <Button className="bg-primary hover:bg-primary-hover">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                No spam, unsubscribe anytime. Read our privacy policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gradient-white mb-4">WanderNest</h3>
              <p className="text-background/70 mb-4">
                Inspiring wanderlust and creating unforgettable travel experiences since 2009.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="border-background/20 text-background hover:bg-background/10">
                  Instagram
                </Button>
                <Button variant="outline" size="sm" className="border-background/20 text-background hover:bg-background/10">
                  Facebook
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/destinations" className="hover:text-background transition-smooth">Asia</Link></li>
                <li><Link to="/destinations" className="hover:text-background transition-smooth">Europe</Link></li>
                <li><Link to="/destinations" className="hover:text-background transition-smooth">Americas</Link></li>
                <li><Link to="/destinations" className="hover:text-background transition-smooth">Africa</Link></li>
                <li><Link to="/destinations" className="hover:text-background transition-smooth">Oceania</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/about" className="hover:text-background transition-smooth">About Us</Link></li>
                <li><Link to="/guides" className="hover:text-background transition-smooth">Travel Guides</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-smooth">Contact</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-smooth">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-smooth">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li><Link to="/contact" className="hover:text-background transition-smooth">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-smooth">Travel Insurance</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-smooth">Cancellation Policy</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-smooth">Terms of Service</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-smooth">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/70">
            <p>&copy; 2024 WanderNest. All rights reserved. Made with ❤️ for travelers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;