import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Pressable
} from "react-native";

/* ================= CATEGORY DATA ================= */
const CATEGORY_DATA = [
  {
    id: "1",
    name: "Beauty & Hygiene",
    sub: [
      {
        id: "1-1",
        name: "Bathroom & Cleaning",
        mini: ["Bathroom", "Bathroom Accessories", "Bath Cloth", "Garden Care"]
      }
    ]
  },
  {
    id: "2",
    name: "Cleaning & Household",
    sub: [
      {
        id: "2-1",
        name: "Home Cleaning",
        mini: ["Floor Cleaners", "Detergents", "Fresheners"]
      }
    ]
  }
];

const CategoryMenu = () => {
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const closeAll = () => {
    setVisible(false);
    setSelectedCategory(null);
    setSelectedSub(null);
  };

  return (
    <>
      {/* MENU ICON */}
      <TouchableOpacity style={styles.menuBtn} onPress={() => setVisible(true)}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* POPUP MODAL */}
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={closeAll}
      >
        {/* Backdrop (full screen click-to-close) */}
        <Pressable style={styles.backdrop} onPress={closeAll} />

        {/* Popup container (does NOT behave like drawer) */}
        <View style={styles.popupHost} pointerEvents="box-none">
          <View style={styles.popup}>
            {/* HEADER */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  if (selectedSub) setSelectedSub(null);
                  else if (selectedCategory) setSelectedCategory(null);
                  else closeAll();
                }}
              >
                <Text style={styles.back}>⮜</Text>
              </TouchableOpacity>

              <Text style={styles.title}>
                {selectedSub
                  ? "Mini Categories"
                  : selectedCategory
                  ? "Sub Categories"
                  : "Categories"}
              </Text>
            </View>

            {/* CATEGORY */}
            {!selectedCategory && (
              <FlatList
                data={CATEGORY_DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => setSelectedCategory(item)}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* SUB CATEGORY */}
            {selectedCategory && !selectedSub && (
              <FlatList
                data={selectedCategory.sub}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => setSelectedSub(item)}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* MINI SUB */}
            {selectedSub && (
              <FlatList
                data={selectedSub.mini}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      console.log("Selected:", item);
                      closeAll();
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CategoryMenu;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  menuBtn: {
    paddingRight: 10
  },
  menuIcon: {
    fontSize: 26,
    color: "white"
  },

  // Full screen backdrop behind popup
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)"
  },

  // Host that positions the popup like a dropdown
  popupHost: {
    position: "absolute",
    top: 120, // below your header (adjust if needed)
    left: 16,
    right: 16,
    alignItems: "flex-start"
  },

  // Actual popup box
  popup: {
    width: "80%",
    maxHeight: 320, // fixed popup height (not full screen)
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 12
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  back: {
    fontSize: 22,
    marginRight: 15
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee"
  }
});
