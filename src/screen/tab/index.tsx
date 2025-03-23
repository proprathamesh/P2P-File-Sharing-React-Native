import React, { useState } from 'react';
import { View, Text, SafeAreaView, useWindowDimensions } from 'react-native';
import { SceneMap, TabBar, TabView, Route } from 'react-native-tab-view';
import AntDesign from 'react-native-vector-icons/AntDesign';

// Define the type for the routes
type TabRoute = {
  key: string;
  title: string;
};

// Define the type for the TabBar props
type TabBarProps = {
  navigationState: { index: number; routes: TabRoute[] };
  position: any; // You can replace 'any' with a more specific type if needed
  jumpTo: (key: string) => void;
};

// Define the type for the renderLabel and renderIcon parameters
type RenderLabelProps = {
  route: TabRoute;
  focused: boolean;
  color: string;
};

type RenderIconProps = {
  route: TabRoute;
  focused: boolean;
  color: string;
};

// Define the scenes
const FirstRoute = () => <View style={{ flex: 1, backgroundColor: '#ff4081' }} />;

const SecondRoute = () => <View style={{ flex: 1, backgroundColor: '#673ab7' }} />;

// Map the scenes
const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function TabScreen() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState<number>(0);
  const [routes] = useState<TabRoute[]>([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  // Render the custom TabBar
  const renderTabBar = (props: TabBarProps) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{ backgroundColor: 'orange' }}
      renderLabel={({ route, focused, color }: RenderLabelProps) => (
        <Text style={{ color: focused ? 'black' : 'red', margin: 8 }}>
          {route.title}
        </Text>
      )}
      renderIcon={({ route, focused, color }: RenderIconProps) =>
        route.key === 'first' ? (
          <AntDesign name="home" color={color} size={20} />
        ) : (
          <AntDesign name="user" color={color} size={20} />
        )
      }
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
}