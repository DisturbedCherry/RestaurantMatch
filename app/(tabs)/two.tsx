import { Text } from '@/components/Themed';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db } from '../../FirebaseConfig';

// Define the type for your restaurant data
interface Restaurant {
  id: string;
  nameOfRestaurant: string;
  description?: string;
  image?: string;
  website?: string;
  // Add other fields you expect from Firestore
  [key: string]: any;
}

export default function TabTwoScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsRef = collection(db, "restaurants");
        const q = query(restaurantsRef, orderBy("__name__", "asc"), limit(5));
        const querySnapshot = await getDocs(q);
        
        const data: Restaurant[] = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data()
          } as Restaurant);
        });
        
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        Alert.alert("Error", "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Function to open website
  const openWebsite = async (websiteUrl: string, restaurantName: string) => {
    try {
      // Check if URL has protocol, add https:// if not
      let url = websiteUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      // Check if the URL can be opened
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Cannot Open Website",
          `We can't open the website for ${restaurantName}. URL: ${url}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert(
        "Error",
        `Failed to open website for ${restaurantName}`,
        [{ text: "OK" }]
      );
    }
  };

  // Calculate card width to fit two cards per row with spacing
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2;

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity 
      style={[styles.card, { width: cardWidth }]}
      onPress={() => {
        if (item.website) {
          openWebsite(item.website, item.nameOfRestaurant);
        } else {
          Alert.alert(
            "No Website Available",
            `${item.nameOfRestaurant} doesn't have a website listed.`,
            [{ text: "OK" }]
          );
        }
      }}
      activeOpacity={0.7}
    >
      <Image 
        source={require("../../assets/images/food_placeholder.png")}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item.nameOfRestaurant}
        </Text>
        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ImageBackground 
        source={require("../../assets/images/BackgroundDark.png")}
        style={styles.background}
      >
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={require("../../assets/images/BackgroundDark.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Nowości</Text>
        {restaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No restaurants found</Text>
          </View>
        ) : (
          <FlatList
            data={restaurants}
            renderItem={renderRestaurantCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff',
  },
  restaurantDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
    marginBottom: 8,
  },
  websiteContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  websiteText: {
    fontSize: 11,
    color: '#4dabf7',
    fontWeight: '500',
  },
  noWebsiteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  noWebsiteText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});