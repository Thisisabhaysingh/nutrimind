import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCurrentUser, load, save, setCurrentUser } from "../utils/storage";
import { weeklyNutritionSummary } from "../utils/nutrientUtils";

const { width } = Dimensions.get("window");
const TOTAL_MILESTONES = 8;

export default function DashboardScreen({ navigation }) {
  const [summary, setSummary] = useState(() => weeklyNutritionSummary([], []));
  const [milestones, setMilestones] = useState([]);
  const [school, setSchool] = useState({});
  const [userName, setUserName] = useState("Child");

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

        const meals = (await load("meals")) || [];
        const games = (await load("games")) || [];
        const storedMilestones = (await load("milestones")) || [];
        const schoolData = (await load("school")) || {};
        const users = (await load("users")) || {};
        const profile = users[email] || {};
        const fallbackName = email?.split("@")[0] || "Child";

        if (mounted) {
          setSummary(weeklyNutritionSummary(meals, games, schoolData));
          setMilestones(storedMilestones);
          setSchool(schoolData);
          setUserName(profile.childName || profile.name || fallbackName);
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

  const mealCount = summary.mealCount || 0;
  const diversityScore = summary.diversityScore || 0;
  const focusScore = summary.neurotransmitterScores?.dopamine || 0;
  const gamingScore = summary.gamingScore || 0;
  const brainBoost = summary.gamingBonus
    ? summary.gamingBonus.acetylcholine + summary.gamingBonus.dopamine + summary.gamingBonus.micronutrients
    : 0;
  const brainScore = Math.max(0, Math.min(100, summary.healthScore || 0));
  const milestoneProgress = Math.round((milestones.length / TOTAL_MILESTONES) * 100);

  const stats = [
    {
      icon: "🍽️",
      value: mealCount,
      label: "Meals Logged",
      detail: "this week",
    },
    {
      icon: "🍎",
      value: diversityScore,
      label: "Diversity Score",
      detail: "out of 100",
    },
    {
      icon: "🎯",
      value: focusScore,
      label: "Focus Score",
      detail: "dopamine",
    },
    {
      icon: "🎮",
      value: gamingScore,
      label: "Gaming Score",
      detail: `${summary.gamesPlayed || 0} games`,
    },
    {
      icon: "🧠",
      value: `+${brainBoost}`,
      label: "Brain Boost",
      detail: "from gaming",
    },
  ];

  function showStatDetail(label) {
    let title = label;
    let message = "";

    switch (label) {
      case "Diversity Score":
        message =
          "Measures variety in your diet (0-100).\nHigher scores = eating from more food groups.\n\nBenefits:\n• Complete nutrition\n• Better brain development\n• All essential vitamins\n\nGoal: 60+ (eating 5-6 different food groups)\n\nFormula:\n diversityScore = round((diversitySum / 7) * 100 / 6)\n\nwhere diversitySum is the count of distinct food categories per day over 7 days and 6 categories is treated as the ideal maximum.";
        break;
      case "Focus Score":
        message =
          "Focus Score is represented by dopamine support from your meals.\nHigher values indicate better attention and motivation support from food.";
        break;
      case "Gaming Score":
        message =
          "Game score is computed as:\n points = max(1, round(100 - moves * 2))\n\nThis means fewer moves give a higher matching score and better brain training boost.";
        break;
      case "Brain Boost":
        message =
          "Brain Boost is the gameplay contribution to your overall health score.\nIt is derived from your latest game score and gives extra value to dopamine, acetylcholine, and micronutrients.";
        break;
      case "Meals Logged":
        message =
          "Tracks the number of meals you logged this week.\nThe more meals logged, the richer the nutrition data for scoring.";
        break;
      default:
        message = "No details available.";
    }

    Alert.alert(title, message, [{ text: "OK" }]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#087CAF" />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBand}>
          <View style={styles.topHeaderRow}>
            <View style={styles.topHeaderText}>
              <Text style={styles.greetingTitle}>Hello!</Text>
              <Text style={styles.greetingName}>{userName}</Text>
              <Text style={styles.greetingSubtitle}>Let's track your nutrition</Text>
            </View>
            <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8} onPress={logout}>
              <Text style={styles.avatarIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Brain Health Score</Text>
            <View style={styles.alertPill}>
              <View style={styles.alertDot} />
              <Text style={styles.alertText}>Needs Attention</Text>
            </View>
          </View>

          <View style={styles.scoreBody}>
            <View style={styles.scoreNumberRow}>
              <Text style={styles.scoreNumber}>{brainScore}</Text>
              <Text style={styles.scoreTotal}>/100</Text>
            </View>
            <Text style={styles.scoreCopy}>
              Improve with better{"\n"}nutrition & brain training
            </Text>
          </View>

          <View style={styles.divider} />
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Insights")}
          >
            <Text style={styles.breakdownText}>Tap for breakdown -></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
        </View>

        <View style={styles.statsTopRow}>
          {stats.slice(0, 3).map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              badge="i"
              value={stat.value}
              label={stat.label}
              detail={stat.detail}
              style={styles.statCardTop}
              onPress={() => showStatDetail(stat.label)}
            />
          ))}
        </View>

        <View style={styles.statsBottomRow}>
          {stats.slice(3).map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              badge="i"
              value={stat.value}
              label={stat.label}
              detail={stat.detail}
              style={styles.statCardBottom}
              onPress={() => showStatDetail(stat.label)}
            />
          ))}
        </View>

        <View style={styles.quickHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Recommendations")}>
            <Text style={styles.swipeText}>Swipe -></Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.8 + 16}
          decelerationRate="fast"
          contentContainerStyle={styles.actionsTrack}
        >
          <ActionTile
            title="Games"
            icon="🎮"
            onPress={() => navigation.navigate("Games")}
          />
          <ActionTile
            title="Food Chemistry"
            icon="⚗️"
            onPress={() => navigation.navigate("FoodChemistry")}
          />
            <ActionTile
            title="Log Food"
            icon="🍎"
            onPress={() => navigation.navigate("FoodLogger")}
          />
          <ActionTile
            title="Milestones"
            icon="🏅"
            onPress={() => navigation.navigate("Milestones")}
          />
          <ActionTile
            title="School"
            icon="📚"
            onPress={() => navigation.navigate("SchoolData")}
          />
        </ScrollView>

        <View style={styles.hiddenInfo}>
          <Text style={styles.hiddenInfoText}>
            Attendance {school.attendance || "--"} · Milestones {milestoneProgress}%
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, badge, value, label, detail, footer, style, onPress }) {
  return (
    <TouchableOpacity style={[styles.statCard, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={styles.infoBadge}>
        <Text style={styles.infoBadgeText}>{badge}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statDetail}>{detail}</Text>
      {footer ? <Text style={styles.statFooter}>{footer}</Text> : null}
    </TouchableOpacity>
  );
}

function ActionTile({ title, icon, onPress }) {
  return (
    <TouchableOpacity
      style={styles.actionTile}
      onPress={onPress}
      activeOpacity={0.86}
    >
      <View style={styles.actionBubble} />
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <View style={styles.actionArrow}>
        <Text style={styles.actionArrowText}>-></Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#087CAF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    paddingBottom: 48,
  },
  topBand: {
    minHeight: 170,
    backgroundColor: "#087CAF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 18,
  },
  topHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  topHeaderText: {
    flex: 1,
    paddingRight: 12,
  },
  greetingTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 6,
  },
  greetingName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  greetingSubtitle: {
    color: "#D6EEFF",
    fontSize: 14,
    lineHeight: 20,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: {
    fontSize: 22,
  },
  scoreCard: {
    alignSelf: "center",
    width: width - 34,
    minHeight: 186,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginTop: -19,
    paddingHorizontal: 27,
    paddingTop: 29,
    paddingBottom: 16,
    shadowColor: "#66A9C8",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.26,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreTitle: {
    color: "#172235",
    fontSize: 16,
    fontWeight: "900",
  },
  alertPill: {
    alignItems: "center",
    backgroundColor: "#FFE2E2",
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  alertDot: {
    width: 12,
    height: 12,
    backgroundColor: "#FF4B4B",
    borderRadius: 6,
    marginRight: 5,
  },
  alertText: {
    color: "#D45A5A",
    fontSize: 11,
    fontWeight: "900",
  },
  scoreBody: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 26,
  },
  scoreNumberRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    width: 120,
  },
  scoreNumber: {
    color: "#0C7EAD",
    fontSize: 58,
    fontWeight: "900",
    lineHeight: 62,
  },
  scoreTotal: {
    color: "#96A3B3",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  scoreCopy: {
    color: "#536477",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#EDF1F4",
    marginTop: 24,
    marginBottom: 14,
  },
  breakdownText: {
    color: "#8AA0B0",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  sectionHeader: {
    marginTop: 30,
    paddingHorizontal: 25,
  },
  sectionTitle: {
    color: "#152238",
    fontSize: 18,
    fontWeight: "900",
  },
  statsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: 15,
  },
  statsBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: 15,
  },
  statCardTop: {
    width: (width - 80) / 3,
  },
  statCardBottom: {
    width: (width - 70) / 2,
  },
  statCard: {
    alignItems: "center",
    width: (width - 60) / 2,
    minHeight: 170,
    backgroundColor: "#FFFFFF",
    borderColor: "#E7EDF2",
    borderRadius: 15,
    borderWidth: 1,
    paddingTop: 18,
    paddingHorizontal: 10,
    marginBottom: 14,
    shadowColor: "#93A4B4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 5,
    elevation: 5,
  },
  statIcon: {
    fontSize: 35,
    lineHeight: 43,
    height: 43,
  },
  infoBadge: {
    alignItems: "center",
    justifyContent: "center",
    width: 19,
    height: 19,
    backgroundColor: "#DFF5FF",
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 11,
  },
  infoBadgeText: {
    color: "#52A9CB",
    fontSize: 10,
    fontWeight: "900",
  },
  statValue: {
    color: "#142238",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 27,
  },
  statLabel: {
    color: "#475A6F",
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 15,
    marginTop: 7,
    textAlign: "center",
  },
  statDetail: {
    color: "#66788D",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 13,
    textAlign: "center",
  },
  statFooter: {
    color: "#A7B4BF",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 12,
    textAlign: "center",
  },
  quickHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 25,
  },
  swipeText: {
    color: "#8FA2B1",
    fontSize: 12,
    fontWeight: "900",
  },
  actionsTrack: {
    gap: 16,
    paddingHorizontal: 25,
    paddingTop: 27,
    paddingRight: 44,
  },
  actionTile: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    height: 135,
    backgroundColor: "#0B78AB",
    borderRadius: 19,
    overflow: "hidden",
  },
  actionBubble: {
    position: "absolute",
    right: -26,
    top: -35,
    width: 142,
    height: 142,
    borderRadius: 71,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  actionIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  actionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  actionArrow: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 22,
    bottom: 18,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  actionArrowText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  hiddenInfo: {
    alignItems: "center",
    paddingTop: 20,
  },
  hiddenInfoText: {
    color: "#FAFAFA",
    fontSize: 1,
  },
});
