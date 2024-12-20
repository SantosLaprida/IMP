import { enableScreens } from "react-native-screens";

enableScreens();

import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { TouchableOpacity, Text, View, LogBox } from "react-native";
import { registerRootComponent } from "expo";

if (!__DEV__) {
  console.log = (...args) => {
    console.warn("LOG:", ...args);
  };
  console.error = (...args) => {
    console.warn("ERROR:", ...args);
  };
} else {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    originalConsoleError(...args);
    console.log("Global Error Caught: ", args);
  };
}

// Import screens
import Home from "./screens/Home";
import Players from "./screens/Players";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Tournaments from "./screens/Tournaments";
import Bets from "./screens/Bets";
import Wallet from "./screens/Wallet";
import Settings from "./screens/Settings";
import PasswordReset from "./auth/PasswordReset";
import QuarterFinals from "./screens/QuarterFinals";
import SemiFinals from "./screens/SemiFinals";
import Finals from "./screens/Finals";
import ThirdPlace from "./screens/ThirdPlace";
import Results from "./screens/Results";
import TournamentDetails from "./screens/TournamentDetails";

// Configure LogBox
LogBox.ignoreAllLogs(true);

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();
const HomeStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="PasswordReset"
        component={PasswordReset}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

function BetStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Bets"
        component={Bets}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

function CustomTabBarButton({ children, onPress, isFocused }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isFocused ? "black" : "black",
        borderColor: isFocused ? "#2296F3" : "grey",
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 60,
        marginHorizontal: 10,
        width: 80,
        position: "relative",
        top: -20,
        borderWidth: 3,
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
  return (
    <Tab.Navigator
      initialRouteName="Bet"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Bet") {
            iconName = focused ? "cash" : "cash-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
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
          fontFamily: "p-medium",
        },
      })}
    >
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarButton: (props) => <BetTabBarButton {...props} />,
          tabBarIcon: ({ focused, color, size }) => (
            <>
              <Ionicons
                name="cash"
                size={30}
                color={focused ? "#2296F3" : "grey"}
              />
              <Text
                style={{
                  color: focused ? "#2296F3" : "grey",
                  fontFamily: "p-bold",
                  fontSize: 12,
                }}
              >
                Bet
              </Text>
            </>
          ),
          tabBarLabel: () => null, // Remove default label
        }}
        name="Bet"
        component={BetStackScreen}
      />

      <Tab.Screen
        options={{ headerShown: false }}
        name="Account"
        component={Settings}
      />
    </Tab.Navigator>
  );
}

function MainStackScreen() {
  // Log for apk build testing

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Auth" component={AuthStackScreen} />
      <MainStack.Screen name="Main" component={TabNavigator} />
      <MainStack.Screen name="Players" component={Players} />
      <MainStack.Screen name="QuarterFinals" component={QuarterFinals} />
      <MainStack.Screen name="SemiFinals" component={SemiFinals} />
      <MainStack.Screen name="Finals" component={Finals} />
      <MainStack.Screen name="ThirdPlace" component={ThirdPlace} />
      <MainStack.Screen name="Results" component={Results} />
      <MainStack.Screen
        name="TournamentDetails"
        component={TournamentDetails}
      />
    </MainStack.Navigator>
  );
}

function App() {
  // Log for apk build testing

  // Call useFonts at the top level of the functional component
  const [fontsLoaded] = useFonts({
    "p-bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
    "p-semibold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "p-medium": require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
    "p-light": require("./assets/fonts/Poppins/Poppins-Light.ttf"),
    "p-regular": require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    "p-italic": require("./assets/fonts/Poppins/Poppins-Italic.ttf"),
  });

  // Use effect to handle splash screen and font loading
  React.useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Load fonts or perform other async operations here
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainStackScreen />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default registerRootComponent(App);
