import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


const tips: string[] = [
  "Use the Pomodoro Technique: 25 min work, 5 min break.",
  "Batch small tasks together to save mental energy.",
  "Start your day by tackling the hardest task first.",
  "Declutter your workspace to boost focus.",
  "Set a daily top 3 priorities list.",
  "Break big tasks into small, manageable steps.",
  "Minimize notifications while working.",
  "Review your to-do list at the end of each day.",
  "Work in focused sprints, not long marathons.",
];


export default function RandomTipWidget() {
  const [tip, setTip] = useState<string>('');


  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
  }, []);


  return (
    <View style={styles.widget}>
      <Text style={styles.title}>Productivity Tip</Text>
      <Text style={styles.tip}>{tip}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  widget: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tip: {
    fontSize: 16,
    color: '#555',
  },
});
