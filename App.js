// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { TouchableOpacity, Text } from 'react-native';

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




function BetStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Bets" component={Bets} options={{ headerShown: false }} />
      <HomeStack.Screen name="QuarterFinals" component={QuarterFinals} options={{ headerShown: false }} />
      <HomeStack.Screen name="SemiFinals" component={SemiFinals} options={{ headerShown: false }} />
      <HomeStack.Screen name="Finals" component={Finals} options={{ headerShown: false }} />
      <HomeStack.Screen name="Players" component={Players} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}


function CustomTabBarButton({ children, onPress, isFocused }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isFocused ? 'black' : 'black',
        borderColor: isFocused ? '#2296F3' : 'grey',
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
        marginHorizontal: 10,
        width: 90,
        position: "relative",
        top: -30,
        borderWidth: 4,
       
      }}
    >
      {children}
    </TouchableOpacity>
  );
}

function BetTabBarButton(props) {
  const isFocused = useIsFocused();
  return <CustomTabBarButton {...props} isFocused={isFocused} />;
}


function TabNavigator() {
  const [fontsLoaded] = useFonts({
    'kanit-bold': require('./assets/fonts/kanit/Kanit-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

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
          } else if (route.name === 'Bet') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarStyle: {
          paddingBottom: 20,
          paddingTop: 10,
          height: 80,
          backgroundColor: "black",
          borderColor: "transparent",
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: 'kanit-bold',
        },
      })}
    >
      <Tab.Screen options={{ headerShown: false }} name="Home" component={Home} />
      <Tab.Screen options={{ headerShown: false }} name="Tournaments" component={Tournaments} />
      <Tab.Screen 
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <BetTabBarButton {...props} />
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <Ionicons name="cash" size={32} color={focused ? '#2296F3' : 'grey'} />
              <Text style={{ color: focused ? '#2296F3' : 'grey', fontFamily: 'kanit-bold', fontSize: 13 }}>Bet</Text>
            </>
          ),
          tabBarLabel: () => null, // eliminar etiqueta predeterminada
        }}
        name="Bet"
        component={BetStackScreen}
      />
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
      <MainStack.Screen name="QuarterFinals" component={QuarterFinals} />
      <MainStack.Screen name="SemiFinals" component={SemiFinals} />
      <MainStack.Screen name="Finals" component={Finals} />
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