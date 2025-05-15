import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Pressable} from 'react-native';
import { auth, db } from '../../FirebaseConfig'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where, getDoc } from 'firebase/firestore';
import {View, Text} from "../../components/Themed"
import { getAuth } from 'firebase/auth';

// Define the Task Type
interface Task {
  id: number;
  name: string;
  completed: boolean;
  category: string;
}

//Temp structure for dashboard
interface DashboardProps {
  tasks: Task[];
}

//Placeholder data for page testing (temporary)
const Dashboard: React.FC<DashboardProps> = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    var totalTasks = 0;
    var completedTasks = 0; //Get completed tasks and come up with statistics
    var pendingTasks = 0;
    var completionPercentage = 0;
  useEffect(() => {
    const fetchUserDoc = async () => {
      const userDocPromise = user?.uid ? getDoc(doc(db, "users", user.uid)) : null;
      if (userDocPromise) {
        const userDoc = await userDocPromise;
        const data = userDoc.data();
        if (data) {
          completedTasks = data["completedTasks"];
          totalTasks = data["totalTasks"];
        }
        pendingTasks = totalTasks - completedTasks;
        completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      }
      else { 
        console.log("No user found");
      }
    };
    fetchUserDoc();
  }, []);

  // Format data for charts
  const completionData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  return (
    
    <SafeAreaView>
      <View style={{ alignItems: "center", justifyContent: "center", padding: 30 }}>
        <View>
          <Text>To-Do App Analytics Dashboard</Text>
          <Text>Total Tasks: {totalTasks}</Text>
          <Text>Completed: {completedTasks}</Text>
          <Text>Pending: {pendingTasks}</Text>
          <Text>Completion Rate: {completionPercentage.toFixed(2)}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
