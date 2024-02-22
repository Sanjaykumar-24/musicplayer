import React, { useContext, useEffect } from 'react'
import { Alert, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as MediaLibrary from 'expo-media-library'
import Error from './error'
import { AudioContext } from './App'
export default function AudioProvider() {
    const {setAudio} = useContext(AudioContext)
    const navigation = useNavigation()
    useEffect(()=>{
  getPermission()
    },[])
    const permissionAlert=async()=>{
        Alert.alert("Permission requires", "This app needs to read the audio files..!!",[{
          text:"allow",
          onPress:()=>getPermission()
        },{
            text:'cancel',
            onPress:()=>permissionAlert()
        }])
    }
    const getPermission = async()=>{
        const permisson = await MediaLibrary.getPermissionsAsync()
        if(permisson.granted)
        {
            getAudioFiles();
        }
        if(!permisson.granted&&!permisson.canAskAgain)
        {
                return (navigation.navigate('error'))
        }
        if(!permisson.granted&&permisson.canAskAgain)
        {
            const {status,canAskAgain} = await MediaLibrary.requestPermissionsAsync();
            if(status==='denied'&&canAskAgain)
            {
                permissionAlert()
            }
            if(status==='granted')
            {
                getAudioFiles();
            }
            if(status==='denied'&&!canAskAgain)
            {
                return (navigation.navigate('error'))
            }
        }
    }
    const getAudioFiles = async()=>{
        let media = await MediaLibrary.getAssetsAsync({
            mediaType:'audio'
        })
        setAudio(media.assets)
    }
  return (
    <View></View>
  )
}
