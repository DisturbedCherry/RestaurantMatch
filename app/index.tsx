import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from '@firebase/auth';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../FirebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Przekierowanie po zalogowaniu jest obsługiwane przez app/_layout.tsx
  // Nie dodajemy tutaj dodatkowego przekierowania, aby uniknąć konfliktów

  // Configure Facebook Auth Request - UPROSZCZONE
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '825184180489983',
    scopes: ['public_profile', 'email'], // Dodaj wymagane scopes
  });

  // This is for Google
  // const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
  //   // Użyj swojego WEB Client ID z Firebase/Google Cloud
  //   webClientId: '903298888350-n3tghv2kv71o30lf4o12m00v1pude8v5.apps.googleusercontent.com'
  // });


  // const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
  //   webClientId: '903298888350-n3tghv2kv71o30lf4o12m00v1pude8v5.apps.googleusercontent.com',
  //   // 🔧 DODAJ TO:
  //   responseType: ResponseType.IdToken, // WAŻNE dla Firebase!
  //   scopes: ['profile', 'email'],
  // });

  const [requestGoogle, responseGoogle, promptAsyncGoogle] =
    Google.useAuthRequest({
      // androidClientId:
      //   "903298888350-38ou1hoa8mr3i50pins72gtblbvlodhe.apps.googleusercontent.com",
      androidClientId:
        "903298888350-38ou1hoa8mr3i50pins72gtblbvlodhe.apps.googleusercontent.com",
      webClientId:
        "903298888350-n3tghv2kv71o30lf4o12m00v1pude8v5.apps.googleusercontent.com",
      responseType: ResponseType.IdToken,
      scopes: ["profile", "email"],
      redirectUri: makeRedirectUri({
        useProxy: true,
        scheme: 'restaurantmatch',
  })

      // redirectUri: 'https://auth.expo.io/@disturbedcherry/RestaurantMatch',
  });

      
    

  // useEffect(() => {
  //   // Wywołaj logowanie TYLKO gdy odpowiedź jest sukcesem i mamy token
  //   if (responseGoogle?.type === 'success' && responseGoogle.authentication?.idToken) {
  //       console.log('DEBUG: Wywołuję handleGoogleLogin z tokenem');
  //       handleGoogleLogin(responseGoogle.authentication.idToken);
  //   } else if (responseGoogle) {
  //       console.log('DEBUG: Pełna odpowiedź Google:', responseGoogle.type, '| Nie wywołuję logowania');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [responseGoogle])
  useEffect(() => {
    if (responseGoogle) {
      console.log('🔍 DEBUG: Type:', responseGoogle.type);
      console.log('🔍 DEBUG: Authentication:', JSON.stringify(responseGoogle.authentication, null, 2));
      console.log('🔍 DEBUG: Params:', JSON.stringify(responseGoogle.params, null, 2));
      
      if (responseGoogle.type === 'success') {
        // Sprawdź wszystkie możliwe lokalizacje tokenu
        const idToken = responseGoogle.authentication?.idToken 
                     || responseGoogle.params?.id_token;
        
        const accessToken = responseGoogle.authentication?.accessToken 
                         || responseGoogle.params?.access_token;
        
        console.log('✅ idToken:', idToken ? 'JEST' : 'BRAK');
        console.log('✅ accessToken:', accessToken ? 'JEST' : 'BRAK');
        
        if (idToken) {
          console.log('DEBUG: Wywołuję handleGoogleLogin z idToken');
          handleGoogleLogin(idToken);
        } else if (accessToken) {
          console.log('⚠️ Mam tylko accessToken, próbuję użyć go zamiast idToken');
          handleGoogleLogin(accessToken);
        } else {
          console.error('❌ Brak tokenów w odpowiedzi!');
          Alert.alert('Błąd', 'Nie otrzymano tokenu od Google');
        }
      } else if (responseGoogle.type === 'error') {
        console.error('❌ Błąd Google:', responseGoogle.error);
        Alert.alert('Błąd Google', responseGoogle.error?.message || 'Nieznany błąd');
      }
    }
  }, [responseGoogle]);
  const signIn = async () => {
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        console.log('Email Sign-In Successful:', user.user?.email);
      //  router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.log('Email Sign-In Error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      Alert.alert('Sign in failed', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    console.log('DEBUG: signUp wywołany - START');
    console.trace('DEBUG: Stack trace wywołania signUp');
    try {
      setLoading(true);
      console.log('DEBUG: Wywołuję createUserWithEmailAndPassword');
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        console.log('Email Sign-Up Successful:', user.user?.email);
       // router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.log('Email Sign-Up Error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account already exists with this email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      
      Alert.alert('Sign up failed', errorMessage);
    } finally {
      setLoading(false);
      console.log('DEBUG: signUp wywołany - END');
    }
  }

  const handleGoogleLogin = async (idToken: string) => {
    try {
      setLoading(true);
      
      // 1. Utwórz poświadczenie Firebase z tokenu ID Google
      console.log('DEBUG: Krok 1 - Tworzę poświadczenie Firebase.');
      const credential = GoogleAuthProvider.credential(idToken);
      
      // 2. Zaloguj użytkownika do Firebase
      console.log('DEBUG: Krok 2 - Uruchamiam signInWithCredential...');
      const userCredential = await signInWithCredential(auth, credential);

      if (userCredential) {
        console.log('Google Sign-In Successful:', userCredential.user?.email);
        console.log('➡️ DEBUG: Przekierowuję do /(tabs)/two');
        // Przekierowanie bezpośrednio do widoku "two" po logowaniu Google
        router.replace('/(tabs)/two');
      }
    } catch (error : any) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Failed', 'Nie udało się zalogować przez Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignInPress = React.useCallback(() => {
    console.log('DEBUG: handleGoogleSignInPress wywołany');
    console.trace('DEBUG: Stack trace wywołania handleGoogleSignInPress');
    if (requestGoogle) {
      console.log('DEBUG: Wywołuję promptAsyncGoogle');
      promptAsyncGoogle();
    } else {
      console.log('DEBUG: requestGoogle nie jest gotowy');
      Alert.alert('Błąd', 'Brak gotowego żądania uwierzytelniania Google. Sprawdź konfigurację Client ID.');
    }
  }, [requestGoogle, promptAsyncGoogle])


  return (
    <ImageBackground 
      source={require("../assets/images/Background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView 
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        onStartShouldSetResponder={() => false}
      >
        <Image 
          source={require('../assets/images/LogoRM.png')}
          style={{ width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 }}
        />
        <Text 
          style={{ color: "#FFF", fontSize: 24, fontWeight: "bold" }}
        >
          Restaurant Match
        </Text>
        
        <TextInput 
          placeholder='email' 
          value={email} 
          keyboardType="email-address" 
          autoCapitalize='none' 
          onChangeText={setEmail} 
          placeholderTextColor="#FFF"
          editable={!loading}
          onFocus={() => console.log('DEBUG: TextInput email - onFocus')}
          onBlur={() => console.log('DEBUG: TextInput email - onBlur')}
          onSubmitEditing={() => {
            console.log('DEBUG: TextInput email - onSubmitEditing');
            // Nie rób nic - nie wywołuj handleGoogleSignInPress
          }}
          returnKeyType="next"
          style={{ width: 280, height: 70, backgroundColor: "#1E1825", color:"#FFF", marginBottom: 10, marginTop: 30, paddingHorizontal: 20, borderRadius: 16, borderWidth: 4, borderColor: "#B5B3BF"}}
        />
        
        <TextInput 
          placeholder='password' 
          secureTextEntry={true} 
          value={password} 
          autoCapitalize='none' 
          onChangeText={setPassword} 
          placeholderTextColor="#FFF"
          editable={!loading}
          onFocus={() => console.log('DEBUG: TextInput password - onFocus')}
          onBlur={() => console.log('DEBUG: TextInput password - onBlur')}
          onSubmitEditing={() => {
            console.log('DEBUG: TextInput password - onSubmitEditing');
            // Wywołaj signIn zamiast handleGoogleSignInPress
            if (!loading) {
              signIn();
            }
          }}
          returnKeyType="done"
          style={{ width: 280, height: 70, backgroundColor: "#1E1825", color:"#FFF",  marginBottom: 30, paddingHorizontal: 20, borderRadius: 16, borderWidth: 4, borderColor: "#B5B3BF" }}
        /> 
        
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            console.log('DEBUG: Przycisk Zaloguj się kliknięty');
            signIn();
          }}
          disabled={loading}
          activeOpacity={0.8}
          style={{ marginBottom: 20, backgroundColor: "#1E1825", width: 220, height: 60, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 4, borderColor: "#8E5AFF", opacity: loading ? 0.7 : 1 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            {loading ? 'Loading...' : 'Zaloguj się'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('DEBUG: Przycisk Zarejestruj się kliknięty - START');
            console.log('DEBUG: loading:', loading);
            if (!loading) {
              console.log('DEBUG: Wywołuję signUp');
              signUp();
            } else {
              console.log('DEBUG: Loading jest true, nie wywołuję signUp');
            }
            console.log('DEBUG: Przycisk Zarejestruj się kliknięty - END');
          }}
          disabled={loading}
          activeOpacity={0.8}
          style={{ marginBottom: 20, backgroundColor: "#1E1825", width: 220, height: 60, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 4, borderColor: "#D5C338", opacity: loading ? 0.7 : 1 }}
        >
          <Text 
            style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}
            onPress={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('DEBUG: Text w przycisku Zarejestruj się - onPress - NIE POWINNO SIĘ WYWOŁAĆ');
            }}
          >
            {loading ? 'Loading...' : 'Zarejestruj się'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: 280 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: '#B5B3BF' }} />
          <Text style={{ color: '#FFF', marginHorizontal: 10 }}>OR</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: '#B5B3BF' }} />
        </View>

        {/* Google Sign-In Button */}
        <View 
          style={{ flexDirection: 'row', gap: 32, alignItems: 'center', justifyContent: 'center' }}
          onStartShouldSetResponder={() => false}
          pointerEvents="box-none"
        >
          <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('DEBUG: Przycisk Google kliknięty - START');
            console.log('DEBUG: loading:', loading);
            if (!loading) {
              console.log('DEBUG: Wywołuję handleGoogleSignInPress z przycisku Google');
              handleGoogleSignInPress();
            } else {
              console.log('DEBUG: Loading jest true, nie wywołuję handleGoogleSignInPress');
            }
            console.log('DEBUG: Przycisk Google kliknięty - END');
          }}
          disabled={loading}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            height: 60,
            width: 60,
            justifyContent: "center", 
            borderRadius: 10, 
            opacity: loading ? 0.7 : 1,
            backgroundColor: 'transparent'
          }}
        >
          <Image 
            source={require("../assets/images/GoogleLogo.png")}
            style={{
              width: 50,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('DEBUG: Przycisk Facebook kliknięty');
            if (!loading) {
              handleGoogleSignInPress();
            }
          }}
          disabled={loading}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            height: 60,
            width: 60,
            justifyContent: "center", 
            borderRadius: 10, 
            opacity: loading ? 0.7 : 1,
            backgroundColor: 'transparent'
          }}
        >
          <Image 
            source={require("../assets/images/fbLogo.png")}
            style={{
              width: 50,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('DEBUG: Przycisk Twitter kliknięty');
            if (!loading) {
              handleGoogleSignInPress();
            }
          }}
          disabled={loading}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            height: 60,
            width: 60,
            justifyContent: "center", 
            borderRadius: 10, 
            opacity: loading ? 0.7 : 1,
            backgroundColor: 'transparent'
          }}
        >
          <Image 
            source={require("../assets/images/xLogo.png")}
            style={{
              width: 50,
              resizeMode: "contain",
            }}
          />
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default LoginScreen;