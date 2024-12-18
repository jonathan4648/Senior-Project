import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack} from 'expo-router';
import { useEffect} from 'react'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { FontAwesome } from '@expo/vector-icons';
import 'react-native-reanimated'
import { useColorScheme } from '@/components/useColorScheme';

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
      <Stack.Screen name="index" options={{ headerShown:false}}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
      <Stack.Screen name="modal" options={{ presentation:'modal'}}/>
    </Stack>
  )
}


/*export default _layout

const styles = StyleSheet.create({})
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}*/
