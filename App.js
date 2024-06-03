// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 


// Importar pantallas
import Home from './screens/Home';
import Matches from './screens/Matches';
import Players from './screens/Players';
import Login from './auth/Login';
import Register from './auth/Register';
import Tournaments from './screens/Tournaments';
import Bets from './screens/Bets';
import Wallet from './screens/Wallet';
import Settings from './screens/Settings';


const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tournaments') {
            iconName = focused ? 'trophy' : 'trophy-outline'; // Cambia a un icono de trofeo
          } else if (route.name === 'Bets') {
            iconName = focused ? 'cash' : 'cash-outline'; // Cambia a un icono de dinero
          } 
          else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline'; // Cambia a un icono de dinero
          }
          else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          height: 65, // Ajusta esta altura según tus necesidades
        },
        tabBarIconStyle: {
          fontSize: 15, // Aumenta el tamaño de los iconos
        },
        tabBarLabelStyle: {
          fontSize: 10, // Ajusta el tamaño de la etiqueta del tab
        },
      })}
    >
      <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
      <Tab.Screen options={{ headerShown: false }} name="Tournaments" component={Tournaments} />
      <Tab.Screen options={{ headerShown: false }} name="Bets" component={Bets} />
      <Tab.Screen options={{ headerShown: false }} name="Wallet" component={Wallet} />
      <Tab.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Auth" component={AuthStackScreen} />
      <MainStack.Screen name="Main" component={TabNavigator} />
      <MainStack.Screen name="Matches" component={Matches} />
      <MainStack.Screen name="Players" component={Players} />
    </MainStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainStackScreen />
    </NavigationContainer>
  );
}
