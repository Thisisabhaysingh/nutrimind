import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { load, save } from "../utils/storage";

const SUBJECTS = [
  { key: "math", label: "Math", icon: "📊" },
  { key: "english", label: "English", icon: "📚" },
  { key: "science", label: "Science", icon: "🔬" },
  { key: "attendance", label: "Attendance", icon: "📅" },
];

const LEVELS = ["Good", "OK", "Low"];

export default function SchoolDataScreen() {
  const [scores, setScores] = useState({
    math: "",
    english: "",
    science: "",
    attendance: "",
  });
  const [focusClass, setFocusClass] = useState("Good");
  const [socialSkills, setSocialSkills] = useState("Good");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    (async () => {
      const stored = (await load("school")) || {};
      setScores({
        math: String(stored.math || ""),
        english: String(stored.english || ""),
        science: String(stored.science || ""),
        attendance: String(stored.attendance || ""),
      });
      setFocusClass(stored.focusClass || "Good");
      setSocialSkills(stored.socialSkills || "Good");
      setNotes(stored.notes || "");
    })();
  }, []);

  const setScore = (key, value) => {
    setScores((current) => ({ ...current, [key]: value }));
  };

  const onSave = async () => {
    const numericKeys = ["math", "science", "attendance", "english"];
    for (const key of numericKeys) {
      const value = scores[key];
      if (value && Number.isNaN(Number(value))) {
        Alert.alert("Please enter valid numeric values for all subject scores.");
        return;
      }
      const num = Number(value);
      if (value && (num < 0 || num > 100)) {
        Alert.alert(`${SUBJECTS.find((s) => s.key === key)?.label || key} score must be 0-100`);
        return;
      }
    }

    const payload = {
      math: scores.math ? Number(scores.math) : "",
      english: scores.english ? Number(scores.english) : "",
      science: scores.science ? Number(scores.science) : "",
      attendance: scores.attendance ? Number(scores.attendance) : "",
      focusClass,
      socialSkills,
      notes,
    };
    await save("school", payload);
    Alert.alert("Success", "School performance saved.");
  };

  const nutritionCards = [
    {
      title: "Math",
      icon: "📚",
      score: Number(scores.math) || 0,
      advice:
        Number(scores.math) < 50
          ? "Low scores may be linked to low dopamine. Add more protein for better focus."
          : "Good analytical skills. Keep supporting brain health!",
    },
    {
      title: "English",
      icon: "📖",
      score: Number(scores.english) || 0,
      advice:
        Number(scores.english) < 50
          ? "Good language development. Continue with balanced nutrition!"
          : "Good language development. Continue with balanced nutrition!",
    },
    {
      title: "Science",
      icon: "🔬",
      score: Number(scores.science) || 0,
      advice:
        Number(scores.science) < 50
          ? "Support concentration with iron-rich foods and Omega-3."
          : "Good analytical skills. Keep supporting brain health!",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topHeader}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🎓</Text>
          </View>
          <Text style={styles.mainTitle}>School Performance</Text>
          <Text style={styles.subtitle}>Track grades & nutrition impact</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>📝 Academic Scores</Text>
          </View>
          <View style={styles.subjectGrid}>
            {SUBJECTS.map((subject) => (
              <View key={subject.key} style={styles.subjectCard}>
                <Text style={styles.subjectIcon}>{subject.icon}</Text>
                <Text style={styles.subjectLabel}>{subject.label}</Text>
                <View style={styles.subjectValueBox}>
                  <TextInput
                    style={styles.subjectValueInput}
                    value={scores[subject.key]}
                    onChangeText={(value) => setScore(subject.key, value)}
                    keyboardType="numeric"
                    placeholder="--"
                    placeholderTextColor="#9BB0C9"
                    maxLength={3}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.sectionHeaderRow, styles.sectionSpacing]}>
            <Text style={styles.sectionLabel}>🧠 Behavior & Focus</Text>
          </View>
          <View style={styles.focusRow}>
            <View style={styles.focusCard}>
              <Text style={styles.focusLabel}>Focus in Class</Text>
              {LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.focusOption,
                    focusClass === level && styles.focusOptionActive,
                  ]}
                  onPress={() => setFocusClass(level)}
                >
                  <Text
                    style={
                      focusClass === level
                        ? styles.focusOptionTextActive
                        : styles.focusOptionText
                    }
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.focusCard}>
              <Text style={styles.focusLabel}>Social Skills</Text>
              {LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.focusOption,
                    socialSkills === level && styles.focusOptionActive,
                  ]}
                  onPress={() => setSocialSkills(level)}
                >
                  <Text
                    style={
                      socialSkills === level
                        ? styles.focusOptionTextActive
                        : styles.focusOptionText
                    }
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.sectionHeaderRow, styles.sectionSpacing]}>
            <Text style={styles.sectionLabel}>💬 Teacher Notes</Text>
          </View>
          <TextInput
            style={[styles.notesInput, styles.textArea]}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about behavior, attention, or school progress"
            placeholderTextColor="#7C8EA0"
          />

          <TouchableOpacity style={styles.saveButton} onPress={onSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Performance</Text>
          </TouchableOpacity>

          <View style={[styles.sectionHeaderRow, styles.sectionSpacing]}>
            <Text style={styles.sectionLabel}>🔗 Nutrition Links</Text>
          </View>
          <View style={styles.linkGrid}>
            {nutritionCards.map((card) => (
              <View key={card.title} style={styles.linkCard}>
                <Text style={styles.linkIcon}>{card.icon}</Text>
                <Text style={styles.linkTitle}>{card.title}</Text>
                <Text style={styles.linkScore}>{card.score || "--"}</Text>
                <Text style={styles.linkAdvice}>{card.advice}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E7F4FF",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  topHeader: {
    alignItems: "center",
    marginBottom: 14,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4B82A3",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 12,
  },
  headerIconText: {
    fontSize: 28,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0E3C6E",
  },
  subtitle: {
    marginTop: 6,
    color: "#4D6479",
    fontSize: 14,
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 18,
    shadowColor: "#677D9E",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 6,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    color: "#0E3C6E",
    fontWeight: "900",
    fontSize: 15,
  },
  sectionSpacing: {
    marginTop: 16,
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  subjectCard: {
    width: "48%",
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D7E6F4",
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  subjectIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  subjectLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0E3C6E",
    marginBottom: 10,
  },
  subjectValueBox: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E6F4",
    backgroundColor: "#FFFFFF",
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  subjectValueInput: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0E3C6E",
    textAlign: "center",
    paddingVertical: 10,
  },
  subjectValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0E3C6E",
  },
  focusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  focusCard: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D7E6F4",
    padding: 14,
  },
  focusLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0E3C6E",
    marginBottom: 12,
  },
  focusOption: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E6F4",
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  focusOptionActive: {
    backgroundColor: "#0E3C6E",
    borderColor: "#0E3C6E",
  },
  focusOptionText: {
    color: "#264A6F",
    fontWeight: "700",
  },
  focusOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  notesInput: {
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D7E6F4",
    padding: 16,
    color: "#1F3A56",
  },
  textArea: {
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: "#0E3C6E",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#0E3C6E",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  linkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  linkCard: {
    width: "48%",
    minHeight: 180,
    backgroundColor: "#F8FBFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D7E6F4",
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#BCD4EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  linkIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0E3C6E",
    marginBottom: 4,
  },
  linkScore: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0E3C6E",
    marginBottom: 10,
  },
  linkAdvice: {
    color: "#4D6479",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
});
