import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { db } from '../../FirebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

type Reward = {
  id: number;
  title: string;
  points: number;
  icon: 'star' | 'medal' | 'diamond';
  color: string;
};

const rewards: Reward[] = [
  { id: 1, title: 'Reward 1: 100 Points', points: 100, icon: 'star', color: '#FFD700' },
  { id: 2, title: 'Reward 2: 200 Points', points: 200, icon: 'medal', color: '#C0C0C0' },
  { id: 3, title: 'Reward 3: 500 Points', points: 500, icon: 'diamond', color: '#00BFFF' },
];

export default function RewardsTabScreen() {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [claimedRewards, setClaimedRewards] = useState<{ [key: string]: number }>({
    star: 0,
    medal: 0,
    diamond: 0,
  });
  const [bannerVisible, setBannerVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [bonusVisible, setBonusVisible] = useState(false);
  const [bonusFadeAnim] = useState(new Animated.Value(0));
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const userId = getAuth().currentUser?.uid;

  // Fetch user data and handle login bonus
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const storedPoints = await AsyncStorage.getItem(`points_${userId}`);
          const storedRewards = await AsyncStorage.getItem(`claimedRewards_${userId}`);
          const lastLoginDate = await AsyncStorage.getItem(`lastLogin_${userId}`);

          let points = storedPoints ? parseInt(storedPoints) : 0;
          const today = new Date().toISOString().split('T')[0];

          if (lastLoginDate !== today) {
            points += 1000; // Give daily login bonus
            await AsyncStorage.setItem(`points_${userId}`, points.toString());
            await AsyncStorage.setItem(`lastLogin_${userId}`, today);

            // Show bonus animation
            setBonusVisible(true);
            Animated.timing(bonusFadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();

            setTimeout(() => {
              Animated.timing(bonusFadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }).start();
              setBonusVisible(false);
            }, 5000);
          }

          setUserPoints(points);
          if (storedRewards) {
            setClaimedRewards(JSON.parse(storedRewards));
          }
        } catch (error) {
          console.error('Error loading data from AsyncStorage:', error);
        }
      }
    };

    fetchUserData();

    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (!user) router.replace('/');
    });

    return () => unsubscribe();
  }, [userId]);

  // Sync to Firestore when online
  useEffect(() => {
    if (isOnline && userId) {
      const syncDataToFirestore = async () => {
        try {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            points: userPoints,
            claimedRewards,
          });
          console.log('Data synced to Firestore');
        } catch (error) {
          console.error('Error syncing data to Firestore:', error);
        }
      };
      syncDataToFirestore();
    }
  }, [userPoints, claimedRewards, isOnline, userId]);

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected && userId) {
        const sync = async () => {
          try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
              points: userPoints,
              claimedRewards,
            });
            console.log('Synced when back online');
          } catch (err) {
            console.error('Sync error:', err);
          }
        };
        sync();
      }
    });

    return () => unsubscribe();
  }, [userPoints, claimedRewards, userId]);

  // Claim reward
  const handleClaim = useCallback(
    async (rewardPoints: number, rewardIcon: 'star' | 'medal' | 'diamond') => {
      Alert.alert('Are you sure?', `Claim this reward for ${rewardPoints} points?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            if (userPoints >= rewardPoints) {
              const newPoints = userPoints - rewardPoints;
              setUserPoints(newPoints);
              const updatedRewards = {
                ...claimedRewards,
                [rewardIcon]: claimedRewards[rewardIcon] + 1,
              };
              setClaimedRewards(updatedRewards);

              try {
                await AsyncStorage.setItem(`points_${userId}`, newPoints.toString());
                await AsyncStorage.setItem(`claimedRewards_${userId}`, JSON.stringify(updatedRewards));
              } catch (error) {
                console.error('Error saving to AsyncStorage:', error);
              }

              setBannerVisible(true);
              Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }).start();

              setTimeout(() => {
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 500,
                  useNativeDriver: true,
                }).start();
                setBannerVisible(false);
              }, 5000);

              Alert.alert('Congrats!', 'Enjoy your reward!');
            } else {
              Alert.alert('Not enough points', "You don't have enough points.");
            }
          },
        },
      ]);
    },
    [userPoints, fadeAnim, claimedRewards, userId]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.pointsText}>Points: {userPoints}</Text>
        <Text style={styles.title}>Rewards</Text>
        <Text style={styles.description}>
          Earn points and unlock amazing rewards! Keep track of your rewards and achievements here.
        </Text>

        <Text style={styles.claimedTitle}>Your Claimed Rewards:</Text>
        <View style={styles.claimedRewardsContainer}>
          {Object.keys(claimedRewards).map((key) => (
            <View key={key} style={styles.rewardRow}>
              <Ionicons
                name={key === 'star' ? 'star' : key === 'medal' ? 'medal' : 'diamond'}
                size={30}
                color={key === 'star' ? '#FFD700' : key === 'medal' ? '#C0C0C0' : '#00BFFF'}
              />
              <Text style={styles.claimedText}>x {claimedRewards[key]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.rewardsContainer}>
          {rewards.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <Ionicons name={reward.icon} size={30} color={reward.color} style={styles.icon} />
              <Text style={styles.rewardText}>{reward.title}</Text>
              <TouchableOpacity
                style={styles.claimButton}
                onPress={() => handleClaim(reward.points, reward.icon)}
              >
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Reward Claimed Banner */}
        {bannerVisible && (
          <Animated.View style={[styles.rewardClaimedBanner, { opacity: fadeAnim }]}>
            <Text style={styles.rewardClaimedText}>Reward Claimed!</Text>
          </Animated.View>
        )}

        {/* Daily Bonus Banner */}
        {bonusVisible && (
          <Animated.View style={[styles.bonusBanner, { opacity: bonusFadeAnim }]}>
            <Text style={styles.bonusText}>+1000 Sign Up Bonus 🎉</Text>
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const colors = {
  deepPurple: '#4B0082',
  mediumPurple: '#6A0DAD',
  brightPurple: '#8A2BE2',
  vibrantPurple: '#D500F9',
  gold: '#FFD700',
  lightGray: '#E0E0E0',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.deepPurple,
    padding: 20,
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: colors.lightGray,
  },
  claimedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.white,
  },
  claimedRewardsContainer: {
    marginBottom: 30,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  claimedText: {
    fontSize: 18,
    color: colors.white,
    marginLeft: 10,
  },
  rewardsContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mediumPurple,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  icon: {
    marginRight: 15,
  },
  rewardText: {
    fontSize: 18,
    color: colors.white,
  },
  claimButton: {
    backgroundColor: colors.brightPurple,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  claimButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  rewardClaimedBanner: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: colors.vibrantPurple,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  rewardClaimedText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  bonusBanner: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    backgroundColor: colors.gold,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    marginHorizontal: 20,
  },
  bonusText: {
    color: colors.deepPurple,
    fontSize: 20,
    fontWeight: 'bold',
  },
});