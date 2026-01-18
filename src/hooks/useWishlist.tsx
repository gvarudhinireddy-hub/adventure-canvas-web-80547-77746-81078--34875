import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Destination } from '@/data/destinations';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (destinationId: number) => void;
  removeFromWishlist: (destinationId: number) => void;
  isInWishlist: (destinationId: number) => boolean;
  toggleWishlist: (destination: Destination) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'wandernest_wishlist';

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (destinationId: number) => {
    setWishlist(prev => {
      if (prev.includes(destinationId)) return prev;
      return [...prev, destinationId];
    });
  };

  const removeFromWishlist = (destinationId: number) => {
    setWishlist(prev => prev.filter(id => id !== destinationId));
  };

  const isInWishlist = (destinationId: number) => {
    return wishlist.includes(destinationId);
  };

  const toggleWishlist = (destination: Destination) => {
    if (isInWishlist(destination.id)) {
      removeFromWishlist(destination.id);
      toast({
        title: "Removed from Wishlist",
        description: `${destination.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(destination.id);
      toast({
        title: "Added to Wishlist ❤️",
        description: `${destination.name} has been saved to your wishlist`,
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
