import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { Text, View } from '@/components/Themed';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import {db} from '../../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection,getDocs, query, where, doc} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { router,useFocusEffect } from 'expo-router';   
import AddButton from "../../../components/ui/AddButton"
import { FontAwesome6, Ionicons, MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';


interface Item {
  task: string;
  time: string;
  priority: string;
}
interface TodoItem {
  id: string;
  task: string;
  completed: boolean;
  userId: string;
  priority: string;
  date: string;
  time: string;
  location: string;
  travelTime: string;
  distance: string;
}
export default function Today() {
  const [todos, setTodos ] = useState<any>([]);
  const [PriorityList, setPriorityList]= useState<any>([]);
  const [LocationList, setLocationList]= useState<any>([]);
  const [TimeList, setTimeList]= useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const todosCollection = collection(db, 'todos');
  const [PrioritySort, setPriority] = useState(false);
  const [normalSort, setNormal] = useState(false);


  //Refresh the screen
  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchData();
        ListByPriority()
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
  const fetchData = async () => 
    {
      console.log('fetchData function called');
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
            id: doc.id, // Use Firestore document ID as the task ID
            taskId: doc.id, // Add taskId for editing
            time: doc.data().time, // Extract time
            date: doc.data().date, // Extract date
            title: doc.data().task, // Extract task name
            description: doc.data().priority, // Extract priority
            location: doc.data().location, // Extract location
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
      console.log('Sorting by time');
    } else {
      console.log('No user found');
    }
  };
  
  
  //Routes to creattask file with autofill information of task
  interface RowData {
      id: string;
      task: string;
      completed: boolean;
      userId: string;
      location: string;
      travelTime: string;
      distance: string;
      date: string;
      title: string;
      time: string;
      priority: string;
      description: string;
  }

  const handleEdit = async (rowData: RowData) => {
      router.push({
          pathname: '/createTask',
          params: {
              id: rowData.id, // Pass task ID
              task: rowData.title,
              priority: rowData.description,
              time: rowData.time,
              location: rowData.location || '', // Ensure location is passed
              travelTime: rowData.travelTime || '', // Ensure travelTime is passed
              distance: rowData.distance || '', // Ensure distance is passed
              date: rowData.date, // Ensure date is passed
              isEdit: 'true', // Indicate edit mode
          },
      });
      console.log('Opened createTask with autofill information from Timeline');
  };

  const ListByPriority = async () =>
  {
    console.log('ListByPriority function called');
    if (user){
      const today = new Date();  //Get the date for the current day 
      const formatDate = (date:Date) => { //formatting the date
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
      }
      const thedate = formatDate(today)
      const q = query(
        todosCollection,
        where('userId', '==', user.uid),
        where('date', '==', thedate)
      );
      const data = await getDocs(q);
      setPriorityList(
        data.docs
        //create a list of all the task and get the task: name, time, and priority
        .map((doc) => ({
          id: doc.id, // Use Firestore document ID as the task ID
          taskId: doc.id, // Add taskId for editing
          time: doc.data().time, // Extract time
          date: doc.data().date, // Extract date
          title: doc.data().task, // Extract task name
          description: doc.data().priority, // Extract priority
          location: doc.data().location, // Extract location
        }))
        //After creating the list of task, sort the task by time from 12:00 AM to 11:59 PM
        .sort((a, b) => {
          const priorityOrder = ['High', 'Medium', 'Low'];
          return priorityOrder.indexOf(a.description) - priorityOrder.indexOf(b.description);
        })
      );
      console.log('Sorting by priority');
  } else {
    console.log('No user found');
  }

  }
  const ListByLocation = async (rowData:RowData) =>{}
  const ListByTime = async (rowData:RowData) =>{}
  const ListByDate = async (rowData:RowData) =>{}
  const ListByCompleted = async (rowData:RowData) =>{}
  const ListByUncompleted = async (rowData:RowData) =>{}


  return (
    <View style={{flex: 1}}>
      <View style = {styles.sortContainer}>
        <Text style={styles.listby}>List By:</Text>
        <TouchableOpacity style={styles.sortButton} onPress={ async() => { 
          setPriority(true); 
          setNormal(false); // Reset normalSort when toggling PrioritySort
          await ListByPriority(); // Call the function to sort by priority
        }}>
          <Text style={styles.sortText}>Priority</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={() => {}}>
          <Text style={styles.sortText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={async() => { 
          setNormal(true); 
          setPriority(false); // Reset PrioritySort when toggling normalSort
          await fetchData(); // Call the function to fetch data
        }}>
          <Text style={styles.sortText}>Time</Text>
        </TouchableOpacity>
      </View>
      <Timeline
        data={PrioritySort ? PriorityList :todos} // Default to todos, switch to PriorityList if PrioritySort is true
        renderDetail={(rowData, rowID) => (
          <View style={{flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 2, paddingLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{rowData.title}</Text>
              <Text>Priority: {rowData.description}</Text>
              <Text>Time: {rowData.time}</Text>
              <Text>Location: {rowData.location}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => handleEdit(rowData)}>
                <Feather name="edit" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        circleSize={15}
        circleColor="rgb(45, 156, 219)"
        lineColor="rgb(45, 156, 219)"
        lineWidth={4}
        timeContainerStyle={{ minWidth: 90, marginTop: 20, marginBottom: 10, marginLeft: -5,marginRight: 10 }}
        timeStyle={styles.timeStyle}
        descriptionStyle={{ color: 'gray' }}
        style={{ paddingTop: 0, marginTop: 20}}
        renderFullLine={true}
        eventContainerStyle={{ marginTop: 9, paddingBottom: 15 }}
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
  sortContainer:{
    flexDirection: 'row',
    marginBottom:-10,
    gap:10,
  },
  sortButton:{
    padding: 10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#5C6BC0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginLeft: 10,
    marginTop: 10,
  },
  listby:{
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  sortText:{
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
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