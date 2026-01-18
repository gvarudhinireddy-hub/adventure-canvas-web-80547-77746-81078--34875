import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavigationMenu } from "./NavigationMenu";
import { GlobalSettings } from "./GlobalSettings";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart } from "lucide-react";
export const Navbar = () => {
  const location = useLocation();
  const { wishlistCount } = useWishlist();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: "Plan Trip", path: "/book" },
    { name: "My Trips", path: "/saved-trips" },
  ];

  return (
    <nav 
      className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Main navigation"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            WanderNest
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant="ghost"
                className={cn(
                  "font-medium transition-colors",
                  isActive(link.path) 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex md:hidden items-center space-x-1">
          {navLinks.slice(0, 2).map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "font-medium text-xs",
                  isActive(link.path) 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground/70"
                )}
              >
                {link.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right side: Wishlist, Settings, Menu */}
        <div className="flex items-center gap-1">
          {/* Wishlist button */}
          <Link to="/wishlist">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "relative",
                location.pathname === "/wishlist" && "text-red-500"
              )}
            >
              <Heart className={cn(
                "h-4 w-4",
                wishlistCount > 0 && "fill-red-500 text-red-500"
              )} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Global Settings (Language & Currency) */}
          <GlobalSettings />

          {/* Dropdown Menu */}
          <NavigationMenu />
        </div>
      </div>
    </nav>
  );
};