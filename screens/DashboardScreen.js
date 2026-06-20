import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getCurrentUser, load, save, setCurrentUser } from "../utils/storage";
import { weeklyNutritionSummary } from "../utils/nutrientUtils";

const TOTAL_MILESTONES = 8;

export default function DashboardScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(() => weeklyNutritionSummary([], []));
  const [milestones, setMilestones] = useState([]);
  const [school, setSchool] = useState({});

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function loadDashboard() {
        const session = await load("session");
        const email = session?.email || (await getCurrentUser());

        if (!email) {
          navigation.replace("Welcome");
          return;
        }

        await setCurrentUser(email);

        const users = (await load("users")) || {};
        const meals = (await load("meals")) || [];
        const games = (await load("games")) || [];
        const storedMilestones = (await load("milestones")) || [];
        const schoolData = (await load("school")) || {};

        if (mounted) {
          setProfile(users[email] || { email });
          setSummary(weeklyNutritionSummary(meals, games, schoolData));
          setMilestones(storedMilestones);
          setSchool(schoolData);
        }
      }

      loadDashboard();

      return () => {
        mounted = false;
      };
    }, [navigation])
  );

  async function logout() {
    await save("session", null);
    await setCurrentUser(null);
    navigation.replace("Welcome");
  }

  function showFoodLoggerNotice() {
    Alert.alert(
      "Food logging is not wired yet",
      "The scoring engine already supports meals, but this workspace does not include a Food Logger screen."
    );
  }

  const milestoneProgress = Math.round((milestones.length / TOTAL_MILESTONES) * 100);
  const childName = profile?.childName || "your child";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>NutriMind</Text>
          <Text style={styles.title}>Hi, {profile?.name || "there"}</Text>
          <Text style={styles.subtitle}>Tracking nutrition, learning, and progress for {childName}.</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scorePanel}>
        <Text style={styles.scoreLabel}>Health Score</Text>
        <Text style={styles.scoreValue}>{summary.healthScore}</Text>
        <Text style={styles.scoreHint}>
          Weighted from academics, food, games, and dietary diversity.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Food" value={summary.foodScore} />
        <StatCard label="Academics" value={summary.academicsScore} />
        <StatCard label="Games" value={summary.gamingScore} />
        <StatCard label="Diversity" value={summary.diversityScore} />
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="Meals" value={summary.mealCount} />
        <StatCard label="Categories" value={summary.uniqueCategories} />
        <StatCard label="Games Played" value={summary.gamesPlayed} />
        <StatCard label="Milestones" value={`${milestoneProgress}%`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ActionButton title="Log Food" detail="Add meals for nutrition scoring" onPress={showFoodLoggerNotice} />
        <ActionButton title="Play Memory Match" detail="Earn a cognitive boost" onPress={() => navigation.navigate("Games")} />
        <ActionButton title="Update Milestones" detail="Track cognitive development" onPress={() => navigation.navigate("Milestones")} />
        <ActionButton title="School Data" detail="Save attendance, grades, and notes" onPress={() => navigation.navigate("SchoolData")} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review</Text>
        <View style={styles.reviewRow}>
          <TouchableOpacity style={styles.reviewButton} onPress={() => navigation.navigate("Insights")}>
            <Text style={styles.reviewButtonText}>Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewButton} onPress={() => navigation.navigate("Recommendations")}>
            <Text style={styles.reviewButtonText}>Tips</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.schoolPanel}>
        <Text style={styles.schoolTitle}>School Snapshot</Text>
        <Text style={styles.schoolText}>Attendance: {school.attendance || "Not added"}{school.attendance ? "%" : ""}</Text>
        <Text style={styles.schoolText}>Grades: {school.grades || "Not added"}</Text>
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionButton({ title, detail, onPress }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.8}>
      <View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDetail}>{detail}</Text>
      </View>
      <Text style={styles.actionArrow}>></Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E0F2FE",
  },
  content: {
    padding: 20,
    paddingTop: 52,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  kicker: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  title: {
    color: "#0369A1",
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    maxWidth: 260,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#64748B",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#0369A1",
    fontSize: 12,
    fontWeight: "900",
  },
  scorePanel: {
    backgroundColor: "#0369A1",
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
  },
  scoreLabel: {
    color: "#E0F2FE",
    fontSize: 13,
    fontWeight: "800",
  },
  scoreValue: {
    color: "#FFFFFF",
    fontSize: 58,
    fontWeight: "900",
    marginVertical: 4,
  },
  scoreHint: {
    color: "#E0F2FE",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderColor: "#64748B",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  statValue: {
    color: "#0369A1",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 2,
  },
  statLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "800",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: "#0369A1",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#64748B",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 14,
  },
  actionTitle: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "900",
  },
  actionDetail: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 3,
  },
  actionArrow: {
    color: "#0369A1",
    fontSize: 20,
    fontWeight: "900",
  },
  reviewRow: {
    flexDirection: "row",
    gap: 10,
  },
  reviewButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#0369A1",
    borderRadius: 12,
    borderWidth: 2,
    flex: 1,
    paddingVertical: 14,
  },
  reviewButtonText: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "900",
  },
  schoolPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#64748B",
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  schoolTitle: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },
  schoolText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
});
