import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    row:{
      backgroundColor: "transparent",
      padding: 20,
      paddingVertical: 40,
      borderRadius: 25,
      paddingTop: 60,
      alignItems: "center",
    },
    text: {
      fontSize: 30,
      textAlign: "center",
      fontWeight: "700",
      color: "white",
      paddingBottom: 20
    },
   
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'transparent',
      justifyContent: "center"
      
    },
    button: {
      backgroundColor: 'rgba(212, 188, 50, 0.76)',
      padding: 15,
      margin: 10,
      borderRadius: 10,
      width: 300,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      borderBottomWidth: 4, 
      borderBottomColor: 'rgba(0, 0, 0, 0.2)', 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
    buttonText: {
      color: '#15303F',
      fontSize: 20,
      fontWeight: '500',
    },
    logo: {
      width: 300,
      height: 150,
      marginBottom: 30,
    },
  });

  export default globalStyles;