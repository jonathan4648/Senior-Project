import {View, Text, SafeAreaView, Touchable, TouchableOpacity, StyleSheet, Keyboard, Image} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React, { useState }from 'react'
import { auth } from '../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { TextInput } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import {db} from '../FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico'
import { LinearGradient } from 'expo-linear-gradient'


const index = () => {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const userCollection = collection(db, 'users');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)/(home)/home');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: Wrong email or password');
    }
  }

  return(
    <GestureHandlerRootView>
      <LinearGradient
        colors={['#7B1FA2', '#6F2DA8', '#6432A8','transparent']}
        style={styles.background}>
        <SafeAreaView style={styles.background}>
          <Text style={styles.title}>ToDo App</Text>
          <View style={styles.inputbox}>
              <MaterialCommunityIcons name="email-outline" size={24} color="black" />
              <TextInput
                style={styles.userinput}
                placeholder=" Email" 
                value={email} 
                onChangeText={setEmail}
              />
          </View>
          <View style={styles.inputbox}>
              <MaterialCommunityIcons name="lock" size={24} color="black" />
              <TextInput 
                style={styles.userinput}
                placeholder=' Password' 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
            />
          </View>
            <TouchableOpacity style={styles.button} onPress={signIn}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.replace('/Signup')}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
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
    fontFamily: 'Pacifico_400Regular', // Use a fun font for a modern look
  },
  inputbox: {
    width: '90%', // Set width to 80% of the container
    padding: 12, // Add padding inside the input
    marginVertical: 5, // Add vertical margin for spacing
    borderWidth: 4, // Add border width
    borderBlockColor: 'black', // Set border color to light purple
    borderColor: 'black', // Set border color to light grey
    borderRadius: 30, // Add border radius for rounded corners
    flexDirection: 'row',
    color: 'black',
  },
  userinput:{
    width: '70%',
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
    marginLeft: 15,
  },
  button: {
    width: '20%',
    backgroundColor: '#51158C', // Set button background color to blue
    padding: 10, // Add padding inside the button
    borderRadius: 20, // Add border radius for rounded corners
    marginVertical: 10, // Add vertical margin for spacing
  },
  buttonText: {
    color: '#FFFFFF', // Set button text color to white
    fontSize: 24, // Increase font size for better readability
    fontWeight: 'bold', // Make the font bold
    textAlign: 'center', // Center the text
    width: '0%',
    flexDirection: 'row',
    paddingLeft: 50,
    paddingRight: 50,
  },
});
export default index