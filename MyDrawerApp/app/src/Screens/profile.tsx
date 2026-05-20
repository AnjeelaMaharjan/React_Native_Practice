import React, { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Modal, Button as RNButton } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SafeHeader from "../components/Header/SafeHeader"; 
import { COLORS, SPACING, TYPOGRAPHY } from "../styles/index";
import { withDrawer } from "../components/Drawer/DrawerHOC";
import { Button } from "@react-navigation/elements";
import { Profilestyles as styles } from "../styles/style";

const ProfileScreen: React.FC = () => {

  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonPress = () => {
    setModalVisible(true); 
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <SafeHeader title="Profile" showDrawerButton={true} />
        
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your Profile</Text>
              <Text style={styles.cardDescription}>
                Add your profile information here
              </Text>
              <Button onPress={handleButtonPress}>Open Profile Modal</Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>


      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Details</Text>
            <Text style={styles.modalBody}>
             THis is a modal showing more details about the profile. You can add more information or actions here as needed.
             This modal can be closed by pressing the button below.
             </Text>
            
            <View style={styles.modalButtonContainer}>
              <RNButton 
                title="Close" 
                color={COLORS.primary[600]} 
                onPress={() => setModalVisible(false)} 
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};


export default withDrawer(ProfileScreen);