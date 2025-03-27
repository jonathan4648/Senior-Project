/**
 * @file home.tsx
 * @description This file contains the main component for the Home Page of the application. It includes user authentication check and displays the current date and a title.
 */
import { fetchTodos } from '../firebaseUtils'; // Adjust the path as needed
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';
import {StyleSheet, TouchableOpacity,Text, View, FlatList, Button} from 'react-native';
import { auth} from '@/FirebaseConfig';
import { getAuth } from 'firebase/auth'
import { router }  from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

/**
 * @function TabOneScreen
 * @description Main component for the Home Page. It checks if the user is authenticated and redirects to the login page if not. Displays the current date and a title.
 * @returns {JSX.Element} The rendered component.
 */
export default function Homepage(){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA', // A softer white for a modern, minimalist background
  },

  dateText: {
    fontSize: 20, // Slightly larger for emphasis
    fontWeight: '600', // Semi-bold for a balanced weight
    marginBottom: 10, // Increased space for a more airy, open feel
    color: '#7B1FA2', // A dark purple for a unique look
    position: 'absolute',
    top : 200,
  },
  todoText: {
    fontSize: 18,
    color: 'purple',
    textAlign: 'center',
    marginVertical: 1,
    marginBottom: 30,
    paddingHorizontal: 10,
    top : 250,
  },
  title: {
    fontSize: 28, // A bit larger for a more striking appearance
    fontWeight: '800', // Extra bold for emphasis
    marginBottom: 40, // Increased space for a more airy, open feel
    color: '#7B1FA2', // A dark purple for a unique look
    position: 'absolute',
    top: 100,
    left: 10,
  },
  textInput: {
    height: 50, // Standard height for elegance and simplicity
    width: '90%', // Full width for a more expansive feel
    backgroundColor: '#FFFFFF', // Pure white for contrast against the container
    borderColor: '#E8EAF6', // A very light indigo border for subtle contrast
    borderWidth: 2,
    borderRadius: 15, // Softly rounded corners for a modern, friendly touch
    marginVertical: 15,
    paddingHorizontal: 25, // Generous padding for ease of text entry
    fontSize: 16, // Comfortable reading size
    color: '#3C4858', // A dark gray for readability with a hint of warmth
    shadowColor: '#9E9E9E', // A medium gray shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // Slightly elevated for a subtle 3D effect
  },
  menuButton: {
    width: '90%',
    marginVertical: 15,
    backgroundColor: '#5C6BC0', // A lighter indigo to complement the title color
    padding: 20,
    borderRadius: 15, // Matching rounded corners for consistency
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6BC0', // Shadow color to match the button for a cohesive look
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF', // Maintained white for clear visibility
    fontSize: 18, // Slightly larger for emphasis
    fontWeight: '600', // Semi-bold for a balanced weight
  },
});

