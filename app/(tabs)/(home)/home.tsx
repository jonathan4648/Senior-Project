/**
 * @file home.tsx
 * @description This file contains the main component for the Home Page of the application. It includes user authentication check and displays the current date and a title.
 */

import React, { useState, useEffect } from 'react';
import { fetchTodos } from '../firebaseUtils'; // Adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import { StyleSheet, TouchableOpacity, Text, View, FlatList, Modal } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @interface Todo
 * @description Defines the structure for a to-do item.
 */
interface Todo {
  id: string;
  task: string;
}

/**
 * @function HomeScreen
 * @description Main component for the Home Page. It checks if the user is authenticated and redirects to the login page if not. Displays the current date and a title.
 * @returns {JSX.Element} The rendered component.
 */
export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const auth = getAuth();

  useEffect(() => {
    // Check authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/'); // Redirect to login if not authenticated
      } else {
        fetchTodos(user.uid).then(setTodos);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Retrieve tutorial state from AsyncStorage
    const checkTutorialStatus = async () => {
      const tutorialSeen = await AsyncStorage.getItem('showTutorial');
      if (tutorialSeen === null) {
        setShowTutorial(true); // Show tutorial if not seen before
      }
    };
    checkTutorialStatus();
  }, []);

  const saveTutorialState = async () => {
    await AsyncStorage.setItem('showTutorial', 'false');
    setShowTutorial(false);
  };

  const tabs = [
    { name: 'Homepage', icon: 'home', description: 'This is the homepage where you can see an overview of your ToDo list.' },
    { name: 'Task', icon: 'check', description: 'Manage your tasks, mark them as completed, or add new ones.' },
    { name: 'Notifications', icon: 'bell', description: 'View your notifications and important updates.' },
    { name: 'Profile', icon: 'user', description: 'Manage your profile information and settings.' },
    { name: 'Rewards', icon: 'gift', description: 'View and manage any rewards you have earned.' },
  ];

  const nextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setCurrentTabIndex(currentTabIndex + 1);
    } else {
      saveTutorialState(); // Close tutorial after last tab
    }
  };

  const startTutorial = () => {
    setCurrentTabIndex(0);
    setShowTutorial(true);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{currentDate}</Text>
      <Text style={styles.title}>Home Page</Text>

      <FlatList
        data={todos}
        renderItem={({ item }) => <Text style={styles.todoText}>{item.task}</Text>}
        keyExtractor={(item) => item.id}
      />

      {/* Tutorial Modal */}
      <Modal animationType="slide" transparent={true} visible={showTutorial} onRequestClose={saveTutorialState}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={saveTutorialState}>
              <Feather name="x" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Welcome to ToDo!</Text>
            <Text style={styles.modalText}>{tabs[currentTabIndex].description}</Text>
            <Feather name={tabs[currentTabIndex].icon as keyof typeof Feather.glyphMap} size={50} color="black" />

            <TouchableOpacity style={styles.button} onPress={nextTab}>
              <Text style={styles.buttonText}>{currentTabIndex === tabs.length - 1 ? 'Close' : 'Next'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Button to View Tutorial Again */}
      <TouchableOpacity style={styles.viewTutorialButton} onPress={startTutorial}>
        <Text style={styles.buttonText}>View Tutorial Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#7B1FA2',
    position: 'absolute',
    top: 200,
  },
  todoText: {
    fontSize: 18,
    color: 'purple',
    textAlign: 'center',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 40,
    color: '#7B1FA2',
    position: 'absolute',
    top: 100,
    left: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#7B1FA2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  viewTutorialButton: {
    backgroundColor: '#7B1FA2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
  },
});


