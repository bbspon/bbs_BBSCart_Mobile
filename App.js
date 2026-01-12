import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// ---------- Screens ----------
import Home from "./src/screens/Home";
import Dashboard from "./src/screens/Dashboard";
import FranchiseHeadScreen from "./src/screens/FranchiseHeadScreen";
import TerritoryHead from "./src/screens/TerritoryHead";
import AgentScreen from "./src/screens/AgentScreen";
import VendorScreen from "./src/screens/VendorScreen";
import BecomeVendorScreen from "./src/screens/BecomeVendorScreen";
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
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Intro">
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

/* ---------------- MAIN APP STACK ---------------- */
function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          title: "BBSCART",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          },
          headerStyle: { backgroundColor: "white" },
          headerRight: () => <HeaderIcons navigation={navigation} />,
        })}
      />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="FranchiseHead" component={FranchiseHeadScreen} />
      <Stack.Screen name="TerritoryHead" component={TerritoryHead} />
      <Stack.Screen name="Agent" component={AgentScreen} />
      <Stack.Screen name="Vendor" component={VendorScreen} />
      <Stack.Screen name="BecomeAVendor" component={BecomeVendorScreen} />
      <Stack.Screen name="UserAccount" component={UserAccount} />
      <Stack.Screen name="Cart" component={CartPage} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Products" component={ProductListings} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutPage} />
      <Stack.Screen name="Success" component={SuccessPage} />
      <Stack.Screen name="Orders" component={OrderHistory} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Coupons" component={Coupons} />
      <Stack.Screen name="Wallet" component={MyWallet} />
      <Stack.Screen name="Payments" component={SavedCardsUPI} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
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
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <MainStack /> : <AuthStack />;
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
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
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
