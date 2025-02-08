import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Modal} from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { router }  from 'expo-router';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

  useEffect(() => {
    fetchTodos();
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

  const addTodo = async () => {
    if (user) {
      router.replace('/(tabs)/create_task');
      //await addDoc(todosCollection, { task, completed: false, userId: user.uid ,priority});
      //setTask('');
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

  const updatePriority = async (id: string, newPriority: string) => {
    try {
      const todoDoc = doc(db, 'todos', id);
      await updateDoc(todoDoc, { priority: newPriority });
      fetchTodos(); // Refresh the list to show updated priority
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Todo List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Task"
            value={task}
            onChangeText={(text) => setTask(text)}
            style={styles.input}
          />

          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <View style={styles.todoContainer}>
              <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none', flex: 1 }}>{item.task}</Text>
              <Text style={{ fontSize: 12, color: '#666',flex: 0.5}}>Priority: {item.priority}</Text>
              <TouchableOpacity 
              style={styles.PriButton} 
              onPress={() => {
                setSelectedTaskId(item.id); // Store the task ID
                setSelectedPriority(item.priority); // Set current priority
                setModalVisible(true); // Show modal
              }}
            >
              <Text style={styles.buttonText}>Change Priority</Text>
            </TouchableOpacity>
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
        <Modal visible={modalVisible} animationType="slide" transparent={false} > 
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Select Priority</Text>

            {/* Priority Picker */}
            <View>
            <Picker
              selectedValue={selectedPriority}
              onValueChange={(itemValue) => setSelectedPriority(itemValue)}
              style={{ height: 150, width: 200}}
            >
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
            </Picker>
            </View>

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
});