import React, { useState, useEffect } from 'react';
import { fetchTodos } from './firebaseUtils'; // Adjust the path as needed
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, View, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icons
import { auth } from '@/FirebaseConfig'; 
import { router } from 'expo-router';

// Define the valid icon names for Feather
type FeatherIconNames = 'home' | 'check' | 'bell' | 'user' | 'gift'; // Add more if needed

/**
 * @function TabOneScreen
 * @description Main component for the Home Page. It checks if the user is authenticated and redirects to the login page if not. Displays the current date and a title.
 * @returns {JSX.Element} The rendered component.
 */
export default function TabOneScreen() {
  const [todos, setTodos] = useState<any>([]);
  const [showTutorial, setShowTutorial] = useState<boolean>(true); // Show the tutorial modal initially
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0); // Track the current tab in tutorial
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      fetchTodos(auth.currentUser.uid).then(setTodos);
    }
  }, [auth.currentUser]);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Define the tabs and their icons along with descriptions
  const tabs = [
    { name: 'Homepage', icon: 'home', description: 'This is the homepage where you can see the overview of ToDo.' },
    { name: 'Task', icon: 'check', description: 'Manage your tasks, mark them as completed, or add new ones.' },
    { name: 'Notifications', icon: 'code', description: 'View your notifications and important updates.' },
    { name: 'Profile', icon: 'user', description: 'Manage your profile information and settings.' },
    { name: 'Rewards', icon: 'gift', description: 'View and manage any rewards you have earned.' }
  ];

  const nextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setCurrentTabIndex(currentTabIndex + 1);
    } else {
      setShowTutorial(false); // End tutorial after showing all tabs
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false); // Close the tutorial when "X" is clicked
  };

  // Function to show the tutorial again
  const startTutorial = () => {
    setCurrentTabIndex(0); // Reset to the first tab
    setShowTutorial(true); // Show the tutorial modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formattedDate}</Text>
      <Text style={styles.title}>Home Page</Text>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <Text style={styles.todoText}>{item.task}</Text>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Tutorial Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTutorial}
        onRequestClose={closeTutorial}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button ("X") */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeTutorial}
            >
              <Feather name="x" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Welcome to ToDo!</Text>
            <Text style={styles.modalText}>Here is a brief tutorial to help you get started!</Text>
            <Text style={styles.modalText}>Tab: {tabs[currentTabIndex].name}</Text>
            <Feather 
              name={tabs[currentTabIndex].icon as FeatherIconNames} 
              size={50} 
              color="black" 
            />
            <Text style={styles.modalText}>{tabs[currentTabIndex].description}</Text>
            
            {/* Change the button text to 'Close' on the last tab */}
            <TouchableOpacity
              style={styles.button}
              onPress={currentTabIndex === tabs.length - 1 ? closeTutorial : nextTab} // Close if it's the last tab
            >
              <Text style={styles.buttonText}>
                {currentTabIndex === tabs.length - 1 ? 'Close' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Button to View Tutorial Again */}
      <TouchableOpacity
        style={styles.viewTutorialButton}
        onPress={startTutorial}
      >
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
    marginVertical: 1,
    marginBottom: 30,
    paddingHorizontal: 10,
    top: 250,
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













