import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Animated 
} from "react-native";
import { load, save } from "../utils/storage";

const defaultCards = ["🍎", "🍌", "🥕", "🥚", "🥜", "🐟"];

function shuffle(a) {
  const arr = [...a, ...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map((v, idx) => ({ id: idx, value: v, revealed: false, matched: false }));
}

export default function GamesScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [moves, setMoves] = useState(0);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      setCards(shuffle(defaultCards));
      const hist = (await load("games")) || [];
      setScoreHistory(hist);
    })();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  async function onCardPress(card) {
    if (card.matched || card.revealed || second) return;
    
    const c = cards.map((x) => (x.id === card.id ? { ...x, revealed: true } : x));
    setCards(c);
    
    if (!first) {
      setFirst(card);
    } else {
      setSecond(card);
      setMoves(moves + 1);
      
      // Check match after delay
      setTimeout(() => {
        const firstCard = c.find((x) => x.id === first.id);
        const secondCard = c.find((x) => x.id === card.id);
        
        if (firstCard.value === secondCard.value) {
          const newC = c.map((x) => (x.value === card.value ? { ...x, matched: true } : x));
          setCards(newC);
          
          // Check if finished
          if (newC.every((x) => x.matched)) {
            const points = Math.max(1, Math.round(100 - moves * 2));
            saveGameScore(points);
            showGameContributionAfterWin(points, moves + 1);
          }
        } else {
          const newC = c.map((x) => (x.matched ? x : { ...x, revealed: false }));
          setCards(newC);
        }
        setFirst(null);
        setSecond(null);
      }, 800);
    }
  }

  async function saveGameScore(points) {
    const hist = [
      { date: new Date().toISOString(), points, moves: moves + 1 }, 
      ...((await load("games")) || [])
    ].slice(0, 10);
    await save("games", hist);
    setScoreHistory(hist);
  }

  function showGameContributionAfterWin(points, totalMoves) {
    const contribution = {
      acetylcholine: Math.round(points * 0.3),
      dopamine: Math.round(points * 0.4),
      micronutrients: Math.round(points * 0.2),
    };

    const totalBoost = contribution.acetylcholine + contribution.dopamine + contribution.micronutrients;

    const message = `
🎉 GAME COMPLETE!

Score: ${points}/100
Moves: ${totalMoves}

━━━━━━━━━━━━━━━━━━━━━
🧠 BRAIN BOOST EARNED

💭 Memory (Acetylcholine)
   +${contribution.acetylcholine} points
   
⚡ Focus (Dopamine)
   +${contribution.dopamine} points
   
💪 Brain Health
   +${contribution.micronutrients} points

Total Brain Boost: +${totalBoost}

━━━━━━━━━━━━━━━━━━━━━
✨ This boost is added to your overall Brain Health Score!

Better performance = Bigger brain boost!
    `.trim();

    Alert.alert("🎮 Brain Boost!", message, [
      { text: "Play Again", onPress: restart },
      { text: "Back to Dashboard", onPress: () => navigation.goBack() }
    ]);
  }

  function showGameContribution(game) {
    const contribution = {
      acetylcholine: Math.round(game.points * 0.3),
      dopamine: Math.round(game.points * 0.4),
      micronutrients: Math.round(game.points * 0.2),
    };

    const totalBoost = contribution.acetylcholine + contribution.dopamine + contribution.micronutrients;

    const message = `
🎮 GAME PERFORMANCE

Score: ${game.points}/100
Moves: ${game.moves}
📅 ${new Date(game.date).toLocaleDateString()}
⏰ ${new Date(game.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}

━━━━━━━━━━━━━━━━━━━━━
🧠 BRAIN BOOST

💭 Memory (Acetylcholine)
   +${contribution.acetylcholine} points
   Helps with learning & retention
   
⚡ Focus (Dopamine)
   +${contribution.dopamine} points
   Improves attention & motivation
   
💪 Brain Health
   +${contribution.micronutrients} points
   Supports cognitive function

Total Boost: +${totalBoost}

━━━━━━━━━━━━━━━━━━━━━
💡 Better game performance = Better brain scores!

Keep playing to boost your Brain Health Score!
    `.trim();

    Alert.alert("Game Contribution", message, [{ text: "Got it!" }]);
  }

  function restart() {
    setCards(shuffle(defaultCards));
    setMoves(0);
    setFirst(null);
    setSecond(null);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerEmoji}>🎮</Text>
          </View>
          <Text style={styles.title}>Memory Match</Text>
          <Text style={styles.subtitle}>Match nutrition pairs!</Text>
        </View>

        {/* BACK BUTTON */}
        {navigation && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Moves</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pairs Left</Text>
            <Text style={styles.statValue}>
              {6 - cards.filter(c => c.matched).length / 2}
            </Text>
          </View>
        </View>

        {/* GAME GRID */}
        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity 
              key={card.id} 
              style={[
                styles.card, 
                (card.revealed || card.matched) && styles.cardRevealed,
                card.matched && styles.cardMatched
              ]} 
              onPress={() => onCardPress(card)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardEmoji}>
                {card.revealed || card.matched ? card.value : "❓"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RESTART BUTTON */}
        <TouchableOpacity onPress={restart} style={styles.restartBtn}>
          <Text style={styles.restartBtnText}>🔄 Restart Game</Text>
        </TouchableOpacity>

        {/* SCORE HISTORY */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>🏆 Recent Scores</Text>
          <Text style={styles.historySubtitle}>Tap to see brain boost</Text>
          {scoreHistory.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyText}>No games played yet</Text>
              <Text style={styles.emptySubtext}>Start playing to track scores!</Text>
            </View>
          ) : (
            scoreHistory.slice(0, 5).map((g, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.historyItem}
                onPress={() => showGameContribution(g)}
                activeOpacity={0.7}
              >
                <View style={styles.historyLeft}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.historyRank}>#{idx + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.historyScore}>{g.points} pts</Text>
                    <Text style={styles.historyMoves}>
                      {g.moves || 'N/A'} moves
                    </Text>
                  </View>
                </View>
                <View style={styles.historyRight}>
                  <Text style={styles.historyDate}>
                    {new Date(g.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyTap}>Tap →</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#E0F2FE" 
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#0369A1",
  },
  headerEmoji: {
    fontSize: 32,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "900",
    color: "#0369A1",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#64748B",
    alignItems: "center",
  },
  backButtonText: {
    color: "#0369A1",
    fontWeight: "700",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#64748B",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0369A1",
  },
grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  rowGap: 10,      // Vertical spacing between rows
  columnGap: 10,   // Horizontal spacing between cards
  marginBottom: 0,
},

  card: { 
    width: "30%", 
    aspectRatio: 1, 
    borderRadius: 12,
    backgroundColor: "#0369A1",
    borderWidth: 2,
    borderColor: "#0369A1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRevealed: {
    backgroundColor: "#FFFFFF",
    borderColor: "#64748B",
  },
  cardMatched: {
    backgroundColor: "#FFFFFF",
    borderColor: "#0369A1",
    borderWidth: 3,
  },
  cardEmoji: {
    fontSize: 36,
  },
  restartBtn: {
    backgroundColor: "#0369A1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    marginTop: -65,  
  },
  restartBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  historySection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#64748B",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0369A1",
    marginBottom: 4,
  },
  historySubtitle: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 12,
    fontStyle: "italic",
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 12,
    color: "#0369A1",
    fontWeight: "700",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 11,
    color: "#64748B",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0F2FE",
    borderRadius: 8,
    backgroundColor: "#E0F2FE",
    marginBottom: 8,
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0369A1",
    justifyContent: "center",
    alignItems: "center",
  },
  historyRank: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  historyScore: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0369A1",
  },
  historyMoves: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyDate: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 2,
    fontWeight: "600",
  },
  historyTap: {
    fontSize: 10,
    color: "#0369A1",
    fontWeight: "700",
  },
});
