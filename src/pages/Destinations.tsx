import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import { SearchBarWithAutocomplete } from "@/components/SearchBarWithAutocomplete";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { useState, useEffect } from "react";
import { destinations, Destination } from "@/data/destinations";
import Fuse from "fuse.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 12;

const continents = ["All Continents", "Asia", "Europe", "North America", "South America", "Africa", "Oceania"];
const travelTypes = ["All Types", "Beach", "Cultural", "Urban", "Adventure", "Nature", "Luxury", "History", "Food", "Spiritual", "Pilgrimage"];
const budgetLevels = ["All Budgets", "Low", "Medium", "High"];
const seasons = ["All Seasons", "Dec - Feb", "Mar - May", "Jun - Aug", "Sep - Nov"];
const durations = ["All Durations", "Weekend", "1 Week", "2+ Weeks"];
const locationTypes = ["All Types", "Country", "City", "Region", "Neighborhood", "Temple", "Monument", "Natural Wonder", "Attraction"];

type SortOption = "popularity" | "rating" | "price-low" | "price-high" | "name";

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All Continents");
  const [selectedTravelType, setSelectedTravelType] = useState("All Types");
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");
  const [selectedSeason, setSelectedSeason] = useState("All Seasons");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedLocationType, setSelectedLocationType] = useState("All Types");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedContinent("All Continents");
    setSelectedTravelType("All Types");
    setSelectedBudget("All Budgets");
    setSelectedSeason("All Seasons");
    setSelectedDuration("All Durations");
    setSelectedLocationType("All Types");
    setCurrentPage(1);
  };

  const extractPrice = (priceString: string): number => {
    const match = priceString.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Configure Fuse.js for advanced fuzzy search
  const fuse = new Fuse(destinations, {
    keys: [
      { name: "name", weight: 3 },
      { name: "country", weight: 2 },
      { name: "description", weight: 1 },
      { name: "topAttractions", weight: 1.5 },
      { name: "category", weight: 1 },
      { name: "travelType", weight: 1.2 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  });

  // Use fuzzy search when there's a search query, otherwise show all
  let filteredDestinations = searchQuery.trim() !== "" 
    ? fuse.search(searchQuery).map(result => result.item)
    : destinations;

  // Apply filters after search
  filteredDestinations = filteredDestinations.filter(dest => {
    const matchesContinent = selectedContinent === "All Continents" || dest.continent === selectedContinent;
    const matchesTravelType = selectedTravelType === "All Types" || dest.travelType.includes(selectedTravelType);
    const matchesBudget = selectedBudget === "All Budgets" || dest.budgetLevel === selectedBudget;
    const matchesSeason = selectedSeason === "All Seasons" || dest.bestSeason.includes(selectedSeason.split(" - ")[0]);
    const matchesDuration = selectedDuration === "All Durations" || dest.duration.includes(selectedDuration);
    const matchesLocationType = selectedLocationType === "All Types" || 
      (dest.locationType && dest.locationType.toLowerCase() === selectedLocationType.toLowerCase());
    
    return matchesContinent && matchesTravelType && matchesBudget && matchesSeason && matchesDuration && matchesLocationType;
  });

  // Sort destinations
  filteredDestinations = [...filteredDestinations].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return extractPrice(a.price) - extractPrice(b.price);
      case "price-high":
        return extractPrice(b.price) - extractPrice(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      case "popularity":
      default:
        return b.rating - a.rating; // Default to rating for popularity
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDestinations = filteredDestinations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasActiveFilters = selectedContinent !== "All Continents" || 
    selectedTravelType !== "All Types" || 
    selectedBudget !== "All Budgets" || 
    selectedSeason !== "All Seasons" || 
    selectedDuration !== "All Durations" ||
    selectedLocationType !== "All Types" ||
    searchQuery !== "";

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="bg-hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Explore Amazing Destinations
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-90">
            Discover your next adventure from our curated collection of breathtaking locations
          </p>
          
          {/* Search Bar with Autocomplete */}
          <div className="animate-slide-up">
            <SearchBarWithAutocomplete 
              onSearch={handleSearch}
              placeholder="Search destinations, cities, regions..." 
              variant="hero"
              autoNavigate={false}
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-semibold">Filters:</span>
              </div>

              {/* Continent */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {selectedContinent} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {continents.map((continent) => (
                    <DropdownMenuItem
                      key={continent}
                      onClick={() => { setSelectedContinent(continent); setCurrentPage(1); }}
                      className={selectedContinent === continent ? "bg-accent" : ""}
                    >
                      {continent}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Travel Type */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {selectedTravelType} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {travelTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => { setSelectedTravelType(type); setCurrentPage(1); }}
                      className={selectedTravelType === type ? "bg-accent" : ""}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Budget */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {selectedBudget} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {budgetLevels.map((budget) => (
                    <DropdownMenuItem
                      key={budget}
                      onClick={() => { setSelectedBudget(budget); setCurrentPage(1); }}
                      className={selectedBudget === budget ? "bg-accent" : ""}
                    >
                      {budget}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Season */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {selectedSeason} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {seasons.map((season) => (
                    <DropdownMenuItem
                      key={season}
                      onClick={() => { setSelectedSeason(season); setCurrentPage(1); }}
                      className={selectedSeason === season ? "bg-accent" : ""}
                    >
                      {season}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Duration */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {selectedDuration} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {durations.map((duration) => (
                    <DropdownMenuItem
                      key={duration}
                      onClick={() => { setSelectedDuration(duration); setCurrentPage(1); }}
                      className={selectedDuration === duration ? "bg-accent" : ""}
                    >
                      {duration}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Location Type */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {selectedLocationType} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {locationTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => { setSelectedLocationType(type); setCurrentPage(1); }}
                      className={selectedLocationType === type ? "bg-accent" : ""}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Clear All
                </Button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-muted-foreground">
                {searchQuery && (
                  <span className="font-medium">Results for "{searchQuery}": </span>
                )}
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredDestinations.length)} of {filteredDestinations.length} destinations
              </p>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort by: {sortBy === "popularity" ? "Popularity" : sortBy === "rating" ? "Rating" : sortBy === "price-low" ? "Price (Low)" : sortBy === "price-high" ? "Price (High)" : "Name"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSortBy("popularity")}>
                    Popularity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating")}>
                    Rating
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                    Price (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                    Price (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name (A-Z)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-muted-foreground mb-4">No destinations found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedDestinations.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let our travel experts create a custom itinerary just for you
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-accent hover:bg-white/90">
            Contact Our Experts
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Destinations;