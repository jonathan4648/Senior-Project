import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Modal, Pressable} from 'react-native';
import React, { useState } from "react";
import Card from "../../components/ui/card";
import Button from "../../components/ui/button";
import { AlignRight, Bell, CheckCircle, Trash2 } from "lucide-react-native";
import { auth, db } from '../../FirebaseConfig'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';

//Data fields required for each notification
interface Notification {
  id: string;
  message: string;
  read: boolean;
}

//Initialize notification center with temporary notifications
const NotificationCenter: React.FC = () => {
  const docsRef = collection(db, 'notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  //State to change color when clicking trash button
  const [hovered, setHovered] = useState<string | null>(null);

  //Function to delete notification
  const deleteNotification = async (id: string) => {
    const q = query(docsRef, where("userId", "==", auth.currentUser?.uid)); // Filters only notifications for current user
    const x = query(docsRef, where("id", "==", id)); // Filters only notifications with id
    const querySnapshot = await getDocs(x);
    if (querySnapshot.empty) {
      console.log(`No document found with ID: ${id}`);
      return;
    }

    // Loop through results and delete each document
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'notifications', document.id));
      console.log(`Deleted document with ID: ${document.id}`);
    });
    fetchNotifs();
  };

  //Function to mark notification as read
  const markAsRead = async (id: string) => {
    
    fetchNotifs();
  };

  const fetchNotifs = async () => {
    const q = query(docsRef, where("userId", "==", auth.currentUser?.uid)); // Filters only notifications for current user
    const querySnapshot = await getDocs(q);  
    const fetchedNotifications: Notification[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      message: doc.data().message,
      read: doc.data().read,
      userId: doc.data().userId
    })) as Notification[];
    setNotifications(fetchedNotifications);
  }

  //Function to add a new notification with temporary placeholder message
  const addNotification = async (message: string) => {
    const docRef = doc(collection(db, 'notifications'));
            var data = {
              id: Date.now().toString(),
              message: message,
              read: false,
              userId: auth.currentUser?.uid
            }
    await setDoc(docRef, data);
    fetchNotifs();
  };

  //Styling for the notification center
  return (
    <SafeAreaView>
        <View className="p-4">
        <Button onPress={() => addNotification("New Notification")} className="mb-4">
            <Bell size={20} color='#111' /> Add Notification
        </Button>
        <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <Card className={`p-4 mb-2 rounded-xl ${item.read ? 'bg-gray-300' : 'bg-white'}`}>
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg">{item.message}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" }}>
                    {!item.read && (
                        <TouchableOpacity 
                          onPress={() => markAsRead(item.id)}
                          style={{ flexDirection:"row", alignItems:"center", marginRight: 8 }}
                        >
                          <CheckCircle size={24} color="blue" /> 
                          <Text style={{ marginLeft: 4, color: "blue" }} className="text-sm">Mark as read</Text>
                        </TouchableOpacity>
                    )}
                      <TouchableOpacity
                        onPress={() => deleteNotification(item.id)}
                        onPressIn={() => setHovered(item.id)}
                        onPressOut={() => setHovered(null)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 4,
                        }}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={24} color={hovered === item.id ? "red" : "gray"}/>
                        <Text style={{textAlign:"right", color: hovered === item.id ? "red" : "gray" }}>Delete</Text>
                      </TouchableOpacity>
                  </View>
                </View>
            </Card>
            )}
        />
        </View>
    </SafeAreaView>
  );
};

export default NotificationCenter;