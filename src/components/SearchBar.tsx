import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  variant?: "hero" | "default";
  autoNavigate?: boolean;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Where do you want to go?",
  variant = "default",
  autoNavigate = true
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) return;

    if (onSearch) {
      onSearch(trimmedQuery);
    } else if (autoNavigate) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className={isHero ? "max-w-2xl mx-auto" : "w-full"}>
      <div className={`${isHero ? "bg-white/10 backdrop-blur-sm rounded-2xl p-3" : "bg-background rounded-full p-2"}`}>
        <div className="flex items-center gap-2">
          <Search className={`h-5 w-5 ml-2 ${isHero ? "text-white/70" : "text-muted-foreground"}`} />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Search destinations and experiences"
            className={`border-none bg-transparent focus-visible:ring-0 ${
              isHero ? "text-white placeholder:text-white/70" : ""
            }`}
          />
          <Button 
            type="submit"
            size="lg" 
            className={isHero ? "bg-primary hover:bg-primary-hover text-white" : "rounded-full"}
          >
            {isHero ? "Explore Now" : "Search"}
          </Button>
        </div>
      </div>
    </form>
  );
};
