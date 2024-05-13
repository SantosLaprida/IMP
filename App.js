
import React, { useState } from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Registro from './Register'; // Importa el componente Registro desde registro.js
import Players from './Players';
import LoginScreen from './loginScreen';
import Home from './Home';

const Stack = createStackNavigator();

export default function App() {


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="loginScreen" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Registro" component={Registro} />
          <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
          <Stack.Screen options={{ headerShown: false }} name="Players" component={Players} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}



