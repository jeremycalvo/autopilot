import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, AsyncStorage, TouchableOpacity, Dimensions, SelectField} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginPage';
import RegisterScreen from './RegisterPage';
import HomeScreen from './HomePage';
import SpotifyScreen from './SpotifyPage';
import GoogleScreen from './GooglePage';
import AreaTriggerScreen from './AreaTriggerPage';
import AreaReactionScreen from './AreaReactionPage';

import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';

const AuthContext = React.createContext();

const { width, height } = Dimensions.get('window');

const getToken = async () => {
  let usertoken = null;
  try {  
    const token = await AsyncStorage.getItem('token')
    usertoken = JSON.parse(token);    
  } catch (error) {
    console.error('Error geting token', error);
  }
  return (usertoken);
};


function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}



function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {  
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
      
              <Stack.Screen name="SignUp" component={RegisterScreen} options={{title: 'Sign up'}}/>
              <Stack.Screen name="Login" component={LoginScreen} options={{title: 'Login'}}/>
              <Stack.Screen name="Spotify" component={SpotifyScreen} options={{title: 'Spotify'}}/>
              <Stack.Screen name="Google" component={GoogleScreen} options={{title: 'Google'}}/>
              <Stack.Screen name="AreaTrigger" component={AreaTriggerScreen} options={{title: 'AreaTrigger'}}/>
              <Stack.Screen name="AreaReaction" component={AreaReactionScreen} options={{title: 'AreaReaction'}}/>
              
            
            <Stack.Screen name="Home" component={HomeScreen} />

        </Stack.Navigator>
      </NavigationContainer>
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

