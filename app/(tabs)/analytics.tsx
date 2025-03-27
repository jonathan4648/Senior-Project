import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, View, Modal, Pressable} from 'react-native';
import { auth, db } from '../../FirebaseConfig'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';

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
  var task1 = { id: 1, name: "Task 1", completed: true, category: "Work" };
  var task2 = { id: 2, name: "Task 2", completed: false, category: "Personal" };
  var tasks = [task1, task2];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Count tasks per category
  const categoryCount: Record<string, number> = {};
  tasks.forEach(task => {
    categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
  });

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
