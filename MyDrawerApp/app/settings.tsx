import SettingsScreen from './src/components/Drawer/settings';

import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
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

function Tab() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
  navigationState={{ index, routes }}
  renderScene={renderScene}
  onIndexChange={setIndex}
  initialLayout={{ width: layout.width }}
  renderTabBar={props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'red' }} // Color of the line under the tab
      style={{ backgroundColor: '#6200ee' }}       // Background color of the bar
    />
  )}
/>
  );
}


export default SettingsScreen;
