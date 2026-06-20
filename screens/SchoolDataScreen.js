import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { load, save } from "../utils/storage";

export default function SchoolDataScreen() {
  const [attendance, setAttendance] = useState("");
  const [grades, setGrades] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const d = (await load("school")) || {};
        setAttendance(String(d.attendance || ""));
        setGrades(String(d.grades || ""));
        setNotes(String(d.notes || ""));
      } catch (e) {
        console.error("Error loading school data:", e);
      }
    })();
  }, []);

  async function onSave() {
    if (attendance && (Number(attendance) < 0 || Number(attendance) > 100)) {
      Alert.alert("Attendance must be 0-100");
      return;
    }
    const obj = { attendance, grades, notes };
    await save("school", obj);
    Alert.alert("Saved");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>School Data & Performance</Text>
      <TextInput placeholder="Attendance %" value={attendance} onChangeText={setAttendance} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Grades (e.g., Math: A, Eng: B)" value={grades} onChangeText={setGrades} style={styles.input} />
      <TextInput placeholder="Teacher notes / behavior" value={notes} onChangeText={setNotes} style={styles.input} />
      <Button title="Save" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 8, borderRadius: 6 },
});
