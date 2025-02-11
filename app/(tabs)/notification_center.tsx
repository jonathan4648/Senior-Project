import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Card } from "react-native-ui-lib";
import { Button } from "./components/ui/Button";
import { Bell, CheckCircle } from "lucide-react-native";

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", message: "Welcome to the app!", read: false },
    { id: "2", message: "Your order has been shipped!", read: false },
  ]);

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
    <View className="p-4">
      <Button onPress={addNotification} className="mb-4">
        <Bell size={20} /> Add Notification
      </Button>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className={`p-4 mb-2 rounded-xl ${item.read ? 'bg-gray-300' : 'bg-white'}`}>
            <View className="flex-row justify-between items-center">
              <Text className="text-lg">{item.message}</Text>
              {!item.read && (
                <TouchableOpacity onPress={() => markAsRead(item.id)}>
                  <CheckCircle size={24} color="green" />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}
      />
    </View>
  );
};

export default NotificationCenter;
