import React, {useState} from 'react'
import Junction from './junction'
import Error from './error'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
export const AudioContext = React.createContext()
export default function App() {
  const stack = createStackNavigator()
 return (
<NavigationContainer>
<StatusBar />
<stack.Navigator>
<stack.Screen name='send' component={Send} options={{headerShown:false}}/>
<stack.Screen name='Error' component={Error}/>
</stack.Navigator>
</NavigationContainer>
  )
}
const Send=()=>{
  const [audio,setAudio] = useState([])
  const [playingsong,setPlayingsong] = useState({})
  const [Like,setLike] = useState([])
  const [curraudio,setcurrAudio] = useState('')
  const [prevsong,setPrevsong] = useState({})
  const [songStatus,setsongStatus] = useState(0)
  const [playback,setPlayback] = useState(null)
  const [positionMilli,setPositionMilli] = useState(0)
  const [durationMilli,setDurationMilli] = useState(0)
  return (<AudioContext.Provider value={{setLike,Like,playingsong,setPlayingsong,positionMilli,setDurationMilli,setPositionMilli,durationMilli,prevsong,setPrevsong,setAudio,audio,curraudio,setcurrAudio,setsongStatus,songStatus,playback,setPlayback}}>
          <Junction/>
          </AudioContext.Provider>)
}