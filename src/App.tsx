import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/hooks/useCurrency";
import { LanguageProvider } from "@/hooks/useLanguage";
import { WishlistProvider } from "@/hooks/useWishlist";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import Destinations from "./pages/Destinations";
import Wishlist from "./pages/Wishlist";
import DestinationDetails from "./pages/DestinationDetails";
import TravelGuides from "./pages/TravelGuides";
import BookTrip from "./pages/BookTrip";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Safety from "./pages/Safety";
import Transportation from "./pages/Transportation";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import SavedTrips from "./pages/SavedTrips";
import PackingList from "./pages/PackingList";
import OfflineMode from "./pages/OfflineMode";
import InteractiveMap from "./pages/InteractiveMap";
import TravelBuddy from "./pages/TravelBuddy";
import LocalGuides from "./pages/LocalGuides";
import Community from "./pages/Community";
import Gamification from "./pages/Gamification";
import AIConcierge from "./pages/AIConcierge";
import SmartPredictions from "./pages/SmartPredictions";
import WeatherForecast from "./pages/WeatherForecast";
import ExpenseTracker from "./pages/ExpenseTracker";
import LanguageTranslator from "./pages/LanguageTranslator";
import NearbyAttractions from "./pages/NearbyAttractions";
import EmergencyContacts from "./pages/EmergencyContacts";
import CurrencyConverter from "./pages/CurrencyConverter";
import Auth from "./pages/Auth";
import SharedTrip from "./pages/SharedTrip";
import SearchResults from "./pages/SearchResults";
import SOSButton from "./components/SOSButton";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/destinations/:id" element={<DestinationDetails />} />
                  <Route path="/guides" element={<TravelGuides />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/transportation" element={<Transportation />} />
                  <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
                  <Route path="/saved-trips" element={<SavedTrips />} />
                  <Route path="/packing-list" element={<PackingList />} />
                  <Route path="/offline-mode" element={<OfflineMode />} />
                  <Route path="/map" element={<InteractiveMap />} />
                  <Route path="/travel-buddy" element={<TravelBuddy />} />
                  <Route path="/local-guides" element={<LocalGuides />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/achievements" element={<Gamification />} />
                  <Route path="/ai-concierge" element={<AIConcierge />} />
                  <Route path="/smart-predictions" element={<SmartPredictions />} />
                  <Route path="/weather" element={<WeatherForecast />} />
                  <Route path="/expenses" element={<ExpenseTracker />} />
                  <Route path="/translator" element={<LanguageTranslator />} />
                  <Route path="/nearby" element={<NearbyAttractions />} />
                  <Route path="/emergency" element={<EmergencyContacts />} />
                  <Route path="/currency" element={<CurrencyConverter />} />
                  <Route path="/book" element={<BookTrip />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/shared/:token" element={<SharedTrip />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <SOSButton />
              </BrowserRouter>
            </TooltipProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
