import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeHeader } from "../components/Header/SafeHeader";
import { COLORS, SPACING, TYPOGRAPHY } from "../styles/index";
import { withDrawer } from "../components/Drawer/DrawerHOC";
import { Button } from "@react-navigation/elements";
// import Camera from "./camera";

const ProfileScreen: React.FC = () => {
  const showAlert = (message: string) => {
    alert(message);
  };
  const handleButtonPress = () => {
    showAlert("This is my Profile Page.");
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SafeHeader title="Profile" />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Profile</Text>
          <Text style={styles.cardDescription}>
            Add your profile information here
          </Text>
          <Button onPress={handleButtonPress}>Press me</Button>

          {/* <Camera /> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[50] },
  content: { padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary[600],
    marginBottom: SPACING.md,
  },
  cardDescription: { ...TYPOGRAPHY.body, color: COLORS.gray[600] },
  buttonText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.black,
    borderWidth: 1,
    textAlign: "center",
    marginBottom: SPACING.lg,
  },
});

export default withDrawer(ProfileScreen);
