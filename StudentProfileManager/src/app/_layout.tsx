import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Modal, Platform, StatusBar } from "react-native";
import { runMigrations } from "../db";
import { useTranslation } from "react-i18next";
import "../i18n/config"; // ensures i18n is initialized before any component calls useTranslation()

/**
 * Root Layout of the application.
 *
 * Concept:
 * - We check if the local SQLite database has run migrations.
 * - If not, we show a loading indicator.
 * - Once migrations are completed, we render the screen Stack.
 */
export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { t, i18n } = useTranslation();

  const isNepali = i18n.language?.startsWith("ne");
  const currentLang = isNepali ? "ne" : "en";

  const changeLanguage = (lang: "en" | "ne") => {
    i18n.changeLanguage(lang);
    setMenuVisible(false);
  };

  useEffect(() => {
    async function initDb() {
      await runMigrations();
      setDbReady(true);
    }
    initDb();
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ee8b2f" />
      </View>
    );
  }

  const langButton = (
    <>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.langButton}
        activeOpacity={0.7}
      >
        <Text style={styles.langButtonText}>
          🌐 {currentLang === "en" ? "English" : "नेपाली"} ▾
        </Text>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                currentLang === "en" && styles.activeDropdownItem,
              ]}
              onPress={() => changeLanguage("en")}
              activeOpacity={0.6}
            >
              <Text style={[
                styles.dropdownItemText,
                currentLang === "en" && styles.activeDropdownItemText,
              ]}>
                English
              </Text>
              {currentLang === "en" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dropdownItem,
                currentLang === "ne" && styles.activeDropdownItem,
              ]}
              onPress={() => changeLanguage("ne")}
              activeOpacity={0.6}
            >
              <Text style={[
                styles.dropdownItemText,
                currentLang === "ne" && styles.activeDropdownItemText,
              ]}>
                नेपाली
              </Text>
              {currentLang === "ne" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ee8b2f",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor: "#F3F4F6", // Sleek background color
        },
        headerRight: () => langButton,
      }}
    >
      <Stack.Screen name="index" options={{ title: t("screen.studentDirectory") }} />
      <Stack.Screen name="add" options={{ title: t("screen.addNewStudent") }} />
      <Stack.Screen name="edit/[id]" options={{ title: t("screen.editStudent") }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  langButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  langButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  },
  dropdownContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 95 : 56 + (StatusBar.currentHeight || 24) - 10,
    right: 14,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 6,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeDropdownItem: {
    backgroundColor: "#FDF2E9",
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  activeDropdownItemText: {
    color: "#ee8b2f",
    fontWeight: "700",
  },
  checkmark: {
    fontSize: 14,
    color: "#ee8b2f",
    fontWeight: "700",
  },
});
