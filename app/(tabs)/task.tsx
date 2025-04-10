import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Modal,Platform,ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from 'react';
// project db and firestore imported from FirebaseConfig 
import { db } from '../../FirebaseConfig';
// tools imported from firebase/firestore and firebase/auth 
import { Picker } from '@react-native-picker/picker';
import { router }  from 'expo-router';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Location from 'expo-location';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  //GoogleLocationDetailResult,
  //GoogleLocationResult,
} from 'react-native-google-autocomplete';



const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

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

export default function TabTwoScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const todosCollection = collection(db, 'todos');
  const [priority,setPriority] = useState('Low');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState("Low");
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Initialize with today's date (YYYY-MM-DD)
    const [showCalendar, setShowCalendar] = useState(true);
    const [time, setTime] = useState('');
    //const for location services
    const [taskLocation, setTaskLocation] = useState('');
    const [travelTime, setTravelTime] = useState('');
    const [distance, setDistance] = useState('');
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

    //edit button 
    const [editMode, setEditMode] = useState(false);
    const handleEdit = (item: TodoItem) => {
    setTask(item.task);
    setSelectedPriority(item.priority);
    setSelectedDate(item.date);
    setTime(item.time);
    setTaskLocation(item.location);
    setTravelTime(item.travelTime);
    setDistance(item.distance);
    setSelectedTodoInfo(item);
    setShowCalendar(true);
    setMenuVisible(true);
    setInfoModalVisible(false);
    setEditMode(true);
    };



  useEffect(() => {
    fetchTodos();
     (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setHasLocationPermission(false);
                return;
            }
            setHasLocationPermission(true);
            let locationData = await Location.getCurrentPositionAsync({});
            setUserLocation(locationData.coords);
        })();
  }, [user]);

  const fetchTodos = async () => {
    if (user) {
      const q = query(todosCollection, where("userId", "==", user.uid));
      const data = await getDocs(q);
      setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id,  priority: doc.data().priority || 'Low'})));
    } else {
      console.log("No user logged in");
    }
  };


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
                `https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation.latitude},${userLocation.longitude}&destination=${taskLocation}&key=${GOOGLE_MAPS_API_KEY}`
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

const handleSelectLocation = async (placeId: string) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.result) {
                setSelectedLocation(data.result);
                setSearchQuery(data.result.formatted_address);
                setSearchResults([]);
                setShowSearchResults(false);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    const selectPrediction = (prediction: Prediction) => {
        setTaskLocation(prediction.description);
        setPredictions([]);
        setShowPredictions(false);
    };

  const addTodo = async () => {
    if (user) {
        await addDoc(todosCollection, {
            task, completed: false,
            userId: user.uid,
            priority: selectedPriority,
            date: selectedDate,
            time: time,
            location: taskLocation,
            travelTime: travelTime,
            distance: distance,
        });
      setTask('');
        setSelectedPriority('low')
        setSelectedDate(new Date().toISOString().slice(0, 10));
        setTime('');
        setTaskLocation('');
        setTravelTime('');
        setDistance('');
      fetchTodos();
    } else {
      console.log("No user logged in");
      fetchTodos();
    
  };

  const updateTodo = async (id: string, completed: any) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    const todoDoc = doc(db, 'todos', id);
    await deleteDoc(todoDoc);
    fetchTodos();
  };

  //change priority 
    const updatePriority = async (id: string, setEventPriority: string) => {
        try {
            const todoDoc = doc(db, 'todos', id);
            await updateDoc(todoDoc, { priority: setEventPriority });
            fetchTodos(); // Refresh the list to show updated priority
        } catch (error) {
            console.error("Error updating priority:", error);
        }
    };
    //open menu
    const toggleMenu = () => {
        console.log("Toggling menu visibility from:", menuVisible);
        setMenuVisible(prevState => !prevState);
    };

    const AddandClose = async (isEdit = false, id = null) => {
        if (isEdit && id) {
        // Update existing task
        const todoDoc = doc(db, 'todos', id);
        await updateDoc(todoDoc, {
            task,
            priority: selectedPriority,
            date: selectedDate,
            time: time,
            location: taskLocation,
            travelTime: travelTime,
            distance: distance,
        });
        fetchTodos();
    } else {
        await addTodo(); // Call your addTodo function
        }
        setTask('');
        setSelectedPriority('Low');
        setSelectedDate(new Date().toISOString().slice(0, 10));
        setTime('');
        setTaskLocation('');
        setTravelTime('');
        setDistance('');
        setShowCalendar(false);
        setShowCalendar(false);
        toggleMenu(); // Call your toggleMenu function
    };

    //date selection
    const onDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString); // Update selectedDate with the YYYY-MM-DD string
        setShowCalendar(false); // Hide the calendar after selection
    };

    //view info 
    const showTodoDetails = (item: TodoItem) => {
    setSelectedTodoInfo(item);
    setInfoModalVisible(true);
};

