import AsyncStorage from "@react-native-async-storage/async-storage";

// Global current user email
let currentUserEmail = null;

export async function setCurrentUser(email) {
  currentUserEmail = email ? email.trim().toLowerCase() : null;
}

export async function getCurrentUser() {
  return currentUserEmail;
}

// User-specific keys
function getUserKey(baseKey) {
  if (!currentUserEmail) {
    console.warn("⚠️ No current user set");
    return baseKey; // Fallback to base key
  }
  return `${baseKey}_${currentUserEmail}`;
}

export async function save(key, value) {
  try {
    // Special handling for session and users (global, not user-specific)
    const actualKey = key === "session" || key === "users" ? key : getUserKey(key);
    
    const jsonString = JSON.stringify(value);
    await AsyncStorage.setItem(actualKey, jsonString);
    console.log(`✅ Saved: ${actualKey}`);
    return true;
  } catch (e) {
    console.error("Save error", e);
    return false;
  }
}

export async function load(key, defaultValue = null) {
  try {
    // Special handling for session and users (global, not user-specific)
    const actualKey = key === "session" || key === "users" ? key : getUserKey(key);
    
    const v = await AsyncStorage.getItem(actualKey);
    console.log(`📖 Loaded: ${actualKey}`, v ? "✓" : "empty");
    
    if (v === null) return defaultValue;
    return JSON.parse(v);
  } catch (e) {
    console.error("Load error for key:", key, e);
    return defaultValue;
  }
}

export async function remove(key) {
  try {
    const actualKey = key === "session" || key === "users" ? key : getUserKey(key);
    await AsyncStorage.removeItem(actualKey);
    console.log(`🗑️ Removed: ${actualKey}`);
    return true;
  } catch (e) {
    console.error("Remove error", e);
    return false;
  }
}




// Clear all user-specific data
export async function clearUserData() {
  try {
    if (!currentUserEmail) return;
    
    const keysToDelete = ["meals", "games", "profile", "milestones", "schoolPerformance", "school"];
    
    for (const key of keysToDelete) {
      await remove(key); // Uses getUserKey internally
    }
    
    console.log("🧹 User data cleared");
    return true;
  } catch (e) {
    console.error("Clear user data error:", e);
    return false;
  }
}

export async function clearAllUsers() {
  try {
    await AsyncStorage.removeItem("users");
    console.log("✅ All users deleted");
  } catch (e) {
    console.error("Error:", e);
  }
}