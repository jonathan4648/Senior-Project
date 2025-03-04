import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function RewardsTabScreen() {
  // State to store the current user's points
  const [userPoints, setUserPoints] = useState(1500);

  // State to track claimed rewards (star, medal, diamond)
  const [claimedRewards, setClaimedRewards] = useState<{ [key: string]: number }>({
    star: 0,
    medal: 0,
    diamond: 0,
  });

  // Animation state for the reward claimed banner
  const [bannerVisible, setBannerVisible] = useState(false);

  // Opacity state for the banner animation (fading effect)
  const [fadeAnim] = useState(new Animated.Value(0));

  // State to control when confetti is visible
  const [confettiVisible, setConfettiVisible] = useState(false);

  // Listen for changes in authentication state (user logged in or not)
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      // If no user is logged in, navigate to the home screen
      if (!user) {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, []);

  // Structure of a Reward (points, icon, etc.)
  type Reward = {
    id: number;
    title: string;
    points: number;
    icon: 'star' | 'medal' | 'diamond';
    color: string;
  };

  // List of available rewards
  const rewards: Reward[] = [
    { id: 1, title: 'Reward 1: 100 Points', points: 100, icon: 'star', color: '#FFD700' },
    { id: 2, title: 'Reward 2: 200 Points', points: 200, icon: 'medal', color: '#C0C0C0' },
    { id: 3, title: 'Reward 3: 500 Points', points: 500, icon: 'diamond', color: '#00BFFF' },
  ];

  // Optimized handleClaim function using useCallback
  const handleClaim = useCallback(
    (rewardPoints: number, rewardIcon: 'star' | 'medal' | 'diamond') => {
      // Check if user has enough points to claim the reward
      if (userPoints >= rewardPoints) {
        // Deduct points from the user
        setUserPoints((prevPoints) => prevPoints - rewardPoints);

        // Update the claimed rewards count for the specific icon
        setClaimedRewards((prevRewards) => ({
          ...prevRewards,
          [rewardIcon]: prevRewards[rewardIcon] + 1,
        }));

        // Trigger confetti animation
        setConfettiVisible(true);

        // Show the reward claimed banner with fade-in animation
        setBannerVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade in the banner
          duration: 500, // Duration of the animation
          useNativeDriver: true, // Use native driver for better performance
        }).start();

        // Hide the Reward Claimed banner after 2 seconds with a fade-out animation
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0, // Fade out the banner
            duration: 500,
            useNativeDriver: true,
          }).start();
          setBannerVisible(false); // Hide the banner
        }, 5000);

        // Hide the confetti after 5 seconds (when animation finishes)
        setTimeout(() => {
          setConfettiVisible(false);
        }, 5000);

        // Show a success alert
        Alert.alert('Congrats!', 'Enjoy your reward!');
      } else {
        // If not enough points, show an error alert
        Alert.alert('Insufficient Points', "You don't have enough points for this reward.");
      }
    },
    [userPoints, fadeAnim] // Dependencies: only change when userPoints or fadeAnim changes
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        {/* Display current points */}
        <Text style={styles.pointsText}>Points: {userPoints}</Text>

        {/* Title of the rewards screen */}
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.description}>
          Earn points and unlock amazing rewards! Keep track of your rewards and achievements here.
        </Text>

        {/* Display the number of claimed rewards */}
        <Text style={styles.claimedTitle}>Your Claimed Rewards:</Text>
        <View style={styles.claimedRewardsContainer}>
          {/* Display star reward count */}
          <View style={styles.rewardRow}>
            <Ionicons name="star" size={30} color="#FFD700" />
            <Text style={styles.claimedText}>x {claimedRewards.star}</Text>
          </View>
          {/* Display medal reward count */}
          <View style={styles.rewardRow}>
            <Ionicons name="medal" size={30} color="#C0C0C0" />
            <Text style={styles.claimedText}>x {claimedRewards.medal}</Text>
          </View>
          {/* Display diamond reward count */}
          <View style={styles.rewardRow}>
            <Ionicons name="diamond" size={30} color="#00BFFF" />
            <Text style={styles.claimedText}>x {claimedRewards.diamond}</Text>
          </View>
        </View>

        {/* Rewards List - Display each available reward */}
        <View style={styles.rewardsContainer}>
          {rewards.map((reward) => (
            <TouchableOpacity key={reward.id} style={styles.rewardCard}>
              {/* Reward icon */}
              <Ionicons name={reward.icon} size={30} color={reward.color} style={styles.icon} />

              {/* Reward title */}
              <Text style={styles.rewardText}>{reward.title}</Text>

              {/* Claim button */}
              <TouchableOpacity
                style={styles.claimButton}
                onPress={() => handleClaim(reward.points, reward.icon)} // Pass reward points and icon to handleClaim
              >
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confetti animation */}
        {confettiVisible && (
          <ConfettiCannon
            count={100} // Reduced number of confetti particles
            origin={{ x: 0, y: 0 }}
            fadeOut={true}
            key={confettiVisible ? 'confetti-active' : 'confetti-inactive'} // Ensures reset when visibility changes
          />
        )}

        {/* Reward claimed banner */}
        {bannerVisible && (
          <Animated.View style={[styles.rewardClaimedBanner, { opacity: fadeAnim }]}>
            <Text style={styles.rewardClaimedText}>Reward Claimed!</Text>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Container for the entire screen, centers content and adds padding
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // You can set a solid background color here
    padding: 20,
  },

  // Style for the points display text
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 15,
  },

  // Style for the main title
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },

  // Style for the description text
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#000000',
  },

  // Style for the "Your Claimed Rewards" title
  claimedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },

  // Container for claimed rewards, adds space below the rewards list
  claimedRewardsContainer: {
    marginBottom: 30,
  },

  // Style for the row displaying each individual reward
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  // Style for the text displaying the count of claimed rewards
  claimedText: {
    fontSize: 18,
    color: '#333333',
    marginLeft: 10,
  },

  // Container for all the rewards (list of available rewards)
  rewardsContainer: {
    width: '100%',
    paddingBottom: 40,
  },

  // Style for each reward card
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },

  // Style for the icon inside each reward card
  icon: {
    marginRight: 15,
  },

  // Style for the reward title text
  rewardText: {
    fontSize: 18,
    color: '#333333',
  },

  // Style for the claim button
  claimButton: {
    backgroundColor: '#1A237E',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 'auto',
  },

  // Style for the text inside the claim button
  claimButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Style for the reward claimed banner (appears when a reward is claimed)
  rewardClaimedBanner: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#00C853',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  // Style for the text inside the reward claimed banner
  rewardClaimedText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});


















