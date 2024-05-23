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
          } else if (route.name === 'Matches') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Players') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
        },
      })}
    >
      <Tab.Screen   options={{ headerShown: false }}  name="Home" component={Home} />
      <Tab.Screen   options={{ headerShown: false }}  name="Matches" component={Matches} />
      <Tab.Screen   options={{ headerShown: false }}  name="Players" component={Players} />
    </Tab.Navigator>
  );
}

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Auth" component={AuthStackScreen} />
      <MainStack.Screen name="Main" component={TabNavigator} />
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
