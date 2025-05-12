import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Layout () {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer initialRouteName="home">
        <Drawer.Screen
          name="Home" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            headerTitle: 'Homepage',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name="home-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="CalenderView" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Calender',
            headerTitle: 'Calender',
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome5
                name="calendar-alt"
                size={size}
                color={color}
              />
            ),
          }}
        />
      <Drawer.Screen
          name="TodaySchedule" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Today',
            headerTitle: 'Today',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name="today"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="MapView" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Map',
            headerTitle: 'Map View',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name="map"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
