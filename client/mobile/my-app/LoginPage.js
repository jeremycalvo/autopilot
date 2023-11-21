import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, AsyncStorage } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import App from './App';
import axios from 'axios';
import RegisterScreen from './RegisterPage';
import { NetworkInfo } from 'react-native-network-info';
import * as urls from "./constants/network"




// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/login');
//       const json = await response.json();
//       setData(json);
//     } catch (error) {
//       console.error(error);
//     }
//     };
//   }

export default function LoginScreen({ navigation }) {
  const data = {
    username : 'username',
    password : 'password',
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post ('http://' + urls.backUrl + '/login', data);
      await AsyncStorage.setItem("token", response.data.token);
      navigation.navigate("Home")
      
    } catch (error) {
      console.error(error.response.data.message);
    }
  };
    return (
    <View style={styles.container}>
      <Text style={styles.title}>AREA</Text>
      <Text style={styles.subtitle}>Sign in to</Text>
      <Text style={styles.registertitle}>If you don’t have an account register</Text>
      <Text style={styles.registertitle2}>You can</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        style={styles.Registerbutton}
      >
        <Text style={styles.RegisterButtonText}>Register here !</Text>
      </TouchableOpacity>
      <TextInput  
        onChangeText={text => data.username = text}
        placeholder="Username"
        placeholderTextColor='#4D47C3'
        style={{
          height: "5%",
          width: "70%",
          borderColor: '#A7A3FF',
          backgroundColor: '#A7A3FF',
          borderWidth: 10,
          borderRadius:40,
          position: "relative",
          top: "-5%"
        }}
      />
      <TextInput
        onChangeText={text => data.password = text}
        placeholder="Password"
        placeholderTextColor='#4D47C3'
        secureTextEntry={true}
        style={styles.textInput}
    
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.Loginbutton}
      >
        <Text style={styles.LoginButtonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEffB44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    padding: "5%",
    fontWeight: 'bold',
    fontSize: 45,
    position: "absolute",
    top: "7%",
    left: "1%"
  },
  subtitle: {
    color: '#000',
    padding: "5%",
    fontWeight: 'bold',
    fontSize: 30,
    position: "absolute",
    top: "20%",
    left: "1%"
  },
  registertitle: {
    color: '#000',
    padding: "5%",
    fontSize: 20,
    position: "absolute",
    top: "25%",
    left: "1%"
  },
  registertitle2: {
    color: '#000',
    padding: "5%",
    fontSize: 20,
    position: "absolute",
    top: "28%",
    left: "1%"
  },
  LoginButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  RegisterButtonText: {
    fontSize: 18,
    color: "#4D47C3",
    fontWeight: "bold",
    alignSelf: "center",
  },
  textInput: {
      height: "5%",
      width: "70%",
      borderColor: '#A7A3FF',
      backgroundColor: '#A7A3FF',
      borderWidth: 10,
      borderRadius: 40,
      position: "relative",
      top: "0%"
  },
  Loginbutton: {
    backgroundColor: '#4D47C3',
    position: 'absolute',
    top: '65%',
    alignItems: 'center',
    fontSize: 20,
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  Registerbutton: {
    position: 'absolute',
    top: '29.7%',
    left: "22.0%",
    fontSize: 20,
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  }
});