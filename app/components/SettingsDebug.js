
import React from "react";
import {StyleSheet, UIManager, Text, View, TouchableHighlight, Settings, TouchableOpacity,Dimensions, Animated, PushNotificationIOS, Image, ScrollView, AsyncStorage, Navigator, ListView,Alert} from "react-native";
import AppTelemetry from '../AppTelemetry'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import AppActions from '../flux/actions/AppActions'
import colors from '../utils/colors'
import FakeNavBar from '../controls/FakeNavBar'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import Coupling from '../coupling'
import NotificationPermissions from '../modals/NewNotificationPermissions'
import LocationPermissions from '../modals/LocationPermission'
import {MagicNumbers} from '../DeviceConfig'

import TEST_ACCOUNTS from '../../TEST_ACCOUNTS.js'
const TripppleSettingsKeys = [
  ...SettingsConstants,
  'LocationSetting',
];
import SettingsConstants, { HAS_SEEN_NOTIFICATION_REQUEST, LAST_ASKED_NOTIFICATION_PERMISSION, NOTIFICATION_SETTING } from '../utils/SettingsConstants'


class SettingsDebug extends React.Component{
  constructor(props){
    super()
  }
  render(){
      return (
        <View  style={{ }}>

      <ScrollView style={{flex:1,paddingTop:60,overflow:'visible'}}    >
            {/*  Show telemetry */}
              <TouchableHighlight
                onPress={(f)=>{
                  AppTelemetry.getPayload()
                  .then((telemetry)=>{
                    this.props.navigator.push({
                      component: TelemetryPage,
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
                  <Text style={{color:colors.white,}}>User & session info</Text>
                <Image source={{uri: 'assets/nextArrow@3x.png'}} style={{height:10,width:10,tintColor:colors.white}} />
                </View>
              </TouchableHighlight>




{/*  login */}
  <TouchableHighlight
    onPress={(f)=>{

         this.props.navigator.push({
           component:  TelemetryPage,
           passProps:{
             data: TEST_ACCOUNTS
             },

           name: "login"
         })

    }} >
    <View style={styles.wrapfield}>
      <Text style={{color:colors.white,}}>Login As </Text>
     </View>
  </TouchableHighlight>

              {/*  send like */}
                <TouchableHighlight
                  onPress={(f)=>{
                    Alert.prompt(
                      'Like User',
                     'Enter their id',
                     [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: (likeUserId) => {
                          console.log('liking user: ' + likeUserId);
                          MatchActions.sendLike( likeUserId, 'approve', (this.props.user.relationship_status == 'single' ? 'couple' : 'single'), this.props.user.relationship_status );
                        }, style: 'default'}
                      ],
                      'plain-text'
                    )
                  }} >
                  <View style={styles.wrapfield}>
                    <Text style={{color:colors.white,}}>Send like to user</Text>
                    <Image source={{uri: 'assets/nextArrow@3x.png'}} style={{height:10,width:10,tintColor:colors.white}} />

                  </View>
                </TouchableHighlight>

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

           AppActions.showInModal({
             component:NotificationPermissions,
             passProps:{
               relevantUser
             }
           })

           this.props.navigator.pop()


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
                  HAS_SEEN_NOTIFICATION_REQUEST:null, LAST_ASKED_NOTIFICATION_PERMISSION:null, NOTIFICATION_SETTING:null,
                });
                PushNotificationIOS.abandonPermissions()

             }} >
             <View style={styles.wrapfield}>
               <Text style={{color:colors.white,}}>Reset New Notification permisson</Text>
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
               </View>
            </TouchableHighlight>


              {/*   */}
                <TouchableHighlight
                  onPress={(f)=>{
                    AppActions.showInModal({
                      component:Coupling,
                      passProps:{

                      }
                    })
                  }}>
                  <View style={styles.wrapfield}>
                    <Text style={{color:colors.white,}}>coupling</Text>

                  </View>
                </TouchableHighlight>

                {/*   */}
                  <TouchableHighlight
                    onPress={(f)=>{
                      AppActions.showInModal({
                        component:LocationPermissions,
                          name:'Location Permission Modal',
                          title:'Location Permission Modal',
                          passProps:{
                            title:'Prioritze Local',
                            user:this.props.user,
                            failedTitle:'Location',
                            successCallback: ()=>{ this.props.navigator.pop() },

                            failCallback: ()=>{ this.props.navigator.pop() },
                            hideModal: ()=>{ this.props.navigator.pop() },
                            closeModal: ()=>{ this.props.close() }

                          }

                      })
                    }}>
                    <View style={styles.wrapfield}>
                      <Text style={{color:colors.white,}}>location modal</Text>

                    </View>
                  </TouchableHighlight>



          {/*  toggle DEV */}
            {/*<TouchableHighlight
              onPress={(f)=>{
                // __DEV__ = false;
                // __DEBUG__ = false;


              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white,}}>toggle __DEV__  </Text>
               </View>
            </TouchableHighlight>*/}

            {/*  screenshot */}
              <TouchableHighlight
                onPress={(f)=>{
                  UIManager.takeSnapshot('window', {format: 'jpeg', quality: 0.8}).then(screenshot=>{

                     this.props.navigator.push({
                       component:  EmptyPage,
                       passProps:{
                         screenshot
                       }
                     })
                })

                }} >
                <View style={styles.wrapfield}>
                  <Text style={{color:colors.white,}}>screenshot </Text>
                 </View>
              </TouchableHighlight>

        {/*  clear local storage */}
          <TouchableHighlight
            onPress={(f)=>{
              AsyncStorage.clear()
              .then((res)=>{
                // console.log(res)
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
             </View>
          </TouchableHighlight>

          {/*  Local Notification */}
            <TouchableHighlight
              onPress={(f)=>{
                PushNotificationIOS.scheduleLocalNotification({
                  fireDate: Date.now()+10000,
                  alertBody: 'local notification in 10 seconds!',
                  soundName: 'default'
                })
              }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white,}}>Schedule local notification in 10 seconds</Text>
               </View>
              </TouchableHighlight>

          {/*  loading overlay */}
            <TouchableHighlight
              onPress={()=>{ AppActions.toggleOverlay() }} >
              <View style={styles.wrapfield}>
                <Text style={{color:colors.white}}>Toggle Loading Overlay</Text>
               </View>
            </TouchableHighlight>


              {/*  send telemetry */}
                <TouchableHighlight
                  onPress={(f)=>{
                    AppActions.sendTelemetry()

                  }} >
                  <View style={styles.wrapfield}>
                    <Text style={{color:colors.white,}}>send telemetry base64</Text>
                   </View>
                </TouchableHighlight>
            {/*  show checkmark */}
              <TouchableHighlight
                onPress={()=>{ AppActions.showCheckmark() }}
                >
                <View style={styles.wrapfield}>

                  <Text style={{color:colors.white}}>Checkmark</Text>
                 </View>
              </TouchableHighlight>


          </ScrollView>
          {/* <FakeNavBar
            blur={true}
            navigator={this.props.navigator}
            backgroundStyle={{backgroundColor:colors.sushi,top:0}}
            hideNext={true}
            customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{marginVertical:10,alignSelf:'center',height:12,width:12}}
            source={{uri:'assets/close@3x.png'}}/>}
            onPrev={(nav,route)=> nav.pop()}
            title={'DEBUG SETTINGS'}
            titleColor={colors.white}
          /> */}

</View>
      )

  }



}

export default SettingsDebug


class EmptyPage extends React.Component{
  constructor(props){
    super()
  }
  render(){
    const {data,screenshot} = this.props
    // console.log(data)
    return (
      <View style={{flex: 1,overflow:'hidden'}}>

      <ScrollView horizontal={true}
              scrollEnabled={true}
 vertical={true}
contentContainerStyle={{height:9000,position:'relative',paddingTop:60}}
      removeClippedSubviews={false}
      directionalLockEnabled={true}
 ><View style={{position:'relative'}}>{screenshot ?
            <Image resizeMode={'cover'} source={{uri: screenshot}} style={{width:DeviceWidth*.75,height:DeviceHeight*.75}}/>
           : <Text style={{color:colors.white,marginBottom:20, overflow:'visible' }}>{
              JSON.stringify(data.data, null, 2)
          }</Text>}
      </View></ScrollView>
        <FakeNavBar
          blur={true}
          navigator={this.props.navigator}
          backgroundStyle={{backgroundColor:colors.sushi,top:0}}
          hideNext={true}
          customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{marginVertical:10,alignSelf:'center',height:12,width:12}}
          source={{uri:'assets/close@3x.png'}}/>}
          onPrev={(nav,route)=> nav.pop()}
          title={screenshot ? 'SCREENSHOT' : data.name}
          titleColor={colors.white}
        />

      </View>

    )
  }
}



class TelemetryPage extends React.Component{

  constructor(props){
    super()

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const {renderProps} = props
    // console.log(props,'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    const data = props.data || Object.keys(renderProps).map((prop,i)=>{ return {name: prop, data: renderProps[prop] }})
    this.state = {
      dataSource: ds.cloneWithRows(data),
    };
  }
  renderRow(rowData){

    return  (
      <View style={[styles.wrapfield,{}]}><TouchableOpacity onPress={()=>{
          if(rowData.name == 'state'){
            this.props.navigator.push({
              component: TelemetryPage,
              passProps:{
                renderProps: rowData.data,
              },
              name: `debug - ${rowData.name}`
            })

          }else if(rowData.user_id){
            console.log('saved creds');

            Alert.alert('logged in as '+rowData.user_id,'Now shake and reload')
          }else{
            this.props.navigator.push({
              component: EmptyPage,
              passProps:{
                data: rowData,
              },
              name: `debug - ${rowData.name}`
            })
          }

        }} style={{alignSelf:'stretch',width:DeviceWidth}}>
        <View style={styles.wrapfield}>
          <Text style={{color:colors.white,}}>{rowData.name || rowData.user_id}</Text>
          <Image source={{uri: 'assets/nextArrow@3x.png'}} style={{height:10,width:10,tintColor:colors.white}} />

        </View>
      </TouchableOpacity></View>

    )
  }
  render(){
    const {renderProps} = this.props;


    return (
      <View style={{flex: 1,overflow:'hidden'}}>

        <ListView
          contentContainerStyle={{flex: 1,paddingTop:60,position:'relative'}}
          scrollEnabled={true}
          vertical={true}
 style={{flex: 1}}
  removeClippedSubviews={false}



          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />

        <FakeNavBar
          blur={true}
          backgroundStyle={{backgroundColor:colors.sushi,top:0}}
          hideNext={true}
          customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{marginVertical:10,alignSelf:'center',height:12,width:12}}
          source={{uri:'assets/close@3x.png'}}/>}
          onPrev={(nav,route)=> nav.pop()}
          title={renderProps ? renderProps.name : 'x'}
          titleColor={colors.white}
          navigator={this.props.navigator}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  row:{},
  wrapfield:{
   borderBottomWidth:1,
   borderColor:colors.shuttleGray,
   height:35,
  //  backgroundColor:colors.outerSpace,
   alignItems:'center',
   justifyContent:'space-between',
   flexDirection:'row',
   paddingRight:MagicNumbers.screenPadding/1.5,
   marginLeft:MagicNumbers.screenPadding/1.5,
 },
})
