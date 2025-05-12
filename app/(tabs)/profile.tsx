import { StatusBar } from 'expo-status-bar';
import { SafeAreaView,Platform, StyleSheet,TouchableOpacity,ScrollView } from 'react-native';
import { router }  from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabThreeScreen() {
    const navigation = useNavigation();
    const signOut = async () => {
        try {
        await router.replace('/');
        } catch (error: any) {
        console.log(error)
        alert('Sign out failed: '+ error.message);
        }
    }
    const Editprofile = async () => {
        try {
        await router.push('/EditProfile');
        } catch (error: any) {
        console.log(error)
        alert('Edit profile failed: '+ error.message);
        }
    }
    const routeNotificationCenter = async () => {
      try {
        await router.push('/notification_center');
      } catch (error: any) {
        console.log(error)
        alert('Notification Center failed: '+ error.message);
      }
    }
    const routeSettings = async () => {
      try {
        await router.push('/settings');
      } catch (error: any) {
        console.log(error)
        alert('Settings failed: '+ error.message);
      }
    }
    const routeAnalytics = async () => {
      try {
        await router.push('/analytics');
      } catch (error: any) {
        console.log(error)
        alert('Analytics Dashboard failed: '+ error.message);
      }
    }
    return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container1}>
          <Text style={styles.mainTitle}>Profile</Text>
          <TouchableOpacity onPress={(Editprofile) }>
            <Text style={styles.EditProfile}>Edit your profile</Text>
            <StatusBar style="auto"/>
          </TouchableOpacity>
        </View>
      <View style={styles.container2}>
          <View style={styles.notifyIcon}>
          <TouchableOpacity onPress={routeNotificationCenter}>
            <Text style={styles.subTitle}>Notifications</Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={routeAnalytics}>
              <Text style={styles.subTitle}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/widgets')}>
            <Text style={styles.subTitle}>Widgets</Text>
          </TouchableOpacity>
          <Text style={styles.subTitle}>Collabrate</Text>
          <Text style={styles.subTitle}>About</Text>
          <Text style={styles.subTitle}>Theme</Text>
          <TouchableOpacity onPress={routeSettings}>
              <Text style={styles.subTitle}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut}>
              <Text style={styles.subTitle}>Log Out</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
  container1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // A softer white for a modern, minimalist background
    padding: 30,
  },
  container2: {
    alignItems: 'flex-start',
    padding: 18, // A softer white for a modern, minimalist background
    backgroundColor: '#f0f0f0', // A softer white for a modern, minimalist background
    marginVertical: 0,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Verdana',
  },
  EditProfile: {
    fontSize: 20,
    fontWeight: 'light',
    marginBottom: -100,
    fontFamily: 'Arial',
    justifyContent: 'center'
  },
  notifyIcon:{
    flexDirection:'row',
    backgroundColor:'#f0f0f0',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 75, // Adjust spacing
    fontFamily: 'Arial',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
});

// Examples of other fonts you can use:
// fontFamily: 'Courier New'
// fontFamily: 'Georgia'
// fontFamily: 'Times New Roman'
// fontFamily: 'Verdana'
// fontFamily: 'Helvetica'
// fontFamily: 'Tahoma'