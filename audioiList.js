import React, { useContext, useEffect, useState,useMemo } from 'react'
import { Entypo } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library'
import { Foundation } from '@expo/vector-icons'; 
import { View ,Text, Modal, TouchableOpacity} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { AudioContext } from './App';
import { FlatList } from 'react-native-gesture-handler'
import { Audio } from 'expo-av';
export default function AudioList() {
  const {audio} = useContext(AudioContext)
  const [ok,Setok] = useState(false)
  const {curraudio,setcurrAudio} = useContext(AudioContext)
  const [sid,setId] = useState(curraudio.id)
  const {setDurationMilli,setPositionMilli} = useContext(AudioContext)
  const {songStatus,setsongStatus,setPlayback,playback} = useContext(AudioContext)
  const {prevsong,setPrevsong} = useContext(AudioContext)
  const [modelview,setModel] = useState({})
  const [select,setSelect] = useState('')
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
    const onPlayBack = async(songDetail)=>{
      if(songDetail.didJustFinish)
      {
       for(let i=0;i<audio.length;i++)
       {
        if(song.id===audio[i].id)
        {
          if(i===audio.length-1)
          {
            playAudio(audio[0])
          }
          else
          {
            playAudio(audio[i+1])
          }
        }
       }
      }
      setPositionMilli(songDetail.positionMillis)
      setDurationMilli(songDetail.durationMillis)
     }

    setcurrAudio(song)
    setId(song.id)
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
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await MediaLibrary.getPermissionsAsync();
      if (permission.granted) {
        Setok(true);
      } else {
        Setok(false);
      }
    };
    requestPermission();
    return;
  }, []);
  if(!ok)
  {
    return (<View style={{flex:1,backgroundColor:'black',alignItems:'center'}}><Text style={{marginTop:'10%',height:'10%',width:'90%',color:"orange"}}>please allow permission to access you interenal storage..!!</Text></View>)
  }
  return (
    <View style={{flex:1,backgroundColor:'black'}}>
    <FlatList data={audio} renderItem={(itemData)=>{
      return (
        <View>
        <View style={{flexDirection:'row',width:'93%',marginLeft:'3.5%',height:70,backgroundColor:'orange',justifyContent:'center',borderColor:'white',borderWidth:0.5,marginTop:10,borderRadius:20}}>
        <View style={{width:'15%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <View style={{width:'75%',height:'60%',backgroundColor:'black',borderRadius:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>{playAudio(itemData.item)}}>
        <Text style={{color:'orange',fontSize:30}}>{curraudio.id===itemData.item.id?songStatus.isPlaying?<Foundation name="pause" size={30} color="orange" />:<Entypo name="controller-play" size={30} color="orange" />:itemData.item.filename[0]}</Text>
        </TouchableOpacity>
        </View>
        </View>
        <TouchableOpacity  onPress={()=>{
          playAudio(itemData.item)
        }}>
        <View style={{marginLeft:'1%',marginTop:'2%',width:'75%',height:55,flexDirection:'col'}}>
        <Text style={{color:'black',fontSize:20,height:'50%'}}>{itemData.item.filename}</Text>
        <Text style={{marginRight:'80%',marginTop:'3%'}}>{converts(itemData.item.duration)}</Text>
        </View>
        </TouchableOpacity>
        <View style={{paddingRight:'5%',width:'10%',height:'100%',justifyContent:'center',alignItems:'center'}}>
        <Entypo name="dots-three-vertical" onPress={()=>{setModel(true)
           setSelect(itemData.item)}} size={24} color="black"/>
        </View>
        </View>
       <Modal visible={modelview} onRequestClose={()=>{setModel(false)}} transparent={true}>
       <View style={{marginLeft:'3%',width:'95%',height:'30%',marginTop:'150%',backgroundColor:'black',borderRadius:20,borderWidth:1,borderColor:'white'}}>
       <View style={{flex:1,flexDirection:'row',justifyContent:'left',alignItems:'center',borderBottomColor:'white',borderBottomWidth:1}}>
       <Text style={{color:'orange',marginLeft:'2%',fontSize:20}}>{select.filename}</Text>
       </View>
       <View style={{flex:3}}>
       <View style={{width:'100%',height:'50%',flexDirection:'row',justifyContent:'left',alignItems:'center',marginLeft:'5%'}}>
       <TouchableOpacity onPress={()=>{playAudio(select)}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
       {(select.id===sid&&songStatus.isPlaying)?<Foundation style={{marginTop:8}} name="pause" size={25} color="orange" />:<Entypo style={{marginTop:5}} name="controller-play" size={25} color="orange" />}
       <Text style={{fontSize:20,color:'orange'}}>{(select.id===sid&&songStatus.isPlaying)?"  pause":"play"}</Text>
       </TouchableOpacity>
       </View>
       <View style={{width:'100%',height:'25%',flexDirection:'row',justifyContent:'left',alignItems:'center',marginLeft:'5%'}}><TouchableOpacity onPress={()=>{setModel(false)}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}><MaterialIcons name="cancel" size={23} color="orange" /><Text style={{fontSize:20,color:'orange'}}> Cancel</Text></TouchableOpacity></View>
       </View>
       </View>
       </Modal>
        </View>
      )
    }}/>
    </View>
  )
  }