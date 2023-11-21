import React, { useState, setState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, AsyncStorage, TouchableOpacity, Dimensions, SelectField, Linking} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginPage';
import RegisterScreen from './RegisterPage';
import { WebView } from 'react-native-webview';
import App from './App';
import axios from 'axios';
import NetworkInfo from 'react-native-network-info';
import * as urls from "./constants/network"


const { width, height } = Dimensions.get('window');

export default function GoogleScreen({ route, navigation }) {
    let d_uri = route.params.serviceCode.link; 
    
    let code = "";


    const service_connection = async () => {
      const token = await AsyncStorage.getItem('token');
     
      try {
        const response = await axios.get('http://' + urls.backUrl + '/services/' + route.params.serviceCode.code + '/auth', {
          params: {code},
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigation.navigate("Home");
      } catch (err) {
         console.error(err);
      }
    };

    return (

      <WebView 
      // ref={(ref) => { this.webview = ref; }}
      source={{ uri: d_uri }}  style={{marginTop: 20}}
      onNavigationStateChange={(event) => {
        const test = event.url;
        if (test.search("localhost:8081") > 0 && test.search("code=") > 0) {
          code =  test.substring(test.search("code=") + 5, test.search("&"));
          service_connection();
        }
      }}
      />
);
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
      fontSize: 35,
      position: "absolute",
      top: "15%",
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
      top: "75%",
    },
    LoginButtonText: {
      fontSize: 15,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      // textTransform: "uppercase"
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
        top: "5%"
    },
    Loginbutton: {
      backgroundColor: '#4D47C3',
      position: 'absolute',
      top: '6%',
      left: '75%',
      fontSize: 20,
      color: "#4D47C3",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12
    },
    Area1: {
      backgroundColor: '#1DB954',
      position: 'absolute',
      top: '40%',
      left: '5%',
      fontSize: 20,
      color: "#1DB954",
      borderRadius: 10,
      paddingVertical: 50,
      paddingHorizontal: 35
    },
    Area2: {
      backgroundColor: '#4D47C3',
      position: 'absolute',
      top: '40%',
      left: '50%',
      fontSize: 20,
      color: "#1DB954",
      borderRadius: 10,
      paddingVertical: 50,
      paddingHorizontal: 35
    },
    Spotifybutton: {
      position: 'absolute',
      top: '80%',
      left: "22.0%",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12
    },
    Discordbutton: {
      position: 'absolute',
      top: '80%',
      left: "60.0%",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12
    },
    Spotify: {
      position: 'absolute',
      top: '80%',
      left: "22.0%",
      width: width * 0.15, 
      height: height * 0.15 
    },
    Discord: {
      position: 'absolute',
      top: '80%',
      left: "60.0%",
      width: width * 0.15, 
      height: height * 0.15 
    }
  });