import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	ActivityIndicator,
	TouchableOpacity,
	Image,
	StatusBar,
	ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { loginUserAPI } from "../api";

export default function Login({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [secureTextEntry, setSecureTextEntry] = useState(true);

	// Cargar el email y la contraseña almacenados cuando el componente se monta
	useEffect(() => {
		const loadStoredCredentials = async () => {
			try {
				const savedEmail = await AsyncStorage.getItem("savedEmail");
				const savedPassword = await AsyncStorage.getItem("savedPassword");
				if (savedEmail && savedPassword) {
					setEmail(savedEmail);
					setPassword(savedPassword);
				}
			} catch (error) {
				console.error("Error loading credentials from storage:", error);
			}
		};

		loadStoredCredentials();
	}, []);

	const toggleSecureTextEntry = () => {
		setSecureTextEntry(!secureTextEntry);
	};

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const handleLogin = async () => {
		console.log(`Email: ${email}, Password: ${password}`);

		if (!email || !password) {
			alert("All fields are required");
			return;
		}

		if (!validateEmail(email)) {
			alert("Invalid email format");
			return;
		}

		setLoading(true);

		try {
			const userData = await loginUserAPI(email.toLowerCase(), password);
			if (userData) {
				// Guardar los datos del usuario en AsyncStorage
				await AsyncStorage.setItem(
					"user",
					JSON.stringify({ uid: userData.uid, email: userData.email })
				);

				// Guardar el email y la contraseña para recordarlos
				await AsyncStorage.setItem("savedEmail", email);
				await AsyncStorage.setItem("savedPassword", password);

				console.log("Login successful");
				navigation.navigate("Main");
			}
		} catch (error) {
			console.error("Login failed:", error);
			alert("Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<LinearGradient
			colors={["#17628b34", "white"]}
			locations={[0, 15]}
			style={styles.container}
		>
			{loading ? (
				<ActivityIndicator size="large" color="#1f3a5c" />
			) : (
				<>
					<Image
						source={require("../assets/images/IMP-02.png")}
						style={styles.logo}
					/>
					<ScrollView
						contentContainerStyle={styles.scrollViewContent}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.container2}>
							<View>
								<Text style={styles.text}>Welcome!</Text>
							</View>
							<View style={styles.passwordContainer}>
								<TextInput
									style={styles.input}
									placeholder="Email"
									value={email}
									onChangeText={setEmail}
									placeholderTextColor="#28486e6b"
									autoCapitalize="none"
								/>
							</View>
							<View style={styles.passwordContainer}>
								<TextInput
									style={styles.input}
									placeholder="Password"
									value={password}
									onChangeText={setPassword}
									secureTextEntry={secureTextEntry}
									placeholderTextColor="#28486e6b"
									autoCapitalize="none"
								/>

								<TouchableOpacity
									onPress={toggleSecureTextEntry}
									style={styles.icon}
								>
									<Icon
										name={secureTextEntry ? "eye-off" : "eye"}
										size={24}
										color="#1f3a5c"
									/>
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								style={{
									...styles.button,
									marginTop: 30,
									backgroundColor: "#1f3a5c",
								}}
								onPress={handleLogin}
							>
								<Text style={{ ...styles.buttonText, color: "white" }}>
									Login
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={() => navigation.navigate("Register")}
							>
								<Text style={styles.buttonText}>Register</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => navigation.navigate("PasswordReset")}
							>
								<Text style={styles.linkText}>Forgot Password?</Text>
							</TouchableOpacity>
							<StatusBar style="auto" />
						</View>
					</ScrollView>
				</>
			)}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	logo: {
		width: 250,
		height: 150,
		backgroundColor: "transparent",
		marginTop: 50,
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "white",
	},
	scrollViewContent: {
		flexGrow: 1,
		alignItems: "center",
	},
	container2: {
		borderRadius: 10,
		padding: 20,
		backgroundColor: "rgb(255, 252, 241)",
		marginTop: 30,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 10,
		minHeight: 250,
		width: "100%",
		alignItems: "center",
		paddingVertical: 40,
	},
	text: {
		color: "#1f3a5c",
		fontSize: 20,
		fontFamily: "p-bold",
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#17628b94",
		borderBottomWidth: 7,
		borderRadius: 5,
		width: 300,
		marginTop: 10,
	},
	input: {
		flex: 1,
		color: "#1f3a5c",
		fontWeight: "500",
		padding: 10,
		fontSize: 14,
		fontFamily: "p-regular",
		position: "relative",
		bottom: -2,
	},
	icon: {
		padding: 10,
	},
	button: {
		backgroundColor: "#17628b34",
		padding: 6,
		margin: 5,
		borderRadius: 10,
		width: 300,
		alignItems: "center",
		borderWidth: 0,
		borderColor: "#17628b94",
		borderBottomWidth: 7,
		borderBottomColor: "rgba(0, 0, 0, 0.2)",
	},
	buttonText: {
		color: "#1f3a5c",
		fontSize: 14,
		fontFamily: "p-semibold",
		position: "relative",
		bottom: -2,
	},
	linkText: {
		color: "#1f3a5c",
		marginTop: 10,
		fontWeight: "500",
		fontSize: 12,
		fontFamily: "p-italic",
	},
});
