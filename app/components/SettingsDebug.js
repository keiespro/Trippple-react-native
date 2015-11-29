
import React from 'react-native';
const {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  PushNotificationIOS,
  Image,
  AsyncStorage,
  Navigator
} = React

import AppActions from '../flux/actions/AppActions'
import colors from '../utils/colors'

import MagicNumbers from '../DeviceConfig'

class SettingsDebug extends React.Component{
  constructor(props){
    super()
  }
  render(){
      return (
          <View>

          <TouchableHighlight
            onPress={(f)=>{
                  AppActions.showCheckmark()

             }}
            underlayColor={colors.dark}
            style={styles.wrapfield}>
            <View>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>Checkmark</Text>
            <Image source={require('../../newimg/nextArrow.png')} />
          </View>
        </TouchableHighlight>

     <TouchableHighlight
            onPress={(f)=>{
               PushNotificationIOS.presentLocalNotification({alertBody:"HEY"})
            }}
            underlayColor={colors.dark}
            >
          <View>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>Local Notification</Text>
            <Image source={require('../../newimg/nextArrow.png')} />
          </View>
        </TouchableHighlight>



          </View>


      )

  }



}

export default SettingsDebug


const styles = StyleSheet.create({
   wrapfield:{
   borderBottomWidth:1,
   borderColor:colors.shuttleGray,
   height:80,
  //  backgroundColor:colors.outerSpace,
   alignItems:'center',
   justifyContent:'space-between',
   flexDirection:'row',
   paddingRight:MagicNumbers.screenPadding/1.5,
   marginLeft:MagicNumbers.screenPadding/1.5
 },
})
