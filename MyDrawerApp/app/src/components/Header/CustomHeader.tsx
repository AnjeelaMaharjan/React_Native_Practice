import { View, Text, StyleSheet } from 'react-native';

const CustomHeader = () => {
  
  return (
    <View style = {headerStyle.container}>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Header Content</Text>
      <View>Space-evenly</View>
    </View>

    
  );
 
};
 const headerStyle = StyleSheet.create({

    container:{
        backgroundColor: 'blue',
        paddingTop: 10,
        paddingBottom: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  
     paddingBlockStart:5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }
});  

  
 
export default CustomHeader;