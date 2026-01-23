import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

const DashboardScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Business Partner</Text>
      <Text style={styles.subHeader}>Manage everything in one place</Text>

      {/* Franchise */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Franchise</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("FranchiseHead")}
        >
          <Text style={styles.emoji}>🏢</Text>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Franchise</Text>
            <Text style={styles.cardSubtitle}>Track all franchisees under your region</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate("Franchisee")}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Territory */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Territory</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("TerritoryHead")}
        >
          <Text style={styles.emoji}>🌍</Text>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Territory</Text>
            <Text style={styles.cardSubtitle}>Check sales & operations</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate("TerritoryHead")}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Agents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agents</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Agent")}
        >
          <Text style={styles.emoji}>🧑‍💼</Text>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Agent Management</Text>
            <Text style={styles.cardSubtitle}>Monitor field activities</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate("AgentForm")}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Vendors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendors</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Vendor")}
        >
          <Text style={styles.emoji}>📦</Text>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Vendor Network</Text>
            <Text style={styles.cardSubtitle}>Manage vendor partnerships</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate("VendorForm")}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Become a Vendor */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Become a Vendor</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("BecomeAVendor")}
        >
          <Text style={styles.emoji}>🚀</Text>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Become a Vendor</Text>
            <Text style={styles.cardSubtitle}>Join our network of vendors</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.navigate("CustomerBVendor")}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 26,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
    paddingLeft: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: "row", // side by side
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
    marginRight: 12, // spacing between emoji & text
  },
  textContainer: {
    flexShrink: 1, // allows wrapping text
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  applyButton: {
    backgroundColor: "#008080",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DashboardScreen;
