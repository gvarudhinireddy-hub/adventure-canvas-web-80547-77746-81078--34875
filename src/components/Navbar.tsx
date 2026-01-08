import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavigationMenu } from "./NavigationMenu";

export const Navbar = () => {
  const location = useLocation();
  
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

        {/* Dropdown Menu */}
        <NavigationMenu />
      </div>
    </nav>
  );
};