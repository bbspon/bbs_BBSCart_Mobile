import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function CartPage() {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "iPhone 14 Pro",
      price: 120000,
      originalPrice: 130000,
      discount: 8,
      quantity: 1,
      image: "https://e7.pngegg.com/pngimages/763/814/png-clipart-xiaomi-mi-a1-xiaomi-redmi-smartphone-telephone-smartphone-gadget-electronics.png",
      deliveryDate: "Delivery by 25 Aug, Express",
    },
    {
      id: "2",
      name: "Nike Air Max",
      price: 9000,
      originalPrice: 12000,
      discount: 25,
      quantity: 2,
      image: "https://th.bing.com/th/id/R.77eed415b01a3ec4f6cb7758a5a2a6d4?rik=XKDGn49n844u4Q&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fshoes-png-nike-shoes-transparent-background-800.png&ehk=ZvKLgGJIAl%2fJYtcu4emEZimity8VBQnk3UNcaW8MbLQ%3d&risl=&pid=ImgRaw&r=0",
      deliveryDate: "Delivery by 26 Aug, Standard",
    },
  ]);

  const [savedItems, setSavedItems] = useState([]);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveForLater = (item) => {
    setSavedItems((prev) => [...prev, item]);
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const moveToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setSavedItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const getTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const originalTotal = cartItems.reduce(
      (sum, item) => sum + item.originalPrice * item.quantity,
      0
    );
    return { total, originalTotal, discount: originalTotal - total };
  };

  const { total, originalTotal, discount } = getTotal();

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
          <Text style={styles.itemOriginal}>₹{item.originalPrice}</Text>
          <Text style={styles.itemDiscount}>{item.discount}% off</Text>
        </View>
        <Text style={styles.deliveryText}>{item.deliveryDate}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => decreaseQty(item.id)} style={styles.qtyBtn}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQty(item.id)} style={styles.qtyBtn}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Text style={styles.actionText}>REMOVE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveForLater(item)}>
            <Text style={styles.actionText}>SAVE FOR LATER</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("Buy Now", "Proceeding to checkout...")}>
            <Text style={styles.actionText}>BUY NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <ScrollView>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

        {/* Save for Later Section */}
        {savedItems.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={styles.savedTitle}>Saved for Later</Text>
            {savedItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    <Text style={styles.itemOriginal}>₹{item.originalPrice}</Text>
                    <Text style={styles.itemDiscount}>{item.discount}% off</Text>
                  </View>
                  <TouchableOpacity onPress={() => moveToCart(item)}>
                    <Text style={styles.actionText}>MOVE TO CART</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Price Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Price Details</Text>
          <View style={styles.summaryRow}>
            <Text>Price ({cartItems.length} items)</Text>
            <Text>₹{originalTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Discount</Text>
            <Text style={{ color: "green" }}>-₹{discount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Delivery Charges</Text>
            <Text style={{ color: discount > 1000 ? "green" : "black" }}>
              {discount > 1000 ? "FREE" : "₹100"}
            </Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, marginTop: 5, paddingTop: 5 }]}>
            <Text style={{ fontWeight: "bold" }}>Total Amount</Text>
            <Text style={{ fontWeight: "bold" }}>₹{total + (discount > 1000 ? 0 : 100)}</Text>
          </View>
          <Text style={{ color: "green", marginTop: 5 }}>
            You will save ₹{discount} on this order
          </Text>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderBtn}
      onPress={() => navigation.navigate("Checkout")}>
        <Text style={styles.placeOrderText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 12,
    marginHorizontal: 12,
    padding: 20,
    borderRadius: 8,
    elevation: 2,
  },
  itemImage: { width: 100, height: 90, borderRadius: 6,padding:20 },
  itemName: { fontSize: 15, fontWeight: "bold", marginBottom: 5 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  itemPrice: { fontSize: 16, fontWeight: "bold", marginRight: 8 },
  itemOriginal: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "gray",
    marginRight: 8,
  },
  itemDiscount: { fontSize: 14, color: "green" },
  deliveryText: { fontSize: 12, color: "gray", marginVertical: 4 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qtyText: { marginHorizontal: 10, fontSize: 16 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionText: { color: "#2874F0", marginRight: 8, fontSize: 13},
  savedSection: { backgroundColor: "#fff", marginTop: 10, padding: 10 },
  savedTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    margin: 15,
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  placeOrderBtn: {
    backgroundColor: "#fb641b",
    padding: 15,
    alignItems: "center",
  },
  placeOrderText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
