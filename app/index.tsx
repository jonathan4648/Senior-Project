import {View, Text, SafeAreaView, Touchable, TouchableOpacity, StyleSheet, Keyboard } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React, { useState }from 'react'
import { auth } from '../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { TextInput } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import {db} from '../FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons'


const index = () => {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const userCollection = collection(db, 'users');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)/home');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: Email and password does not exist');
    }
  }

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/Signup');
    } catch (error: any) {
      console.log(error)
      alert('Sign up failed: '+ error.message);
    }
  }

  const forgotPassword = () => {
    alert('Forgot Password clicked!');
  };  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#CBC3E3', // Change background color to pure white
    },
    title: {
      fontSize: 24, // Increase font size for better readability
      fontWeight: 'bold', // Make the font bold
      color: '#333333', // Change color to a dark grey for better contrast
      marginVertical: 10, // Add vertical margin for spacing
      alignItems: 'center', // Center the text
      flexShrink: 1,
      fontFamily: "", // Use a fun font for a modern look
    },
    input: {
      width: '80%', // Set width to 80% of the container
      padding: 10, // Add padding inside the input
      marginVertical: 10, // Add vertical margin for spacing
      borderWidth: 1, // Add border width
      borderBlockColor: '#6F2DA8', // Set border color to light purple
      borderColor: '#6F2DA8', // Set border color to light grey
      borderRadius: 5, // Add border radius for rounded corners
      flexDirection: 'row'
    },
    mailIcon:{
      flexDirection: 'row'
    },
    button: {
      backgroundColor: '#007BFF', // Set button background color to blue
      padding: 10, // Add padding inside the button
      borderRadius: 5, // Add border radius for rounded corners
      marginVertical: 10, // Add vertical margin for spacing
    },
    buttonText: {
      color: '#FFFFFF', // Set button text color to white
      fontSize: 18, // Increase font size for better readability
      fontWeight: 'bold', // Make the font bold
      textAlign: 'center', // Center the text
    },
  });

  return(
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>ToDo App</Text>

        <View style={styles.input}>
        <MaterialCommunityIcons name="email-outline" size={24} color="gray" />
        <TextInput
          style={styles.mailIcon} 
          placeholder=" Email" 
          value={email} 
          onChangeText={setEmail}
        />
        </View>

        <View style={styles.input}>
        <MaterialCommunityIcons name="lock" size={24} color="gray" />
        <TextInput 
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
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={forgotPassword}>
          <Text style={{ color: '#007BFF', marginTop: 10 }}>Forgot Password?</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default index
