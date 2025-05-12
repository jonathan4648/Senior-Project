import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
// import WeatherWidget from '@/components/WeatherWidget'; ← Removed
import FocusTimerWidget from '@/components/FocusTimerWidget';
import QuoteOfTheDayWidget from '@/components/QuoteOfTheDayWidget';
import RandomTipWidget from '@/components/RandomTipWidget';


export default function WidgetsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FocusTimerWidget />
        <QuoteOfTheDayWidget />
        <RandomTipWidget />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    padding: 20,
    gap: 20,
  },
});
