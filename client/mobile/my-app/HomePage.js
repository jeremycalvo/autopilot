import React, { useState, setState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, AsyncStorage, TouchableOpacity, Dimensions, SelectField} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer, NavigationContainerRefContext } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginPage';
import RegisterScreen from './RegisterPage';
import { WebView } from 'react-native-webview';
import App from './App';
import axios from 'axios';
import * as urls from "./constants/network"
import * as logo from "./constants/images"
import { api_recipe, api_recipe_list, api_recipe_delete } from "./API/Recipe";


const { width, height } = Dimensions.get('window');



export default function HomeScreen({ navigation }) {
  const [isshowWebview, showWebView] = useState(false);
  const [service, setService] = useState([]);
  const [recipe, setRecipes] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  const getScenarios = async () => {
		const response = await api_recipe_list();
    console.log(response )
		setScenarios(response);
	};

  

  useEffect(() => {

		getService();
		getRecipes();
		getScenarios();
	}, [service]);
  

  const findServiceByCode = (serviceCode) => {
		for (let i = 0; i < recipe.length; i++) {
			if (recipe[i].code === serviceCode) {
				return recipe[i];
			}
		}
		return "Service not found";
	};

  const getService = async () => {
    const token = await AsyncStorage.getItem('token');
   
    try {
      const response = await axios.get('http://' + urls.backUrl + '/services', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setService(response.data);
    } catch (err) {
       console.error(err);
    }
  }

  const getImagePath = (serviceCode) => {
    return "./assets/" + serviceCode + ".png"
	};
  

  const getRecipes = async () => {
		const response = await api_recipe();
		for (let i = 0; i < response.length; i++) {
			response[i].logoPath =
				"http://" + urls.backUrl + "/" + response[i].code + ".svg";
		}
		setRecipes(response);
	};
  

  const handlePressButton = async () => {
    try {
      if (isshowWebview) {
        showWebView(false)
      }
      else {
        showWebView(true)
      }
    } catch (e) {
      console.error(e);
    }
  }
    const clearing = async () => {
        let context = this;
        try {
          await AsyncStorage.removeItem('token');
          checkUserSignedIn();
        } catch (error) {
          console.error(error);
        }
      };
      
      const checkUserSignedIn = async  () => {
        let context = this;
        try {
          const value = await AsyncStorage.getItem('token');
          if (value != null){
          }
          else {
            navigation.navigate("Login")
          }
        } catch (error) {
          console.error(error)
        }
      };
    
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => clearing()} style={styles.Loginbutton} >
          <Text style={styles.LoginButtonText}>Sign out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate({name: "AreaTrigger", params: {recipe: recipe}})} style={styles.Editbutton}   >
          <Image source={require("./assets/edit.png")} style={{width: width * 0.1,
      height: height * 0.1}} resizeMode= 'contain' />
        </TouchableOpacity>
          <Text style={styles.title}>My areas</Text>
          <View style={styles.buttonsContainer}>
            {scenarios.map((item, index) => 
              <TouchableOpacity key={index} style={styles.Area1} onPress={() => api_recipe_delete(item._id)}>
                <Text style={styles.LoginButtonText}> {item.name}</Text>
              </TouchableOpacity>
            )}
          </View>
        {/* <TouchableOpacity style={styles.Area2} >
          <Text style={styles.LoginButtonText}>Send Messages</Text>
        </TouchableOpacity> */}
        <Text style={styles.registertitle2}>Connection to sevices</Text>
        <View style={{ flexDirection: 'row' }}>
         {recipe.map((item, index) => {
            let targetScreen = 'Spotify';
            if (item.code === 'sheets' || item.code === 'gmail') {
              targetScreen = 'Google';
            }
            return (      
              <TouchableOpacity key={index} style={[styles.Spotifybutton, {top: height * (0.35 - ((scenarios.length - scenarios.length % 2) / 15))}]} onPress={() => navigation.navigate({ name: targetScreen, params: { serviceCode: item } })}>
                <Image source={logo.Logos[item.code]} style={{ width: width * 0.13,  height: height * 0.13, }} resizeMode= 'contain' />
              </TouchableOpacity>
            )})}
        </View>


      </View>
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
      textAlign: 'center',
      numberOfLines: 1,
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
    Editbutton: {
      width: width * 0.1,
      height: height * 0.1,
      position: 'absolute',
      top: '3%',
    left: '10%',
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginTop: 16,
    },
    Area1: {
      backgroundColor: '#4D47C3',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      marginVertical: 8,
      width: '40%',
      height: '30%',
      marginLeft: 16,
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
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
      // position: 'absolute',
      top: height * 0.35,
      paddingHorizontal: 10
      // borderRadius: 10,
      // paddingVertical: 10,
      // paddingHorizontal: 12
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
      width: width * 0.25, 
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
  