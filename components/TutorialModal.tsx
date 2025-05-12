import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TutorialModal({ visible, onClose }: TutorialModalProps) {
  const tabs = [
    { name: 'Homepage', icon: 'home', description: 'This is the homepage where you can see an overview of your ToDo list.' },
    { name: 'Task', icon: 'check', description: 'Manage your tasks, mark them as completed, or add new ones.' },
    { name: 'Notifications', icon: 'bell', description: 'View your notifications and important updates.' },
    { name: 'Profile', icon: 'user', description: 'Manage your profile information and settings.' },
    { name: 'Rewards', icon: 'gift', description: 'View and manage any rewards you have earned.' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    if (currentIndex < tabs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // reset for next time
      onClose();
    }
  };

  const currentTab = tabs[currentIndex];

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Welcome to ToDo!</Text>
          <Text style={styles.modalText}>{currentTab.description}</Text>
          <Feather name={currentTab.icon as any} size={50} color="black" />
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>
              {currentIndex === tabs.length - 1 ? 'Close' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
