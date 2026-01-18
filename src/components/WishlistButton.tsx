import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { Destination } from "@/data/destinations";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  destination: Destination;
  variant?: "default" | "overlay" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const WishlistButton = ({ 
  destination, 
  variant = "icon",
  size = "icon",
  className = "" 
}: WishlistButtonProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(destination.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(destination);
  };

  if (variant === "overlay") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "absolute top-4 left-4 z-20 p-2 rounded-full backdrop-blur-sm transition-all",
          "hover:scale-110 active:scale-95",
          isWishlisted 
            ? "bg-red-500 text-white" 
            : "bg-white/80 text-gray-700 hover:bg-white",
          className
        )}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          className={cn(
            "h-5 w-5 transition-all",
            isWishlisted && "fill-current"
          )} 
        />
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      className={cn(
        "transition-all",
        isWishlisted && "text-red-500 hover:text-red-600",
        className
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isWishlisted && "fill-current"
        )} 
      />
      {variant === "default" && (
        <span className="ml-2">{isWishlisted ? "Saved" : "Save"}</span>
      )}
    </Button>
  );
};
