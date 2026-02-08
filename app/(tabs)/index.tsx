import { router } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';

interface Restaurant {
  id: string;
  nameOfRestaurant: string;
  description?: string;
  website?: string;
  image?: string;
  isPromoted?: boolean;
  selectedPlan?: string;
  address?: string; // dodaj, jeśli chcesz otwierać Google Maps
}

const colors = ['#8E5AFF', '#0CBA88', '#FF8680', '#D5C338'];

export default function CentralPartScreen() {
  const [promotedRestaurants, setPromotedRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null); // modal

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
          restaurants.push({ id: doc.id, ...doc.data() } as Restaurant);
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
        Alert.alert("Cannot Open Website", `Nie można otworzyć strony dla ${restaurantName}. URL: ${url}`, [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", `Nie udało się otworzyć strony dla ${restaurantName}`, [{ text: "OK" }]);
    }
  };

  const openMaps = async (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Cannot open Maps", "Nie udało się otworzyć Google Maps");
    }
  };

  const handleFindRestaurant = () => {
    router.push('/three');
  };

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth - 48) / 2;

  const renderRestaurantCard = ({ item, index }: { item: Restaurant; index: number }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => setSelectedRestaurant(item)} // pokaż modal
      activeOpacity={0.7}
    >
      <View style={[styles.cardHeader, { backgroundColor: colors[index % colors.length] }]}>
        <Text style={styles.promotedBadge}>PROMOWANE</Text>
        <Image
          source={require("../../assets/images/food_placeholder.png")}
          style={styles.cardImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item.nameOfRestaurant}
        </Text>
        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {item.description || "Brak opisu"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ImageBackground source={require("../../assets/images/BackgroundDark.png")} style={styles.background}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Ładowanie restauracji...</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground source={require("../../assets/images/BackgroundDark.png")} style={styles.background}>
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>Błąd: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              // Re-fetch
              const fetchPromotedRestaurants = async () => {
                try {
                  const restaurantsRef = collection(db, "restaurants");
                  const q = query(restaurantsRef, where("selectedPlan", "==", "Basic"));
                  const querySnapshot = await getDocs(q);

                  const restaurants: Restaurant[] = [];
                  querySnapshot.forEach((doc) => {
                    restaurants.push({ id: doc.id, ...doc.data() } as Restaurant);
                  });

                  setPromotedRestaurants(restaurants);
                } catch (err) {
                  console.error(err);
                  setError("Nie udało się pobrać restauracji");
                } finally {
                  setIsLoading(false);
                }
              };
              fetchPromotedRestaurants();
            }}
          >
            <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require("../../assets/images/BackgroundDark.png")} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Promowane Restauracje</Text>

        {promotedRestaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak promowanych restauracji</Text>
            <Text style={styles.emptySubText}>
              Obecnie żadna restauracja nie ma aktywnego planu promocyjnego.
            </Text>
          </View>
        ) : (
          <FlatList
            data={promotedRestaurants}
            renderItem={renderRestaurantCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <TouchableOpacity style={styles.findRestaurantButton} onPress={handleFindRestaurant} activeOpacity={0.8}>
                <Text style={styles.findRestaurantButtonText}>Chcę znaleźć restaurację</Text>
              </TouchableOpacity>
            }
          />
        )}

        {/* Modal */}
        <Modal
          visible={selectedRestaurant !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedRestaurant(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedRestaurant?.nameOfRestaurant}</Text>
              <Text style={styles.modalDescription}>{selectedRestaurant?.description || "Brak opisu"}</Text>

              <View style={styles.modalButtons}>
                {selectedRestaurant?.website && (
                  <Pressable style={styles.modalButton} onPress={() => openWebsite(selectedRestaurant.website!, selectedRestaurant.nameOfRestaurant)}>
                    <Text style={styles.modalButtonText}>Odwiedź stronę</Text>
                  </Pressable>
                )}
                {selectedRestaurant?.address && (
                  <Pressable style={[styles.modalButton, { backgroundColor: '#4caf50' }]} onPress={() => openMaps(selectedRestaurant.address!)}>
                    <Text style={styles.modalButtonText}>Pokaż w Maps</Text>
                  </Pressable>
                )}
                <Pressable style={[styles.modalButton, { backgroundColor: '#f44336' }]} onPress={() => setSelectedRestaurant(null)}>
                  <Text style={styles.modalButtonText}>Zamknij</Text>
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
  loadingText: { marginTop: 10, color: '#fff', fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  errorText: { color: '#ff6b6b', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#8E5AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#fff' },
  listContainer: { paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 16 },
  card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5 },
  cardHeader: { position: 'relative', height: 120 },
  promotedBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, zIndex: 1 },
  cardImage: { width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' },
  cardContent: { padding: 12 },
  restaurantName: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#fff' },
  restaurantDescription: { fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 16, marginBottom: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  emptySubText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  findRestaurantButton: { backgroundColor: '#8E5AFF', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', marginTop: 24, marginHorizontal: 20, elevation: 3, shadowColor: '#8E5AFF', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  findRestaurantButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#222', borderRadius: 16, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12, textAlign: 'center' },
  modalDescription: { fontSize: 14, color: '#ddd', marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  modalButton: { backgroundColor: '#1e88e5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
