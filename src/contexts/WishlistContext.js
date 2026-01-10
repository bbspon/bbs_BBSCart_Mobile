import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const WishlistContext = createContext(null);
const API_BASE = "https://bbscart.com/api";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setItems([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data?.items || res.data || []);
    } catch (e) {
      console.log("Wishlist fetch error", e.response?.data || e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (productId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found for wishlist add");
        return;
      }

      await axios.post(
        `${API_BASE}/wishlist/add`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh wishlist after adding
      await fetchWishlist();
    } catch (e) {
      console.log("Wishlist add error", e.response?.data || e.message);
    }
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("No token found for wishlist remove");
        return;
      }

      await axios.delete(`${API_BASE}/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh wishlist after removing
      await fetchWishlist();
    } catch (e) {
      console.log("Wishlist remove error", e.response?.data || e.message);
    }
  }, [fetchWishlist]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
