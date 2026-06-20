// ============================================
// MILESTONES SCREEN - REDESIGNED
// ============================================
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { load, save } from "../utils/storage";

const ALL_MILESTONES = [
  { id: "m1", title: "Short-term memory", desc: "Remembers object after 1 min", emoji: "🧠" },
  { id: "m2", title: "Sustained attention", desc: "Listens for 5 minutes", emoji: "🎯" },
  { id: "m3", title: "Problem solving", desc: "Solves simple puzzles", emoji: "🧩" },
  { id: "m4", title: "Counting & math", desc: "Basic math skills", emoji: "🧮" },
  { id: "m5", title: "Language", desc: "Forms complete sentences", emoji: "💬" },
  { id: "m6", title: "Reading", desc: "Reads simple books", emoji: "📖" },
  { id: "m7", title: "Social skills", desc: "Cooperates with peers", emoji: "👥" },
  { id: "m8", title: "Motor skills", desc: "Coordination & balance", emoji: "🏃" },
];

export function MilestonesScreen() {
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    (async () => {
      const stored = (await load("milestones")) || [];
      setMilestones(stored);
    })();
  }, []);

  function toggleAchieved(item) {
    const existing = milestones.find((m) => m.id === item.id);
    let updated;
    if (existing) {
      updated = milestones.filter((m) => m.id !== item.id);
    } else {
      updated = [
        { id: item.id, title: item.title, date: new Date().toISOString() },
        ...milestones,
      ];
    }
    setMilestones(updated);
    save("milestones", updated);
  }

  function reset() {
    Alert.alert("Reset Milestones", "Clear all achievements?", [
      { text: "Cancel" },
      {
        text: "Reset",
        onPress: async () => {
          await save("milestones", []);
          setMilestones([]);
        },
      },
    ]);
  }

  const achievedCount = milestones.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🎯</Text>
        <Text style={styles.title}>Cognitive Milestones</Text>
        <Text style={styles.subtitle}>Track your child's development</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(achievedCount / ALL_MILESTONES.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {achievedCount} of {ALL_MILESTONES.length} achieved
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {ALL_MILESTONES.map((item) => {
          const achieved = !!milestones.find((m) => m.id === item.id);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleAchieved(item)}
              style={[
                styles.milestoneCard,
                achieved && styles.milestoneCardAchieved,
              ]}
            >
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneEmoji}>{item.emoji}</Text>
                <View style={styles.milestoneText}>
                  <Text style={styles.milestoneTitle}>{item.title}</Text>
                  <Text style={styles.milestoneDesc}>{item.desc}</Text>
                </View>
              </View>
              <Text style={styles.milestoneStatus}>
                {achieved ? "✅" : "⭕"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={reset}
          activeOpacity={0.8}
        >
          <Text style={styles.resetBtnText}>🔄 Reset All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================
// RECOMMENDATIONS SCREEN - REDESIGNED
// ============================================

export function RecommendationsScreen() {
  const recs = [
    {
      key: 1,
      title: "Protein at Breakfast",
      emoji: "🥚",
      text: "Include eggs, paneer, or lentils to boost dopamine for focus.",
    },
    {
      key: 2,
      title: "Daily Fruits",
      emoji: "🍎",
      text: "Fruits provide tryptophan & vitamins for mood & serotonin.",
    },
    {
      key: 3,
      title: "Fish & Nuts Weekly",
      emoji: "🐟",
      text: "2-3x per week for Omega-3 (DHA) - supports memory & IQ.",
    },
    {
      key: 4,
      title: "More Vegetables",
      emoji: "🥦",
      text: "Supply micronutrients (iron, zinc) for attention & memory.",
    },
    {
      key: 5,
      title: "Sleep & Routine",
      emoji: "😴",
      text: "Consistent sleep & limited screen time improve learning.",
    },
    {
      key: 6,
      title: "Stay Hydrated",
      emoji: "💧",
      text: "Water is essential - dehydration causes brain fog & fatigue.",
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.recContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.recHeader}>
        <Text style={styles.recHeaderEmoji}>💡</Text>
        <Text style={styles.recTitle}>Recommendations</Text>
        <Text style={styles.recSubtitle}>Evidence-based tips for brain health</Text>
      </View>

      {recs.map((rec) => (
        <View key={rec.key} style={styles.recCard}>
          <View style={styles.recCardHeader}>
            <Text style={styles.recEmoji}>{rec.emoji}</Text>
            <Text style={styles.recCardTitle}>{rec.title}</Text>
          </View>
          <Text style={styles.recText}>{rec.text}</Text>
        </View>
      ))}

      <View style={styles.recBottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ============ MILESTONES STYLES ============
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE", // Light Blue
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0369A1", // Dark Blue
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B", // Gray
    fontWeight: "500",
  },

  progressCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF", // White
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#0369A1", // Dark Blue
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369A1", // Dark Blue
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0F2FE", // Light Blue
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0369A1", // Dark Blue
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: "#64748B", // Gray
    fontWeight: "600",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  milestoneCard: {
    backgroundColor: "#FFFFFF", // White
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: "#64748B", // Gray
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneCardAchieved: {
    backgroundColor: "#FFFFFF", // White
    borderLeftColor: "#0369A1", // Dark Blue
  },
  milestoneContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  milestoneEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  milestoneText: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0369A1", // Dark Blue
  },
  milestoneDesc: {
    fontSize: 11,
    color: "#64748B", // Gray
    marginTop: 2,
  },
  milestoneStatus: {
    fontSize: 24,
    marginLeft: 10,
  },

  bottomButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resetBtn: {
    backgroundColor: "#FFFFFF", // White
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#64748B", // Gray
  },
  resetBtnText: {
    color: "#0369A1", // Dark Blue
    fontWeight: "800",
    fontSize: 14,
  },

  // ============ RECOMMENDATIONS STYLES ============
  recContainer: {
    backgroundColor: "#E0F2FE", // Light Blue
    paddingVertical: 16,
  },
  recHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  recHeaderEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  recTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0369A1", // Dark Blue
    marginBottom: 4,
  },
  recSubtitle: {
    fontSize: 13,
    color: "#64748B", // Gray
    fontWeight: "500",
  },

  recCard: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: "#FFFFFF", // White
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 5,
    borderLeftColor: "#0369A1", // Dark Blue
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  recCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0369A1", // Dark Blue
  },
  recText: {
    fontSize: 12,
    color: "#64748B", // Gray
    lineHeight: 16,
  },

  recBottom: {
    height: 30,
  },
});

// Export both screens
export default MilestonesScreen;
