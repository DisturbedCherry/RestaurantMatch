import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, ImageBackground, Text, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../FirebaseConfig'

const index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // TODO: Google SignIn & SignUp

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)')
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
  }

  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace('/(tabs)')
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    }
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
      <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Restaurant Match</Text>
      <TextInput 
        placeholder='email' 
        value={email} 
        keyboardType="email-address" 
        autoCapitalize='none' 
        onChangeText={setEmail} 
        placeholderTextColor="#FFF"
        style={{ width: 280, height: 70, backgroundColor: "#1E1825", color:"#FFF", marginBottom: 10, marginTop: 50, paddingHorizontal: 20, borderRadius: 16, borderWidth: 4, borderColor: "#B5B3BF"}}
      />
      <TextInput 
        placeholder='password' 
        secureTextEntry={true} 
        value={password} 
        autoCapitalize='none' 
        onChangeText={setPassword} 
        placeholderTextColor="#FFF"
        style={{ width: 280, height: 70, backgroundColor: "#1E1825", color:"#FFF",  marginBottom: 30, paddingHorizontal: 20, borderRadius: 16, borderWidth: 4, borderColor: "#B5B3BF" }}
      /> 
      <TouchableOpacity onPress={signIn} style={{ marginBottom: 20, backgroundColor: "#1E1825", width: 220, height: 60, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 4, borderColor: "#8E5AFF" }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>Zaloguj się</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signUp} style={{ marginBottom: 20, backgroundColor: "#1E1825", width: 220, height: 60, justifyContent: "center", alignItems: "center", borderRadius: 10, borderWidth: 4, borderColor: "#D5C338" }}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>Zarejestruj się</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </ImageBackground>


  )
}

export default index