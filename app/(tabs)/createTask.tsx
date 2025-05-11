import { StyleSheet, TextInput, FlatList, TouchableOpacity,SafeAreaView, Modal,Platform,ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from 'react';
// project db and firestore imported from FirebaseConfig 
import { db } from '../../FirebaseConfig';
// tools imported from firebase/firestore and firebase/auth 
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams }  from 'expo-router';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Location from 'expo-location';
import { Title } from 'react-native-paper';
import {View, Text} from '../../components/Themed'

interface SelectedLocation {
    formatted_address: string;
    description: string;
    // ... other properties you need from Google Places API
};

interface Prediction {
    description: string;
};

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

export default function CreateTask() {
    //Paramaters from Task.tsx routed to this page
    const params = useLocalSearchParams();
    const isEdit = params.isEdit === 'true' ? true : false;
    const getParam = (key: keyof typeof params, fallback: string) => 
                    isEdit ? (params[key] as string) : fallback;
    const {refresh2} = useLocalSearchParams();
    //Initialize the Items variables 
    const [task, setTask] = useState<string>();
    const [selectedPriority, setSelectedPriority] = useState<string>();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10)); // Initialize with today's date (YYYY-MM-DD)
    const [time, setTime] = useState<string>();
    const [taskLocation, setTaskLocation] = useState<string>();
    const [travelTime, setTravelTime] = useState<string>();
    const [distance, setDistance] = useState<string>();

    const [todos, setTodos] = useState<any>([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const todosCollection = collection(db, 'todos');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    //const for location services
    const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Prediction[]>([]);
    const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //information icon
    const [infoModalVisible, setInfoModalVisible] = useState(false); // Modal for task info
    const [selectedTodoInfo, setSelectedTodoInfo] = useState<TodoItem | null>(null); // Selected todo for info modal

    //Fetches data from database
    const fetchTodos = async () => {
        if (user) {
          const q = query(todosCollection, where("userId", "==", user.uid));
          const data = await getDocs(q);
          setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id,  priority: doc.data().priority || 'Low'})));
        } else {
          console.log("No user logged in");
        }
    };

    //formatting the date
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    //adds task to databse
    const addTodo = async () => {
    if (user) {
        await addDoc(todosCollection, {
            task: task, 
            completed: false,
            userId: user.uid,
            priority: selectedPriority,
            date: selectedDate,
            time: time,
            location: taskLocation,
            travelTime: travelTime,
            distance: distance,
        });
        //after adding it resets the input fields to empty
        setTask('');
        setSelectedPriority('')
        setSelectedDate('');
        setTime('');
        setTaskLocation('');
        setTravelTime('');
        setDistance('');
        fetchTodos();
    } else {
        console.log("No user logged in");
        fetchTodos();
    
    }};

    const handleSearch = async (text: string) => {
    setTaskLocation(text); // Update taskLocation immediately
    if (text.length > 2) {
        try {
            const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY; //Move this line.
            console.log("API KEY inside handleSearch:", GOOGLE_MAPS_API_KEY);
            let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_MAPS_API_KEY}`;
            if (userLocation) {
                url += `&location=${userLocation.latitude},${userLocation.longitude}&radius=20000`;
            }
            console.log("API URL:", url); // Debugging: Check the URL
            const response = await fetch(url);
            const data = await response.json();
            console.log("API Response:", data); // Debugging: Check the response

            if (data.predictions) {
                setPredictions(data.predictions);
                setShowPredictions(true);
            } else {
                setPredictions([]);
                setShowPredictions(false);
            }
        } catch (error) {
            console.error('Error fetching autocomplete predictions:', error);
            console.log("Api Error:", error);
            setPredictions([]);
            setShowPredictions(false);
        }
    } else {
        setPredictions([]);
        setShowPredictions(false);
    }
    };

    const calculateDirections = async () => {
        if (!userLocation || !taskLocation) return;
            try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${taskLocation}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const leg = route.legs[0];
                setTravelTime(leg.duration.text);
                setDistance(leg.distance.text);
            } else {
                setTravelTime('Directions not found');
                setDistance('Directions not found');
            }
            } catch (error) {
            console.error('Error calculating directions:', error);
            setTravelTime('Error calculating directions');
            setDistance('Error calculating directions');
            }
        };
    
    const selectPrediction = (prediction: Prediction) => {
        setTaskLocation(prediction.description);
        setPredictions([]);
        setShowPredictions(false);
    };
    // Closes the createtask menu and saves task to firebase
    const AddandClose = async (isEdit:Boolean) => {
        console.log("AddandClose function called");
        console.log("Edit is:", isEdit);
        if (isEdit === true) {
            const todoDoc = doc(db, 'todos', params.id as string);
            console.log("Opened todoDoc");
            await updateDoc(todoDoc, {
                task: task || params.task,
                priority: selectedPriority || params.priority,
                date: selectedDate || params.date,
                time: time || params.time,
                location: taskLocation || params.location,
                travelTime: travelTime || params.travelTime,
                distance: distance || params.distance,
            });
            console.log("Task updated successfully"); 
            await router.back()
            //await router.replace('/task?refresh=true') 
        } 
        else {
            // close file and move to task.tsx and refresh screen when routed back
            console.log("Created new task :", task);
            await addTodo();
            await router.back()
            //await router.replace('/task?refresh=true') 
        }
            setTask('');
            setSelectedPriority('');
            setSelectedDate('');
            setTime('');
            setTaskLocation('');
            setTravelTime('');
            setDistance('');
            setShowCalendar(false);
            console.log("Exited created task")
    };
    // Resets the input text to be empty and routes back to task.tsx
    const cancelFeature = async () => {
        setTask('');
        setSelectedPriority('');
        setSelectedDate('');
        setTime('');
        setTaskLocation('');
        setTravelTime('');
        setDistance('');
        setShowCalendar(false);
        console.log("Canceled created task")
        router.back();
    }
    

return(
    <SafeAreaView style={{flex:1}}>
        <View style={styles.TitleContainer}>
            <Text style={styles.mainTitle}>
            {isEdit? 'Editing Task': 'Creating Task'}</Text>
        </View>
    <View style={styles.menuContainer}>
        <View style={styles.tasktitle}>
            <Text style={{fontWeight:'bold'}}>Task: {params.task}</Text>
                <TextInput
                    placeholder={isEdit? "New task": "Enter Task"}
                    value={task}
                    onChangeText={(text) => setTask(text)}
                    style={styles.input}
                    editable={true}
                    maxLength={40}/>    
        </View>
        {/* time input  */}
        <View style={styles.tasktitle}>
            <Text style={{fontWeight:'bold'}}>Time: {params.time}</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <TextInput
                        placeholder="Time (e.g., 10:30 AM)"
                        value={time}
                        onChangeText={setTime}
                        style={styles.dateinput}
                        //autoFocus={true}
                        editable={true}
                        pointerEvents='none'/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationButton} onPress={() => setTime('')}>
                  <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                onConfirm={(time) => {setTime(time.toLocaleTimeString('en-US',{hour:'numeric', minute:'2-digit',}));setShowTimePicker(false)}} // Set the time as a string and close the picker
                mode={'time'}
                //date= {new Date()} // Set the initial date to the current time
                display='spinner' // Use the default display for the date picker
                onCancel={() => setShowTimePicker(false)}
                isVisible={showTimePicker} // Use the state to control visibility of the date picker
                />
        </View>
         {/* Locaiton services */}
          <View style={styles.tasktitle}>
          <Text style={{fontWeight:'bold'}}>Location: {params.location}</Text>
            <TextInput
                placeholder="Location"
                value={taskLocation}
                onChangeText={handleSearch} // search for a location 
                style={styles.input}
                />
              <TouchableOpacity style={styles.locationButton} onPress={calculateDirections}>
                  <Text style={styles.buttonText}>Get Directions</Text>
              </TouchableOpacity>
          </View>
          {/*Date assigned*/}
          <View style={styles.tasktitle}>
          <Text style={{fontWeight:'bold'}}>Date: {params.date}</Text>
              <TouchableOpacity onPress={() => setShowCalendar(true)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Date: (YYYY-MM-DD)"
                    value={selectedDate}
                    editable={true} // Make the TextInput read-only
                    pointerEvents='none' // Disable interaction with the TextInput
                      />
              </TouchableOpacity>
              <TouchableOpacity style={styles.locationButton} onPress={() => setSelectedDate('')}>
                  <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                testID="dateTimePicker"
                onConfirm={(date) => {
                    const agendaDate = formatDate(date);
                    setSelectedDate(agendaDate);setShowCalendar(false)}} // Set the date and close the picker
                mode={'date'}
                //date = {new Date()} // Set the initial date to the current date
                display="inline" // Use the default display for the date picker
                onCancel={() => setShowCalendar(false)}
                isVisible={showCalendar} // Use the state to control visibility of the date picker
                />

          </View>
          {/* Priority Picker */}
        <View style={styles.tasktitle}>
            <Text style={{fontWeight:'bold'}}>Priority: {params.priority}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <TextInput
                    style={styles.input}
                    placeholder="Priority lvl"
                    value={selectedPriority}
                    autoFocus={true}
                    editable={true} // Make the TextInput read-only
                    pointerEvents='none' // Disable interaction with the TextInput
                    />
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={{flex:1, justifyContent:'center', alignItems:'center',backgroundColor: 'rgba(0,0,0,0,3)',marginTop: 10}}>
                    <View style={styles.priorityModal}>
                        <Picker
                            selectedValue={selectedPriority} // Bind to newEventPriority
                            onValueChange={(itemValue) => {setSelectedPriority(itemValue);setModalVisible(false)}}
                            mode="dropdown"
                            style={{ height: 150, width: 200 }}>
                            <Picker.Item label="Low" value="Low" />
                            <Picker.Item label="Medium" value="Medium" />
                            <Picker.Item label="High" value="High" />
                        </Picker>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', color: 'red' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.locationButton} onPress={() => setSelectedPriority('')}>
                  <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
        </View>
          {showPredictions && (
          <FlatList
              data={predictions}
                renderItem={({ item }: { item: Prediction }) => (
                  <TouchableOpacity style={styles.predictionItem} onPress={() => selectPrediction(item)}>
                      <Text>{item.description}</Text>
                  </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.predictionsList}
          />
          )}
         {/* changes to save when edit is true*/}
        <TouchableOpacity style={styles.addButton} onPress={() => AddandClose(isEdit)}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => cancelFeature()}>
            <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
)}


const styles = StyleSheet.create({
    menuContainer: {
        backgroundColor: 'auto',
        padding: 20, // Adjust padding as needed
        height: '60%',    // Take full height (you might not need this since top/bottom are 0)
        alignItems: 'flex-start', // Align content to the left
        flex: 1,
    },
    TitleContainer:{
        flexShrink: 1,
        alignItems: 'center',
        marginBottom: 2,
        padding: 20,
        backgroundColor:'auto'
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#1A237E',
        backgroundColor:'auto'
      },
    tasktitle: {
        alignItems: 'flex-start',
        width: '100%',
        backgroundColor:'auto'
    },
    inputContainer: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 0,
        color:'auto'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginRight: 7, // Add margin to separate input and button
        marginBottom: 10, // Add margin to separate input and list
        borderRadius: 10,
        minHeight: 20,
        width: 350,
        marginVertical: 10,
        fontSize: 16,
        

    },
    dateinput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginRight: 7, // Add margin to separate input and button
        marginBottom: 10, // Add margin to separate input and list
        borderRadius: 10,
        minHeight: 20,
        width: 350,
        marginVertical: 10,
        fontSize: 16,
        

    },
    locationButton: {
        padding: 7,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5C6BC0',
        marginLeft: 0,
        marginBottom: 8, // Add margin to separate input and list
    },
    priorityModal:{
        margin:20,
        backgroundColor:'white',
        borderRadius:20,
        padding: 30, 
        alignItems:'center',
        justifyContent:'space-evenly',
        borderTopLeftRadius:30, 
        borderTopRightRadius:30,
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        shadowColor:'#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    addButton: {
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFA277', // Use a distinct color for the add button
        shadowColor: '#FFA726',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 30,
    },
    button: {
        padding: 7,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5C6BC0',
        shadowColor: '#5C6BC0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
        marginLeft: 3,
    },
    predictionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    predictionsList: {
        position: 'absolute',
        top: 50, // Adjust as needed
        left: 0,
        right: 0,
        backgroundColor: 'white',
        zIndex: 100,
        maxHeight: 200,
    },


});