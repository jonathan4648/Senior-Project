import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

export default function FocusTimerWidget() {
  const [inputMinutes, setInputMinutes] = useState<string>('25'); // user input
  const [secondsLeft, setSecondsLeft] = useState<number>(0); // countdown
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false); // prevents input change mid-timer

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const startTimer = () => {
    const minutes = parseInt(inputMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      setSecondsLeft(minutes * 60);
      setIsRunning(true);
      setHasStarted(true);
    }
  };

  const toggleTimer = () => {
    if (!hasStarted) {
      startTimer();
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setHasStarted(false);
    setSecondsLeft(0);
    setInputMinutes('25');
  };

  return (
    <View style={styles.widget}>
      <Text style={styles.title}>Focus Timer</Text>

      {!hasStarted && (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter minutes"
          value={inputMinutes}
          onChangeText={setInputMinutes}
        />
      )}

      <Text style={styles.time}>{formatTime(secondsLeft)}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    width: 100,
    alignSelf: 'center',
  },
  time: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

