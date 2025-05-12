import { StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Modal,Platform,ActivityIndicator} from 'react-native';
import React, { useState, useEffect , useCallback} from 'react';
import { db } from '../../FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams, useFocusEffect }  from 'expo-router';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesome6, Ionicons, MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSearchParams } from 'expo-router/build/hooks';
import {Colors} from '../../constants/Colors'
import {View, Text} from '../../components/Themed'
import { StatusBar } from 'expo-status-bar';
import AddButton from "../../components/ui/AddButton"

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
interface isEdit {
    isEdit: boolean;
}
export default function TabTwoScreen() {
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState<any>([]);
    const {refresh} = useLocalSearchParams();
    const auth = getAuth();
    const user = auth.currentUser;
    const todosCollection = collection(db, 'todos');
    //information icon
    const [infoModalVisible, setInfoModalVisible] = useState(false); // Modal for task info
    const [selectedTodoInfo, setSelectedTodoInfo] = useState<TodoItem | null>(null); // Selected todo for info modal

    //Routes to creattask file with autofill information of task
    const handleEdit = async (item:TodoItem) => {
        router.push({
            pathname: '/createTask',
            params: {
                id: item.id,
                task: item.task,
                priority: item.priority,
                date: item.date,
                time: item.time,
                location: item.location,
                travelTime: item.travelTime,
                distance: item.distance,
                isEdit: 'true',
            },
        });
        console.log('Task closed, opened createTask to edit');
    };
    //Refresh the screen
    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchTodos();
            }
        }, [user])
    );


    const fetchTodos = async () => {
        if (user) {
            const q = query(todosCollection, where("userId", "==", user.uid));
            const data = await getDocs(q);
            setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id,  priority: doc.data().priority || 'Low'})));
            
        } 
        else {
            console.log("No user logged in");
        }
    };

    //Updates Item
    const updateTodo = async (id: string, completed: any) => {
        const todoDoc = doc(db, 'todos', id);
        await updateDoc(todoDoc, { completed: !completed });
        const data = (await getDoc(todoDoc)).data();
        if (!data) {
            console.log('No such document!');
            return;
        }
        if (completed) {
            if (data.hasOwnProperty('tasksCompleted')) {
                await updateDoc(todoDoc, { tasksCompleted: data.tasksCompleted + 1 });
            }
            else {
                await updateDoc(todoDoc, { tasksCompleted: 1 });
            }
        }

        fetchTodos();
    };

    //Deletes the Item
    const deleteTodo = async (id: string) => {
        const todoDoc = doc(db, 'todos', id);
        await deleteDoc(todoDoc);
        fetchTodos();
        console.log('deleted task ID: ' + id)
    };

    //Routes to createTask file
    const toggleMenu = async () => {
        try {
            await router.push("/createTask");
            console.log('Task closed, opened createTask');
        }
        catch (error: any) {
            console.log(error);
            alert('Toggling menu failed: ' + error.message);
        }
    };

    //open info modal 
    const showTodoDetails = (item: TodoItem): void => {
    setSelectedTodoInfo(item);
    setInfoModalVisible(true);
    };

    //close info modal
    const hideTodoDetails = () => {
        setInfoModalVisible(false);
        setSelectedTodoInfo(null);
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto"/>
        <View style={styles.container}>
            <Text style={styles.mainTitle}>Todo List</Text>
            <View style={styles.inputContainer}/>
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
                transparent={true} // Ensure this is set to true
                visible={infoModalVisible}
                onRequestClose={hideTodoDetails}>
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
        </View>
        <AddButton
            title="test"
            onPress= {(toggleMenu)}/>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor:'auto',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10, // Adjust spacing as needed
        color: '#333', // Choose a color that fits your app theme
    },
    inputContainer: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 0,
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
        backgroundColor:'auto',
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
        width:"100%",
        padding: 10,
        borderRadius: 18,
        marginLeft: 4,
        alignItems: 'center',
        backgroundColor: '#CBC3E3',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.0)', // Add semi-transparent background
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
