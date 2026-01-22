import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import BBSCARTLOGO from "../assets/images/bbscart-logo.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

 const [showPassword, setShowPassword] = useState(false);

  const validateLogin = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return false;
    }

    if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      Alert.alert("Error", "Enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Password is required");
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/.test(
        password
      )
    ) {
      Alert.alert(
        "Error",
        "Password must include uppercase, lowercase, number, and special character"
      );
      return false;
    }

    return true;
  };

  const handleSendOtp = () => {
    if (!phone || phone.length !== 10) {
      Alert.alert("Invalid Phone", "Enter a valid 10-digit phone number.");
      return;
    }
    setOtpSent(true);
    Alert.alert("OTP Sent", "An OTP has been sent to your phone number.");
  };

  const handleSignIn = async () => {
    if (!validateLogin()) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://bbscart.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // Build auth_user payload
      const authUser = {
        token: data.token,
        user: data.user || {
          name: data.name || "",
          email: email.trim(),
          phone: data.phone || "",
        },
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem(
        "auth_user",
        JSON.stringify(authUser)
      );

      // Call AuthContext login to update auth state
      login();

      // Debug log (temporary)
      console.log("auth_user CREATED →", authUser);

    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={BBSCARTLOGO} style={styles.logo} />
        <Text style={styles.title}>Welcome to BBSCART</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
<View style={styles.inputGroup}>
  <Text style={styles.label}>Password</Text>

  <View style={styles.passwordContainer}>
    <TextInput
      placeholder="Enter password"
      value={password}
      onChangeText={setPassword}
      style={styles.passwordInput}
      secureTextEntry={!showPassword}
    />

    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      style={styles.eyeIcon}
    >
      <Icon
        name={showPassword ? 'eye' : 'eye-off'}
        size={22}
        color="#666"
      />
    </TouchableOpacity>
  </View>
</View>


      <Text style={styles.orText}>OR</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="Enter phone number"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      {!otpSent ? (
        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Verify OTP</Text>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
          Sign Up
        </Text>
      </Text>

      <Text style={styles.footerText}>
        Forgot your password?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("ResetPasswordFlow")}
        >
          Reset Password
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  /* ===== CONTAINER ===== */
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 25,
    paddingTop: 40,
  },

  /* ===== HEADER ===== */
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#022D36",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  /* ===== INPUT GROUP ===== */
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },

  /* ===== NORMAL TEXT INPUT ===== */
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FAFAFA",
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
  },

  /* ===== PASSWORD CONTAINER (TEXT INPUT + EYE ICON) ===== */
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    height: 50,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },

  /* ===== OR TEXT ===== */
  orText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 15,
    fontSize: 14,
    fontWeight: "500",
  },

  /* ===== BUTTON ===== */
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    ...(Platform.OS === "web" && { cursor: "pointer" }),
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* ===== FOOTER ===== */
  footerText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    marginTop: 10,
  },
  link: {
    color: "#022D36",
    fontWeight: "bold",
  },
});


export default SignInScreen;
