// ============================================
// nutrientUtils.js - CUMULATIVE SCORING + GAMING
// ============================================

/**
 * CATEGORY → NEUROTRANSMITTER MAPPING
 * 
 * Updated to include all new food categories from FoodLogger
 */

const NUTRIENT_MAPPING = {
  // Original categories
  Fruits: {
    serotonin: 20,
    dopamine: 5,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 10
  },
  Vegetables: {
    serotonin: 10,
    dopamine: 5,
    acetylcholine: 5,
    omega3: 0,
    micronutrients: 25
  },
  Protein: {
    serotonin: 5,
    dopamine: 25,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 15
  },
  Dairy: {
    serotonin: 10,
    dopamine: 5,
    acetylcholine: 20,
    omega3: 0,
    micronutrients: 20
  },
  Grains: {
    serotonin: 15,
    dopamine: 5,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 10
  },
  Fats: {
    serotonin: 0,
    dopamine: 0,
    acetylcholine: 0,
    omega3: 5,
    micronutrients: 5
  },
  Nuts: {
    serotonin: 0,
    dopamine: 5,
    acetylcholine: 5,
    omega3: 30,
    micronutrients: 15
  },
  Legumes: {
    serotonin: 5,
    dopamine: 15,
    acetylcholine: 10,
    omega3: 0,
    micronutrients: 20
  },
  Fish: {
    serotonin: 10,
    dopamine: 20,
    acetylcholine: 15,
    omega3: 40,
    micronutrients: 25
  },
  Eggs: {
    serotonin: 5,
    dopamine: 20,
    acetylcholine: 30,
    omega3: 5,
    micronutrients: 15
  },

  // NEW CATEGORIES - Breakfast
  Bread: {
    serotonin: 15,
    dopamine: 5,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 8
  },
  Cereal: {
    serotonin: 12,
    dopamine: 5,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 12
  },
  Oats: {
    serotonin: 15,
    dopamine: 5,
    acetylcholine: 5,
    omega3: 2,
    micronutrients: 15
  },
  Pancakes: {
    serotonin: 10,
    dopamine: 3,
    acetylcholine: 2,
    omega3: 0,
    micronutrients: 5
  },
  "Coffee/Tea": {
    serotonin: 0,
    dopamine: 10,
    acetylcholine: 5,
    omega3: 0,
    micronutrients: 2
  },
  Juice: {
    serotonin: 8,
    dopamine: 2,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 8
  },
  Smoothie: {
    serotonin: 15,
    dopamine: 8,
    acetylcholine: 5,
    omega3: 5,
    micronutrients: 18
  },

  // NEW CATEGORIES - Proteins
  Chicken: {
    serotonin: 5,
    dopamine: 25,
    acetylcholine: 5,
    omega3: 0,
    micronutrients: 18
  },
  "Red Meat": {
    serotonin: 5,
    dopamine: 28,
    acetylcholine: 5,
    omega3: 0,
    micronutrients: 25
  },
  Seafood: {
    serotonin: 10,
    dopamine: 20,
    acetylcholine: 18,
    omega3: 38,
    micronutrients: 22
  },

  // NEW CATEGORIES - Grains
  "Whole Grains": {
    serotonin: 18,
    dopamine: 8,
    acetylcholine: 5,
    omega3: 2,
    micronutrients: 15
  },
  Rice: {
    serotonin: 12,
    dopamine: 3,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 5
  },
  Pasta: {
    serotonin: 15,
    dopamine: 5,
    acetylcholine: 2,
    omega3: 0,
    micronutrients: 8
  },
  Crackers: {
    serotonin: 8,
    dopamine: 2,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 3
  },

  // NEW CATEGORIES - Dairy
  Milk: {
    serotonin: 12,
    dopamine: 8,
    acetylcholine: 18,
    omega3: 2,
    micronutrients: 20
  },
  Cheese: {
    serotonin: 8,
    dopamine: 10,
    acetylcholine: 22,
    omega3: 0,
    micronutrients: 18
  },
  Yogurt: {
    serotonin: 15,
    dopamine: 8,
    acetylcholine: 20,
    omega3: 2,
    micronutrients: 22
  },

  // NEW CATEGORIES - Vegetables
  "Leafy Greens": {
    serotonin: 12,
    dopamine: 8,
    acetylcholine: 8,
    omega3: 3,
    micronutrients: 30
  },
  "Root Vegetables": {
    serotonin: 8,
    dopamine: 5,
    acetylcholine: 3,
    omega3: 0,
    micronutrients: 20
  },

  // NEW CATEGORIES - Fats & Nuts
  "Healthy Fats": {
    serotonin: 0,
    dopamine: 0,
    acetylcholine: 3,
    omega3: 8,
    micronutrients: 5
  },
  Seeds: {
    serotonin: 5,
    dopamine: 8,
    acetylcholine: 8,
    omega3: 25,
    micronutrients: 18
  },

  // NEW CATEGORIES - Meals
  Soup: {
    serotonin: 10,
    dopamine: 8,
    acetylcholine: 5,
    omega3: 2,
    micronutrients: 15
  },
  Salad: {
    serotonin: 12,
    dopamine: 5,
    acetylcholine: 8,
    omega3: 5,
    micronutrients: 25
  },
  Sandwich: {
    serotonin: 12,
    dopamine: 12,
    acetylcholine: 8,
    omega3: 2,
    micronutrients: 15
  },

  // NEW CATEGORIES - Snacks
  Chips: {
    serotonin: 3,
    dopamine: 2,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 2
  },
  Cookies: {
    serotonin: 5,
    dopamine: 3,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 2
  },
  Chocolate: {
    serotonin: 8,
    dopamine: 5,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 5
  },
  "Ice Cream": {
    serotonin: 10,
    dopamine: 5,
    acetylcholine: 3,
    omega3: 0,
    micronutrients: 5
  },
  Popcorn: {
    serotonin: 5,
    dopamine: 2,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 3
  },

  // NEW CATEGORY - Custom foods
  Other: {
    serotonin: 5,
    dopamine: 5,
    acetylcholine: 5,
    omega3: 5,
    micronutrients: 5
  },
};

