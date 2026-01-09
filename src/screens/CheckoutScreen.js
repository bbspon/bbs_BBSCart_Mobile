import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

export default function CheckoutPage({ navigation }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  
  
  const cartItems = [
    { id: "1", name: "iPhone 14", price: 79999, quantity: 1, delivery: "Tomorrow" },
    { id: "2", name: "Nike Running Shoes", price: 4999, quantity: 2, delivery: "3 Days" },
  ];

  const banks = ["SBI", "HDFC", "ICICI", "Axis Bank", "Kotak"];

  const totalAmount =
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 40;

 const handlePlaceOrder = () => {
  if (!selectedPayment) {
    alert("Please select a payment method!");
    return;
  }
  navigation.navigate("Success"); // ✅ moves to SuccessPage
};

  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* LOGIN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. LOGIN</Text>
          <Text style={styles.text}>Arul, 9876543210</Text>
          <TouchableOpacity>
            <Text style={styles.changeBtn}>CHANGE</Text>
          </TouchableOpacity>
        </View>

        {/* DELIVERY ADDRESS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. DELIVERY ADDRESS</Text>
          <Text style={styles.text}>
            123, Rajapalayam, Puducherry - 605007
          </Text>
          <TouchableOpacity>
            <Text style={styles.changeBtn}>CHANGE</Text>
          </TouchableOpacity>
        </View>

        {/* ORDER SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. ORDER SUMMARY</Text>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {item.name} (x{item.quantity})
                  </Text>
                  <Text style={styles.deliveryText}>
                    Delivery: {item.delivery}
                  </Text>
                </View>
                <Text style={styles.price}>₹{item.price * item.quantity}</Text>
              </View>
            )}
          />
        </View>

        {/* PAYMENT OPTIONS */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>4. PAYMENT OPTIONS</Text>

  {/* UPI */}
  <TouchableOpacity
    style={styles.optionRow}
    onPress={() => setSelectedPayment("upi")}
  >
    <View style={[styles.radioCircle, selectedPayment === "upi" && styles.radioSelected]} />
    <Text style={styles.optionText}>UPI Payment</Text>
  </TouchableOpacity>
  {selectedPayment === "upi" && (
    <TextInput
      style={styles.input}
      placeholder="Enter UPI ID"
      value={upiId}
      onChangeText={setUpiId}
    />
  )}

  {/* CARD */}
  <TouchableOpacity
    style={styles.optionRow}
    onPress={() => setSelectedPayment("card")}
  >
    <View style={[styles.radioCircle, selectedPayment === "card" && styles.radioSelected]} />
    <Text style={styles.optionText}>Credit / Debit / ATM Card</Text>
  </TouchableOpacity>
  {selectedPayment === "card" && (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardDetails.number}
        onChangeText={(text) =>
          setCardDetails({ ...cardDetails, number: text })
        }
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        value={cardDetails.expiry}
        onChangeText={(text) =>
          setCardDetails({ ...cardDetails, expiry: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        secureTextEntry
        value={cardDetails.cvv}
        onChangeText={(text) =>
          setCardDetails({ ...cardDetails, cvv: text })
        }
        keyboardType="numeric"
      />
    </View>
  )}

  {/* NET BANKING */}
  <TouchableOpacity
    style={styles.optionRow}
    onPress={() => setSelectedPayment("netbanking")}
  >
    <View style={[styles.radioCircle, selectedPayment === "netbanking" && styles.radioSelected]} />
    <Text style={styles.optionText}>Net Banking</Text>
  </TouchableOpacity>
  {selectedPayment === "netbanking" && (
    <View>
      {banks.map((bank) => (
        <TouchableOpacity
          key={bank}
          style={[
            styles.bankOption,
            selectedBank === bank && styles.selectedBank,
          ]}
          onPress={() => setSelectedBank(bank)}
        >
          <Text
            style={[
              styles.bankText,
              selectedBank === bank && { color: "#fff" },
            ]}
          >
            {bank}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )}

  {/* COD */}
  <TouchableOpacity
    style={styles.optionRow}
    onPress={() => setSelectedPayment("cod")}
  >
    <View style={[styles.radioCircle, selectedPayment === "cod" && styles.radioSelected]} />
    <Text style={styles.optionText}>Cash on Delivery</Text>
  </TouchableOpacity>
</View>

        {/* PRICE DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. PRICE DETAILS</Text>
          <View style={styles.itemRow}>
            <Text>Items Total</Text>
            <Text>₹{totalAmount - 40}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text>Handling Fee</Text>
            <Text>₹40</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.itemRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalText}>₹{totalAmount}</Text>
          </View>
        </View>
      </ScrollView>

      {/* PLACE ORDER - fixed bottom */}
    <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder}>
  <Text style={styles.placeBtnText}>PLACE ORDER</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f3f6", padding: 10 },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2874F0",
  },
  text: { fontSize: 14, color: "#333", lineHeight: 20 },
  changeBtn: { color: "#2874F0", fontWeight: "bold", marginTop: 5 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  itemName: { fontSize: 14, fontWeight: "500", color: "#222" },
  deliveryText: { fontSize: 12, color: "green", marginTop: 2 },
  price: { fontSize: 14, fontWeight: "bold", color: "#000" },
  optionRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginVertical: 5,
    backgroundColor: "#fafafa",
  },
  optionText: { fontSize: 14, color: "#111" },
  selectedOption: { borderColor: "#2874F0", backgroundColor: "#e9f2ff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 6,
    backgroundColor: "#fff",
  },
  bankOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 4,
    borderRadius: 6,
  },
  bankText: { fontSize: 14, color: "#222" },
  selectedBank: { backgroundColor: "#2874F0", borderColor: "#2874F0" },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
  totalText: { fontSize: 15, fontWeight: "bold", color: "#000" },
  placeBtn: {
    backgroundColor: "#fb641b",
    padding: 15,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  placeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  radioCircle: {
  height: 20,
  width: 20,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: "#2874F0",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 10,
},
radioSelected: {
  backgroundColor: "#2874F0",
},
optionRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
optionText: {
  fontSize: 14,
  color: "#111",
},

});
