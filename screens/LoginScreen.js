import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { load, save, setCurrentUser } from "../utils/storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function onLogin() {
    // Validation
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert("⚠️ Invalid Email", "Please enter a valid email address");
      return;
    }

    if (!password) {
      Alert.alert("⚠️ Missing Password", "Please enter your password");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Attempting login for:", email);

      // Load all registered users
      const users = (await load("users")) || {};
      console.log("Users loaded:", Object.keys(users));

      const emailKey = email.trim().toLowerCase();
      const user = users[emailKey];

      if (!user) {
        Alert.alert("❌ Login Failed", "No account found with this email. Please register first.");
        setLoading(false);
        return;
      }

      if (user.password !== password) {
        Alert.alert("❌ Login Failed", "Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      // SUCCESS - Set current user FIRST
      console.log("✅ Login successful - Setting current user");
      await setCurrentUser(emailKey);

      // Then save session
      await save("session", { email: emailKey });

      // VERIFY session was saved
      const verify = await load("session");
      console.log("🔍 Session verified:", verify);

      // Navigate to Dashboard
      setLoading(false);
      console.log("Navigating to Dashboard");
      navigation.replace("Dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
      Alert.alert("❌ Error", "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* HEADER WITH BADGE */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logo}>🔐</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to NutriMind</Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            {/* EMAIL INPUT */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#CBD5E1"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                editable={!loading}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={onLogin}
              />
            </View>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.disabledBtn]}
            onPress={onLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginBtnText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Ref for password input
const passwordInputRef = React.createRef();

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },

  // HEADER
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#0369A1",
    shadowColor: "#0369A1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0369A1",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },

  // FORM CARD
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#64748B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#64748B",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0369A1",
    fontWeight: "600",
  },

  // BUTTON
  loginBtn: {
    backgroundColor: "#0369A1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    shadowColor: "#0369A1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },

  // FOOTER
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  link: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0369A1",
    textDecorationLine: "underline",
  },
});