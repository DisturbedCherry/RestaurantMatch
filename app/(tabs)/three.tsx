import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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
  address?: string;
  image?: string;
}

export default function TabTwoScreen() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null); // modal

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const q = query(
      collection(db, 'restaurants'),
      where('nameOfRestaurant', '>=', search),
      where('nameOfRestaurant', '<=', search + '\uf8ff')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Restaurant[];
      setResults(data);
    });

    return () => unsubscribe();
  }, [search]);

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
        alert(`Nie można otworzyć strony dla ${restaurantName}. URL: ${url}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Nie udało się otworzyć strony dla ${restaurantName}`);
    }
  };

  const openMaps = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Nie udało się otworzyć Google Maps");
      }
    });
  };

  return (
    <ImageBackground 
      source={require("../../assets/images/BackgroundDark.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={styles.header}>Search Restaurants</Text>

        <TextInput
          placeholderTextColor="#FFF"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurants..."
        />

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.resultCard}
              onPress={() => setSelectedRestaurant(item)} // pokaż modal
            >
              <Text style={styles.resultText}>{item.nameOfRestaurant}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            search ? (
              <Text style={styles.emptyText}>No restaurants found for "{search}"</Text>
            ) : (
              <Text style={styles.emptyText}>Start typing to search for restaurants</Text>
            )
          }
        />

        {/* Modal */}
        <Modal
          visible={selectedRestaurant !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedRestaurant(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedRestaurant?.image && (
                <Image source={{ uri: selectedRestaurant.image }} style={styles.modalImage} resizeMode="cover" />
              )}
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
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: "center", color: "#FFF" },
  input: { 
    borderWidth: 1, borderColor: '#FFF',
    padding: 12, marginBottom: 16,
    borderRadius: 8, fontSize: 16,
    color: "#FFF", height: 60, backgroundColor: "#1E1825", paddingLeft: 16
  },
  resultCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 8,
  },
  resultText: { fontSize: 16, fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#222', borderRadius: 16, padding: 20, alignItems: 'center' },
  modalImage: { width: '100%', height: 150, borderRadius: 12, marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12, textAlign: 'center' },
  modalDescription: { fontSize: 14, color: '#ddd', marginBottom: 20, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  modalButton: { backgroundColor: '#1e88e5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
