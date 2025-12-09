import { auth } from '../FirebaseConfig';
// context/AuthContext.tsx (Stwórz ten plik)

import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Definicja typów dla kontekstu
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Stworzenie kontekstu z domyślnymi wartościami
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider, który będzie zarządzał stanem autoryzacji
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Nasłuchiwanie zmian stanu autoryzacji Firebase
  useEffect(() => {
    // onAuthStateChanged jest subskrybentem. Zwraca funkcję, która usuwa subskrypcję po odmontowaniu.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false); // Stan został ustalony
    });

    return () => unsubscribe();
  }, []);

  // Funkcja wylogowania
  const logout = async () => {
    // router.replace('/'); // Wylogowanie nastąpi automatycznie przez onAuthStateChanged
    await auth.signOut();
  };

  const value = {
    user,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Customowy hook do użycia kontekstu
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth musi być użyte wewnątrz AuthProvider');
  }
  return context;
}