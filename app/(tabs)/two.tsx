import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';

interface Restaurant {
  id: string;
  nameOfRestaurant: string;
  description?: string;
  website?: string;
  image?: string;
  isPromoted?: boolean;
}

const colors = ['#8E5AFF', '#0CBA88', '#FF8680', '#D5C338'];

export default function CentralPartScreen() {
  const [promotedRestaurants, setPromotedRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotedRestaurants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const restaurantsRef = collection(db, "restaurants");
        const q = query(restaurantsRef, where("selectedPlan", "==", "Basic"));
        const querySnapshot = await getDocs(q);
        
        const restaurants: Restaurant[] = [];
        querySnapshot.forEach((doc) => {
          restaurants.push({
            id: doc.id,
            ...doc.data()
          } as Restaurant);
        });
        
        setPromotedRestaurants(restaurants);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Nie udało się pobrać restauracji");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotedRestaurants();
  }, []);

  const handleRestaurantPress = async (website?: string) => {
    if (website) {
      try {
        await Linking.openURL(website);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  const renderRestaurantCard = ({ item, index }: { item: Restaurant; index: number }) => (
    <TouchableOpacity onPress={() => handleRestaurantPress(item.website)}>
      <View style={{ backgroundColor: colors[index % colors.length] }}>
        <Text>{item.nameOfRestaurant}</Text>
        {item.description && <Text>{item.description}</Text>}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Ładowanie...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Błąd: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Text>Promowane Restauracje</Text>
      
      <FlatList
        data={promotedRestaurants}
        renderItem={renderRestaurantCard}
        keyExtractor={(item) => item.id}
      />
      
      <TouchableOpacity>
        <Text>Chcę znaleźć restaurację</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}