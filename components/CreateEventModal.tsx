import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


interface Props {
  visible: boolean;
  onClose: () => void;
  fetchTodos: () => void;
  user: any;
}

export default function CreateEventModal({ visible, onClose, fetchTodos, user }: Props) {
    console.log("Modal visible:", visible);

  const [task, setTask] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Low');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [distance, setDistance] = useState('');

  const todosCollection = collection(db, 'todos');

  //google maps api key 
  const GOOGLE_MAPS_API_KEY = "AIzaSyAlkE0Q7pX0EGmIqRZHo2AcA3etixqn3kM";
  console.log("Loaded API Key:", GOOGLE_MAPS_API_KEY);


  const addTodo = async () => {
    if (user) {
        console.log("Adding todo...");
      await addDoc(todosCollection, {
        task,
        completed: false,
        userId: user.uid,
        priority: selectedPriority,
        date: selectedDate,
        time,
        location: taskLocation,
        travelTime,
        distance,
      });
      console.log("Todo added!");
      fetchTodos();
      onClose();
    }else{
         console.warn("User is missing, cannot add todo");
    }

  };

  if (!visible) return null;

  return (

    <View style={styles.overlay}>
      <View style={styles.modal}>
        <TextInput placeholder="New Task" value={task} onChangeText={setTask} style={styles.input} />
        <TextInput placeholder="Time" value={time} onChangeText={setTime} style={styles.input} />
        <TextInput placeholder="Location" value={taskLocation} onChangeText={setTaskLocation} style={styles.input} />
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{ [selectedDate]: { selected: true, selectedColor: 'blue' } }}
        />
        <Picker selectedValue={selectedPriority} onValueChange={(v) => setSelectedPriority(v)} style={styles.picker}>
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="High" value="High" />
        </Picker>

        <GooglePlacesAutocomplete
              placeholder="Search location"
              fetchDetails={true}
              onPress={(data, details = null) => {
                const address = data.description;
                const lat = details?.geometry?.location?.lat;
                const lng = details?.geometry?.location?.lng;

                setTaskLocation(address); // Save the address string
                console.log("Selected location:", address);
                // Optionally: save lat/lng from details.geometry.location
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: 'en',
              }}
              styles={{
                textInput: {
                  height: 44,
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  backgroundColor: '#fff',
                  marginBottom: 10,
                },
                listView: {
                  backgroundColor: '#fff',
                },
              }}
              enablePoweredByContainer={false}
            />

        <TouchableOpacity onPress={addTodo} style={styles.button}><Text>Add Event</Text></TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: 'red' }]}><Text>Cancel</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
      },
      android: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
      }
    })
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10
  },
  picker: {
    height: 100,
    width: '100%'
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    borderRadius: 10
  }
});
