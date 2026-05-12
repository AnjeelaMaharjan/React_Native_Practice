import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const NativeDemo = () => {
  const handlePress = () => {
    console.log("Button Pressed!");
    alert("Namaste from Mobile!");
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.card}>
        <Text style={styles.title}>Developer Profile</Text>
        <Text style={styles.subtitle}>Name: Anjeela Maharjan</Text>
        <Text style={styles.description}>
          Learning React Native for professional mobile app development.
        </Text>

        {/* Action Button */}
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Connect Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Mobile Styling (CSS jastai tara CamelCase ma)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginVertical: 10,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NativeDemo;