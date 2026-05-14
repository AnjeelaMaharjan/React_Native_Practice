import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'  ;

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#d88424' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#5d13d3', alignSelf: 'center' }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const routes = [
  { key: 'first', title: 'First' },
  { key: 'second', title: 'Second' },
];

export default function Tab() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <>
    <View>
<TextInput  placeholder="Type here..."
style={{ margin: 20, padding:20,height: 40, width: "50%", borderColor: 'gray', borderWidth: 1, marginTop: 20, paddingHorizontal: 10 }}
/>
</View>
    <TabView
  navigationState={{ index, routes }}
  renderScene={renderScene}
  onIndexChange={setIndex}
  initialLayout={{ width: layout.width }}
  renderTabBar={props => (
    
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#f1ee5c' }} // Color of the line under the tab
      style={{ backgroundColor: '#204c11' }}       // Background color of the bar
    />
  )}
  
/>

</>
  );
}
