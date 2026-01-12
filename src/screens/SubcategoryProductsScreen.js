import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../contexts/CartContext";
import Icon from "react-native-vector-icons/Ionicons";
import { useWishlist } from "../contexts/WishlistContext";

const API_BASE = "https://bbscart.com/api";
const IMAGE_BASE = "https://bbscart.com/uploads/";

export default function SubcategoryProductsScreen({ route, navigation }) {
  const { subcategoryId, title } = route.params;
  const { addItem } = useCart();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { items, addToWishlist, removeFromWishlist, fetchWishlist } = useWishlist();

  // Refresh wishlist when screen comes into focus to ensure state is up to date
  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [fetchWishlist])
  );

  useEffect(() => {
    navigation.setOptions({ title });
    fetchProducts();
  }, [subcategoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const pincode = await AsyncStorage.getItem("deliveryPincode");

      const res = await axios.get(`${API_BASE}/products/public`, {
        params: { subcategoryId, pincode },
      });

      const list = res.data?.products || res.data?.items || [];
      setProducts(list);
    } catch (err) {
      console.log("❌ PRODUCT FETCH ERROR", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (item) => {
    if (item.product_img_url) return item.product_img_url;
    if (item.product_img) return IMAGE_BASE + item.product_img;
    if (item.image) return item.image;
    return "https://via.placeholder.com/300";
  };

  const handleWishlistToggle = async (item, isWishlisted) => {
    try {
      const result = isWishlisted
        ? await removeFromWishlist(item._id)
        : await addToWishlist(item._id);
      
      if (result && !result.success) {
        Alert.alert("Error", result.error || "Failed to update wishlist");
      }
      // If success is true, the wishlist will be automatically refreshed by fetchWishlist
    } catch (error) {
      Alert.alert("Error", "Failed to update wishlist. Please try again.");
      console.log("Wishlist toggle error:", error);
    }
  };

  const renderItem = ({ item }) => {
    // Check if item is wishlisted - handle both direct product structure and nested product structure
    const isWishlisted = items.some((w) => {
      const productId = w.product?._id || w._id;
      return productId === item._id;
    });

  return (
    <View style={styles.card}>
      {/* Wishlist */}
      <TouchableOpacity
        style={styles.wishlist}
        onPress={() => handleWishlistToggle(item, isWishlisted)}
      >
        <Icon
          name={isWishlisted ? "heart" : "heart-outline"}
          size={20}
          color={isWishlisted ? "red" : "#555"}
        />
      </TouchableOpacity>

      {/* Product Click */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetails", { productId: item._id })
        }
      >
        <Image source={{ uri: getImageUrl(item) }} style={styles.image} />

        <Text numberOfLines={2} style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.price}>₹{item.price}</Text>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() =>
            addItem({
              productId: item._id,
              name: item.name,
              price: item.price,
              image: getImageUrl(item),
              qty: 1,
            })
          }
        >
          <Text style={styles.addText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => {
            addItem({
              productId: item._id,
              name: item.name,
              price: item.price,
              image: getImageUrl(item),
              qty: 1,
            });
            navigation.navigate("Cart");
          }}
        >
          <Text style={styles.buyText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.center}>
        <Text>No products found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      numColumns={2}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 10 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 10,
    padding: 8,
    elevation: 3,
  },
  image: {
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  wishlist: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  name: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#fb641b",
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 4,
  },
  buyBtn: {
    flex: 1,
    backgroundColor: "#9acd32",
    paddingVertical: 6,
    borderRadius: 4,
  },
  addText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  buyText: {
    textAlign: "center",
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
