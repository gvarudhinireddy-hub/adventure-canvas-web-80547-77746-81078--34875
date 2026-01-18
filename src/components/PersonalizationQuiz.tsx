import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Mountain, 
  Umbrella, 
  Zap, 
  Heart, 
  Wallet, 
  Crown,
  MapPin,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { destinations, Destination } from "@/data/destinations";
import { Link } from "react-router-dom";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    icon: any;
    tags: string[];
  }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "terrain",
    question: "What's your ideal landscape?",
    options: [
      { label: "Beach & Ocean", value: "beach", icon: Umbrella, tags: ["Beach", "Island", "Coastal"] },
      { label: "Mountains & Hills", value: "mountains", icon: Mountain, tags: ["Mountains", "Hiking", "Nature", "Adventure"] },
      { label: "City & Urban", value: "city", icon: MapPin, tags: ["Urban", "Cultural", "City"] },
      { label: "Mix of Everything", value: "mixed", icon: Sparkles, tags: [] },
    ],
  },
  {
    id: "activity",
    question: "How do you like to travel?",
    options: [
      { label: "Adventure & Thrills", value: "adventure", icon: Zap, tags: ["Adventure", "Hiking", "Diving", "Trekking"] },
      { label: "Relaxation & Wellness", value: "relaxation", icon: Heart, tags: ["Wellness", "Spa", "Beach", "Nature"] },
      { label: "Culture & History", value: "culture", icon: Crown, tags: ["Cultural", "History", "Religious", "Heritage"] },
      { label: "Food & Nightlife", value: "food", icon: Sparkles, tags: ["Food", "Nightlife", "Party", "Urban"] },
    ],
  },
  {
    id: "budget",
    question: "What's your budget style?",
    options: [
      { label: "Budget-Friendly", value: "low", icon: Wallet, tags: ["Low"] },
      { label: "Mid-Range Comfort", value: "medium", icon: Heart, tags: ["Medium"] },
      { label: "Luxury Experience", value: "high", icon: Crown, tags: ["High", "Luxury"] },
      { label: "Flexible Budget", value: "any", icon: Sparkles, tags: [] },
    ],
  },
];

export const PersonalizationQuiz = () => {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [recommendations, setRecommendations] = useState<Destination[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, tags: string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: tags }));
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate recommendations
      generateRecommendations({ ...answers, [questionId]: tags });
    }
  };

  const generateRecommendations = (allAnswers: Record<string, string[]>) => {
    const allTags = Object.values(allAnswers).flat();
    
    // Score each destination based on matching tags
    const scoredDestinations = destinations.map(dest => {
      let score = 0;
      
      // Check travel types
      dest.travelType.forEach(type => {
        if (allTags.some(tag => type.toLowerCase().includes(tag.toLowerCase()))) {
          score += 2;
        }
      });
      
      // Check category
      if (allTags.some(tag => dest.category.toLowerCase().includes(tag.toLowerCase()))) {
        score += 3;
      }
      
      // Check budget level
      if (allTags.includes(dest.budgetLevel)) {
        score += 2;
      }
      
      return { destination: dest, score };
    });
    
    // Sort by score and take top 6
    const topDestinations = scoredDestinations
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.destination);
    
    setRecommendations(topDestinations);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setRecommendations([]);
    setShowResults(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetQuiz(); }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Find Your Perfect Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {showResults ? "Your Perfect Destinations" : "Travel Style Quiz"}
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-6">
                {quizQuestions[currentQuestion].question}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {quizQuestions[currentQuestion].options.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/10 hover:border-primary transition-all"
                      onClick={() => handleAnswer(quizQuestions[currentQuestion].id, option.tags)}
                    >
                      <Icon className="h-8 w-8 text-primary" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Based on your preferences, we recommend these destinations:
            </p>
            
            <div className="grid gap-3">
              {recommendations.map((dest) => (
                <Card key={dest.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <img 
                        src={dest.image} 
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{dest.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{dest.country}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">{dest.category}</Badge>
                        <Badge variant="outline" className="text-xs">{dest.budgetLevel}</Badge>
                      </div>
                    </div>
                    <Link to={`/destinations/${dest.id}`} onClick={() => setOpen(false)}>
                      <Button size="sm" variant="ghost" className="rounded-full">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={resetQuiz} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              <Link to="/destinations" className="flex-1">
                <Button className="w-full" onClick={() => setOpen(false)}>
                  Browse All
                </Button>
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
