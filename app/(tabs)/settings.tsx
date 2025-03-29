import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


//Placeholder for settings screen
const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const savedNotifications = await AsyncStorage.getItem("notifications");
      if (savedNotifications !== null) setNotificationsEnabled(JSON.parse(savedNotifications));
    })();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("notifications", JSON.stringify(value));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Notification Settings */}
      <Text style={styles.sectionHeader}>Notification Settings</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  sectionHeader: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
  settingLabel: { fontSize: 18 },
});

export default SettingsScreen;
