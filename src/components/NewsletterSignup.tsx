import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Sparkles, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  variant?: "inline" | "card";
  className?: string;
}

export const NewsletterSignup = ({ variant = "card", className = "" }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - in production, this would save to database
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage for demo
    const subscribers = JSON.parse(localStorage.getItem('wandernest_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('wandernest_subscribers', JSON.stringify(subscribers));
    }
    
    setIsLoading(false);
    setIsSubscribed(true);
    
    toast({
      title: "Welcome to WanderNest! 🌍",
      description: "You'll receive our Weekly Wanderlust Picks soon",
    });

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 3000);
  };

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubscribe} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <Input 
          type="email" 
          placeholder="Enter your email for weekly travel inspiration..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          disabled={isLoading || isSubscribed}
        />
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-hover whitespace-nowrap"
          disabled={isLoading || isSubscribed}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Subscribed!
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Subscribe
            </>
          )}
        </Button>
      </form>
    );
  }

  return (
    <Card className={`shadow-travel ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Weekly Wanderlust Picks</CardTitle>
        <CardDescription className="text-base">
          Get travel tips, hidden gems, and exclusive deals delivered to your inbox every week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <Input 
            type="email" 
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center"
            disabled={isLoading || isSubscribed}
          />
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover"
            disabled={isLoading || isSubscribed}
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSubscribed ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                You're In!
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Get Weekly Inspiration
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Join 50,000+ travelers. No spam, unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
};
