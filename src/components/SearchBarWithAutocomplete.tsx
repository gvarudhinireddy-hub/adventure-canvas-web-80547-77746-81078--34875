import { useState, FormEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { destinations, Destination } from "@/data/destinations";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  variant?: "hero" | "default";
  autoNavigate?: boolean;
}

export const SearchBarWithAutocomplete = ({ 
  onSearch, 
  placeholder = "Where do you want to go?",
  variant = "default",
  autoNavigate = true
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Configure Fuse.js for fuzzy searching
  const fuse = new Fuse(destinations, {
    keys: [
      { name: "name", weight: 3 },
      { name: "country", weight: 2 },
      { name: "description", weight: 1 },
      { name: "topAttractions", weight: 1.5 },
      { name: "category", weight: 1 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  });

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (query.trim().length >= 2) {
      const results = fuse.search(query).slice(0, 8);
      setSuggestions(results.map(result => result.item));
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) return;

    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(trimmedQuery);
    } else if (autoNavigate) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleSuggestionClick = (destination: Destination) => {
    setQuery(destination.name);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(destination.name);
    } else if (autoNavigate) {
      // Navigate directly to the destination details page
      navigate(`/destinations/${destination.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const isHero = variant === "hero";

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} className={isHero ? "max-w-2xl mx-auto" : "w-full"}>
        <div className={`${isHero ? "bg-white/10 backdrop-blur-sm rounded-2xl p-3" : "bg-background rounded-full p-2"}`}>
          <div className="flex items-center gap-2">
            <Search className={`h-5 w-5 ml-2 ${isHero ? "text-white/70" : "text-muted-foreground"}`} />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              placeholder={placeholder}
              aria-label="Search destinations and experiences"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions}
              className={`border-none bg-transparent focus-visible:ring-0 ${
                isHero ? "text-white placeholder:text-white/70" : ""
              }`}
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className={`${isHero ? "text-white/70 hover:text-white" : ""}`}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          id="search-suggestions"
          role="listbox"
          className={`absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-travel z-50 max-h-96 overflow-y-auto ${
            isHero ? "max-w-2xl mx-auto left-0 right-0" : ""
          }`}
        >
          {suggestions.map((destination, index) => (
            <div
              key={destination.id}
              role="option"
              aria-selected={highlightedIndex === index}
              onClick={() => handleSuggestionClick(destination)}
              className={`px-4 py-3 cursor-pointer transition-smooth border-b border-border/50 last:border-b-0 ${
                highlightedIndex === index 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {destination.name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {destination.country} • {destination.continent}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {destination.description}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="text-sm font-semibold text-primary whitespace-nowrap">
                    {destination.price.replace("From ", "")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ★ {destination.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
        <div className={`absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-travel p-4 text-center z-50 ${
          isHero ? "max-w-2xl mx-auto left-0 right-0" : ""
        }`}>
          <p className="text-sm text-muted-foreground">
            No destinations found for "{query}"
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try searching for a city, country, or region
          </p>
        </div>
      )}
    </div>
  );
};
