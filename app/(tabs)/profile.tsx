import { StatusBar } from 'expo-status-bar';
import { SafeAreaView,Platform, StyleSheet,TouchableOpacity } from 'react-native';
import { router }  from 'expo-router';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabThreeScreen() {

    const signOut = async () => {
        try {
        await router.replace('/');
        } catch (error: any) {
        console.log(error)
        alert('Sign out failed: '+ error.message);
        }
    }
    return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container1}>
      <Text style={styles.mainTitle}>Profile</Text>
      <Text style={styles.mainTitle}>Edit your profile</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </View>
    <View style={styles.container2}>
        <Text style={styles.subTitle}>Name</Text>
        <Text style={styles.subTitle}>Birthday</Text>
        <Text style={styles.subTitle}>Password</Text>
        <Text style={styles.subTitle}>Email</Text>
        <Text style={styles.subTitle}>Phone Number</Text>
        <Text style={styles.subTitle}>Theme</Text>
        <TouchableOpacity onPress={signOut}>
            <Text style={styles.subTitle}>Sign Out</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container1: {
    flexShrink: 1,
    alignItems: 'center',
    padding: 20,
  },
  container2: {
    flexShrink: 1,
    alignItems: 'flex-start',
    padding: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 1, // Adjust spacing as needed
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50, // Adjust spacing
    fontFamily: 'Arial',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
});