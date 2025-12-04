import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, Linking, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../FirebaseConfig';

interface Restaurant {
  id: string;
  nameOfRestaurant: string;
  website?: string;
}

export default function TabTwoScreen() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);

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

  return (
    <ImageBackground 
          source={require("../../assets/images/BackgroundDark.png")}
          style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: "center", color: "#FFF" }}>
          Search Restaurants
        </Text>
        
        <TextInput placeholderTextColor="#FFF"
          style={{ 
            borderWidth: 1, 
            borderColor: '#FFF',
            padding: 12, 
            marginBottom: 16,
            borderRadius: 8,
            fontSize: 16,
            color: "#FFF",
            height: 60,
            backgroundColor: "#1E1825",
            paddingLeft: 16
          }}
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurants..."
        />
        
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={{ 
                padding: 16, 
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                backgroundColor: '#f9f9f9',
                marginBottom: 8,
                borderRadius: 8
              }}
              onPress={() => item.website && Linking.openURL(item.website)}
            >
              <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.nameOfRestaurant}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            search ? (
              <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
                No restaurants found for "{search}"
              </Text>
            ) : (
              <Text style={{ textAlign: 'center', color: '#FFF', marginTop: 20 }}>
                Start typing to search for restaurants
              </Text>
            )
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
}