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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
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

  async function onRegister() {
    if (!name.trim()) {
      Alert.alert("⚠️ Missing Info", "Please enter your name");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert("⚠️ Invalid Email", "Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert("⚠️ Weak Password", "Password must be at least 6 characters");
      return;
    }
    if (!childName.trim()) {
      Alert.alert("⚠️ Missing Info", "Please enter your child's name");
      return;
    }
    if (!age.trim() || isNaN(age) || age < 1 || age > 18) {
      Alert.alert("⚠️ Invalid Age", "Please enter a valid age (1-18)");
      return;
    }

    setLoading(true);

    try {
      const users = (await load("users")) || {};
      const emailKey = email.trim().toLowerCase(); // NORMALIZE

      if (users[emailKey]) {
        Alert.alert("❌ Account Exists", "This email is already registered");
        setLoading(false);
        return;
      }

      users[emailKey] = {
        name: name.trim(),
        email: emailKey,
        password: password,
        childName: childName.trim(),
        age: age.trim(),
      };

      await save("users", users);
      console.log("✅ User registered with email:", emailKey);

      Alert.alert("✅ Success", "Account created! Please log in.", [
        {
          text: "OK",
          onPress: async () => {
            // Set current user for the new account
            await setCurrentUser(emailKey);

            // Clear any old session data
            await save("session", null);

            console.log("✅ User context set for fresh start");

            // Navigate to Login screen
            navigation.replace("Login");
          },
        },
      ]);
    } catch (error) {
      console.error("❌ Registration error:", error);
      Alert.alert("❌ Error", "Something went wrong. Please try again.");
    } finally {
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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* COMPACT HEADER */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logo}>📝</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            {/* PARENT SECTION */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👤</Text>
              <Text style={styles.sectionLabel}>Your Info</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#CBD5E1"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#CBD5E1"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Min 6 characters"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#CBD5E1"
                editable={!loading}
              />
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* CHILD SECTION */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👶</Text>
              <Text style={styles.sectionLabel}>Child Info</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.flexInput]}>
                <Text style={styles.label}>Child's Name</Text>
                <TextInput
                  placeholder="Name"
                  value={childName}
                  onChangeText={setChildName}
                  style={styles.input}
                  placeholderTextColor="#CBD5E1"
                  editable={!loading}
                />
              </View>

              <View style={[styles.inputContainer, styles.ageInput]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  placeholder="1-18"
                  value={age}
                  onChangeText={setAge}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholderTextColor="#CBD5E1"
                  editable={!loading}
                />
              </View>
            </View>
          </View>

          {/* REGISTER BUTTON */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.disabledBtn]}
            onPress={onRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.registerBtnText}>
              {loading ? "Creating..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },

  // COMPACT HEADER
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#0369A1",
  },
  logo: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0369A1",
  },

  // FORM CARD
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#64748B",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0369A1",
  },

  divider: {
    height: 1,
    backgroundColor: "#E0F2FE",
    marginVertical: 12,
  },

  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0369A1",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#64748B",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0369A1",
    fontWeight: "600",
  },

  // ROW LAYOUT FOR NAME + AGE
  row: {
    flexDirection: "row",
    gap: 10,
  },
  flexInput: {
    flex: 1,
  },
  ageInput: {
    width: 80,
  },

  // BUTTON
  registerBtn: {
    backgroundColor: "#0369A1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  registerBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
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
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  loginLink: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0369A1",
    textDecorationLine: "underline",
  },
});