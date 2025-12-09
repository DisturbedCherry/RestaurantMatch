// app/_layout.tsx

import { Stack, useSegments, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../FirebaseConfig'; 

// 1. Centralny Hook Autoryzacyjny
// Ten hook nasłuchuje stanu logowania w Firebase
const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true); // Stan ładowania

  useEffect(() => {
    // onAuthStateChanged natychmiast sprawdza stan, a następnie nasłuchuje zmian
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stan został ustalony
      console.log('DEBUG (Layout): Stan Użytkownika Ustalony.');
    });

    return () => unsubscribe(); // Sprzątanie subskrypcji
  }, []);

  return { user, loading };
};


// 2. Główny Komponent Layoutu
const RootLayout = () => {
  const { user, loading } = useAuth();
  const segments = useSegments(); 
  const router = useRouter(); 

  // Ścieżka publiczna to 'index' (Twój ekran logowania)
  const isPublicRoute = (segments[0] as string) === 'index'; 

  // 3. Logika Przekierowania
  useEffect(() => {
    // ⚠️ Krok 1: Czekaj, aż Firebase ustali stan (loading=false)
    if (loading) return; 

    // Krok 2: Użytkownik zalogowany -> przekieruj na chronioną ścieżkę
    // Jeśli user istnieje I segmentem jest 'index' (publiczny)
    if (user && isPublicRoute) {
      console.log('REDIRECT: Zalogowany. Idę do / (tabs)');
      router.replace('/(tabs)');
    } 
    
    // Krok 3: Użytkownik wylogowany -> przekieruj na publiczną ścieżkę
    // Jeśli user NIE istnieje I segmentem NIE JEST 'index' (chroniony)
    else if (!user && !isPublicRoute) {
      console.log('REDIRECT: Wylogowany. Idę do /');
      router.replace('/'); 
    }

  }, [user, loading, isPublicRoute, router]);


  // 4. Renderowanie
  // Możesz dodać ekran ładowania tutaj, jeśli 'loading' jest true
  if (loading) {
    // Opcjonalnie: Zwróć ekran ładowania, aby uniknąć migotania
    // return <LoadingScreen />; 
  }

  return (
    <Stack>
      {/* 
        Konfiguracja Stack.Screen jest poprawna. 
        Upewnij się, że masz plik app/(tabs)/_layout.tsx
      */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* ... inne ekrany, np. modal */}
    </Stack>
  );
};

export default RootLayout;