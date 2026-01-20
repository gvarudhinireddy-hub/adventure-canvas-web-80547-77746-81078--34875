import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  Award, 
  MapPin, 
  Globe, 
  Mountain,
  Palmtree,
  Camera,
  Compass,
  Plane,
  Heart,
  Users,
  Sparkles,
  Crown,
  Medal,
  Target,
  Zap
} from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { destinations } from "@/data/destinations";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  requirement: number;
  category: "explorer" | "collector" | "social" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum";
}

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  badges: number;
  country: string;
  title: string;
}

const Gamification = () => {
  const { wishlist } = useWishlist();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Calculate user stats based on wishlist
  const viewedContinents = new Set(
    wishlist.map(id => 
      destinations.find(d => d.id === id)?.continent
    ).filter(Boolean)
  );
  
  const viewedCountries = new Set(
    wishlist.map(id => 
      destinations.find(d => d.id === id)?.country
    ).filter(Boolean)
  );

  // Dynamic badges based on user activity
  const badges: BadgeItem[] = [
    // Explorer Badges
    {
      id: "first_steps",
      name: "First Steps",
      description: "Add your first destination to wishlist",
      icon: Compass,
      unlocked: wishlist.length >= 1,
      progress: Math.min(wishlist.length, 1),
      requirement: 1,
      category: "explorer",
      tier: "bronze"
    },
    {
      id: "wanderer",
      name: "Wanderer",
      description: "Save 5 destinations to your wishlist",
      icon: MapPin,
      unlocked: wishlist.length >= 5,
      progress: Math.min(wishlist.length, 5),
      requirement: 5,
      category: "explorer",
      tier: "bronze"
    },
    {
      id: "globetrotter",
      name: "Globetrotter",
      description: "Save 15 destinations to your wishlist",
      icon: Globe,
      unlocked: wishlist.length >= 15,
      progress: Math.min(wishlist.length, 15),
      requirement: 15,
      category: "explorer",
      tier: "silver"
    },
    {
      id: "world_explorer",
      name: "World Explorer",
      description: "Save 30 destinations to your wishlist",
      icon: Plane,
      unlocked: wishlist.length >= 30,
      progress: Math.min(wishlist.length, 30),
      requirement: 30,
      category: "explorer",
      tier: "gold"
    },
    {
      id: "ultimate_traveler",
      name: "Ultimate Traveler",
      description: "Save 50 destinations to your wishlist",
      icon: Crown,
      unlocked: wishlist.length >= 50,
      progress: Math.min(wishlist.length, 50),
      requirement: 50,
      category: "explorer",
      tier: "platinum"
    },
    
    // Collector Badges - Continents
    {
      id: "asia_explorer",
      name: "Explorer of Asia",
      description: "Save 10 Asian destinations",
      icon: Mountain,
      unlocked: wishlist.filter(id => destinations.find(d => d.id === id)?.continent === "Asia").length >= 10,
      progress: Math.min(wishlist.filter(id => destinations.find(d => d.id === id)?.continent === "Asia").length, 10),
      requirement: 10,
      category: "collector",
      tier: "silver"
    },
    {
      id: "europe_explorer",
      name: "Explorer of Europe",
      description: "Save 10 European destinations",
      icon: Award,
      unlocked: wishlist.filter(id => destinations.find(d => d.id === id)?.continent === "Europe").length >= 10,
      progress: Math.min(wishlist.filter(id => destinations.find(d => d.id === id)?.continent === "Europe").length, 10),
      requirement: 10,
      category: "collector",
      tier: "silver"
    },
    {
      id: "beach_lover",
      name: "Beach Lover",
      description: "Save 5 beach destinations",
      icon: Palmtree,
      unlocked: wishlist.filter(id => destinations.find(d => d.id === id)?.category === "Beach").length >= 5,
      progress: Math.min(wishlist.filter(id => destinations.find(d => d.id === id)?.category === "Beach").length, 5),
      requirement: 5,
      category: "collector",
      tier: "bronze"
    },
    {
      id: "adventure_seeker",
      name: "Adventure Seeker",
      description: "Save 5 adventure destinations",
      icon: Zap,
      unlocked: wishlist.filter(id => destinations.find(d => d.id === id)?.category === "Adventure").length >= 5,
      progress: Math.min(wishlist.filter(id => destinations.find(d => d.id === id)?.category === "Adventure").length, 5),
      requirement: 5,
      category: "collector",
      tier: "bronze"
    },
    {
      id: "culture_enthusiast",
      name: "Culture Enthusiast",
      description: "Save 5 cultural destinations",
      icon: Camera,
      unlocked: wishlist.filter(id => destinations.find(d => d.id === id)?.category === "Cultural").length >= 5,
      progress: Math.min(wishlist.filter(id => destinations.find(d => d.id === id)?.category === "Cultural").length, 5),
      requirement: 5,
      category: "collector",
      tier: "bronze"
    },
    
    // Social Badges
    {
      id: "social_butterfly",
      name: "Social Butterfly",
      description: "Share your first trip with friends",
      icon: Users,
      unlocked: false,
      progress: 0,
      requirement: 1,
      category: "social",
      tier: "bronze"
    },
    {
      id: "inspiration",
      name: "Inspiration",
      description: "Have 10 people view your shared trips",
      icon: Heart,
      unlocked: false,
      progress: 0,
      requirement: 10,
      category: "social",
      tier: "silver"
    },
    
    // Special Badges
    {
      id: "hidden_gem_hunter",
      name: "Hidden Gem Hunter",
      description: "Save 3 hidden gem destinations",
      icon: Sparkles,
      unlocked: wishlist.filter(id => {
        const dest = destinations.find(d => d.id === id);
        return dest?.isHiddenGem === true;
      }).length >= 3,
      progress: Math.min(wishlist.filter(id => {
        const dest = destinations.find(d => d.id === id);
        return dest?.isHiddenGem === true;
      }).length, 3),
      requirement: 3,
      category: "special",
      tier: "gold"
    },
    {
      id: "diverse_explorer",
      name: "Diverse Explorer",
      description: "Save destinations from 5 different countries",
      icon: Target,
      unlocked: viewedCountries.size >= 5,
      progress: Math.min(viewedCountries.size, 5),
      requirement: 5,
      category: "special",
      tier: "silver"
    },
    {
      id: "continent_hopper",
      name: "Continent Hopper",
      description: "Save destinations from 4 continents",
      icon: Globe,
      unlocked: viewedContinents.size >= 4,
      progress: Math.min(viewedContinents.size, 4),
      requirement: 4,
      category: "special",
      tier: "gold"
    }
  ];

  const leaderboard: LeaderboardUser[] = [
    { rank: 1, name: "TravelMaster", avatar: "", points: 12450, badges: 18, country: "USA", title: "Legendary Explorer" },
    { rank: 2, name: "WanderlustQueen", avatar: "", points: 11200, badges: 16, country: "UK", title: "Master Traveler" },
    { rank: 3, name: "GlobeTrotter99", avatar: "", points: 9800, badges: 14, country: "Australia", title: "Elite Wanderer" },
    { rank: 4, name: "AdventureAce", avatar: "", points: 8500, badges: 12, country: "Canada", title: "Senior Explorer" },
    { rank: 5, name: "NomadNinja", avatar: "", points: 7200, badges: 11, country: "Germany", title: "Experienced Traveler" },
    { rank: 6, name: "ExplorerElite", avatar: "", points: 6800, badges: 10, country: "Japan", title: "Rising Star" },
    { rank: 7, name: "JourneyJunkie", avatar: "", points: 5500, badges: 9, country: "Brazil", title: "Dedicated Wanderer" },
    { rank: 8, name: "PathfinderPro", avatar: "", points: 4200, badges: 8, country: "India", title: "Aspiring Explorer" }
  ];

  // User stats
  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const totalPoints = unlockedBadges * 100 + wishlist.length * 10;
  const nextBadge = badges.find(b => !b.unlocked && b.progress > 0);

  const filteredBadges = selectedCategory === "all" 
    ? badges 
    : badges.filter(b => b.category === selectedCategory);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze": return "from-amber-600 to-amber-800";
      case "silver": return "from-slate-300 to-slate-500";
      case "gold": return "from-yellow-400 to-yellow-600";
      case "platinum": return "from-purple-400 to-purple-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getTierBg = (tier: string) => {
    switch (tier) {
      case "bronze": return "bg-amber-500/10 border-amber-500/30";
      case "silver": return "bg-slate-500/10 border-slate-500/30";
      case "gold": return "bg-yellow-500/10 border-yellow-500/30";
      case "platinum": return "bg-purple-500/10 border-purple-500/30";
      default: return "bg-muted border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Achievements & Badges - WanderNest</title>
        <meta name="description" content="Track your travel achievements, earn badges, and compete on the global leaderboard." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Trophy className="h-3 w-3 mr-1" />
              Gamification
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Travel Achievements
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Earn badges, climb the leaderboard, and showcase your wanderlust journey
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-3xl font-bold text-primary">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 border-yellow-500/20">
              <div className="text-3xl font-bold text-yellow-600">{unlockedBadges}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <div className="text-3xl font-bold text-green-600">{wishlist.length}</div>
              <div className="text-sm text-muted-foreground">Destinations Saved</div>
            </Card>
            <Card className="text-center p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <div className="text-3xl font-bold text-purple-600">#{Math.max(1, 9 - unlockedBadges)}</div>
              <div className="text-sm text-muted-foreground">Global Rank</div>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="badges" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="badges" className="gap-2">
              <Award className="h-4 w-4" />
              My Badges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-8">
            {/* Next Badge Progress */}
            {nextBadge && (
              <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getTierColor(nextBadge.tier)}`}>
                    <nextBadge.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Next Badge: {nextBadge.name}</h3>
                    <p className="text-sm text-muted-foreground">{nextBadge.description}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{nextBadge.tier}</Badge>
                </div>
                <Progress value={(nextBadge.progress / nextBadge.requirement) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {nextBadge.progress} / {nextBadge.requirement} completed
                </p>
              </Card>
            )}

            {/* Tips Section */}
            <Card className="p-6 bg-muted/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Tips to Earn Badges
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Browse and save destinations from different continents</li>
                <li>• Explore hidden gems like Meghalaya, Cappadocia, or Ladakh</li>
                <li>• Save beach, adventure, and cultural destinations</li>
                <li>• Share your trips with friends to earn social badges</li>
              </ul>
            </Card>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {["all", "explorer", "collector", "social", "special"].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat === "all" ? "All Badges" : cat}
                </Button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBadges.map((badge) => (
                <Card 
                  key={badge.id} 
                  className={`relative overflow-hidden transition-all duration-300 ${
                    badge.unlocked 
                      ? getTierBg(badge.tier)
                      : "bg-muted/30 border-dashed opacity-60"
                  }`}
                >
                  {badge.unlocked && (
                    <div className="absolute top-2 right-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${
                        badge.unlocked 
                          ? `bg-gradient-to-br ${getTierColor(badge.tier)}`
                          : "bg-muted"
                      }`}>
                        <badge.icon className={`h-6 w-6 ${badge.unlocked ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <Badge variant="outline" className="text-xs capitalize mt-1">
                          {badge.tier}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                    <div className="space-y-2">
                      <Progress value={(badge.progress / badge.requirement) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {badge.progress} / {badge.requirement} {badge.unlocked ? "✓ Complete" : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Travelers This Month
                </CardTitle>
                <CardDescription>
                  Compete with travelers worldwide and climb the ranks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        user.rank <= 3 
                          ? "bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20" 
                          : "bg-muted/30"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1 ? "bg-yellow-500 text-white" :
                        user.rank === 2 ? "bg-slate-400 text-white" :
                        user.rank === 3 ? "bg-amber-600 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {user.rank <= 3 ? <Medal className="h-5 w-5" /> : user.rank}
                      </div>
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.title}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-primary">{user.points.toLocaleString()} pts</p>
                        <p className="text-xs text-muted-foreground">{user.badges} badges</p>
                      </div>
                      <Badge variant="outline" className="hidden md:flex">
                        {user.country}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Gamification;
