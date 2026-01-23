import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BBSCARTLOGO from "./src/assets/images/bbscart-logo.png";

// ---------- Screens ----------
import Home from "./src/screens/Home";
import Dashboard from "./src/screens/Dashboard";
import FranchiseHeadScreen from "./src/screens/FranchiseHeadScreen";
import Franchisee from "./src/screens/Franchisee";
import TerritoryHead from "./src/screens/TerritoryHead";
import AgentScreen from "./src/screens/AgentScreen";
import AgentForm from "./src/screens/AgentForm";
import VendorScreen from "./src/screens/VendorScreen";
import VendorForm from "./src/screens/VendorForm";
import BecomeVendorScreen from "./src/screens/BecomeVendorScreen";
import CustomerBVendor from "./src/screens/CustomerBVendor";
import ProfileSettingsScreen from "./src/screens/ProfileSettings";
import CartPage from "./src/screens/CartScreen";
import ProductListings from "./src/screens/ProductListings";
import CheckoutPage from "./src/screens/CheckoutScreen";
import SuccessPage from "./src/screens/SuccessPage";
import Notifications from "./src/screens/Notifications";
import ProductDetails from "./src/screens/ProductDetails";
import Registration from "./src/screens/SignUp";
import SignIn from "./src/screens/SignInScreen";
import IntroScreen from "./src/screens/IntroScreen";
import UserAccount from "./src/screens/UserAccount";
import OrderHistory from "./src/screens/OrderHistory";
import Wishlist from "./src/screens/Wishlist";
import Coupons from "./src/screens/Coupons";
import MyWallet from "./src/screens/MyWallet";
import SavedCardsUPI from "./src/screens/SavedCardsUPI";
import RewardsScreen from "./src/screens/RewardsScreen";
import ResetPasswordFlow from "./src/screens/ResetPassword";
import ContactUsScreen from "./src/screens/ContactUsScreen";
import FeedbackScreen from "./src/screens/FeedbackScreen";
import AppSettingsScreen from "./src/screens/AppSettingsScreen";
// ---------- Context ----------
import ChangePassword from "./src/screens/ChangePasswordScreen";
import TermsOfUse from "./src/screens/TermsOfUseScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import CancellationPolicyScreen from "./src/screens/CancellationPolicyScreen";
import ShippingPolicyScreen from "./src/screens/ShippingPolicyScreen";
import RefundPolicyScreen from "./src/screens/RefundPolicyScreen";
import BuybackPolicyScreen from "./src/screens/BuybackPolicyScreen";
import ExchangePolicyScreen from "./src/screens/ExchangePolicyScreen";
import BankCashbackPolicyScreen from "./src/screens/BankCashbackPolicyScreen";
import SubcategoryProductsScreen from "./src/screens/SubcategoryProductsScreen";
import { CartProvider, useCart } from "./src/contexts/CartContext";
import { WishlistProvider, useWishlist } from "./src/contexts/WishlistContext";

// ---------- Context ----------
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

const Stack = createNativeStackNavigator();

/* ---------------- HEADER ICONS WITH COUNTS COMPONENT ---------------- */
function HeaderIcons({ navigation }) {
  const { totalCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <View style={styles.headerIconsContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Notifications")}
        style={styles.iconButton}
      >
        <Icon name="bell-outline" size={24} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate("Cart")}
        style={styles.iconButton}
      >
        <View style={styles.iconWrapper}>
          <Icon name="cart-outline" size={24} color="black" />
          {totalCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalCount > 99 ? "99+" : totalCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Wishlist")}
        style={styles.iconButton}
      >
        <View style={styles.iconWrapper}>
          <Icon name="heart-outline" size={24} color="black" />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- AUTH STACK ---------------- */
function AuthStack({ showIntro }) {
  return (
    <Stack.Navigator initialRouteName={showIntro ? "Intro" : "SignIn"}>
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={Registration}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordFlow"
        component={ResetPasswordFlow}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}

/* ---------------- HEADER LOGO COMPONENT ---------------- */
function HeaderLogo() {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={BBSCARTLOGO}
        style={styles.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

/* ---------------- MAIN APP STACK ---------------- */
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: "center",
          headerStyle: { 
            backgroundColor: "white",
            height: 60,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleContainerStyle: {
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            overflow: "visible",
          },
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="FranchiseHead" component={FranchiseHeadScreen} />
      <Stack.Screen name="Franchisee" component={Franchisee} />
      <Stack.Screen name="TerritoryHead" component={TerritoryHead} />
      <Stack.Screen name="Agent" component={AgentScreen} />
      <Stack.Screen name="AgentForm" component={AgentForm} />
      <Stack.Screen name="Vendor" component={VendorScreen} />
      <Stack.Screen name="VendorForm" component={VendorForm} />
      <Stack.Screen name="BecomeAVendor" component={BecomeVendorScreen} />
      <Stack.Screen name="CustomerBVendor" component={CustomerBVendor} />
      <Stack.Screen name="UserAccount" component={UserAccount} />
      <Stack.Screen name="Cart" component={CartPage} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Products" component={ProductListings} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="Settings" component={AppSettingsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutPage} />
      <Stack.Screen name="Success" component={SuccessPage} />
      <Stack.Screen name="Orders" component={OrderHistory} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Coupons" component={Coupons} />
      <Stack.Screen name="Wallet" component={MyWallet} />
      <Stack.Screen name="Payments" component={SavedCardsUPI} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="TermsOfUse" component={TermsOfUse} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="CancellationPolicy" component={CancellationPolicyScreen} />
      <Stack.Screen name="ShippingPolicy" component={ShippingPolicyScreen} />
      <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
      <Stack.Screen name="BuybackPolicy" component={BuybackPolicyScreen} />
      <Stack.Screen name="ExchangePolicy" component={ExchangePolicyScreen} />
      <Stack.Screen name="BankCashbackPolicy" component={BankCashbackPolicyScreen} />
      <Stack.Screen name="SubcategoryProducts" component={SubcategoryProductsScreen} />
    </Stack.Navigator>
  );
}

/* ---------------- ROOT NAVIGATOR ---------------- */
function RootNavigator() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [checkingFirstLaunch, setCheckingFirstLaunch] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // First launch - show intro
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          // Not first launch - skip intro
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.log("Error checking first launch:", error);
        setIsFirstLaunch(false);
      } finally {
        setCheckingFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Show loading while checking first launch and auth status
  if (checkingFirstLaunch || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return isLoggedIn ? <MainStack /> : <AuthStack showIntro={isFirstLaunch} />;
}

/* ---------------- APP ROOT ---------------- */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <FlashMessage position="top" />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  logoContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
    position: "relative",
  },
  headerLogo: {
    width: 350,
    height: 150,
    marginTop: -45,
    marginBottom: -45,
  },
  headerIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    overflow: "visible",
  },
  iconButton: {
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ff4444",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 14,
  },
});
