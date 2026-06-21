"use client";

import { useState, useEffect, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";

const WISHLIST_LOCAL_STORAGE_KEY = "raaghas_wishlist";

export function useWishlist() {
  const { loading: authLoading, isAuthenticated, getToken } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize from localStorage and listen to cross-component updates
  useEffect(() => {
    const loadLocal = () => {
      const saved = localStorage.getItem(WISHLIST_LOCAL_STORAGE_KEY);
      if (saved && saved !== "undefined") {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse local wishlist", e);
          localStorage.removeItem(WISHLIST_LOCAL_STORAGE_KEY);
        }
      }
    };
    
    loadLocal();
    setIsInitializing(false);

    const handleUpdate = () => loadLocal();
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  // Sync with backend when signed in
  useEffect(() => {
    const syncWithBackend = async () => {
      if (!authLoading && isAuthenticated) {
        try {
          const token = await getToken();
          
          // First, sync current local items to backend
          const saved = localStorage.getItem(WISHLIST_LOCAL_STORAGE_KEY);
          let currentWishlist: string[] = [];
          if (saved && saved !== "undefined") {
            try { currentWishlist = JSON.parse(saved); } catch(e) {}
          }

          if (currentWishlist.length > 0) {
            const syncRes = await fetch(`${API_URL}/api/v1/wishlist/sync`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ productIds: currentWishlist }),
            });
            if (!syncRes.ok) {
              console.warn("Wishlist sync failed", await syncRes.text());
            }
          }

          // Then, fetch the full merged wishlist from backend
          const response = await fetch(`${API_URL}/api/v1/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch wishlist: ${response.statusText}`);
          }
          
          const data = await response.json();
          // Assuming API returns products, we extract IDs
          const newWishlist = Array.isArray(data) ? data.map((p: any) => p.id) : [];
          setWishlist(newWishlist);
          localStorage.setItem(WISHLIST_LOCAL_STORAGE_KEY, JSON.stringify(newWishlist));
          window.dispatchEvent(new Event('wishlist-updated'));
        } catch (error) {
          console.error("Failed to sync wishlist with backend", error);
        }
      }
    };

    syncWithBackend();
  }, [authLoading, isAuthenticated, getToken]);

  const toggleWishlist = useCallback(async (productId: string) => {
    // Read latest from localStorage to avoid stale state from isolated instances
    let currentWishlist = wishlist;
    const saved = localStorage.getItem(WISHLIST_LOCAL_STORAGE_KEY);
    if (saved && saved !== "undefined") {
      try { currentWishlist = JSON.parse(saved); } catch(e) {}
    }

    const isCurrentlyIn = currentWishlist.includes(productId);
    
    // Optimistic Update
    const newWishlist = isCurrentlyIn 
      ? currentWishlist.filter(id => id !== productId)
      : [...currentWishlist, productId];
    
    setWishlist(newWishlist);
    localStorage.setItem(WISHLIST_LOCAL_STORAGE_KEY, JSON.stringify(newWishlist));
    window.dispatchEvent(new Event('wishlist-updated'));

    // Backend update if signed in
    if (isAuthenticated) {
      try {
        const token = await getToken();
        const method = isCurrentlyIn ? "DELETE" : "POST";
        await fetch(`${API_URL}/api/v1/wishlist/${productId}`, {
          method,
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        // Rollback on error
        setWishlist(currentWishlist);
        localStorage.setItem(WISHLIST_LOCAL_STORAGE_KEY, JSON.stringify(currentWishlist));
        window.dispatchEvent(new Event('wishlist-updated'));
        console.error("Failed to update wishlist on backend", error);
      }
    }
  }, [wishlist, isAuthenticated, getToken]);

  return {
    wishlist,
    toggleWishlist,
    isInWishlist: (productId: string) => wishlist.includes(productId),
    isInitializing: isInitializing || authLoading
  };
}
