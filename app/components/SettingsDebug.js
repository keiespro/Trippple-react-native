
import React, {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  PushNotificationIOS,
  Image,ScrollView,
  AsyncStorage,
  Navigator
}  from 'react-native';

import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import AppActions from '../flux/actions/AppActions'
import colors from '../utils/colors'
import NotificationPermissions from '../modals/NotificationPermissions'
import {MagicNumbers} from '../DeviceConfig'

class SettingsDebug extends React.Component{
  constructor(props){
    super()
  }
  render(){
      return (
          <ScrollView>

            <TouchableHighlight
              onPress={()=>{ AppActions.showCheckmark() }}
              >
              <View style={styles.wrapfield}>

                <Text style={{color:colors.white}}>Checkmark</Text>
                <Image source={require('../../assets/nextArrow.png')} />
              </View>
            </TouchableHighlight>

            <TouchableHighlight
            onPress={()=>{
               require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
                 aps: {

                   alert: {
                     title: 'notify',
                     body: 'Sample notification',
                   },
                   sound: 'default',
                   category: 'TRIPPPLE'
                 },
                 action: 'notify',
                     title: 'notify',
                     body: 'Sample notification',


              });
                PushNotificationIOS.presentLocalNotification({
                  alertSound:'default',
                  alertTitle:'hi'
                })
              }}
              >
              <View style={styles.wrapfield}>

                <Text style={{color:colors.white}}>Local Notification</Text>
                <Image source={require('../../assets/nextArrow.png')} />
              </View>
            </TouchableHighlight>

             {/* <TouchableHighlight
              onPress={()=>{
                NotificationActions.receiveNewMessageNotification({
                  data: {
                    alert:'New message!',
                    type:'chat',
                    message:'jk, you asked for this!',
                    match_id: 100
                   }
                })
              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white,}}>In-app New Message Notification</Text>
                <Image source={require('../../assets/nextArrow.png')} />
              </View>
              </TouchableHighlight>*/}



              <TouchableHighlight
              onPress={(f)=>{
                MatchActions.getPotentials()
              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white}}>Fetch potentials</Text>
                <Image source={require('../../assets/nextArrow.png')} />
              </View>
            </TouchableHighlight>



            {/* <TouchableHighlight
              onPress={(f)=>{
                NotificationActions.receiveNewMatchNotification({
                  data: {
                    alert:'New match!',
                    type:'retrieve',
                    message:'(Not real)',
                    match_id: 100
                  }
                })
              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white,}}>In-app New Match Notification</Text>
                <Image source={require('../../assets/nextArrow.png')} />
              </View>
              </TouchableHighlight>*/}

            <TouchableHighlight
              onPress={()=>{ AppActions.toggleOverlay() }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white}}>Toggle Loading Overlay</Text>
                <Image source={require('../../assets/nextArrow.png')} />
              </View>
            </TouchableHighlight>



          </ScrollView>


      )

  }



}

export default SettingsDebug


const styles = StyleSheet.create({
  row:{},
  wrapfield:{
   borderBottomWidth:1,
   borderColor:colors.shuttleGray,
   height:80,
  //  backgroundColor:colors.outerSpace,
   alignItems:'center',
   justifyContent:'space-between',
   flexDirection:'row',
   paddingRight:MagicNumbers.screenPadding/1.5,
   marginLeft:MagicNumbers.screenPadding/1.5,
 },
})
