// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 


// Importar pantallas
import Home from './screens/Home';
import QuarterFinals from './screens/QuarterFinals';
import Players from './screens/Players';
import Login from './auth/Login';
import Register from './auth/Register';
import Tournaments from './screens/Tournaments';
import Bets from './screens/Bets';
import Wallet from './screens/Wallet';
import Settings from './screens/Settings';
import PasswordReset from './auth/PasswordReset';
import SemiFinals from './screens/SemiFinals';
import Finals from './screens/Finals';



const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();

const HomeStack = createStackNavigator();


function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
      <AuthStack.Screen name="PasswordReset" component={PasswordReset} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}



function TournamentsStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Tournaments" component={Tournaments} options={{ headerShown: false }} />
      <HomeStack.Screen name="Players" component={Players} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}

function BetStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Bets" component={Bets} options={{ headerShown: false }} />
      <HomeStack.Screen name="QuarterFinals" component={QuarterFinals} options={{ headerShown: false }} />
      <HomeStack.Screen name="SemiFinals" component={SemiFinals} options={{ headerShown: false }} />
      <HomeStack.Screen name="Finals" component={Finals} options={{ headerShown: false }} />
    </HomeStack.Navigator>
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
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Bets') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 10,
          height: 65,
        },
        tabBarIconStyle: {
          fontSize: 15,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
        
      })}
    >
      <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
      <Tab.Screen options={{ headerShown: false }} name="Tournaments" component={TournamentsStackScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Bets" component={BetStackScreen} />
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