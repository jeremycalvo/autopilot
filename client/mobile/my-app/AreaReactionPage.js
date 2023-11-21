import { View, ScrollView, Text, StyleSheet, Image, TextInput, Button, AsyncStorage, TouchableOpacity, Dimensions, SelectField} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, { useState, setState, useEffect } from 'react';
import * as logo from "./constants/images"
import axios from "axios";
import * as urls from "./constants/network"



const { width, height } = Dimensions.get('window');





export default function AreaReactionScreen({ route, navigation }) {

    const [selectedService, setselectedService] = useState(route.params.recipe[0].code);
    const [selectedID, setselectedID] = useState(0);
    const [selectedService2, setselectedService2] = useState(route.params.recipe[0].code);
    const [selectedID2, setselectedID2] = useState(0);
    const [selectedReaction, setselectedReaction] = useState(route.params.recipe[0].reactions[0].code);
    const [selectedName, setSelectedName] = useState("")
    const [isInputsFilled, setIsInputsFilled] = useState(false);
    const [reaction, setReaction] = useState(null);
    const [selectedNames, setSelectedNames] = useState(Array(route.params.recipe[selectedID]?.reactions[selectedID2]?.params?.length).fill(''));




  const handleName = (value) => {
    setSelectedName(value);
  }
   	
  const handleNameChange = (value, textInputKey) => {
    console.log(selectedNames.length, " dsdpskd");
    const newSelectedNames = [...selectedNames]; // make a copy of the array to avoid mutation
    newSelectedNames[textInputKey] = value; // update the specific element corresponding to the TextInput key
    setSelectedNames(newSelectedNames);
    if (selectedNames.length == maxIndex) // update selectedNames state with the new array
      checkInputsFilled(newSelectedNames);
  };
  const maxIndex = route.params.recipe[selectedID].reactions[selectedID2].params.length;
  
  const handleTrigger = (value) => {
    setSelectedNames(Array(route.params.recipe[selectedID]?.reactions[selectedID2]?.params?.length).fill(''));
    console.log("selectedNames", selectedNames);
    console.log("maxIndex", maxIndex);
      setselectedService(value);
  };
    
  useEffect(() => {
      let i = 0;
      for (i = 0; selectedService !== route.params.recipe[i].code; i++) {}
      setselectedID(i);
      checkInputsFilled()
  }, [selectedService]);
  
  useEffect(() => {
      checkInputsFilled()
  }, [selectedID]);
  
  useEffect(() => {
      checkInputsFilled()
  }, [selectedID2]);
 
  const handleAction = () => {
    const Naction = {
      service: selectedService,
      function: selectedReaction,
      params: selectedNames,
    };
    setReaction(Naction)
    console.log(reaction);
  }
  useEffect(() => {
   createArea();
 }, [reaction, selectedName]);

const createArea = async () => {
  const token = await AsyncStorage.getItem("token");
   console.log("TOKEN ",token);
  console.log("nom Area: ",selectedName);
  console.log("action: ",route.params.action);
  console.log("reaction:  ",reaction);
  if(selectedName.length == 0 || reaction == null || route.params.action == null) {
    return 0;
  } 
    let data = {
        action: route.params.action,
        reaction: reaction,
        name: selectedName
    }
	try {
		const response = await axios.put("http://" + urls.backUrl + "/recipe/add", data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		navigation.navigate("Home");
	} catch (err) {
		console.error(err);
	}
}

  const handleReaction = (value) => {
    setSelectedNames(Array(route.params.recipe[selectedID]?.reactions[selectedID2]?.params?.length).fill(''));
    setselectedReaction(value);
  };
  
  useEffect(() => {
    let i = 0;
    for (i = 0; selectedReaction !== route.params.recipe[selectedID].reactions[i].code; i++) {}
      setselectedID2(i);
  }, [selectedReaction]);

  const checkInputsFilled = (values) => {
    console.log("values", values);
    console.log("maxINDEX", maxIndex);
    const filled = values && values.every(value => value);    // check if all values are non-empty
    setIsInputsFilled(filled);
  };
  

    return(
    <View style={styles.container} >
        <Text style={styles.title}>Reactions</Text>
        <Image source={logo.Logos[selectedService]} style={{ width: width * 0.13,  height: height * 0.13,  position: 'absolute', top: '16%'}} resizeMode= 'contain' />
        <View style={{ flexDirection: 'row' }}>

            <Picker
            selectedValue={selectedService}
            style={styles.picker}
            onValueChange={handleTrigger}
            >
                  {route.params.recipe.filter(item => item.reactions  && item.reactions.length > 0).map((item, index) => (
                 <Picker.Item key={index} label={item.name} value={item.code} />
                 ))}
            </Picker>
            <Picker
                selectedValue={selectedReaction}
                style={styles.picker}
                onValueChange={handleReaction}
                >
                {route.params.recipe[selectedID].reactions.map((item, index) => (
                  <Picker.Item key={index} label={item.name} value={item.code} />
                  ))}
            </Picker>
        </View>
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <TextInput  
          onChangeText={handleName}
          placeholder="Choose a name for your AREA"
          placeholderTextColor='#4D47C3'
          style={{
            height: height * 0.05,
            width:  width * 0.75,
            borderColor: '#A7A3FF',
            backgroundColor: '#A7A3FF',
            textAlign: 'center',
            borderWidth: 10,
            borderRadius:40,
            position: "relative",
            alignSelf: 'center',
          }}
          />
          {route.params.recipe[selectedID].reactions[selectedID2].params.map((item, index) => (
            <TextInput
              key={index}
              onChangeText={(value) => handleNameChange(value, index)}
              placeholder={item}
              placeholderTextColor='#4D47C3'
              style={{
                height: height * 0.05,
                width:  width * 0.75,
                borderColor: '#A7A3FF',
                backgroundColor: '#A7A3FF',
                textAlign: 'center',
                borderWidth: 10,
                paddingVertical: 10,
                alignSelf: 'center',
                borderRadius: 40,
                marginVertical: 10,
              }}
            />
          ))}

        
        
{(!route.params.recipe[selectedID].reactions[selectedID2].params.length || isInputsFilled) &&
            <TouchableOpacity
              onPress={handleAction}
              style={styles.Loginbutton}
            >
            <Text style={styles.LoginButtonText}>ADD A SCENARIO</Text>
          </TouchableOpacity> 
          }
        </ScrollView>
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
    picker: {
        height: height/2,
        width: width/2,
        position: "relative",
      top: "40%",
    },
    picker2: {
        height: height/2,
        width: width/2,
        position: "relative",
        top: "25%",
    },
    title: {
      color: '#000',
    //   paddingVertical: "1%",
      fontWeight: 'bold',
      fontSize: 35,
      position: "absolute",
      top: "14%",
    },
    title2: {
      color: '#000',
    //   paddingVertical: "1%",
      fontWeight: 'bold',
      fontSize: 35,
      position: "absolute",
      top: "48%",
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
        position: 'relative',
        top: '50%',
        alignItems: 'center',
        fontSize: 20,
        color: "#fff",
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20
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
      // position: 'absolute',
      top: '80%',
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