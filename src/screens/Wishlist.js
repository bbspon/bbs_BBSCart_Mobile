// frontend/screens/Wishlist.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Share,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";

const initialWishlist = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra",
    price: 129999,
    oldPrice: 139999,
    image:
      "https://p.kindpng.com/picc/s/12-126796_phone-s5-hd-png-download.png",
    inStock: true,
    note: "",
    alert: false,
  },
  {
    id: "2",
    name: "Nike Air Zoom Pegasus",
    price: 7999,
    oldPrice: 9999,
    image:
      "https://freepngimg.com/download/running_shoes/15-nike-running-shoes-png-image.png",
    inStock: false,
    note: "",
    alert: false,
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Headphones",
    price: 29990,
    oldPrice: 34990,
    image:
      "https://m.media-amazon.com/images/I/61l+sz394PL._SL1000_.jpg",
    inStock: true,
    note: "",
    alert: false,
  },
];

export default function Wishlist({ navigation }) {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [compareVisible, setCompareVisible] = useState(false);

  // --- ACTIONS ---
  const toggleSelect = (id) => {
    const updated = new Set(selectedIds);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedIds(updated);
  };

  const bulkRemove = () => {
    if (selectedIds.size === 0) return;
    setWishlist((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  const moveToCart = (item) => {
    Alert.alert("Moved to Cart", `${item.name} has been added to your cart.`);
    setWishlist((prev) => prev.filter((i) => i.id !== item.id));
  };

  const goToProductDetail = (item) => {
    navigation.navigate("ProductDetail", { product: item });
  };

  const toggleAlert = (id) => {
    setWishlist((prev) =>
      prev.map((i) => (i.id === id ? { ...i, alert: !i.alert } : i))
    );
  };

  const updateNote = (id, text) => {
    setWishlist((prev) =>
      prev.map((i) => (i.id === id ? { ...i, note: text } : i))
    );
  };

  const shareWishlist = async () => {
    try {
      const items = wishlist.map((i) => `${i.name} - ₹${i.price}`).join("\n");
      await Share.share({
        message: `My Wishlist:\n\n${items}`,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share wishlist.");
    }
  };

  // --- RENDER ---
  const renderItem = ({ item }) => {
    const selected = selectedIds.has(item.id);
    const discount =
      item.oldPrice && item.price < item.oldPrice
        ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
        : null;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          selected && { borderColor: "#2874F0", borderWidth: 2 },
        ]}
        onPress={() =>
          selectMode ? toggleSelect(item.id) : goToProductDetail(item)
        }
        onLongPress={() => {
          setSelectMode(true);
          toggleSelect(item.id);
        }}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.oldPrice && (
              <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
            )}
            {discount && (
              <Text style={styles.discount}>{discount}% off</Text>
            )}
          </View>

          <Text style={{ color: item.inStock ? "green" : "red", fontSize: 12 }}>
            {item.inStock ? "In stock" : "Out of stock"}
          </Text>

          {/* Wishlist alerts */}
          <TouchableOpacity onPress={() => toggleAlert(item.id)}>
            <Text style={{ fontSize: 12, color: item.alert ? "red" : "#2874F0" }}>
              {item.alert ? "Alert Set ✓" : "Set Price/Stock Alert"}
            </Text>
          </TouchableOpacity>

          {/* User notes */}
          <TextInput
            placeholder="Add a note..."
            value={item.note}
            onChangeText={(txt) => updateNote(item.id, txt)}
            style={styles.note}
          />

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cartBtn} onPress={() => moveToCart(item)}>
              <Text style={styles.cartBtnText}>Move to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() =>
                setWishlist((prev) => prev.filter((i) => i.id !== item.id))
              }
            >
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedItems = wishlist.filter((i) => selectedIds.has(i.id));

  return (
    <View style={styles.container}>
      {wishlist.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      ) : (
        <>
          {/* Bulk bar */}
          {selectMode && (
            <View style={styles.bulkBar}>
              <Text style={styles.bulkText}>{selectedIds.size} selected</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[styles.bulkRemoveBtn, { marginRight: 10 }]}
                  onPress={() => setCompareVisible(true)}
                >
                  <Text style={{ color: "white" }}>Compare</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bulkRemoveBtn} onPress={bulkRemove}>
                  <Text style={{ color: "white" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Share Button */}
          <TouchableOpacity style={styles.shareBtn} onPress={shareWishlist}>
            <Text style={{ color: "#2874F0", fontWeight: "500" }}>📤 Share Wishlist</Text>
          </TouchableOpacity>

          <FlatList
            data={wishlist}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 8 }}
          />

          {/* Recommendations */}
          <View style={styles.recommend}>
            <Text style={styles.recommendTitle}>You may also like</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3].map((n) => (
                <View key={n} style={styles.recommendCard}>
                  <Image
                    source={{ uri: "https://th.bing.com/th/id/R.b4a95e5342b2e8342a291c3e30f63306?rik=bRvnxONc3fcrBQ&riu=http%3a%2f%2fclipart-library.com%2fnew_gallery%2f30-301973_citi-samsung-pay-smartphone.png&ehk=Z5bHbLS4VIYGMGIbqSKt7OTGGBzRKkNozYDoitWWxuw%3d&risl=&pid=ImgRaw&r=0" }}
                    style={{ width: 80, height: 80, borderRadius: 6 }}
                  />
                  <Text style={{ fontSize: 12 }}>Recommended {n}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Compare Modal */}
          <Modal visible={compareVisible} transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                  Compare Items
                </Text>
                <ScrollView horizontal>
                  {selectedItems.map((i) => (
                    <View key={i.id} style={styles.compareCard}>
                      <Image source={{ uri: i.image }} style={{ width: 80, height: 80 }} />
                      <Text style={{ fontSize: 12, fontWeight: "bold" }}>{i.name}</Text>
                      <Text style={{ fontSize: 12 }}>₹{i.price}</Text>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={[styles.bulkRemoveBtn, { marginTop: 10 }]}
                  onPress={() => setCompareVisible(false)}
                >
                  <Text style={{ color: "white" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

// --- STYLES (Flipkart Style) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f3f6" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
    marginBottom: 8,
  },
  image: { width: 90, height: 90, resizeMode: "contain" },
  info: { flex: 1, marginLeft: 12, justifyContent: "flex-start" },
  name: { fontSize: 14, color: "#212121", marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "bold", color: "#212121" },
  oldPrice: {
    fontSize: 13,
    color: "#878787",
    marginLeft: 6,
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 13,
    color: "#388e3c",
    marginLeft: 6,
    fontWeight: "500",
  },
  note: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    fontSize: 12,
    paddingVertical: 2,
    marginTop: 4,
  },
  actions: { flexDirection: "row", marginTop: 6 },
  cartBtn: { marginRight: 20 },
  cartBtnText: { color: "#2874F0", fontSize: 13, fontWeight: "500" },
  removeBtn: {},
  removeBtnText: { fontSize: 13, color: "#d32f2f", fontWeight: "500" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#777" },
  bulkBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  bulkText: { color: "#212121", fontSize: 14 },
  bulkRemoveBtn: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
  },
  shareBtn: {
    backgroundColor: "#fff",
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  recommend: { backgroundColor: "#fff", padding: 10, marginTop: 8 },
  recommendTitle: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  recommendCard: {
    backgroundColor: "#fafafa",
    padding: 6,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 4,
    width: "90%",
  },
  compareCard: {
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
    marginRight: 8,
    alignItems: "center",
  },
});
