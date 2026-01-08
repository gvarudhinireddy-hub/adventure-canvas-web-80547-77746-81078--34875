import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Info,
  Mail,
  BookOpen,
  Wallet,
  User,
  Settings,
  LifeBuoy,
  Home,
  MapPin,
  Plane,
  Users,
  Map,
  Route,
  FileText,
  Shield,
  MessageSquare,
  Gamepad2,
  TrendingUp,
  Car,
  Users2,
  Cloud,
  DollarSign,
  Languages,
  Navigation,
  AlertCircle,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";

export const NavigationMenu = () => {
  const mainLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Destinations", path: "/destinations", icon: MapPin },
    { name: "Plan Trip", path: "/book", icon: Plane },
    { name: "My Trips", path: "/saved-trips", icon: Wallet },
  ];

  const planningTools = [
    { name: "Interactive Map", path: "/map", icon: Map },
    { name: "Itinerary Builder", path: "/itinerary-builder", icon: Route },
    { name: "Travel Buddy", path: "/travel-buddy", icon: Users2 },
    { name: "AI Concierge", path: "/ai-concierge", icon: MessageSquare },
    { name: "Community", path: "/community", icon: Users },
  ];

  const utilities = [
    { name: "Currency Converter", path: "/currency", icon: ArrowRightLeft },
    { name: "Expense Tracker", path: "/expenses", icon: DollarSign },
    { name: "Language Translator", path: "/translator", icon: Languages },
  ];

  const travelEssentials = [
    { name: "Weather Forecast", path: "/weather", icon: Cloud },
    { name: "Nearby Attractions", path: "/nearby", icon: Navigation },
    { name: "Emergency Contacts", path: "/emergency", icon: AlertCircle },
  ];

  const moreTools = [
    { name: "Packing List", path: "/packing-list", icon: FileText },
    { name: "Safety Resources", path: "/safety", icon: Shield },
    { name: "Local Guides", path: "/local-guides", icon: User },
    { name: "Achievements", path: "/achievements", icon: Gamepad2 },
    { name: "Smart Predictions", path: "/smart-predictions", icon: TrendingUp },
    { name: "Transportation", path: "/transportation", icon: Car },
    { name: "Offline Mode", path: "/offline-mode", icon: BookOpen },
  ];

  const resourceLinks = [
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
    { name: "Travel Guides", path: "/guides", icon: BookOpen },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="hover:bg-accent">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 max-h-[80vh] overflow-y-auto bg-background z-50"
      >
        {/* Main Links */}
        <DropdownMenuLabel>Main</DropdownMenuLabel>
        <DropdownMenuGroup>
          {mainLinks.map((link) => (
            <DropdownMenuItem key={link.path} asChild>
              <Link to={link.path} className="flex items-center cursor-pointer">
                <link.icon className="mr-3 h-4 w-4" />
                {link.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Planning Tools */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Map className="mr-3 h-4 w-4" />
            Planning Tools
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-background">
            {planningTools.map((link) => (
              <DropdownMenuItem key={link.path} asChild>
                <Link to={link.path} className="flex items-center cursor-pointer">
                  <link.icon className="mr-3 h-4 w-4" />
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Utilities */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <DollarSign className="mr-3 h-4 w-4" />
            Utilities
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-background">
            {utilities.map((link) => (
              <DropdownMenuItem key={link.path} asChild>
                <Link to={link.path} className="flex items-center cursor-pointer">
                  <link.icon className="mr-3 h-4 w-4" />
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Travel Essentials */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Cloud className="mr-3 h-4 w-4" />
            Travel Essentials
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-background">
            {travelEssentials.map((link) => (
              <DropdownMenuItem key={link.path} asChild>
                <Link to={link.path} className="flex items-center cursor-pointer">
                  <link.icon className="mr-3 h-4 w-4" />
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* More Tools */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Settings className="mr-3 h-4 w-4" />
            More Tools
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-background">
            {moreTools.map((link) => (
              <DropdownMenuItem key={link.path} asChild>
                <Link to={link.path} className="flex items-center cursor-pointer">
                  <link.icon className="mr-3 h-4 w-4" />
                  {link.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Resources */}
        <DropdownMenuLabel>Resources</DropdownMenuLabel>
        <DropdownMenuGroup>
          {resourceLinks.map((link) => (
            <DropdownMenuItem key={link.path} asChild>
              <Link to={link.path} className="flex items-center cursor-pointer">
                <link.icon className="mr-3 h-4 w-4" />
                {link.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Account */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-3 h-4 w-4" />
            Help & Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};