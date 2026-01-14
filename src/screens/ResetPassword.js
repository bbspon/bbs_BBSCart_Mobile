import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BBSCARTLOGO from "../assets/images/bbscart-logo.png";

const Stack = createNativeStackNavigator();

function EmailConfirmationScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    if (!email.trim()) {
      return Alert.alert("Error", "Please enter your email");
    }
    Alert.alert("Success", "Confirmation link/OTP sent to " + email);
    navigation.navigate("ResetPassword", { email });
  };

  return (
    <View style={styles.container}>
      <Image source={BBSCARTLOGO} style={styles.logo} />
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send Confirmation</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <Text style={styles.links}>
        Remember your password?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("SignIn")}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
}

function ResetPasswordScreen({ route, navigation }) {
  const { email } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Eye toggle states
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    // Navigate to SignIn after reset
    Alert.alert("Success", "Password changed for " + email, [
      {
        text: "OK",
        onPress: () => navigation.navigate("SignIn"),
      },
    ]);
  };

  const renderPasswordInput = (placeholder, value, setValue, visible, setVisible) => (
    <View style={styles.passwordRow}>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        placeholder={placeholder}
        secureTextEntry={!visible}
        value={value}
        onChangeText={setValue}
      />
      <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eyeBtn}>
        <Icon
          name={visible ? "eye-off-outline" : "eye-outline"}
          size={22}
          color="#555"
          style={styles.eyeIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={BBSCARTLOGO} style={styles.logo} />
      <Text style={styles.title}>Create New Password</Text>

      {renderPasswordInput("New Password", newPassword, setNewPassword, showNewPass, setShowNewPass)}
      {renderPasswordInput("Confirm New Password", confirmPassword, setConfirmPassword, showConfirmPass, setShowConfirmPass)}

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <Text style={styles.links}>
        Remember your password?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("SignIn")}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
}

export default function ResetPasswordFlow() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EmailConfirmation"
        component={EmailConfirmationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  eyeBtn: {
    marginLeft: -40,
    padding: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  links: {
    fontWeight: "600",
    marginTop: 15,
    textAlign: "center",
  },
  link: {
    color: "#007AFF",
  },
  eyeIcon: {
    paddingBottom: 15,
 
  },
});
