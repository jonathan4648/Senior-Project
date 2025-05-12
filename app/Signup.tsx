import {View, Text, Button, SafeAreaView, Touchable, TouchableOpacity, StyleSheet, Keyboard } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React, { useState }from 'react'
import { auth } from '../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { TextInput } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import {db} from '../FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons'
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico'
import { LinearGradient } from 'expo-linear-gradient'

const index = () => {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [Firstname,setFname] = useState('');
  const [Lastname, setLname] = useState('');
  const userCollection = collection(db, 'users');


  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      //const user = userCredential.user;
      if (user) {
        const docRef = doc(collection(db, 'users'), auth.currentUser?.uid);
        var data = {
            email: email,
            Firstname: Firstname,
            Lastname: Lastname,
            tasksCompleted: 0
        }
        await setDoc(docRef, data);

        //Create default notification when user signs up
        const tempid = Date.now().toString();
        const docRef2 = doc(collection(db, 'notifications'), tempid);
                var data2 = {
                  id: tempid,
                  message: "Welcome to the app!",
                  read: false,
                  userId: auth.currentUser?.uid
                }
        await setDoc(docRef2, data2);
        
        router.replace('/(tabs)/(home)/TodaySchedule');
      }
    } catch (error: any) {
      console.log(error)
      alert('Sign up failed: Email or password is invalid'+ error.message);
    }
  }

  return(
    <GestureHandlerRootView>
      <LinearGradient
        colors={['#7B1FA2', '#6F2DA8', '#6432A8','transparent']}
        style={styles.background}>
      <SafeAreaView style={styles.background}>
        <Text style={styles.title}>Sign up </Text>
        <View style={styles.inputbox}>
          <FontAwesome5 name="user" size={24} color="black" />
          <TextInput 
            style={styles.userinput}
            placeholder=" First Name" 
            placeholderTextColor={'black'}
            value={Firstname} 
            onChangeText={setFname}
          />
        </View>
        <View style={styles.inputbox}>
        <FontAwesome5 name="user" size={24} color="black" />
        <TextInput 
          style={styles.userinput}
          placeholder=" Last name"
          placeholderTextColor={'black'} 
          value={Lastname} 
          onChangeText={setLname}
        />
        </View>
        <View style={styles.inputbox}>
        <MaterialCommunityIcons name="email-outline" size={24} color="black" />
        <TextInput 
          style={styles.userinput}
          placeholder="Email" 
          placeholderTextColor={'black'}
          value={email} 
          onChangeText={setEmail}
        />
        </View>
        <View style={styles.inputbox}>
        <MaterialCommunityIcons name="lock" size={24} color="black" />
        <TextInput 
          style={styles.userinput}
          placeholder='Password' 
          placeholderTextColor={'black'}
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
        />
        </View>
        <TouchableOpacity style={styles.SignUpbutton} onPress={signUp}>
          <Text style={styles.LoginText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.LoginButton} onPress={() => router.replace('/')}>
          <Text style={styles.SignUpText}>Login</Text>
        </TouchableOpacity>
        <Text>Already have an account?</Text>
      </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  background:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CBC3E3', // Change background color to pure white
  },
  title: {
    fontSize: 50, // Increase font size for better readability
    fontWeight: 'bold', // Make the font bold
    color: 'black', // Change color to a dark grey for better contrast
    marginVertical: 10, // Add vertical margin for spacing
    alignItems: 'center', // Center the text
    flexShrink: 1,
    fontFamily: "Pacifico_400Regular", // Use a fun font for a modern look
  },
  inputbox: {
    width: '90%', // Set width to 80% of the container
    padding: 12, // Add padding inside the input
    marginVertical: 5, // Add vertical margin for spacing
    borderWidth: 4, // Add border width
    borderBlockColor: 'black', // Set border color to light purple
    borderColor: 'black', // Set border color to light grey
    borderRadius: 30, // Add border radius for rounded corners
    flexDirection: "row",
  },
  userinput:{
    width: '70%',
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
    marginLeft: 15,
  },
  SignUpbutton: {
    width: '20%',
    backgroundColor: '#51158C', // Set button background color to blue
    padding: 10, // Add padding inside the button
    borderRadius: 20, // Add border radius for rounded corners
    marginVertical: 10, // Add vertical margin for spacing
  },
  LoginText: {
    color: '#FFFFFF', // Set button text color to white
    fontSize: 25, // Increase font size for better readability
    fontWeight: 'bold', // Make the font bold
    textAlign: 'center', // Center the text
    width: '0%',
    paddingLeft: 50,
    paddingRight: 50,
  },
  signup:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  LoginButton: {
    backgroundColor: '#d7d7d7', // Set button background color to blue
    padding: 10, // Add padding inside the button
    borderRadius: 20, // Add border radius for rounded corners
    marginVertical: 10, // Add vertical margin for spacing
    marginLeft:0,
  },
  SignUpText: {
    color: '#51158C', // Set button text color to white
    fontSize: 25, // Increase font size for better readability
    fontWeight: 'bold', // Make the font bold
    textAlign: 'center', // Center the text
    paddingLeft: 40,
    paddingRight: 40,
  },
});

export default index