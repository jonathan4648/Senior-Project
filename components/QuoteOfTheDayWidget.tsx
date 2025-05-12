import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


const quotes: string[] = [
  "Success is the sum of small efforts repeated daily.",
  "Believe you can and you're halfway there.",
  "Start where you are. Use what you have. Do what you can.",
  "The future depends on what you do today.",
  "Dream big and dare to fail.",
];


export default function QuoteOfTheDayWidget() {
  const [quote, setQuote] = useState<string>('');


  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);


  return (
    <View style={styles.widget}>
      <Text style={styles.title}>Motivational Quote</Text>
      <Text style={styles.quote}>{quote}</Text>
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
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
  },
});
