import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { save, load } from "../utils/storage";
import { NUTRIENT_MAPPING } from "../utils/nutrientUtils";

const FOOD_CATEGORIES = [
  { key: "Eggs", label: "Eggs", emoji: "🥚" },
  { key: "Bread", label: "Bread", emoji: "🍞" },
  { key: "Cereal", label: "Cereal", emoji: "🥣" },
  { key: "Oats", label: "Oats", emoji: "🌾" },
  { key: "Milk", label: "Milk", emoji: "🥛" },
  { key: "Yogurt", label: "Yogurt", emoji: "🍶" },
  { key: "Fruits", label: "Fruits", emoji: "🍎" },
  { key: "Nuts", label: "Nuts", emoji: "🥜" },
  { key: "Coffee/Tea", label: "Coffee/Tea", emoji: "☕" },
  { key: "Juice", label: "Juice", emoji: "🧃" },
  { key: "Pancakes", label: "Pancakes", emoji: "🥞" },
  { key: "Smoothie", label: "Smoothie", emoji: "🍹" },
];

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function FoodLoggerScreen({ navigation }) {
  const [mealType, setMealType] = useState("Breakfast");
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [note, setNote] = useState("");
  const [breakdownMeal, setBreakdownMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = (await load("meals")) || [];
      setMeals(stored);
    })();
  }, []);

  const filteredCategories = FOOD_CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(searchText.toLowerCase())
  );

  function toggleCategory(categoryKey) {
    if (selectedCategories.includes(categoryKey)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryKey));
    } else {
      setSelectedCategories([...selectedCategories, categoryKey]);
    }
  }

  async function saveMeal() {
    if (selectedCategories.length === 0) {
      Alert.alert("Please select at least one food category");
      return;
    }

    const entry = {
      mealType,
      categories: selectedCategories,
      date: new Date().toISOString(),
      note,
    };

    const newMeals = [entry, ...meals];
    setMeals(newMeals);
    await save("meals", newMeals);
    setSelectedCategories([]);
    setNote("");
    setSearchText("");
    Alert.alert("Success", "Meal logged! Keep it up!");
  }

  async function clearAll() {
    await save("meals", []);
    setMeals([]);
  }

  function openBreakdown(meal) {
    setBreakdownMeal(meal);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setBreakdownMeal(null);
  }

  function getMealBreakdown(meal) {
    const totals = {
      serotonin: 0,
      dopamine: 0,
      acetylcholine: 0,
      omega3: 0,
      micronutrients: 0,
    };

    meal.categories.forEach((category) => {
      const nutrients = NUTRIENT_MAPPING[category];
      if (nutrients) {
        Object.keys(totals).forEach((key) => {
          totals[key] += nutrients[key] || 0;
        });
      }
    });

    const rawScore =
      totals.serotonin +
      totals.dopamine +
      totals.acetylcholine +
      totals.omega3 +
      totals.micronutrients;

    const mealScore = Math.min(100, Math.round(rawScore / 5));

    return { totals, mealScore };
  }

  const breakdown = breakdownMeal ? getMealBreakdown(breakdownMeal) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Food Logger</Text>
        <Text style={styles.screenSubtitle}>Track your daily nutrition</Text>
      </View>

      <Text style={styles.sectionLabel}>Meal Time</Text>
      <View style={styles.mealTimeRow}>
        {MEAL_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.mealTypeButton,
              mealType === type && styles.mealTypeButtonActive,
            ]}
            onPress={() => setMealType(type)}
          >
            <Text
              style={
                mealType === type
                  ? styles.mealTypeTextActive
                  : styles.mealTypeText
              }
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>🔍 Search Foods</Text>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Type food name..."
        placeholderTextColor="#A0AAB4"
        style={styles.searchInput}
      />

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      <Text style={styles.sectionLabel}>
        {mealType} Categories ({selectedCategories.length})
      </Text>
      <View style={styles.categoryGrid}>
        {filteredCategories.map((cat) => {
          const selected = selectedCategories.includes(cat.key);
          return (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryCard,
                selected && styles.categoryCardSelected,
              ]}
              onPress={() => toggleCategory(cat.key)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Notes (Optional)</Text>
      <TextInput
        style={[styles.searchInput, styles.notesInput]}
        value={note}
        onChangeText={setNote}
        placeholder="E.g. Homemade pizza with vegetables..."
        placeholderTextColor="#A0AAB4"
        multiline
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={saveMeal}>
          <Text style={styles.saveButtonText}>Save Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Meals ({meals.length})</Text>
      {meals.length === 0 ? (
        <Text style={styles.emptyText}>No meals logged yet.</Text>
      ) : (
        meals.map((meal, index) => (
          <View key={`${meal.date}-${index}`} style={styles.mealCard}>
            <View style={styles.mealCardHeader}>
              <Text style={styles.mealCardTitle}>{meal.mealType}</Text>
              <Text style={styles.mealDate}>
                {new Date(meal.date).toLocaleDateString()},{" "}
                {new Date(meal.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <Text style={styles.mealCategories}>
              Categories: {meal.categories.join(" • ")}
            </Text>
            {meal.note ? (
              <Text style={styles.mealNote}>Note: {meal.note}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.breakdownButton}
              onPress={() => openBreakdown(meal)}
            >
              <Text style={styles.breakdownButtonText}>View Breakdown</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meal Breakdown</Text>
            {breakdown ? (
              <>
                <Text style={styles.modalLabel}>{breakdownMeal.mealType}</Text>
                <Text style={styles.modalDate}>
                  {new Date(breakdownMeal.date).toLocaleString()}
                </Text>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Categories</Text>
                  <Text style={styles.modalSectionText}>
                    {breakdownMeal.categories.join(" • ")}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Nutrient Contribution</Text>
                  <Text style={styles.modalSectionText}>
                    😊 Serotonin: +{breakdown.totals.serotonin}
                  </Text>
                  <Text style={styles.modalSectionText}>
                    💭 Acetylcholine: +{breakdown.totals.acetylcholine}
                  </Text>
                  <Text style={styles.modalSectionText}>
                    🎯 Dopamine: +{breakdown.totals.dopamine}
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Meal Score</Text>
                  <Text style={styles.modalScore}>{breakdown.mealScore}/100</Text>
                </View>
                <Text style={styles.modalFooter}>
                  💡 This meal contributed to your overall brain health score!
                </Text>
              </>
            ) : (
              <Text style={styles.modalSectionText}>Loading breakdown...</Text>
            )}

            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <Text style={styles.modalCloseText}>GOT IT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6FF",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D2E6F8",
    marginBottom: 14,
  },
  backButtonText: {
    color: "#0F4E93",
    fontWeight: "700",
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F4E93",
  },
  screenSubtitle: {
    color: "#5E7B99",
    marginTop: 6,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F4E93",
    marginBottom: 8,
  },
  mealTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  mealTypeButton: {
    width: "48%",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B8D6F0",
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
  },
  mealTypeButtonActive: {
    backgroundColor: "#0F4E93",
    borderColor: "#0F4E93",
  },
  mealTypeText: {
    color: "#334E6F",
    fontWeight: "700",
  },
  mealTypeTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D2E6F8",
    marginBottom: 12,
    color: "#102A43",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#C8D9E8",
  },
  orText: {
    marginHorizontal: 12,
    color: "#64748B",
    fontWeight: "700",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "31%",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D2E6F8",
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  categoryCardSelected: {
    borderColor: "#0F4E93",
    backgroundColor: "#E4F0FF",
  },
  categoryEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "700",
    color: "#102A43",
  },
  notesInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 22,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#0F4E93",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginRight: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0F4E93",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginLeft: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  clearButtonText: {
    color: "#0F4E93",
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F4E93",
    marginBottom: 10,
  },
  emptyText: {
    color: "#64748B",
    fontStyle: "italic",
    textAlign: "center",
  },
  mealCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D2E6F8",
    marginBottom: 14,
  },
  mealCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mealCardTitle: {
    fontWeight: "900",
    color: "#0F4E93",
  },
  mealDate: {
    color: "#64748B",
    fontSize: 12,
  },
  mealCategories: {
    color: "#334E6F",
    marginBottom: 10,
  },
  mealNote: {
    color: "#475569",
    marginBottom: 12,
  },
  breakdownButton: {
    backgroundColor: "#E4F0FF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  breakdownButtonText: {
    color: "#0F4E93",
    fontWeight: "900",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 78, 147, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    elevation: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F4E93",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: "#334E6F",
  },
  modalDate: {
    color: "#64748B",
    marginBottom: 16,
  },
  modalSection: {
    marginTop: 12,
  },
  modalSectionTitle: {
    fontWeight: "900",
    color: "#0F4E93",
    marginBottom: 6,
  },
  modalSectionText: {
    color: "#334E6F",
    marginBottom: 4,
  },
  modalScore: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F4E93",
    marginTop: 6,
  },
  modalFooter: {
    marginTop: 16,
    color: "#475569",
    fontWeight: "700",
  },
  modalCloseButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#0F4E93",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 14,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "900",
  },
});
