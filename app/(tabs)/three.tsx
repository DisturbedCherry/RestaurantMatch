import { Text } from '@/components/Themed';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { db } from '../../FirebaseConfig';

// Define the type for your restaurant data
interface Restaurant {
  id: string;
  nameOfRestaurant: string;
  image?: string;
  website?: string;
  // Add other fields you expect from Firestore
  [key: string]: any; // For any additional fields
}

export default function TabTwoScreen() {
  // Add the Restaurant type to useState
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
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
    };

    fetchRestaurants();
  }, []);

  return (
    <View>
      <Text>Nowości</Text>
      {restaurants.map((restaurant) => (
        <View key={restaurant.id}>
          <Text>{restaurant.nameOfRestaurant}</Text>
        </View>
      ))}
    </View>
  );
}