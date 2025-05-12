import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 , Feather, FontAwesome} from '@expo/vector-icons';
import {Colors} from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import TabBarIcon from '@/components/Icons'
import {Drawer} from 'expo-router/drawer'

export default function TabLayout() {
  const colorScheme = useColorScheme();  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Homepage',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} iconSet='Feather' />,
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: 'Task',
          tabBarIcon: ({ color }) => <TabBarIcon name="check" color={color} iconSet= 'Feather'/>,
        }}
      />
      <Tabs.Screen
        name="createTask"
        options={{
          title: 'Create Task', href: null}}/>
      <Tabs.Screen
        name="notification_center"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} iconSet='Feather'/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} iconSet='Feather'/>,
        }}
      />
      <Tabs.Screen
        name="Rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} iconSet='Feather' />,
        }} 
      />
      <Tabs.Screen
        name="EditProfile"
        options={{
          title: 'Editing Profile',href: null}}/>
      <Tabs.Screen
        name="firebaseUtils"
        options={{
          title: 'firebaseUtils', href: null}}/>
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'analytics', href: null}}/>
      <Tabs.Screen
        name="ThemeSwitch"
        options={{
          title: 'Theme', href: null}}/>
      <Tabs.Screen
        name="settings"
        options={{
          title: 'settings', href: null}}/>
      </Tabs> 
  );
}