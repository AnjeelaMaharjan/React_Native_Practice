import { View, Text } from 'react-native';
export default function Task2_RowLayout() {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20
    }}>
      <Text>Logo</Text>
      <br/><Text>Menu</Text>
    </View>
  );
}