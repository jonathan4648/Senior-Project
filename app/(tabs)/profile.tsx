import { StatusBar } from 'expo-status-bar';
import { Alert,SafeAreaView,Platform, StyleSheet,TouchableOpacity,ScrollView , useColorScheme} from 'react-native';
import { router }  from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons,Entypo} from '@expo/vector-icons';
import {auth,db} from '../../FirebaseConfig'
import {getAuth,deleteUser} from "firebase/auth"
import { collection, query, deleteDoc, where, doc, getDocs } from 'firebase/firestore';
import {Colors} from "../../constants/Colors"
import Header from '@/components/ui/HeaderTitle'


export default function TabThreeScreen() {
    const colorscheme = useColorScheme()
    const theme = colorscheme ? Colors[colorscheme] : Colors.light;
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
    const routeAnalytics = async () => {
      try {
        await router.push('/analytics');
      } catch (error: any) {
        console.log(error)
        alert('Analytics Dashboard failed: '+ error.message);
      }
    }
    const themeSettings = async () => {
      try {
        await router.push('/ThemeSwitch');
      } catch (error: any) {
        console.log(error)
        alert('Analytics Dashboard failed: '+ error.message);
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
    //Delete the user data from database
    const deleteAccount = async () => {
      const auth = getAuth()
      const user = auth.currentUser;
      const todoscollection = collection(db,'todos');
      console.log('test')
        try{
          /*
          Query to get all the task from todo collection that has the user's ID 
          Deletes all the task associated with the User
          */
          if (!user) {
            throw new Error('No authenticated user found');
          }
          const taskDelete = query(todoscollection, where("userId", "==", user.uid))
          const taskdata= await getDocs(taskDelete)
          const nowdelete = taskdata.docs.map((taskDoc) => deleteDoc(taskDoc.ref))
          await Promise.all(nowdelete);
          console.log("task deleted")
          /*
          Gets the user id and deletes the user data from the user doc in the database
          */
          const userDoc = doc(db,'users', user.uid);
          await deleteDoc(userDoc)
          console.log('deleted user doc' + userDoc)
          /*
          Deletes the user email and password from the authentication in the database
          */
          await deleteUser(user);
          console.log('deleted user account' + user?.email)
          
      } catch (error:any){
        console.log(error)
        alert('no user was deleted:' + error.message);
      }
    }
    //Alert mesage before the user fully deletes their data as a "warning"
    const alertMessage = () => {
      //First message that warns user about deleting data
      Alert.alert('Delete Account', 'Deleting your account will delete all your data and delete your account permanantly',[
        {text: 'Cancel', style: 'cancel', onPress:() => {console.log('1st cancel pressed')}},
        {text: 'Yes', 
          onPress:() => {
          //Second Warning message that fully deletes the user data if clicks "delete"
          Alert.alert('Confirm Deletion','This will permantly delete your account.Are you sure ?',[
            {text: 'Cancel', style: 'cancel', onPress:() =>{console.log('2nd Cancel pressed')}},
            {text: 'Delete', onPress:() =>{deleteAccount(),router.replace('/')}} //deletes user data and routes back to login page
          ])
          }
        }
      ])
    }

    return (
    <SafeAreaView style={{flex:1,backgroundColor:'auto'}}>
        <StatusBar style = 'auto'/>
        <Header title='Profile' onPress={() => router.replace('/profile')} showIcon={false}/>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container2}>
            <TouchableOpacity onPress={Editprofile}>
              <View style={styles.iconView}>
                <MaterialCommunityIcons name="account-cog" size={24} color="black" />
                <Text style={styles.subTitle}>Your Account</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={routeNotificationCenter}>
              <View style={styles.iconView}>
              <Ionicons name="notifications" size={24} color="black" />
              <Text style={styles.subTitle}>Notifications</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={routeAnalytics}>
                <View style={styles.iconView}>
                  <Ionicons name="analytics-sharp" size={24} color="black" />
                  <Text style={styles.subTitle}>Analytics</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.iconView}>
                  <MaterialIcons name="widgets" size={24} color="black" />
                  <Text style={styles.subTitle}>Widgets</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.iconView}>
                  <Entypo name="slideshare" size={24} color="black" />
                  <Text style={styles.subTitle}>Collaborate</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress = {themeSettings}>
                <View style={styles.iconView}>
                  <Ionicons name="color-palette" size={24} color="black" />
                  <Text style={styles.subTitle}>Theme</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={routeSettings}>
                <View style={styles.iconView}>
                  <MaterialIcons name="settings" size={24} color="black" />
                  <Text style={styles.subTitle}>Settings</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.iconView}>
                  <Text style={styles.subTitle}>About</Text>
                  <MaterialIcons name="info" size={24} color="black" />
                </View>
            </TouchableOpacity>
            <View style={styles.separator}/>
            <TouchableOpacity onPress={alertMessage}>
                <View style={styles.iconView}>
                  <Text style={styles.deleteTitle}>Delete Account</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
                <View style={styles.iconView}>
                  <Text style={styles.subTitle}>Log Out</Text>
                  <MaterialCommunityIcons name="login" size={24} color="black" />
                </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
    marginTop:5,
    backgroundColor:'auto',
  },
  TitleContainer: {
    flexDirection:'row',
    marginBottom:5,
    justifyContent: 'center',
    backgroundColor: 'auto', // A softer white for a modern, minimalist background
    
  },
  container2: {
    marginLeft:-20,
    marginRight:-20,
    marginTop:-25,
    alignItems: 'flex-start',
    padding: 18, // A softer white for a modern, minimalist background
    backgroundColor: 'auto', // A softer white for a modern, minimalist background
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    //fontFamily: 'Verdana',
  },
  iconView:{
    flexDirection:'row',
    backgroundColor:'auto',
    justifyContent:'center',
    alignContent:'center',
    gap:10,
  },
  notifyIcon:{
    flexDirection:'row',
    //backgroundColor:'',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40, // Adjust spacing
    fontFamily: 'Arial',
    marginTop:0,
    padding:0,
    marginLeft:-3,
    //marginRight: -10,
  },
  deleteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, // Adjust spacing
    fontFamily: 'Arial',
    marginTop:10,
    marginLeft:-5,
    padding:0,
    color:'red',
  },
  separator: {
    marginVertical: 1,
    marginBottom:1,
    height: 1,
    width: '100%',
    borderBottomColor:'black',
    backgroundColor:'#cccccc',
  },
});

// Examples of other fonts you can use:
// fontFamily: 'Courier New'
// fontFamily: 'Georgia'
// fontFamily: 'Times New Roman'
// fontFamily: 'Verdana'
// fontFamily: 'Helvetica'
// fontFamily: 'Tahoma'