const hideTodoDetails = () => {
    setInfoModalVisible(false);
    setSelectedTodoInfo(null);
};

    
  return (
      <SafeAreaView style={styles.safeArea}>
            
              <View>
                  <TouchableOpacity
                      style={styles.add_event_button}
                      onPress={() => {
                                
                              toggleMenu();// Ensure toggleMenu function is defined to handle this logic
                               setShowCalendar(!showCalendar);
                          }}
                  >
                      <Text style={styles.buttonText}>Create Event</Text> 
          </TouchableOpacity>
          </View>
          {menuVisible && (
              <View style={styles.menuContainer}>
                  <View style={styles.inputContainer}>
                  <TextInput
                      placeholder="New Task"
                      value={task}
                      onChangeText={(text) => setTask(text)}
                      style={styles.input}
                      />
                  </View>
                  
                  {/* time input  */}
                  <View style={styles.inputContainer}>
                      <TextInput
                          placeholder="Time (e.g., 10:30 AM)"
                          value={time}
                          onChangeText={setTime}
                          style={styles.input}
                      />
                  </View>
                
                  {/* Calendar view in create event  */}
                  <View>
                  {showCalendar && (
                      <Calendar
                          onDayPress={onDayPress}
                          style={styles.calendar}
                          markedDates={{
                              [selectedDate]: { selected: true, selectedColor: 'blue' }, // Mark the selected date
                          }}
                          theme={{
                              todayTextColor: 'red',
                              dayTextColor: 'black',
                              monthTextColor: 'blue',
   
                          }}
                      />
                      )}
                  </View>
                  {/* Priority Picker */}
                  <View>
                      <Picker
                          selectedValue={selectedPriority} // Bind to newEventPriority
                          onValueChange={(itemValue) => setSelectedPriority(itemValue)}
                          style={{ height: 150, width: 200 }}
                      >
                          <Picker.Item label="Low" value="Low" />
                          <Picker.Item label="Medium" value="Medium" />
                          <Picker.Item label="High" value="High" />
                          </Picker>
                  </View>
                   {/* Locaiton services */}
                  <View style={styles.inputContainer}>
                      <TextInput
                          placeholder="Task Location"
                          value={taskLocation}
                          onChangeText={handleSearch} // search for a location 
                          style={styles.input}
                          />
                        <TouchableOpacity style={styles.locationButton} onPress={calculateDirections}>
                            <Text style={styles.buttonText}>Get Directions</Text>
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
                     {/* add, cancel and close buttons */}
                  <TouchableOpacity style={styles.addButton} onPress={() => AddandClose(false, null)}>
                      <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                   {/* changes to save when edit is true*/}
                  <TouchableOpacity style={styles.addButton} onPress={() => AddandClose(true, selectedTodoInfo?.id)}>
                      <Text style={styles.buttonText}>Save</Text>
                   </TouchableOpacity>
                  <TouchableOpacity 
                      style={styles.button} 
                      onPress={() => {
                                
                              toggleMenu();// Ensure toggleMenu function is defined to handle this logic
                               setShowCalendar(false);
                          }}
                  >r
                      <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
              </View>
          )}

      <View style={styles.container}>
              <Text style={styles.mainTitle}>Todo List</Text>
        <View style={styles.inputContainer}>
        </View>

        <FlatList
          data={todos}
          renderItem={({ item }) => (
              <View style={styles.todoContainer}>

              <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none', flex: 1 }}>{item.task}</Text>

                <TouchableOpacity onPress={() => showTodoDetails(item)}>
                    <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleEdit(item)}>
                    <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => updateTodo(item.id, item.completed)}>
                <Text style={styles.buttonText}>{item.completed ? "Undo" : "Complete"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
               <AntDesign name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>

          )}
          keyExtractor={(item) => item.id}
              />
        <Modal
            animationType="slide"
            transparent={true}
            visible={infoModalVisible}
            onRequestClose={hideTodoDetails}
        >
            <View style={styles.centeredView}>
                <View style={styles.infoView}>
                    {selectedTodoInfo && (
                        <>
                            <Text style={styles.infoText}>Task: {selectedTodoInfo.task}</Text>
                            <Text style={styles.infoText}>Priority: {selectedTodoInfo.priority}</Text>
                            <Text style={styles.infoText}>Travel Time: {selectedTodoInfo.travelTime}</Text>
                            <Text style={styles.infoText}>Date: {selectedTodoInfo.date}</Text>
                        </>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={hideTodoDetails}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </Modal>

        {/* opens up priority menu */ }
        <Modal visible={modalVisible} animationType="slide" transparent={false} > 
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Priority</Text>

            {/* Save Button */}
            <TouchableOpacity 
              style={[styles.button, {marginTop:50}]} 
              onPress={() => {
                if (selectedTaskId) updatePriority(selectedTaskId, selectedPriority);
                setModalVisible(false); // Close the modal
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: 'red', marginTop: 60 }]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
              </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10, // Adjust spacing as needed
    color: '#333', // Choose a color that fits your app theme
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    flex: 1, // Adjusted to take available space
    marginRight: 10, // Add margin to separate input and button
    marginBottom: 10, // Add margin to separate input and list
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
  },
  PriButton: {
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
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
      width: 300,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      height: 300,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  todoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
    width: '100%',
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
    add_event_button: {
        padding: 7,
        borderRadius: 18,
        marginLeft: 4,
        margin: 5,
        bottom: -690,
        alignItems: 'center',
        backgroundColor: '#CBC3E3',
    },
    add_date_button: {
        padding: 7,
        borderRadius: 18,
        marginLeft: 4,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#CBC3E3',
    },
     menuContainer: {
         backgroundColor: 'white',
         padding: 20, // Adjust padding as needed
         // Remove borderWidth and borderColor if you don't want them
         // borderWidth: 1,
         // borderColor: '#ccc',
         borderRadius: 0, // Or keep a small radius if desired
         position: 'absolute', // Important for full-screen
         top: 0,          // Top edge of the screen
         left: 0,         // Left edge of the screen
         right: 0,        // Right edge of the screen
         bottom: 0,       // Bottom edge of the screen
         width: '100%',     // Take full width (you might not need this since left/right are 0)
         height: '100%',    // Take full height (you might not need this since top/bottom are 0)
         zIndex: 1000,      // Ensure it's on top
         justifyContent: 'center', // Center content vertically
         alignItems: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
        width: '100%',
    },
        select_date_button: {
        padding: 7,
        borderRadius: 18,
        marginLeft: 4,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#CBC3E3',
    },
    calendar: {
        width: 300, // Adjust width as needed
        marginTop: 10,
    },
    locationButton: {
        padding: 7,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5C6BC0',
        marginLeft: 3,
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
    predictionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    infoView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    infoText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

}