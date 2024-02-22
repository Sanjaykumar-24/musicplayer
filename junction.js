import AudioProvider from "./audioProvider"
import React from "react";
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Player from './player';
import AudioList from './audioiList';
import { StatusBar} from 'expo-status-bar';
import { View ,Text} from "react-native";
export default function Junction(){
  const Tab = createBottomTabNavigator();
  const screenOptions ={
    tabBarLabelStyle:{
      fontSize:18,
    },
    tabBarActiveTintColor:'orange',
    tabBarInactiveTintColor:'gray',
    tabBarStyle:{
       backgroundColor:'black',
       height:60,
       borderWidth:0,
       borderColor:'orange',
       borderTopWidth:0,
       marginBotton:30
    },
    headerStyle:{
      backgroundColor:'black',
      borderBottomWidth:2,
      borderColor:'orange',
    },
    headerTitleStyle:{
     fontSize:30,
     color:'orange',
    }
  }
  return (
    <React.Fragment>
    <AudioProvider/>
    <StatusBar/>
    <Tab.Navigator screenOptions={screenOptions}>
    <Tab.Screen name='MYMUSIC' component={AudioList} options={{tabBarIcon:()=>{
      return <Ionicons name="headset" size={30} color="orange" />
    }}}/>
    <Tab.Screen name='player' component={Player} options={{headerShown:false,tabBarIcon:()=>{
      return <FontAwesome5 name="compact-disc" size={30} color="orange" />
    }}}/>
    </Tab.Navigator>
    </React.Fragment>
  );
}

