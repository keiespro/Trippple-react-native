
import React from "react";
import {StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, Animated, PushNotificationIOS, Image, ScrollView, AsyncStorage, Navigator} from "react-native";

import AppTelemetry from '../AppTelemetry'
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
   height:80,
  //  backgroundColor:colors.outerSpace,
   alignItems:'center',
   justifyContent:'space-between',
   flexDirection:'row',
   paddingRight:MagicNumbers.screenPadding/1.5,
   marginLeft:MagicNumbers.screenPadding/1.5,
 },
})
