import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import GamesScreen from "../screens/GamesScreen";
import FoodChemistryScreen from "../screens/FoodChemistryScreen";
import FoodLoggerScreen from "../screens/FoodLoggerScreen";
import MilestonesScreen from "../screens/MilestonesScreen";
import RecommendationsScreen from "../screens/RecommendationsScreen";
import SchoolDataScreen from "../screens/SchoolDataScreen";
import { load, setCurrentUser } from "../utils/storage";

const Stack = createNativeStackNavigator();

function LazyInsightsScreen(props) {
  const InsightsScreen = require("../screens/InsightsScreen").default;
  return <InsightsScreen {...props} />;
}

function SessionGate({ navigation }) {
  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      const session = await load("session");
      const email = session?.email;

      if (email) {
        await setCurrentUser(email);
      }

      if (mounted) {
        navigation.replace(email ? "Dashboard" : "Welcome");
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color="#0369A1" />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SessionGate"
      screenOptions={{
        headerStyle: { backgroundColor: "#E0F2FE" },
        headerTintColor: "#0369A1",
        headerTitleStyle: { fontWeight: "900" },
        contentStyle: { backgroundColor: "#E0F2FE" },
      }}
    >
      <Stack.Screen
        name="SessionGate"
        component={SessionGate}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Games" component={GamesScreen} options={{ title: "Memory Match" }} />
      <Stack.Screen name="FoodLogger" component={FoodLoggerScreen} options={{ title: "Food Logger" }} />
      <Stack.Screen
        name="FoodChemistry"
        component={FoodChemistryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Insights" component={LazyInsightsScreen} options={{ title: "Insights" }} />
      <Stack.Screen name="Milestones" component={MilestonesScreen} options={{ title: "Milestones" }} />
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{ title: "Recommendations" }}
      />
      <Stack.Screen
        name="SchoolData"
        component={SchoolDataScreen}
        options={{ title: "School Data" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2FE",
  },
});
