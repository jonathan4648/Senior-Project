import { StyleSheet, TextInput, FlatList, TouchableOpacity, Text, SafeAreaView, View, Modal} from 'react-native';
import React, { useState } from "react";
import Card from "../../components/ui/card";
import Button from "../../components/ui/button";
import { Bell, CheckCircle, Trash2 } from "lucide-react-native";

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", message: "Welcome to the app!", read: false },
    { id: "2", message: "You have an appointment in 5 minutes", read: false },
  ]);

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const addNotification = () => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message: "You have a new message!",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <SafeAreaView>
        <View className="p-4">
        <Button onPress={addNotification} className="mb-4">
            <Bell size={20} color='#111' /> Add Notification
        </Button>
        <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <Card className={`p-4 mb-2 rounded-xl ${item.read ? 'bg-gray-300' : 'bg-white'}`}>
                <View className="flex-row justify-between items-center">
                <Text className="text-lg">{item.message}</Text>
                {!item.read && (
                    <TouchableOpacity 
                      onPress={() => markAsRead(item.id)}
                      style={{ flexDirection:"row", alignItems:"center" }}
                    >
                      <CheckCircle size={24} color="blue" /> 
                      <Text style={{ marginLeft: 4, color: "blue" }} className="text-sm">Mark as read</Text>
                    </TouchableOpacity>
                )}
                  <TouchableOpacity
                    onPress={() => deleteNotification(item.id)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 4,
                    }}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={24} color="gray" />
                    <Text style={{ marginLeft: 4, color: "gray" }}>Delete</Text>
                  </TouchableOpacity>
                </View>
            </Card>
            )}
        />
        </View>
    </SafeAreaView>
  );
};

export default NotificationCenter;
