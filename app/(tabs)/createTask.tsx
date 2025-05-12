import { StyleSheet, TextInput, FlatList, TouchableOpacity,SafeAreaView, Modal,Platform,ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams }  from 'expo-router';
import { collection, addDoc, getDocs, updateDoc, setDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Location from 'expo-location';
import {View, Text} from '../../components/Themed'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
//import CreateEventModal from '../../components/CreateEventModal';

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
    //Initialize the Items variables 
    const [task, setTask] = useState<string>();
    const [selectedPriority, setSelectedPriority] = useState<string>();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10)); // Initialize with today's date (YYYY-MM-DD)
    const [time, setTime] = useState<string>();
    const [taskLocation, setTaskLocation] = useState<string>();
    const [searchText, setSearchText] = useState<string>('');
    const [travelTime, setTravelTime] = useState<string>();
    const [distance, setDistance] = useState<string>();
    const [todos, setTodos] = useState<any>([]);
    const auth = getAuth();
    const user = auth.currentUser;
    const todosCollection = collection(db, 'todos');
    const [modalVisible, setModalVisible] = useState(false);

    //const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const GOOGLE_MAPS_API_KEY = "";

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

        //Create notification for the task
        const tempid = Date.now().toString();
        const docRef = doc(collection(db, 'notifications'), tempid);
            var data = {
                id: tempid,
                message: task,
                read: false,
                userId: auth.currentUser?.uid,
                time: time
            }
        await setDoc(docRef, data);
        
    } else {
        console.log("No user logged in");
        fetchTodos();
    
    }};

    // Closes the createtask menu and saves task to firebase
    const AddandClose = async (isEdit: Boolean) => {
        console.log("AddandClose function called");
        console.log("Edit is:", isEdit);
        if (isEdit === true) {
            if (params.id) { // Ensure the id parameter is present
                console.log("Editing task with ID:", params.id);
                const todoDoc = doc(db, 'todos', params.id as string); // Use params.id for the document reference
                console.log("Opened todoDoc with ID:", params.id);
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
            } else {
                console.error("Error: Task ID is missing for editing.");
            }
        } else {
            console.log("Created new task:", task);
            await addTodo();
        }
        // Reset fields
        setTask('');
        setSelectedPriority('');
        setSelectedDate('');
        setTime('');
        setTaskLocation('');
        setSearchText('');
        setTravelTime('');
        setDistance('');
        setShowCalendar(false);
        console.log("Exited created task");
        await router.back();
    };
    // Resets the input text to be empty and routes back to task.tsx
    const cancelFeature = async () => {
        setTask('');
        setSelectedPriority('');
        setSelectedDate('');
        setTime('');
        setTaskLocation('');
        setSearchText('');
        setTravelTime('');
        setDistance('');
        setShowCalendar(false);
        console.log("Canceled created task")
        router.back();
    }
    
    const GooglePlacesInput = () => {
        return (
            //<View style={styles.LocateContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Search location"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        console.log("Selected data:", data);
                        console.log("Selected details:", details);
                        if (details) {
                            const address = data.description;
                            const lat = details.geometry.location.lat;
                            const lng = details.geometry.location.lng;
                            setTaskLocation(address);
                            setSearchText(address);
                            //setTaskLocation(`📍 ${address}\n🗺️ Lat: ${lat}, Lng: ${lng}`);
                            console.log("Selected Location:", address, lat, lng);
                        } else {
                            console.error("Details not available for the selected location.");
                        }
                    }}
                    query={{
                        key: GOOGLE_MAPS_API_KEY,
                        language: 'en',
                    }}
                    styles={{
                        
                        //container: styles.LocateContainer,
                        textInputContainer: styles.inputContainer, // Match the input container style
                        textInput: styles.Locationinput, // Match the input style
                        listView: styles.autocompleteListView, // Style the dropdown
                    }}
                    textInputProps={{
                        //pointerEvents: 'box-none', // Disable interaction with the TextInput
                        //value: searchText,
                        //onChangeText: (text) => setSearchText(text),
                        editable: true,
                    }}
                    onFail={(error) => {
                        console.log("Autocomplete error", error);
                    }}
                    enablePoweredByContainer={false}
                    debounce={200} // Add debounce to reduce API calls
                    minLength={2} // Minimum characters before triggering search
                />
            //</View>
        );
    };
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
            <Text style={{fontWeight:'bold',marginBottom:10}}>Location: {params.location}</Text>
            <TextInput
                style={styles.input}
                placeholder="Your location:"
                value={searchText}
                editable={false} // Make the TextInput read-only
                pointerEvents='none' // Disable interaction with the TextInput
                    />
            <View style={styles.inputContainer}>
                <GooglePlacesInput/>  
            </View>   
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
        height: 40,
        borderWidth: 0,
        borderRadius: 10,
        marginRight:0,
        marginBottom: 20, // Add margin to separate input and button
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        width: 360,
        padding: 0,
        color:'auto',
        backgroundColor: '',
        borderColor: 'gray',
        //zIndex: 9999,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginTop:10,
        marginRight: 7, // Add margin to separate input and button
        marginBottom: 20, // Add margin to separate input and list
        borderRadius: 10,
        minHeight: 20,
        width: 350,
        marginVertical: 10,
        fontSize: 16,
    },
    Locationinput: {
        height: 40,
        width: 350, // Fixed width
        borderColor: 'gray',
        borderWidth: 1,
        padding: 0,
        marginRight: 7, // Add margin to separate input and button
        marginBottom: 0, // Add margin to separate input and list
        borderRadius: 10,
        marginVertical: 10,
        fontSize: 16,
        gap:10,
        backgroundColor: '',
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
    LocateContainer: {
        position: 'relative',
        //zIndex: 9999,
        flex: 1,
        //paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 0,
        backgroundColor: '',
        marginBottom: 0, // Add margin to separate input and list
    },
    listView: {
        backgroundColor: '#fff',
        width: 350,
    },
    result: {
        backgroundColor: '',
        width: 350,
        marginTop: 20,
        fontSize: 16
    },
    autocompleteListView: {
        position: 'absolute',
        backgroundColor: '',
        borderWidth: 0.4,
        borderColor: 'gray',
        borderRadius: 10,
        marginTop: 10,
        top: 50, // Adjust as needed
        maxHeight: 200, // Limit the height of the dropdown
        overflow: 'hidden', // Ensure content doesn't overflow
        width: 362, // Match the width of the input
        zIndex: 999, // Ensure dropdown appears above other elements
    }


});