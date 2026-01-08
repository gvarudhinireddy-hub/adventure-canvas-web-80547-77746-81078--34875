import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Info,
  Mail,
  BookOpen,
  HelpCircle,
  Tag,
  Wallet,
  User,
  Settings,
  LifeBuoy,
  LogOut,
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
} from "lucide-react";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NavigationDrawer = ({ open, onOpenChange }: NavigationDrawerProps) => {
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

  const additionalFeatures = [
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

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent 
        className="h-[85vh] overflow-y-auto"
        aria-label="Navigation menu"
      >
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Menu
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-8">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </h3>
            <div className="space-y-1">
              {mainLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={handleLinkClick}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-base font-medium"
                  >
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Features */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Features
            </h3>

            {/* Planning Tools */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-muted-foreground/80 pl-2">
                🌍 Planning Tools
              </h4>
              <div className="space-y-1">
                {planningTools.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={handleLinkClick}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <link.icon className="mr-3 h-4 w-4" />
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-muted-foreground/80 pl-2">
                💼 Utilities
              </h4>
              <div className="space-y-1">
                {utilities.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={handleLinkClick}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <link.icon className="mr-3 h-4 w-4" />
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Travel Essentials */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-muted-foreground/80 pl-2">
                🗺️ Travel Essentials
              </h4>
              <div className="space-y-1">
                {travelEssentials.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={handleLinkClick}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <link.icon className="mr-3 h-4 w-4" />
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Additional Features */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              More Tools
            </h3>
            <div className="space-y-1">
              {additionalFeatures.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={handleLinkClick}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <link.icon className="mr-3 h-4 w-4" />
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Resources */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Resources
            </h3>
            <div className="space-y-1">
              {resourceLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={handleLinkClick}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <link.icon className="mr-3 h-4 w-4" />
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Account & Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <LifeBuoy className="mr-3 h-4 w-4" />
                Help & Support
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
