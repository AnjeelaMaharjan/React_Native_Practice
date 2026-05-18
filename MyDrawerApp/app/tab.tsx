import * as React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={[styles.scene, styles.firstRoute]}>
    <Text style={styles.routeText}>First route content</Text>
    <Text style={styles.routeSubtext}>This content appears when you select the First tab.</Text>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.scene, styles.secondRoute]}>
    <Text style={styles.routeText}>Second route content</Text>
    <Text style={styles.routeSubtext}>This content appears when you select the Second tab.</Text>
  </View>
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
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: '#f1ee5c' }}
          style={{ backgroundColor: '#204c11' }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  firstRoute: {
    backgroundColor: '#d88424',
  },
  secondRoute: {
    backgroundColor: '#5d13d3',
  },
  routeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
  },
  routeSubtext: {
    fontSize: 16,
    color: '#f7f7f7',
    textAlign: 'center',
  },
});
