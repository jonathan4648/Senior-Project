import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import {db} from '../../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection,getDocs, query, where, doc} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { router,useFocusEffect } from 'expo-router';   
// import CreateEventModal from "../../../components/CreateEventModal"
import AddButton from "../../../components/ui/AddButton"


interface Item {
  task: string;
  time: string;
  priority: string;
}
export default function Today() {
  const [task, setTask] = useState<any>([]);
  const [todos, setTodos ] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<any>()
  const auth = getAuth();
  const user = auth.currentUser;
  const todosCollection = collection(db, 'todos');

  //Refresh the screen
  useFocusEffect(
    useCallback(() => {
    if (user) {
      fetchTodos();
    }
    }, [user])
  );  

  //Opened the modal to create a new task
  const toggleMenu = async () => {
          try {
              await router.push('/createTask');
              console.log('Task closed, opened createTask');
          }
          catch (error: any) {
              console.log(error);
              alert('Toggling menu failed: ' + error.message);
          }
      };
  //fetch user task from firebase
  const fetchTodos = async () => {
    if (user) {
      const today = new Date();  //Get the date for the current day 
      const formatDate = (date:Date) => { //formatting the date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      const thedate = formatDate(today)
      /*
      Query to get the current user's task from the todo collection
      and only the task from the current date of today 
      */
      const q = query(
        todosCollection,
        where('userId', '==', user.uid),
        where('date', '==', thedate)
      );
      const data = await getDocs(q);
      //get the task from the todo collection
      setTodos(
        data.docs
          //create a list of all the task and get the task: name, time, and priority
          .map((doc) => ({
            time: doc.data().time, // Extract time
            title: doc.data().task, // Extract task name
            description: 'Priority: ' + doc.data().priority, // Extract priority
          }))
          //After creating the list of task, sort the task by time from 12:00 AM to 11:59 PM
          .sort((a, b) => {
            const parseTime = (time: string) => {
              const [hour, minutePart] = time.split(':');
              const minute = parseInt(minutePart.slice(0, -2), 10);
              const isPM = minutePart.slice(-2).toLowerCase() === 'pm';
              let hour24 = parseInt(hour, 10);
              if (isPM && hour24 !== 12) hour24 += 12;
              if (!isPM && hour24 === 12) hour24 = 0;
              return hour24 * 60 + minute;
            };
            return parseTime(a.time) - parseTime(b.time);
          })
      );
      console.log('Todos fetched:', todos.task);
    } else {
      console.log('No user found');
    }
  };
      

  return (
    <View style={{flex: 1}}>
      <Timeline
        data={todos} // Use the processed timeline data
        circleSize={15}
        circleColor="rgb(45, 156, 219)"
        lineColor="rgb(45, 156, 219)"
        lineWidth={4}
        timeContainerStyle={{ minWidth: 90, marginTop: 20, marginBottom: 10, marginLeft: -5,marginRight: 10 }}
        timeStyle={styles.timeStyle}
        descriptionStyle={{ color: 'gray' }}
        style={{ paddingTop: 0, marginTop: 20}}
        renderFullLine={true}
        eventContainerStyle={{ marginTop: 9,}}
        separator={true}
        />
        <AddButton
          title="test"
          onPress= {toggleMenu}
          />
    </View>
  );
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff f',
  },
  timeStyle: {
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 1,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
    marginLeft: 15,
    marginBottom: 20,
  },
});