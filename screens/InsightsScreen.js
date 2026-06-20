import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { load } from "../utils/storage";
import { weeklyNutritionSummary } from "../utils/nutrientUtils";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    (async () => {
      const m = (await load("meals")) || [];
      const g = (await load("games")) || [];
      setMeals(m);
      setGames(g);
      setSummary(weeklyNutritionSummary(m, g));
    })();
  }, []);

  if (!summary) return <View style={styles.container}><Text>Loading...</Text></View>;

  const labels = Object.keys(summary.days);
  const mealTrend = labels.map((day) => summary.days[day] || 0);

  // Game scores trend (last 7)
  const gameScores = (games.slice(0, 7).reverse().map((g) => g.points)) || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insights & Trends</Text>

      <Text style={{ marginTop: 12 }}>Meals Logged (weekly)</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: mealTrend.length ? mealTrend : [0] }],
        }}
        width={screenWidth - 24}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        }}
        style={{ marginVertical: 8, borderRadius: 8 }}
      />

      <Text style={{ marginTop: 12 }}>Recent Game Scores</Text>
      <LineChart
        data={{
          labels: gameScores.map((_, i) => `${i+1}`),
          datasets: [{ data: gameScores.length ? gameScores : [0] }],
        }}
        width={screenWidth - 24}
        height={200}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 200, 100, ${opacity})`,
        }}
        style={{ marginVertical: 8, borderRadius: 8 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 12 },
  title: { fontSize: 20, fontWeight: "bold" },
});
