
import React from "react";
import {StyleSheet, Text, View, TouchableHighlight, Settings, TouchableOpacity, Animated, PushNotificationIOS, Image, ScrollView, AsyncStorage, Navigator} from "react-native";
import AppTelemetry from '../AppTelemetry'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import AppActions from '../flux/actions/AppActions'
import colors from '../utils/colors'
import NotificationPermissions from '../modals/NewNotificationPermissions'
import {MagicNumbers} from '../DeviceConfig'

const TripppleSettingsKeys = [
  'HasSeenNotificationRequest',
  'ShouldSeeNotificationRequest',
  'LocationSetting',
  'NotificationSetting',
  'HasSeenStarterPack'
]

class SettingsDebug extends React.Component{
  constructor(props){
    super()
  }
  render(){
      return (
          <ScrollView>


          {/*  Receive fake Notification */}
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
                <Image source={{uri: 'assets/nextArrow@3x.png'}} />
              </View>
            </TouchableHighlight>
             <TouchableHighlight
             onPress={()=>{

           const coupleRelevantUser = {
             couple: {
               "distance": "",
               "id": "NONE",
               "image_url": ""
             },
             partner: {
               "distance": "",
               "firstname": "",
               "id": "NONE",
               "image_url": ""
             },
             user: {
               "age": 18,
               "distance": "1 Swipe Away",
               "firstname": "",
               "id": 23762,
               "image_url": "https://trippple-user.s3.amazonaws.com/uploads/23762/be4f51816-original.jpg",
               "is_couple": false,
               "is_starter": false,
               "master_id": 23762,
               "master_type": "User",
               "thumb_url": "https://trippple-user.s3.amazonaws.com/uploads/23762/be4f51816-original.jpg"
             }
           };
           const relevantUser = {
             "age": 18,
             "distance": "1 Swipe Away",
             "firstname": "",
             "id": 23762,
             "image_url": "https://trippple-user.s3.amazonaws.com/uploads/23762/be4f51816-original.jpg",
             "is_couple": false,
             "is_starter": false,
             "master_id": 23762,
             "master_type": "User",
             "thumb_url": "https://trippple-user.s3.amazonaws.com/uploads/23762/be4f51816-original.jpg"
           }
            this.props.navigator.pop()

           AppActions.showNotificationModalWithLikedUser.defer(relevantUser)

              //  this.props.navigator.push({
              //    component:NotificationPermissions,
              //    passProps:{
              //      relevantUser:relevantUser
              //    }
              //  })
             }} >
             <View style={styles.wrapfield}>
               <Text style={{color:colors.white,}}>Notification permisson modal</Text>
               <Image source={{uri: 'assets/nextArrow@3x.png'}} />
             </View>
             </TouchableHighlight>

             <TouchableHighlight
             onPress={()=>{
               Settings.set({
                  'co.trippple.HasSeenNotificationRequest':null,
                  'co.trippple.LastNotificationsPermissionRequestTimestamp': null
                })

             }} >
             <View style={styles.wrapfield}>
               <Text style={{color:colors.white,}}>Reset New Notification permisson</Text>
               <Image source={{uri: 'assets/nextArrow@3x.png'}} />
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
                <Image source={{uri: 'assets/nextArrow@3x.png'}} />
              </View>
              </TouchableHighlight>*/}


          {/*  Potentials */}
            <TouchableHighlight
              onPress={(f)=>{
                MatchActions.getPotentials()
                this.props.navigator.pop()
              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white}}>Fetch potentials</Text>
                <Image source={{uri: 'assets/nextArrow@3x.png'}} />
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={(f)=>{
                MatchActions.getFakePotentials()
                this.props.navigator.pop()
              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white}}>Get FAKE potentials</Text>
                <Image source={{uri: 'assets/nextArrow@3x.png'}} />
              </View>
            </TouchableHighlight>


        {/*  clear local storage */}
          <TouchableHighlight
            onPress={(f)=>{
              AsyncStorage.clear()
              .then((res)=>{
                console.log(res)
                TripppleSettingsKeys.map((k,i)=>{
                  Settings.set({[k]: null})
                })
              })
              .catch((err)=>{
                console.error(err)
              })

            }} >
            <View style={styles.wrapfield}>
              <Text style={{color:colors.white,}}>clear local storage</Text>
              <Image source={{uri: 'assets/nextArrow@3x.png'}} />
            </View>
          </TouchableHighlight>

          {/*  Local Notification */}
            <TouchableHighlight
              onPress={(f)=>{
                PushNotificationIOS.scheduleLocalNotification({
                  fireDate: Date.now()+10000,
                  alertBody: 'New Matches!',
                  soundName: 'default'
                })
              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white,}}>Schedule local notification in 10 seconds</Text>
                <Image source={{uri: 'assets/nextArrow@3x.png'}} />
              </View>
              </TouchableHighlight>

          {/*  loading overlay */}
            <TouchableHighlight
              onPress={()=>{ AppActions.toggleOverlay() }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white}}>Toggle Loading Overlay</Text>
                <Image source={{uri: 'assets/nextArrow@3x.png'}} />
              </View>
            </TouchableHighlight>

            {/*  Show telemetry */}
              <TouchableHighlight
                onPress={(f)=>{
                  AppTelemetry.getPayload()
                  .then((telemetry)=>{
                    this.props.navigator.push({
                      component: EmptyPage,
                      passProps: {
                        renderProps: telemetry
                      }
                    })
                  })
                  .catch((err)=>{
                    console.error(err)
                  })

                }} >
                <View style={styles.wrapfield}>
                  <Text style={{color:colors.white,}}>Show telemetry json</Text>
                  <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                </View>
              </TouchableHighlight>

              {/*  send telemetry */}
                <TouchableHighlight
                  onPress={(f)=>{
                    AppActions.sendTelemetry()

                  }} >
                  <View style={styles.wrapfield}>
                    <Text style={{color:colors.white,}}>send telemetry base64</Text>
                    <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                  </View>
                </TouchableHighlight>
            {/*  show checkmark */}
              <TouchableHighlight
                onPress={()=>{ AppActions.showCheckmark() }}
                >
                <View style={styles.wrapfield}>

                  <Text style={{color:colors.white}}>Checkmark</Text>
                  <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                </View>
              </TouchableHighlight>


          </ScrollView>


      )

  }



}

export default SettingsDebug


class EmptyPage extends React.Component{
  constructor(props){
    super()
  }
  render(){
    const {renderProps} = this.props
    console.log(renderProps)
    return (
      <ScrollView>
        {Object.keys(renderProps).map((prop,i)=>{
            return (
              <View key={`debug${i}`}>
                <Text style={{color:colors.sushi,marginBottom:10}}>{prop}</Text>
                <Text style={{color:colors.white,marginBottom:20}}>{
                    JSON.stringify(renderProps[prop])
                }</Text>
              </View>)
          })}
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  row:{},
  wrapfield:{
   borderBottomWidth:1,
   borderColor:colors.shuttleGray,
   height:50,
  //  backgroundColor:colors.outerSpace,
   alignItems:'center',
   justifyContent:'space-between',
   flexDirection:'row',
   paddingRight:MagicNumbers.screenPadding/1.5,
   marginLeft:MagicNumbers.screenPadding/1.5,
 },
})
