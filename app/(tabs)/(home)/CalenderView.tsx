import React ,{ useEffect, useState, useCallback} from 'react';
import { StyleSheet, Button, Platform, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Agenda, AgendaEntry } from 'react-native-calendars'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { fetchTodos, } from '../firebaseUtils';
import { collection} from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { useLocalSearchParams, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {View, Text} from '../../../components/Themed'
import AddButton from "../../../components/ui/AddButton"

interface Item {
  name: string;
  time: string;
  priority: string;
}
export default function Calendar() {
  const [task, setTask] = useState<any>({});
  const auth = getAuth();
  const user = auth.currentUser;
  
  const {refresh} = useLocalSearchParams();

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
  //gets task from todo collection and uses function to convert to items for agenda
  useEffect(() => {
      if (user) {
        fetchTodos(user.uid).then((todos) => {
          const taskForAgenda = agendaTask(todos); //calls agendatask(function to convert todos to items)
          setTask(taskForAgenda); //sets the converted items to the task state
      });
    }
   }, [user]);
  //refreshes the screens so that it can be updated with the latest data
  useEffect(() => {
    if (user) {
      if (refresh === 'true') {
          fetchTodos(user.uid);
          router.replace('/(tabs)/(home)/CalenderView');
      }
    }
  },[refresh]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchTodos(user.uid).then((todos) => {
          const taskForAgenda = agendaTask(todos); // Convert todos to agenda items
          setTask(taskForAgenda); // Update the task state
        });
      }
    }, [user])
  );

  /*
    Function to convert todos to items for the agenda
    it groups the todos by date and creates an array of items for each date
    each item contains the task name and time
  */
  const agendaTask = (todos: any[]) => {
    const items: {[key: string]: Item[] } = {}; // create an object to hold the items grouped by date
    todos.forEach((todo) => {
      const date = todo.date;
      if (!items[date]) {
        items[date] = [];// create an array for the date if it doesn't exist
      }
      items[date].push({ name: todo.task, time: todo.time, priority:todo.priority }); //creates an item with task and time
    });
    return items;
  };
  
  //get the items and set them to the agenda
  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const item = reservation as unknown as Item; // Cast to match your Item type
    return (
      <Card style={styles.container}>
        <Card.Title title={item.name} titleStyle={{ fontWeight: 'bold' }}/>
        <Card.Content>
          <TouchableOpacity>
            <View style={styles.cardview}>
              <Text style={styles.cardContents}>  {item.time}</Text>
              <Text style={styles.cardContents}>  {item.priority}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={{flex:1}}>
      <Agenda
      items={task}
      selected ={new Date().toISOString().slice(0,10)} // today's date
      renderItem={renderItem}
      loadItemsForMonth={() => {}}
      />
       <AddButton
          title="test"
          onPress= {toggleMenu}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:0,
    marginTop: 18,
    marginBottom: 10,
    marginLeft: -2,
    padding: 0,
  },
  cardview:{
    flexDirection:'row',
    justifyContent:'flex-start',
    padding:0,
    flexWrap:'wrap',
    marginLeft:-5,
    backgroundColor:'auto'
    
  },
  cardContents:{
    justifyContent:'space-between',
    alignItems:'center',
    padding:0,
    backgroundColor:'auto'
  },
});
