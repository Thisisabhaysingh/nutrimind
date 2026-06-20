import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CHEMISTRY_ITEMS = [
  {
    name: "Dopamine",
    subtitle: "Focus & Motivation",
    icon: "⚡",
    score: 5,
    progress: 0.05,
    foods: "Lean meats • Fish • Eggs • Soy",
    benefits: "Sharper focus • More motivation",
    works: "Protein -> Tyrosine -> Dopamine",
    warning: "⚠️ Maintain protein intake for focus",
  },
  {
    name: "Acetylcholine",
    subtitle: "Memory & Learning",
    icon: "💭",
    score: 0,
    progress: 0,
    foods: "Eggs • Nuts • Leafy Greens",
    benefits: "Better memory • Faster recall",
    works: "Choline -> Acetylcholine for memory",
    warning: "⚠️ Low choline can weaken memory",
  },
  {
    name: "Serotonin",
    subtitle: "Mood & Sleep",
    icon: "😊",
    score: 14,
    progress: 0.14,
    foods: "Bananas • Whole Grains • Nuts • Chocolate",
    benefits: "Better mood • Good sleep • Reduced anxiety",
    works: "Carbs + Tryptophan -> Serotonin",
    warning: "⚠️ Low level - eat more Serotonin-rich foods!",
  },
  {
    name: "Omega-3",
    subtitle: "Brain Structure",
    icon: "🐟",
    score: 0,
    progress: 0,
    foods: "Fish • Flaxseed • Walnuts",
    benefits: "Stronger brain cells • Better learning",
    works: "Omega-3 supports cell membranes",
    warning: "⚠️ Low omega-3 may affect cognition",
  },
  {
    name: "Iron",
    subtitle: "Brain Energy",
    icon: "💪",
    score: 8,
    progress: 0.08,
    foods: "Red meat • Beans • Spinach",
    benefits: "More energy • Better concentration",
    works: "Iron carries oxygen to the brain",
    warning: "⚠️ Iron deficiency can cause fatigue",
  },
];

export default function FoodChemistryScreen({ navigation }) {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleToggle = (name) => {
    setExpandedItem((current) => (current === name ? null : name));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#E0F6FF" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.82}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Food Chemistry</Text>
          <Text style={styles.subtitle}>Tap cards to explore</Text>
        </View>
      </View>

      <View style={styles.rule} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {CHEMISTRY_ITEMS.map((item) => (
          <ChemistryCard
            key={item.name}
            item={item}
            expanded={item.name === expandedItem}
            onPress={() => handleToggle(item.name)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ChemistryCard({ item, expanded, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, expanded && styles.cardExpanded]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.cardTop}>
        <View style={styles.leftCluster}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{item.score}</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.progress, { width: `${Math.max(item.progress * 100, 2)}%` }]} />
      </View>

      {expanded ? (
        <View style={styles.details}>
          <Text style={styles.detailHeading}>Best Foods:</Text>
          <Text style={styles.detailText}>{item.foods}</Text>

          <Text style={styles.detailHeading}>Benefits:</Text>
          <Text style={styles.detailText}>{item.benefits}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>How It Works:</Text>
            <Text style={styles.infoText}>{item.works}</Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>{item.warning}</Text>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.thinLine} />
          <Text style={styles.learnText}>•  Tap to learn more</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E0F6FF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#DFF5FF",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 27,
    paddingTop: 26,
    paddingBottom: 17,
    backgroundColor: "#F8FDFF",
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: "#087CAF",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 34,
  },
  title: {
    color: "#087CAF",
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 34,
  },
  subtitle: {
    color: "#596879",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 1,
  },
  rule: {
    height: 2,
    backgroundColor: "#8FA9B8",
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#6F8798",
    borderRadius: 13,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 13,
    paddingTop: 13,
    paddingBottom: 12,
    shadowColor: "#20384A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 3,
  },
  cardExpanded: {
    borderColor: "#087CAF",
    borderWidth: 3,
  },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftCluster: {
    alignItems: "center",
    flexDirection: "row",
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#D6F1FF",
    marginRight: 12,
  },
  icon: {
    fontSize: 26,
    lineHeight: 31,
  },
  cardTitle: {
    color: "#087CAF",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 20,
  },
  cardSubtitle: {
    color: "#4E5F70",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 15,
  },
  scoreCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 51,
    height: 51,
    borderRadius: 26,
    backgroundColor: "#087CAF",
  },
  scoreText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  track: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "#DAE2EB",
    marginTop: 13,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#087CAF",
  },
  thinLine: {
    height: 1,
    backgroundColor: "#C5D4DE",
    marginTop: 11,
  },
  learnText: {
    color: "#087CAF",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  details: {
    borderTopColor: "#B9CEDB",
    borderTopWidth: 2,
    marginTop: 11,
    paddingTop: 11,
  },
  detailHeading: {
    color: "#087CAF",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },
  detailText: {
    color: "#435568",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
    marginBottom: 9,
  },
  infoBox: {
    backgroundColor: "#DFF5FF",
    borderColor: "#6E8999",
    borderRadius: 9,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 10,
    marginTop: 2,
  },
  infoTitle: {
    color: "#087CAF",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 5,
  },
  infoText: {
    color: "#435568",
    fontSize: 12,
    fontWeight: "800",
  },
  warningBox: {
    borderColor: "#6E8999",
    borderRadius: 7,
    borderWidth: 1,
    marginTop: 9,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  warningText: {
    color: "#087CAF",
    fontSize: 12,
    fontWeight: "900",
  },
});
