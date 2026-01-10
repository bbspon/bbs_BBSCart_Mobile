import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_BASE = "https://bbscart.com/api";

const CategoryMenu = ({ visible, onClose }) => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [groups, setGroups] = useState([]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  /* ---------------- FETCH CATEGORIES ---------------- */

  useEffect(() => {
    if (!visible) return;

    fetchCategories();
    resetAll(); // important
  }, [visible]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.log("❌ CATEGORY API ERROR", err);
    }
  };

  /* ---------------- FETCH SUBCATEGORIES ---------------- */

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/subcategories?categoryId=${categoryId}`
      );
      setSubcategories(res.data || []);
    } catch (err) {
      console.log("❌ SUBCATEGORY API ERROR", err);
    }
  };

  /* ---------------- FETCH GROUPS ---------------- */

  const fetchGroups = async (subcategoryId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/productgroups?subcategoryId=${subcategoryId}`
      );
      setGroups(res.data || []);
    } catch (err) {
      console.log("❌ GROUP API ERROR", err);
    }
  };

  /* ---------------- STATE RESET HELPERS ---------------- */

  const resetAll = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
    setSubcategories([]);
    setGroups([]);
  };

  const resetSubAndGroups = () => {
    setActiveSubcategory(null);
    setSubcategories([]);
    setGroups([]);
  };

  /* ---------------- CLOSE ---------------- */

  const handleClose = () => {
    resetAll();
    onClose?.();
  };

  /* ---------------- UI ---------------- */

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <View style={styles.popup}>
        <View style={styles.closeWrapper}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.columns}>
          {/* CATEGORY */}
          <View style={styles.column}>
            <Text style={styles.title}>Category</Text>
            <ScrollView>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={[
                    styles.item,
                    activeCategory === cat._id && styles.activeItem,
                  ]}
                  onPress={() => {
                    if (activeCategory === cat._id) return;

                    setActiveCategory(cat._id);
                    resetSubAndGroups();
                    fetchSubcategories(cat._id);
                  }}
                >
                  <Text>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* SUBCATEGORY */}
      <View style={styles.column}>
  <Text style={styles.title}>Subcategory</Text>
  <ScrollView>
    {subcategories.map((sub) => (
      <TouchableOpacity
        key={sub._id}
        style={[
          styles.item,
          activeSubcategory === sub._id && styles.activeItem,
        ]}
        onPress={() => {
          if (activeSubcategory === sub._id) return;

          setActiveSubcategory(sub._id);

          // ✅ CLOSE POPUP
          handleClose();

          // ✅ NAVIGATE LIKE WEBSITE
          navigation.navigate("SubcategoryProducts", {
            subcategoryId: sub._id,
            title: sub.name,
          });
        }}
      >
        <Text>{sub.name}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>


          {/* GROUPS */}
          <View style={styles.column}>
            <Text style={styles.title}>Groups</Text>
            <ScrollView>
              {groups.map((grp) => (
                <TouchableOpacity
                  key={grp._id}
                  style={styles.item}
                  onPress={() => {
                    handleClose();
                    navigation.navigate("ProductListing", {
                      groupId: grp._id,
                      title: grp.label,
                    });
                  }}
                >
                  <Text>{grp.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryMenu;

/* ---------------- STYLES (UNCHANGED) ---------------- */

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  popup: {
    position: "absolute",
    top: 120,
    left: 10,
    right: 10,
    height: 360,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 12,
  },
  closeWrapper: {
    alignItems: "flex-end",
  },
  closeText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  columns: {
    flexDirection: "row",
    flex: 1,
  },
  column: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    paddingVertical: 10,
  },
  activeItem: {
    backgroundColor: "#ffe7b3",
    borderRadius: 6,
  },
});
