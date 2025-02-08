import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Modal, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { router }  from 'expo-router';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Define Props Type
type TaskFormProps = {
  onSubmit: (title: string, date: string) => void;
  onCancel: () => void;
};

export default function create_task({onSubmit, onCancel}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !date.trim()) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }
    onSubmit(title, date);
    setTitle('');
    setDate('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Due Date</Text>
            <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  }
});