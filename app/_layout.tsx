// app/_layout.tsx

import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect } from 'react';
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

  // 3. Logika Przekierowania
  useEffect(() => {
    // ⚠️ Krok 1: Czekaj, aż Firebase ustali stan (loading=false)
    if (loading) {
      console.log('DEBUG (Layout): Czekam na ustalenie stanu autoryzacji...');
      return; 
    }

    const currentSegment = segments[0] as string | undefined;
    const segmentsString = segments.length > 0 ? segments.join('/') : '(root)';
    
    // Sprawdź czy jesteśmy na ekranie logowania (publiczna ścieżka)
    // Ekran logowania to TYLKO gdy pierwszy segment to 'index' I NIE jesteśmy w '(tabs)'
    // lub gdy brak segmentów (główna ścieżka)
    const isInTabs = currentSegment === '(tabs)';
    const isPublicRoute = (!currentSegment && !isInTabs) || (currentSegment === 'index' && !isInTabs);
    
    console.log('DEBUG (Layout): Stan użytkownika:', user ? 'Zalogowany' : 'Wylogowany', '| Segmenty:', segmentsString, '| isPublicRoute:', isPublicRoute, '| isInTabs:', isInTabs);

    // Krok 2: Użytkownik zalogowany -> przekieruj na chronioną ścieżkę
    // UWAGA: Logowanie Google przekierowuje bezpośrednio do /(tabs)/two w app/index.tsx
    // Tutaj przekierowujemy tylko jeśli użytkownik jest zalogowany przez email i jest na ekranie logowania
    if (user) {
      // Przekieruj TYLKO jeśli jesteśmy na ekranie logowania (nie jesteśmy już w zakładkach)
      // Dla logowania Google przekierowanie jest obsługiwane bezpośrednio w handleGoogleLogin
      if (isPublicRoute && !isInTabs) {
        console.log('REDIRECT: Zalogowany (email). Idę do /(tabs)');
        router.replace('/(tabs)');
      }
    } 
    
    // Krok 3: Użytkownik wylogowany -> przekieruj na publiczną ścieżkę
    else if (!user) {
      // Przekieruj TYLKO jeśli NIE jesteśmy na ekranie logowania (jesteśmy w zakładkach)
      if (!isPublicRoute && isInTabs) {
        console.log('REDIRECT: Wylogowany. Idę do /');
        router.replace('/'); 
      }
    }

  }, [user, loading, router, segments]);


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