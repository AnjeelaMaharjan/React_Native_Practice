import { useState } from 'react';
import {
  Button, Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import NativeDemo from './component/NativeDemo';

export default function Index() {
  const [name, setName] = useState("UNknown");
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");

  const changeName = () => {
    setName(name === "Anjeela" ? "Developer " : "Anjeela");
  };

  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count - 1);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>React Native Day 1</Text>
      <View style={{ height: 1, backgroundColor: '#333', width: '100%', marginVertical: 100 }} >
      <NativeDemo />
      </View>
      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.image}
      />

      <Text style={styles.text}>Hello {name}</Text>
      <Button title="Change Name" onPress={changeName} />
      
      <View style={styles.counterBox}>
        <Text style={styles.text}>Count: {count}</Text>

        <View style={styles.row}>
          <Button title="+" onPress={increase} />
          <Button title="-" onPress={decrease} />
        </View>

        <Text style={styles.status}>
          {count > 5 ? "High " : "Low "}
        </Text>
      </View>

      {/* INPUT SECTION */}
      <TextInput
        placeholder="Enter something..." 
        value={input} onChangeText={setInput} style={styles.input}
      />

      <Text style={styles.text}>You typed: {input}</Text>

    </View>
  );
}

// STYLES (React Native CSS)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  text: {
    fontSize: 25,
    marginVertical: 10,
  },

  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  counterBox: {
    marginTop: 20,
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },

  status: {
    fontSize: 16,
    color: 'purple',
  },

  input: {
    borderWidth: 1,
    borderColor: '#333',
    width: '80%',
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
});