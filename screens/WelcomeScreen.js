import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";


export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.logoBox}>
            <Text style={styles.logo}>🧠</Text>
          </View>
          <Text style={styles.title}>NutriMind</Text>
          <Text style={styles.tagline}>
            Nutrition → Brain → Better Learning
          </Text>
          <Text style={styles.description}>
            Track meals and see how nutrition impacts focus, memory, and grades through brain chemistry.
          </Text>
        </View>

        {/* 2x2 FEATURE GRID */}
        <View style={styles.gridContainer}>
          <FeatureCard
            emoji="🍽️"
            title="Track Nutrition"
            desc="Log meals daily"
          />
          <FeatureCard
            emoji="🧪"
            title="Brain Chemistry"
            desc="See neurotransmitters"
          />
          <FeatureCard
            emoji="🎯"
            title="Milestones"
            desc="Track development"
          />
          <FeatureCard
            emoji="📊"
            title="Performance"
            desc="Link to grades"
          />
        </View>

        {/* CTA BUTTONS */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </ScrollView>
  );
}

function FeatureCard({ emoji, title, desc }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureEmojiCircle}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  );
}

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

  // HERO SECTION
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#0369A1",
    shadowColor: "#0369A1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    fontSize: 44,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#0369A1",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 320,
    fontWeight: "500",
  },

  // FEATURE GRID
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
    width: "100%",
  },
  featureCard: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#64748B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  featureEmojiCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#0369A1",
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
    textAlign: "center",
    color: "#0369A1",
  },
  featureDesc: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    fontWeight: "600",
  },

  // BUTTONS
  buttonSection: {
    width: "100%",
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#0369A1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#0369A1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0369A1",
  },
  secondaryBtnText: {
    color: "#0369A1",
    fontWeight: "900",
    fontSize: 16,
  },
});