const HEALTH_WEIGHTS = {
  academics: 0.35,
  food: 0.3,
  games: 0.2,
  diversity: 0.15,
};

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score || 0)));
}

function getDateKey(dateValue) {
  const date = dateValue ? new Date(dateValue) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return date.toISOString().split("T")[0];
}

function getLastSevenDateKeys() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return date.toISOString().split("T")[0];
  });
}

function parseGradeScores(grades) {
  if (!grades || typeof grades !== "string") return [];

  const gradeMap = {
    "A+": 100,
    A: 95,
    "A-": 90,
    "B+": 87,
    B: 83,
    "B-": 80,
    "C+": 77,
    C: 73,
    "C-": 70,
    "D+": 67,
    D: 63,
    "D-": 60,
    F: 40,
  };

  const scores = [];
  const numberMatches = grades.match(/\b\d{1,3}\b/g) || [];

  numberMatches.forEach((value) => {
    const score = Number(value);
    if (score >= 0 && score <= 100) {
      scores.push(score);
    }
  });

  const letterMatches = grades.toUpperCase().match(/\b[A-DF][+-]?\b/g) || [];
  letterMatches.forEach((value) => {
    if (gradeMap[value] !== undefined) {
      scores.push(gradeMap[value]);
    }
  });

  return scores;
}

