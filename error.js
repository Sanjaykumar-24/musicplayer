import React from 'react'
import { View,Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
export default function Error({navigation}) {
  return (
    <View style={{marginLeft:'5%',flexDirection:'row',justifyContent:'space-between',width:'80%',height:'10%',alignItems:'center'}}>
    <MaterialIcons name="error" size={25} color="black" />
    <Text>Please allow permissions in your settings..!!</Text>
    </View>
  )
}
