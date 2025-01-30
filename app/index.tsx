import {View, Text, SafeAreaView, Touchable, TouchableOpacity, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import React, { useState }from 'react'
import { auth } from '../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { TextInput } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import {db} from '../FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';

const index = () => {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const userCollection = collection(db, 'users');

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: '+ error.message);
    }
  }

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) {
        const docRef = doc(collection(db, 'users'), auth.currentUser?.uid);
        var data = {
          email: user.user.email
        }
        await setDoc(docRef, data);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: '+ error.message);
    }
  }
  return(
    <GestureHandlerRootView>
    <SafeAreaView>
      <Text>Login</Text>
      <TextInput placeholder="email" value={email} onChangeText={setEmail}/>
      <TextInput placeholder='password' value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity onPress={signIn}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signUp}>
        <Text>Make Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default index


/*import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>hello.</Text>
      <Link href="/task" style={{color: 'blue'}}>Go to task</Link>
    </View>
  );
}
*/