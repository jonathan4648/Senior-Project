import { router} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState}from 'react'
import { View,Text,StyleSheet, Button, TouchableOpacity , SafeAreaView, TouchableWithoutFeedback, Keyboard} from "react-native"
import {db} from '../../FirebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { auth } from '../../FirebaseConfig';
import { getAuth,sendPasswordResetEmail, updateEmail, sendEmailVerification, User, } from 'firebase/auth';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { MaterialCommunityIcons} from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

export default function Editprofile() {
  const [users, setUserData] = useState<any>([]);
  const [NewEmail, setNewEmail] = useState('');
  const [Firstname, setFirstName] = useState('');
  const [Lastname, setLastName] = useState('');
  const [Birthday, setBirthday] = useState('');
  const [PhoneNum, setPhoneNum] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;
  const usersCollection = collection(db, 'users');
  const [Email, setEmail] = useState<string | undefined>(user?.email || undefined);
  const [NameEdit, setIsEditing] = useState(false);
  const [BirthdayEdit, setBdayedit] = useState(false);
  const [EmailEdit, setEmailEdit] = useState(false);
  const [Passwordreset, setPswrdEdit] = useState(false);
  const [PhoneEdit, setPhoneEdit] = useState(false);
  const [text, setText] = useState('Tap to Edit');

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (user) {
      const q = query(usersCollection, where("userId", "==", user.uid));
      const data = await getDocs(q);
      setUserData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id, Firstname: doc.data().Firstname || 'None', Lastname: doc.data().Lastname || 'None'})));
    } else {
      console.log("No user logged in");
    }
  }
  //Changes name and add to databas
  const changeName = async ( newFirst: string, newLast: string) => {
      if (user) {
      const userDoc = doc(db, 'users', user.uid)
      if (!newFirst && !newLast){
        await updateDoc(userDoc,{Firstname: 'None', Lastname: 'None'}),setIsEditing(false);
        fetchUsers();
      }else{
      await updateDoc(userDoc,{Firstname: newFirst, Lastname: newLast}),setIsEditing(false);
      fetchUsers();
    }}}
  //Changes birthday and adds to database
  const changeBday = async ( bdate:string) => {
    if (user) {
      const userDoc = doc(db, 'users', user.uid)
      if (!bdate ){
        await updateDoc(userDoc,{Birthday: 'None'}),setBdayedit(false);
        fetchUsers();
      }else{
      await updateDoc(userDoc,{Birthday: bdate}),setBdayedit(false);
      fetchUsers();
    }}
  }
  const changePswrd = async () => {
    if (user) {
      const userEmail = user.email;
      if (userEmail) {
        await sendPasswordResetEmail(auth, userEmail)
          .then(() => {
            alert('Password reset email sent!');
          })
          .catch((error) => {
            alert('Error sending password reset email: ' + error.message);
          });
      } else {
        alert('User email is null');
      }
    }
  };

  //still needs work
  const changeEmail = async (newEmail:string) => {
    if (user) {
      const currentEmail = user.email;
      const userDoc = doc(db, 'users', user.uid)
      if (!newEmail){
        await updateDoc(userDoc,{email: Email}),setEmailEdit(false);
        return;
      }
      if (newEmail) {
        await updateDoc(userDoc,{email: newEmail}),setEmail(newEmail),updateEmail(user, newEmail); //still need to implement this-> updateEmail(user, newEmail),
        alert('Email update sent')
        console.log('Email updated successfully')
        setEmailEdit(false);
        }
      else {
        alert('Error sending email change: ');
        };
      }
    };
    const changePhoneNumber = async (PhoneNumber:String) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid)
        if (!PhoneNumber){
          await updateDoc(userDoc,{PhoneNumber: '1+(000-000-0000)'}),setPhoneEdit(false);
          fetchUsers();
        }else{
        await updateDoc(userDoc,{PhoneNumber: PhoneNumber}),setPhoneEdit(false);
        fetchUsers();
      }}
    }
  


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={{flex:1}}>
      <View style={styles.goBack}>
      <Text></Text>
      <Button title="< Go back" onPress={() => router.replace('/profile')} />
    </View>
    <View style={styles.container1}>
      <Text style={styles.mainTitle}>Editing profile</Text>
      <StatusBar style="auto" />
    </View>
    <View style={styles.container2}>
        {!NameEdit ? (
          <TouchableOpacity onPress={() => {setIsEditing(true);setBdayedit(false); setEmailEdit(false);setPswrdEdit(false)}}>
            <View style={styles.iconview}>
                <FontAwesome6 name="id-badge" size={24} color="black" />
                <Text style={styles.name}>   Name</Text>
            </View>
          </TouchableOpacity>
        ): (
          <View>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={styles.nametouchtoexit}>Name</Text>
            </TouchableOpacity>
            <Text>First name:</Text>
            <TextInput
              style={styles.nameinput}
              value={Firstname}
              onChangeText={setFirstName}
              placeholder=' First name'
              autoFocus={true}
            />
            <Text>Last name:</Text>
            <TextInput
              style={styles.nameinput}
              placeholder=' Last name'
              value={Lastname}
              onChangeText={setLastName}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.savebutton} onPress={() => changeName(Firstname, Lastname)}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}


        {!BirthdayEdit ? (
          <TouchableOpacity onPress={() => {setBdayedit(true); setIsEditing(false);setEmailEdit(false);setPswrdEdit(false)}}>
              <View style={styles.iconview}>
              <FontAwesome6 name="cake-candles" size={24} color="black" />
              <Text style={styles.name}>   Birthday</Text>
              </View>
          </TouchableOpacity>
        ): (
          <View style={styles.container3}>
            <TouchableOpacity onPress={() => setBdayedit(false)}>
              <Text style={styles.nametouchtoexit}>Birthday</Text>
            </TouchableOpacity>
            <Text>Birthday date:</Text>
              <TextInput
                style={styles.nameinput}
                value={Birthday}
                onChangeText={setBirthday}
                placeholder='Month/Day/Year'
                autoFocus={true}
              />
            <TouchableOpacity style={styles.savebutton} onPress={() => changeBday(Birthday)}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}


        {!Passwordreset ?(
        <TouchableOpacity onPress={() =>{setPswrdEdit(true);setEmailEdit(false); setBdayedit(false); setIsEditing(false)}}>
              <View style={styles.iconview}>
              <FontAwesome6 name="user-lock" size={24} color="black" />
              <Text style={styles.name}>  Password</Text>
              </View>
        </TouchableOpacity>
        ):(
          <View style={styles.container3}>
            <TouchableOpacity onPress= {() => {setPswrdEdit(false)}}>
              <Text style={styles.nametouchtoexit}>Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.savebutton} onPress={() => changePswrd()}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
          </View>
        )}


        {!EmailEdit ? (
          <TouchableOpacity onPress={() => {setEmailEdit(true); setBdayedit(false); setIsEditing(false);setPswrdEdit(false);}}>
          <View style={styles.iconview}>
              <MaterialCommunityIcons name="email-edit" size={24} color="black" />
              <Text style={styles.name}>  Email</Text>
              </View>
          </TouchableOpacity>
        ): (
          <View style={styles.container3}>
            <TouchableOpacity onPress={() => setEmailEdit(false)}>
              <Text style={styles.nametouchtoexit}>Email</Text>
            </TouchableOpacity>
            <Text>Current Email:</Text>
            <TextInput
              style={styles.nameinput}
              placeholder= {Email}
              value ={Email}
              autoFocus={true}
            />
            <Text>New Email:</Text>
            <TextInput
              style={styles.nameinput}
              value={NewEmail}
              onChangeText={setNewEmail}
              placeholder='New Email'
              
            />
            <TouchableOpacity style={styles.savebutton} onPress={() => changeEmail(NewEmail)}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {!PhoneEdit ? (
          <TouchableOpacity onPress={() => {setPhoneEdit(true);setBdayedit(false); setIsEditing(false);setEmailEdit(false);setPswrdEdit(false)}}>
              <View style={styles.iconview}>
              <FontAwesome6 name="phone" size={24} color="black" />
              <Text style={styles.name}>   Phone Number</Text>
              </View>
          </TouchableOpacity>
        ): (
          <View style={styles.container3}>
            <TouchableOpacity onPress={() => setPhoneEdit(false)}>
              <Text style={styles.nametouchtoexit}>Phone Number</Text>
            </TouchableOpacity>
            <Text>Phone Number:</Text>
              <TextInput
                style={styles.nameinput}
                value={PhoneNum}
                onChangeText={setPhoneNum}
                placeholder='(000)000-0000'
                autoFocus={true}
              />
            <TouchableOpacity style={styles.savebutton} onPress={() => changePhoneNumber(PhoneNum)}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  goBack:
  {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  container1: {
    flexShrink: 1,
    alignItems: 'center',
    marginBottom: 2,
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
    marginBottom: 2,
    color: '#1A237E',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40, // Adjust spacing
    fontFamily: 'Arial', // You can change this to other available fonts
  },
  name: {
    fontSize: 24,
    fontWeight: 'light',
    marginBottom: 0, // Adjust spacing
    fontFamily: 'Arial', // You can change this to other available fonts
  },
  nametouchtoexit: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10, // Adjust spacing
    fontFamily: 'Arial', // You can change this to other available fonts
  },
  container3: {
    flexShrink: 1,
    alignItems: 'flex-start',
    padding: 0,
  },
  nameinput:{
    padding: 10,
    borderBlockColor: '#6F2DA8',
    borderRadius:6,
    width: '100%',
    textAlign: 'center',
    borderColor: '#6F2DA8',
    marginVertical:10,
    borderWidth:1,
    fontSize: 16,
    flexDirection: 'row'
  },
  pswrd: {
    fontSize: 24,
    fontWeight: 'light',
    marginBottom: 10, // Adjust spacing
    fontFamily: 'Arial', // You can change this to other available fonts
  },
  email:{
    fontSize: 24,
    fontWeight: 'light',
    marginBottom: 50, // Adjust spacing
    fontFamily: 'Arial', // You can change this to other available fonts
  },
  input: {
    padding: 10,
    borderBlockColor: '#6F2DA8',
    borderRadius:5,
    borderBottomColor: 'gray',
    width: '50%',
    textAlign: 'center',
    borderColor: '#6F2DA8',
    marginVertical: 10,
    borderWidth:1

  },
  savebutton: {
    backgroundColor: '#007BFF', // Set button background color to blue
      padding: 4, // Add padding inside the button
      borderRadius: 6, // Add border radius for rounded corners
      marginVertical: 0, // Add vertical margin for spacing
      marginBottom:10
  },
  buttonText: {
    color: '#FFFFFF', // Set button text color to white
    fontSize: 18, // Increase font size for better readability
    fontWeight: 'bold', // Make the font bold
    textAlign: 'center', // Center the text
  },
  iconview:{
    flexDirection:'row',
    fontSize: 24,
    fontWeight: 'light',
    marginBottom: 50, // Adjust spacing
    fontFamily: 'Arial', // You can change this to other available fonts
  }

})