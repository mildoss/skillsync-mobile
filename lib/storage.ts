import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const getStoredDraft = async (key: string): Promise<string | null> => {
  const sanitizedKey = key.replace(/[^a-zA-Z0-9._-]/g, "_");
  try {
    if (Platform.OS === "web") {
      return typeof window !== "undefined" ? window.localStorage.getItem(sanitizedKey) : null;
    }
    return await SecureStore.getItemAsync(sanitizedKey);
  } catch {
    return null;
  }
};

export const setStoredDraft = async (key: string, value: string): Promise<void> => {
  const sanitizedKey = key.replace(/[^a-zA-Z0-9._-]/g, "_");
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") window.localStorage.setItem(sanitizedKey, value);
      return;
    }
    await SecureStore.setItemAsync(sanitizedKey, value);
  } catch (e) {
    console.warn("Failed to save draft locally", e);
  }
};

export const removeStoredDraft = async (key: string): Promise<void> => {
  const sanitizedKey = key.replace(/[^a-zA-Z0-9._-]/g, "_");
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") window.localStorage.removeItem(sanitizedKey);
      return;
    }
    await SecureStore.deleteItemAsync(sanitizedKey);
  } catch (e) {
    console.warn("Failed to remove local draft", e);
  }
};
