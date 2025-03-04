import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Modal,Platform,ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { router }  from 'expo-router';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Calendar } from 'react-native-calendars';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = '';

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

    const [taskLocation, setTaskLocation] = useState('');
    const [travelTime, setTravelTime] = useState('');
    const [distance, setDistance] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [showPredictions, setShowPredictions] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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

  const handleSearch = async (text) => {
        setSearchQuery(text);
        if (text.length > 2) {
            try {
                let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_MAPS_API_KEY}`;
                if (userLocation) {
                    url += `&location=${userLocation.latitude},${userLocation.longitude}&radius=20000`;
                }
                const response = await fetch(url);
                const data = await response.json();
                if (data.predictions) {
                    setSearchResults(data.predictions);
                    setShowSearchResults(true);
                } else {
                    setSearchResults([]);
                    setShowSearchResults(false);
                }
            } catch (error) {
                console.error('Error fetching autocomplete predictions:', error);
                setSearchResults([]);
                setShowSearchResults(false);
            }
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
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

const handleSelectLocation = async (placeId) => {
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

    const selectPrediction = (prediction) => {
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
    }
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

    const AddandClose = () => {
        addTodo(); // Call your addTodo function
        setShowCalendar(false);
        toggleMenu(); // Call your toggleMenu function
    };

    //date selection
    const onDayPress = (day) => {
        setSelectedDate(day.dateString); // Update selectedDate with the YYYY-MM-DD string
        setShowCalendar(false); // Hide the calendar after selection
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

                 
                  <View style={styles.inputContainer}>
                      <TextInput
                          placeholder="Time (e.g., 10:30 AM)"
                          value={time}
                          onChangeText={setTime}
                          style={styles.input}
                      />
                  </View>
                
                 
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

                  <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Task Location"
                            value={taskLocation}
                            onChangeText={setTaskLocation}
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.locationButton} onPress={calculateDirections}>
                            <Text style={styles.buttonText}>Get Directions</Text>
                        </TouchableOpacity>
                    </View>
                    {showPredictions && (
                    <FlatList
                        data={predictions}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.predictionItem} onPress={() => selectPrediction(item)}>
                                <Text>{item.description}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.predictionsList}
                    />
                    )}

                  <TouchableOpacity style={styles.addButton} onPress={AddandClose}>
                      <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                      style={styles.button} 
                      onPress={() => {
                                
                              toggleMenu();// Ensure toggleMenu function is defined to handle this logic
                               setShowCalendar(false);
                          }}
                  >
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
                  <Text style={{ fontSize: 12, color: '#666', flex: 0.5 }}>Priority: {item.priority}</Text>
                  <Text style={{ fontSize: 12, color: '#666', flex: 0.5 }}>
                  <Text style={{ fontSize: 12, color: '#666', flex: 0.5 }}>Travel Time: {item.travelTime}</Text>
                      Date: {item.date} {/* Display the date (already in YYYY-MM-DD format) */}
                  </Text>
              <TouchableOpacity style={styles.button} onPress={() => updateTodo(item.id, item.completed)}>
                <Text style={styles.buttonText}>{item.completed ? "Undo" : "Complete"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => deleteTodo(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>

          )}
          keyExtractor={(item) => item.id}
              />

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

});
