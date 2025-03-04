import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect} from 'react'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { FontAwesome } from '@expo/vector-icons';
import 'react-native-reanimated'
import { useColorScheme } from '@/components/useColorScheme';
import index from "./index";
import home from "./(tabs)/home";
import {Stack} from 'expo-router'
export { ErrorBoundary,} from 'expo-router';
export const unstable_settings = {
  iniitialRouteName: '(tabs)',
}
SplashScreen.preventAutoHideAsync();

export default function RootLayout(){
  const [loaded,error] = useFonts({
    SpaceMono : require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
useEffect(() => {
  if(error) throw error;
}, [error]);

useEffect(() => {
  if(loaded) {
    SplashScreen.hideAsync();
  }
},[loaded]);

if (!loaded) {
  return null;
}

return <RootLayoutNav />;
}
function RootLayoutNav(){
const colorscheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen name="index"  options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
      <Stack.Screen name="Signup" options={{headerShown: false}}/>
    </Stack>
  )
}

