import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function RecommendationsScreen() {
  const recs = [
    { key: 1, title: "Add protein at breakfast", text: "Include eggs, paneer, lentils or milk to boost dopamine (attention).", emoji: "🥚" },
    { key: 2, title: "Add fruits daily", text: "Fruits provide tryptophan precursors & vitamins to support serotonin (mood).", emoji: "🍎" },
    { key: 3, title: "Include nuts/fish twice a week", text: "Sources of Omega-3 (DHA) that support memory & IQ.", emoji: "🐟" },
    { key: 4, title: "Increase vegetables", text: "Vegetables supply micronutrients (iron, zinc) for attention and memory.", emoji: "🥦" },
    { key: 5, title: "Sleep & routine", text: "Consistent sleep and limited screen time improve attention and learning.", emoji: "😴" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>💡</Text>
        <Text style={styles.title}>Recommendations</Text>
        <Text style={styles.subtitle}>Evidence-based tips for brain health</Text>
      </View>

      {recs.map(r => (
        <View key={r.key} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.emoji}>{r.emoji}</Text>
            <Text style={styles.cardTitle}>{r.title}</Text>
          </View>
          <Text style={styles.cardText}>{r.text}</Text>
        </View>
      ))}
      
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#E0F2FE", // Light Blue
    paddingVertical: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  card: { 
    backgroundColor: "#FFFFFF", // White
    borderWidth: 1, 
    borderColor: "#64748B", // Gray
    padding: 14, 
    borderRadius: 12, 
    marginBottom: 12,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#0369A1", // Dark Blue
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: "800",
    fontSize: 13,
    color: "#0369A1", // Dark Blue
  },
  cardText: {
    fontSize: 12,
    color: "#64748B", // Gray
    lineHeight: 16,
  }
});
