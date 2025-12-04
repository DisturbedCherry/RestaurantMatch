import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth'
import * as Facebook from 'expo-auth-session/providers/facebook'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { Alert, Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../FirebaseConfig'

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Configure Facebook Auth Request - UPROSZCZONE
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '825184180489983',
    scopes: ['public_profile', 'email'], // Dodaj wymagane scopes
  });

  const signIn = async () => {
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        console.log('Email Sign-In Successful:', user.user?.email);
        router.replace('/(tabs)');
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
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        console.log('Email Sign-Up Successful:', user.user?.email);
        router.replace('/(tabs)');
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
    }
  }

  const handleGoogleSignInPress = () => {
    Alert.alert('Social media login pressed', "yay...")
  }


  return (
    <ImageBackground 
      source={require("../assets/images/Background.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image 
          source={require('../assets/images/LogoRM.png')}
          style={{ width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 }}
        />
        <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "bold" }}>Restaurant Match</Text>
        
        <TextInput 
          placeholder='email' 
          value={email} 
          keyboardType="email-address" 
          autoCapitalize='none' 
          onChangeText={setEmail} 
          placeholderTextColor="#FFF"
          editable={!loading}
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
          style={{ width: 280, height: 70, backgroundColor: "#1E1825", color:"#FFF",  marginBottom: 30, paddingHorizontal: 20, borderRadius: 16, borderWidth: 4, borderColor: "#B5B3BF" }}
        /> 
        
        <TouchableOpacity 
          onPress={signIn} 
          disabled={loading}
          style={{ marginBottom: 20, backgroundColor: "#1E1825", width: 220, height: 60, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 4, borderColor: "#8E5AFF", opacity: loading ? 0.7 : 1 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            {loading ? 'Loading...' : 'Zaloguj się'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={signUp} 
          disabled={loading}
          style={{ marginBottom: 20, backgroundColor: "#1E1825", width: 220, height: 60, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 4, borderColor: "#D5C338", opacity: loading ? 0.7 : 1 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
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
        <View style={{ flexDirection: 'row', gap: 32 }}>
          <TouchableOpacity 
          onPress={handleGoogleSignInPress} 
          disabled={loading}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            height: 60,
            justifyContent: "center", 
            borderRadius: 10, 
            opacity: loading ? 0.7 : 1 
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
          onPress={handleGoogleSignInPress} 
          disabled={loading}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            height: 60,
            justifyContent: "center", 
            borderRadius: 10, 
            opacity: loading ? 0.7 : 1 
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
          onPress={handleGoogleSignInPress} 
          disabled={loading}
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            height: 60,
            justifyContent: "center", 
            borderRadius: 10, 
            opacity: loading ? 0.7 : 1 
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