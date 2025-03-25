import React ,{ useEffect, useState} from 'react';
import { StyleSheet, View, Text, Button, Platform, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Agenda } from 'react-native-calendars'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from 'firebase/auth';
import { fetchTodos, } from '../firebaseUtils';
import { collection} from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
interface Item {
  name: string;
  time: string;
  priority: string;
}
export default function Calendar() {
  const [task, setTask] = useState<any>({});
  const auth = getAuth();
  const user = auth.currentUser;
  const todosCollection = collection(db, 'todos');

  //gets task from todo collection and uses function to convert to items for agenda
  useEffect(() => {
      if (user) {
        fetchTodos(user.uid).then((todos) => {
          const taskForAgenda = agendaTask(todos); //calls agendatask(function to convert todos to items)
          setTask(taskForAgenda); //sets the converted items to the task state
      });
    }
   }, [user]);
  
  //function to convert todos to items for the agenda
  //it groups the todos by date and creates an array of items for each date
  //each item contains the task name and time
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
  const renderItem = (item: Item) => {
    return (
      <TouchableOpacity style={styles.stackofcards}>
        <View style={styles.cardview}>
          <Text style={styles.cardview}>{item.name}</Text>
          <Text style={styles.cardview}>{item.time}</Text>
          <Text style={styles.cardview}>{item.priority}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{flex:1}}>
      <Agenda
      items={task}
      selected ={new Date().toISOString().split('T')[0]} // today's date
      renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 0,
  },
  stackofcards:{
    marginRight:10,
    marginTop:10,
  },
  cardview:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  }
});
