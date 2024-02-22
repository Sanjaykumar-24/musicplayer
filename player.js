import React, { useContext, useEffect, useMemo, useState} from 'react'
import Slider from '@react-native-community/slider';
import { View ,Text} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AudioContext } from './App'
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default function Player() {
  function convertMillisToTime(millis) {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  const {curraudio} = useContext(AudioContext)
  const [startTime,setStartTime] = useState(0);
  const {setDurationMilli,setPositionMilli} = useContext(AudioContext);
  const {playback,setPlayback,setcurrAudio,prevsong,setPrevsong,songStatus,setsongStatus} = useContext(AudioContext)
  const {positionMilli,durationMilli} = useContext(AudioContext)
  const {audio} = useContext(AudioContext)
  const converts=(time)=>{
    const hrs = time / 60;
    const minute = Math.floor(hrs);
    const percent = Math.ceil((hrs - minute) * 60);
    const second = Math.ceil((60 * percent) / 100);
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
    const formattedSecond = second < 10 ? `0${second}` : `${second}`;
    return formattedMinute+':'+formattedSecond;
  }
  const playAudio = async(song)=>{
    const onPlayBack=async(songDetail)=>{
      setPositionMilli(songDetail.positionMillis)
      setDurationMilli(songDetail.durationMillis)
     }
    setcurrAudio(song)
    if(songStatus===0)
    {
      setPrevsong(song)
      const playSong = new Audio.Sound()
      const status = await playSong.loadAsync({uri:song.uri},{shouldPlay:true})
      setsongStatus(status)
      setPlayback(playSong)
      playSong.setOnPlaybackStatusUpdate(onPlayBack)
    }
    if(songStatus.isLoaded&&songStatus.isPlaying&&prevsong.id===song.id)
    {
      const status = await playback.setStatusAsync({shouldPlay:false})
      setsongStatus(status)
    }
    if(songStatus.isLoaded&&!songStatus.isPlaying&&prevsong.id===song.id)
    {
       const status = await playback.playAsync()
       setsongStatus(status)
    }
    if(songStatus.isLoaded&&prevsong.id!==song.id)
    {
      await playback.stopAsync()
      await playback.unloadAsync()
      const status = await playback.loadAsync({uri:song.uri},{shouldPlay:true})
      setsongStatus(status)
      setPrevsong(song)
      playback.setOnPlaybackStatusUpdate(onPlayBack)
    }
  }
  const next=()=>{
    for(let i=0;i<audio.length;i++)
    {
       if(audio[i].id===curraudio.id)
       {
        if(i==audio.length-1)
        {
          playAudio(audio[0])
        }
        else
         playAudio(audio[i+1])
       }
    }
  }
  const prev=()=>{
    for(let i=0;i<audio.length;i++)
    {
       if(audio[i].id===curraudio.id)
       {
        if(i==0)
        {
          playAudio(audio[audio.length-1])
        }
        else
         playAudio(audio[i-1])
       }
    }
  }
 
  const sliderValue = positionMilli > 0 && durationMilli > 0 ? positionMilli / durationMilli : 0;
  const startime = useMemo(()=>{
    setStartTime(convertMillisToTime(positionMilli))
  },[sliderValue])
  const changeValue = (value) => {
    const newPositionMillis = value * durationMilli;
    playback.setPositionAsync(newPositionMillis);
  };
  return (
    <View style={{flex:1,backgroundColor:'black'}}>
    <View style={{width:'100%',marginTop:'20%',height:350,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
    <View style={{width:300,height:300,flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'orange'}}>
    <MaterialCommunityIcons name="music-circle" size={250} color="orange" />
    </View>
    </View>
    <View style={{w:'100%',height:'100%'}}>
    <View style={{width:'95%',height:"12%",flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
    <Text style={{color:'orange',fontSize:20,marginLeft:'1%'}}>{(curraudio.filename)}</Text>
    </View>
    <View style={{width:'100%',height:'8%',justifyContent:'center',alignItems:'center'}}>
    <View style={{width:'90%',height:'80%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text style={{color:'orange'}}>{startTime}</Text></View>
    <View>
    <Text style={{color:'orange'}}>{!curraudio?"Null":converts(curraudio.duration)}</Text>
    </View>
    </View>
    <Slider value={sliderValue} onValueChange={(value)=>{changeValue(value)}} style={{width:'95%'}} minimumValue={0} maximumValue={1} minimumTrackTintColor='orange' maximumTrackTintColor='white' thumbTintColor='orange'/>
    </View>
    <View style={{width:'100%',height:'18%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
    <View style={{width:'65%',height:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
    <TouchableOpacity onPress={prev}><MaterialCommunityIcons name="skip-previous-circle-outline" size={60} color="orange" /></TouchableOpacity>
    <TouchableOpacity onPress={()=>{playAudio(curraudio)}}>{songStatus.isPlaying?<Ionicons name="pause-circle-outline" size={65} color="orange" />:<Ionicons name="play-circle-outline" size={65} color="orange" />}</TouchableOpacity>
    <TouchableOpacity onPress={next}><MaterialCommunityIcons name="skip-next-circle-outline" size={62} color="orange" /></TouchableOpacity>
    </View>
    </View>
    </View>
    </View>
  )
}
