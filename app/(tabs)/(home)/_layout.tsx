import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter, router } from 'expo-router';


export default function Layout () {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
      <Drawer.Screen
          name="TodaySchedule" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Today',
            headerTitle: () => (
              <TouchableOpacity 
                onPress={() => 
                  router.replace({
                    pathname: '/(tabs)/(home)/TodaySchedule',
                    params: { refresh: 'true' }
                  },
                )}>
              <Text style={{fontSize:25, fontWeight:'bold'}}>Today</Text>
              </TouchableOpacity>
            ),
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
          name="CalenderView" // This is the name of the page and must match the url from root
          options={() => ({
            drawerLabel: 'Calender',
            headerTitle: () => (
              <TouchableOpacity 
                onPress={() => 
                  router.replace({
                    pathname: '/(tabs)/(home)/CalenderView',
                    params: { refresh: 'true' }
                  },
                )}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Calender</Text>
              </TouchableOpacity>
            ),
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome5
                name="calendar-alt"
                size={size}
                color={color}
              />
            ),
          })}
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
