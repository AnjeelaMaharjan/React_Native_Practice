import {useState} from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity,Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeHeader } from './src/components/Header/SafeHeader';
import { COLORS, SPACING, TYPOGRAPHY } from './src/styles/index';
import { withDrawer } from './src/components/Drawer/DrawerHOC';


interface CounterState {
  count :number;
  message: string;
}
const Index: React.FC = () => {

  const [count, setCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("Start counting");

  const handleIncrement = ( ): void => {
const newCount = count + 1;
setCount(newCount);
setMessage(`Count is now ${newCount}`);
  };

const handleDecrement = (): void => {
  const newCount = count - 1;
  setCount(newCount);
  setMessage(`Count is now ${newCount}`);
};

const handleReset = (): void => {
  setCount(0);
  setMessage("Count reset to 0");
}


  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SafeHeader title="Home" />
   
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome! </Text>
          <Text style={styles.cardDescription}>This is an simple counter app</Text>
        </View>
      
          <View>
          <View style={styles.Countercontainer}>
            <Text style={styles.title}>Counter App</Text>

            <View style={styles.countBox}>
              <Text style={styles.countText}>{count}</Text>
            </View>

            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity style={[styles.button, styles.green]} onPress={handleIncrement}>
              <Text> + Increment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.red]} onPress = {handleDecrement}>
              <Text > - Decrement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.blue]} onPress = {handleReset}>
              <Text>Reset</Text>
            </TouchableOpacity>
          </View></View>
     
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 50, backgroundColor: COLORS.gray[50] },
  content: { padding: SPACING.lg },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.lg, marginBottom: SPACING.lg, elevation: 2, shadowColor: COLORS.black, shadowOpacity: 0.1, shadowRadius: 3.84, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary[600], marginBottom: SPACING.md },
  cardDescription: { ...TYPOGRAPHY.body, color: COLORS.gray[600] },
    
  Countercontainer:{
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  countBox: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  countText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  green: {
    backgroundColor: '#4CAF50',
  },
  red: {
    backgroundColor: '#FF3B30',
  },
  blue: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default withDrawer(Index);