export function calculateAcademicsScore(school = {}) {
  const scores = [];
  const attendance = Number(school.attendance);

  if (!Number.isNaN(attendance) && attendance >= 0 && attendance <= 100) {
    scores.push(attendance);
  }

  const gradeScores = parseGradeScores(school.grades);
  if (gradeScores.length > 0) {
    scores.push(gradeScores.reduce((sum, score) => sum + score, 0) / gradeScores.length);
  }

  if (scores.length === 0) return 0;

  return clampScore(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

export function calculateHealthScore({
  academicsScore = 0,
  foodScore = 0,
  gamingScore = 0,
  diversityScore = 0,
} = {}) {
  return clampScore(
    HEALTH_WEIGHTS.academics * academicsScore +
      HEALTH_WEIGHTS.food * foodScore +
      HEALTH_WEIGHTS.games * gamingScore +
      HEALTH_WEIGHTS.diversity * diversityScore
  );
}

/**
 * MAIN FUNCTION: Calculate weekly nutrition summary
 * 
 * INPUT: meals array, games array (optional)
 * OUTPUT: summary object with scores 0-100
 * 
 * FIXED: Cumulative scoring - more meals = higher score!
 * NEW: Gaming contribution to brain health!
 */
export function weeklyNutritionSummary(meals, games = [], school = {}) {
  // Guard: No data = return empty summary
  // Guard: No data = return empty summary ONLY if no meals AND no games
  if ((!meals || meals.length === 0) && (!games || games.length === 0)) {
    return {
      neuroScore: 0,
      neurotransmitterScores: {
        serotonin: 0,
        dopamine: 0,
        acetylcholine: 0,
        omega3: 0,
        micronutrients: 0,
        tyrosine: 0,
        choline: 0,
        iron: 0,
        glucose: 0,
      },
      foodScore: 0,
      diversityScore: 0,
      academicsScore: calculateAcademicsScore(school),
      healthScore: calculateHealthScore({
        academicsScore: calculateAcademicsScore(school),
      }),
      gamingScore: 0,
      gamingBonus: { acetylcholine: 0, dopamine: 0, micronutrients: 0 },
      gamesPlayed: 0,
      days: {},
      mealCount: 0,
      uniqueCategories: 0,
    };
  }

  // Step 1: Aggregate all nutrients from all meals
  const totalNutrients = {
    serotonin: 0,
    dopamine: 0,
    acetylcholine: 0,
    omega3: 0,
    micronutrients: 0,
  };

  const categoryFrequency = {};
  const mealDates = {};
  const categoriesByDay = {};

  // ✅ Process meals ONLY if we have them
  if (meals && meals.length > 0) {
    meals.forEach((meal) => {
      // For each meal, process all selected categories
      if (meal.categories && Array.isArray(meal.categories)) {
        meal.categories.forEach((category) => {
          // Add up nutrient contributions
          const nutrients = NUTRIENT_MAPPING[category];
          
          if (nutrients) {
            Object.keys(totalNutrients).forEach((key) => {
              totalNutrients[key] += nutrients[key] || 0;
            });

            categoryFrequency[category] = (categoryFrequency[category] || 0) + 1;

            const date = getDateKey(meal.date);
            categoriesByDay[date] = categoriesByDay[date] || new Set();
            categoriesByDay[date].add(category);
          } else {
            // Log unknown categories for debugging
            console.warn(`⚠️ Unknown category: "${category}"`);
          }
        });
      }

      // Track days with meals
      const date = getDateKey(meal.date);
      mealDates[date] = (mealDates[date] || 0) + 1;
    });
  }


  // Step 2: Calculate gaming contribution
  const recentGames = (games || []).slice(0, 10); // Last 10 games
  const avgGameScore = recentGames.length > 0
    ? recentGames.reduce((sum, g) => sum + g.points, 0) / recentGames.length
    : 0;

  // Games boost cognitive performance
  // Memory games improve acetylcholine (memory & learning)
  // Focus games improve dopamine (attention & concentration)
  // Overall brain training improves micronutrients absorption
  const gamingBonus = {
    acetylcholine: Math.round(avgGameScore * 0.3), // Memory boost
    dopamine: Math.round(avgGameScore * 0.4),      // Focus boost
    micronutrients: Math.round(avgGameScore * 0.2), // Brain health boost
  };

  // Add gaming bonus to totals
  totalNutrients.acetylcholine += gamingBonus.acetylcholine;
  totalNutrients.dopamine += gamingBonus.dopamine;
  totalNutrients.micronutrients += gamingBonus.micronutrients;

  // Step 3: Calculate scores based on TOTAL nutrients (not average)
  // More good meals = higher score!
  const normalizedScores = {
    serotonin: Math.min(100, totalNutrients.serotonin / 2),
    dopamine: Math.min(100, totalNutrients.dopamine / 2),
    acetylcholine: Math.min(100, totalNutrients.acetylcholine / 2),
    omega3: Math.min(100, totalNutrients.omega3 / 3),
    micronutrients: Math.min(100, totalNutrients.micronutrients / 2.5),
  };

  // Food score: weighted neurotransmitter score.
  const neuroScore = clampScore(
    normalizedScores.dopamine * 0.25 +
      normalizedScores.serotonin * 0.2 +
      normalizedScores.acetylcholine * 0.25 +
      normalizedScores.omega3 * 0.2 +
      normalizedScores.micronutrients * 0.1
  );

  const uniqueCategories = Object.keys(categoryFrequency).length;
  const mealCount = meals.length;
  const diversitySum = getLastSevenDateKeys().reduce((sum, dateKey) => {
    return sum + Math.min(6, categoriesByDay[dateKey]?.size || 0);
  }, 0);
  const diversityScore = clampScore((diversitySum / 7) * 100 / 6);
  const gamingScore = clampScore(avgGameScore);
  const academicsScore = calculateAcademicsScore(school);
  const healthScore = calculateHealthScore({
    academicsScore,
    foodScore: neuroScore,
    gamingScore,
    diversityScore,
  });

  // Return final summary with gaming data
  return {
    neuroScore,
    foodScore: neuroScore,
    neurotransmitterScores: {
      serotonin: Math.round(normalizedScores.serotonin),
      dopamine: Math.round(normalizedScores.dopamine),
      acetylcholine: Math.round(normalizedScores.acetylcholine),
      omega3: Math.round(normalizedScores.omega3),
      micronutrients: Math.round(normalizedScores.micronutrients),
      tyrosine: Math.round(normalizedScores.dopamine * 0.8),
      choline: Math.round(normalizedScores.acetylcholine * 0.9),
      iron: Math.round(normalizedScores.micronutrients * 0.6),
      glucose: Math.round((meals.length / 7) * 50),
    },
    diversityScore,
    diversitySum,
    academicsScore,
    healthScore,
    gamingScore, // Average gaming score
    gamingBonus: gamingBonus, // Gaming contribution breakdown
    gamesPlayed: recentGames.length, // Number of games played
    days: mealDates,
    mealCount,
    uniqueCategories,
  };
}

/**
 * Generate personalized chemistry insights
 * Updated to include gaming insights
 */
export function generateChemistryInsights(scores, meals, games = []) {
  if (!meals || meals.length === 0) return [];

  const insights = [];

  // Dopamine insight
  if (scores.dopamine > 70) {
    insights.push({
      emoji: "⚡",
      message: "Strong dopamine support - Focus is optimized!",
      recommendation: "Keep up protein intake at breakfast & lunch",
      color: "#66D9FF",
    });
  } else if (scores.dopamine < 40) {
    insights.push({
      emoji: "📉",
      message: "Dopamine could be higher",
      recommendation: "Add protein: chicken, eggs, fish, or legumes. Try brain games!",
      color: "#EF4444",
    });
  }

  // Acetylcholine insight
  if (scores.acetylcholine > 70) {
    insights.push({
      emoji: "💭",
      message: "Memory & learning well-supported",
      recommendation: "Eggs & dairy are great - keep it up!",
      color: "#B366FF",
    });
  } else if (scores.acetylcholine < 40) {
    insights.push({
      emoji: "🧠",
      message: "Memory needs boost",
      recommendation: "Add eggs, dairy, and play memory games!",
      color: "#EF4444",
    });
  }

  // Gaming insight
  if (games && games.length > 0) {
    const avgScore = games.slice(0, 5).reduce((sum, g) => sum + g.points, 0) / Math.min(5, games.length);
    if (avgScore > 70) {
      insights.push({
        emoji: "🎮",
        message: "Excellent gaming performance!",
        recommendation: "Brain training is boosting cognitive function",
        color: "#10B981",
      });
    }
  } else {
    insights.push({
      emoji: "🎮",
      message: "Try brain games!",
      recommendation: "Memory games boost acetylcholine & dopamine",
      color: "#F59E0B",
    });
  }

  // Omega-3 insight
  if (scores.omega3 < 50) {
    insights.push({
      emoji: "🐟",
      message: "Omega-3 needs a boost",
      recommendation: "Add fish 2-3x per week or walnuts daily",
      color: "#66FF99",
    });
  }

  // Micronutrients insight
  if (scores.micronutrients > 75) {
    insights.push({
      emoji: "💪",
      message: "Excellent mineral & iron levels",
      recommendation: "Vegetables & legumes doing great work",
      color: "#FFD966",
    });
  }

  return insights.slice(0, 3);
}

/**
 * Detect deficiency risks
 */
export function detectDeficiencyRisks(scores) {
  if (!scores) return [];

  const risks = [];

  if (scores.dopamine < 30) {
    risks.push({
      deficiency: "Low Dopamine",
      risk: "🔴 CRITICAL",
      symptom: "Lack of focus, motivation, attention difficulties",
      solution: "Increase protein intake - eggs, meat, fish, legumes. Play brain games!",
    });
  }

  if (scores.acetylcholine < 30) {
    risks.push({
      deficiency: "Low Acetylcholine",
      risk: "🟠 HIGH",
      symptom: "Poor memory, difficulty learning, attention issues",
      solution: "Add eggs, dairy, and practice memory games",
    });
  }

  if (scores.omega3 < 30) {
    risks.push({
      deficiency: "Low Omega-3",
      risk: "🟠 HIGH",
      symptom: "Slower learning, reading difficulties, low IQ trajectory",
      solution: "Add fish 2-3x/week or nuts daily",
    });
  }

  if (scores.micronutrients < 30) {
    risks.push({
      deficiency: "Low Micronutrients",
      risk: "🟠 HIGH",
      symptom: "Brain fog, anemia, hyperactivity, poor attention",
      solution: "Increase vegetables, legumes, red meat",
    });
  }

  return risks;
}

/**
 * Format scores for display
 */
export function formatScoreDisplay(score) {
  if (score >= 75) return { status: "⭐ Excellent", color: "#10B981" };
  if (score >= 60) return { status: "👍 Good", color: "#F59E0B" };
  if (score >= 40) return { status: "📈 Fair", color: "#F59E0B" };
  return { status: "⚠️ Low", color: "#EF4444" };
}

/**
 * Check if data is ready for analysis
 */
export function isDataReady(profile, meals) {
  return (
    profile &&
    profile.childName &&
    meals &&
    Array.isArray(meals) &&
    meals.length > 0
  );
}
