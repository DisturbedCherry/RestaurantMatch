import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
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
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>index</Text>
      <TextInput placeholder='email' value={email} keyboardType="email-address" autoCapitalize='none' onChangeText={setEmail} />
      <TextInput placeholder='password' secureTextEntry={true} value={password} autoCapitalize='none' onChangeText={setPassword} /> 
      <TouchableOpacity onPress={signIn}>
        <Text>Zaloguj Się</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signUp}>
        <Text>Zarejestruj się</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default index