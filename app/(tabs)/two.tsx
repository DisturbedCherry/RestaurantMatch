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
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db } from '../../FirebaseConfig';

interface Restaurant {
  id: string;
  nameOfRestaurant: string;
  description?: string;
  image?: string;
  website?: string;
  address?: string;
  [key: string]: any;
}

const GOOGLE_MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY;

export default function TabTwoScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

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

  const getStaticMapUrl = (address: string) => {
    const encoded = encodeURIComponent(address);

    return `https://maps.googleapis.com/maps/api/staticmap?center=${encoded}&zoom=15&size=600x300&markers=color:red|${encoded}&key=${GOOGLE_MAPS_KEY}`;
  };

  const openWebsite = async (websiteUrl: string, restaurantName: string) => {
    try {
      let url = websiteUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

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

  const openMaps = async (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    await Linking.openURL(url);
  };

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2;

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => setSelectedRestaurant(item)}
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

        {/* MODAL */}
        <Modal
          visible={selectedRestaurant !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedRestaurant(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedRestaurant?.nameOfRestaurant}
              </Text>

              <Text style={styles.modalDescription}>
                {selectedRestaurant?.description || "No description available"}
              </Text>

              {/* MINIMAPA */}
              {selectedRestaurant?.address && (
                <TouchableOpacity
                  style={styles.map}
                  activeOpacity={0.9}
                  onPress={() => openMaps(selectedRestaurant.address!)}
                >
                  <Image
                    source={{ uri: getStaticMapUrl(selectedRestaurant.address) }}
                    style={styles.map}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

              <View style={styles.modalButtons}>
                {selectedRestaurant?.website && (
                  <Pressable
                    style={styles.modalButton}
                    onPress={() =>
                      openWebsite(
                        selectedRestaurant.website!,
                        selectedRestaurant.nameOfRestaurant
                      )
                    }
                  >
                    <Text style={styles.modalButtonText}>Visit Website</Text>
                  </Pressable>
                )}

                <Pressable
                  style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                  onPress={() => setSelectedRestaurant(null)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#fff' },
  listContainer: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },

  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },

  cardImage: { width: '100%', height: 120 },
  cardContent: { padding: 12 },
  restaurantName: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#fff' },
  restaurantDescription: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 16 },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12, textAlign: 'center' },
  modalDescription: { fontSize: 14, color: '#ddd', marginBottom: 16, textAlign: 'center' },

  map: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },

  modalButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },

  modalButton: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
