/* @flow */


import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SwitchIOS,
  Animated,
  PickerIOS,
  Image,
  NativeModules,
  AsyncStorage,
  Navigator
} from  'react-native'
import Analytics from '../utils/Analytics';
import BoxyButton from '../controls/boxyButton'

import ScrollableTabView from '../scrollable-tab-view'
import FakeNavBar from '../controls/FakeNavBar';
import FieldModal from './FieldModal'
import {MagicNumbers} from '../DeviceConfig'

import dismissKeyboard from 'dismissKeyboard'
import UserActions from '../flux/actions/UserActions'
import Contacts from '../screens/contacts'
import Dimensions from 'Dimensions'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const { RNMessageComposer } = NativeModules ;

import moment from 'moment'


import colors from '../utils/colors'

import CloseButton from './CloseButton'
import Api from '../utils/api'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import reactMixin from 'react-mixin'
import formatPhone from '../utils/formatPhone'


var PickerItemIOS = PickerIOS.Item;

class ProfileField extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      selectedDropdown: '',
    }
  }

  _editField(){}
  formattedPhone(){
    return formatPhone(this.props.user[this.props.fieldName])
  }

  displayField(field){
    switch (field.field_type) {
      case 'input':
      case 'phone_input':
        return (
           <TextInput
              autofocus={true}
              style={{
                  height: 60,
                  alignSelf: 'stretch',
                  padding: 8,
                  fontSize: 30,
                  fontFamily:'Montserrat',
                  color: colors.white,
                  textAlign:'center',
                  width:DeviceWidth-40
              }}
              onChangeText={(text) => this.setState({text})}
              placeholder={field.placeholder || field.label}
              autoCapitalize={'words'}
              placeholderTextColor={colors.white}
              autoCorrect={false}
              returnKeyType={'go'}
              autoFocus={true}
              ref={component => this._textInput = component}
              clearButtonMode={'always'}
          />
        );

      case 'dropdown':
        // always add an empty option at the beginning of the array
        field.values.unshift('');

        return (
          <PickerIOS
            style={{alignSelf:'center',width:330,backgroundColor:colors.white,marginHorizontal:0,alignItems:'stretch'}}
            selectedValue={this.state.selectedDropdown || null}
            >
            {field.values.map((val) => (
              <PickerItemIOS
                key={val}
                value={val}
                label={val}
                />
              )
            )}
          </PickerIOS>
        );

      default:
        return (
           null
        );
    }
  }
  render(){
    var field = this.props.field || {};


    if(!field.label){ return false}

    return (
        <View style={{borderBottomWidth:1,borderColor:colors.shuttleGray,marginHorizontal:25}}>
          <View  style={{height:50,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.rollingStone,fontSize:20,fontFamily:'Montserrat'}}>{field.label && field.label.toUpperCase()}</Text>
          <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'Montserrat',textAlign:'right',
        paddingRight:20}}>{this.props.user[this.props.fieldName] ? this.props.user[this.props.fieldName].toString().toUpperCase() : ''}</Text>
          <Image
              style={{width:15,height:15,position:'absolute',right:0,top:15}}
              source={{uri:'assets/icon-lock.png'}}
              resizeMode={Image.resizeMode.contain}/>
              </View>

        </View>
    )
  }
}

class SettingsCouple extends React.Component{
  constructor(props){
    super(props)
  }
  invitePartner(){

        this.props.navigator.push({
          component: Contacts,
          passProps:{
            _continue: ()=>{
              // console.log(this.props.navigator)
              let routes = this.props.navigator.getCurrentRoutes()
              let thisRoute = routes[routes.length-3]
              this.props.navigator.popToRoute(thisRoute);
              UserActions.getUserInfo()
            }
          }

        })

  }
    handleSendMessage(){
      RNMessageComposer.composeMessageWithArgs(
        {
          'messageText':'Come join me on Trippple! http://appstore.com/trippple',
          'recipients':[this.props.user.partner.phone]
        },
        (result) => {
          switch(result) {
            case RNMessageComposer.Sent:
              break;
            case RNMessageComposer.Cancelled:
              break;
            case RNMessageComposer.Failed:
              break;
            case RNMessageComposer.NotSupported:
              break;
            default:
              break;
          }
        }
      );
    }
  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};

    var {partner} = this.props.user

    // if(!partner) {return false}
    return (
      <View style={styles.inner}>
      <FakeNavBar
          blur={false}
          backgroundStyle={{backgroundColor:colors.shuttleGray}}
          hideNext={true}
          navigator={this.props.navigator}
          customPrev={
            <View style={{flexDirection: 'row',opacity:0.5,top:7}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
            </View>
          }
          onPrev={(nav,route)=> nav.pop()}
          title={`${partner.firstname || `YOUR PARTNER` }`}
          titleColor={colors.white}
          />
        <ScrollView style={{flex:1,marginTop:50}} contentContainerStyle={{   paddingTop:50}} >

        { partner.phone && (partner.user_id || partner.id) &&
          <View>
                  <View style={{height:120,width:120,alignItems:'center',alignSelf:'center'}}>
                    <Image
                      style={styles.userimage}
                      key={partner.thumb_url}
                      source={{uri: partner.thumb_url}}
                      defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                      resizeMode={Image.resizeMode.contain}/>

                    </View>
                    <View style={{paddingHorizontal: 25,}}>
                      <View style={styles.formHeader}>
                        <Text style={styles.formHeaderText}>Your Partner</Text>
                      </View>
                      </View>
                    {['firstname','birthday','gender'].map((field) => {
                      return (
                        <View  key={'key'+field} style={{height:60,borderBottomWidth:1,borderColor:colors.shuttleGray, alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:25}}>
                            <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{ field.toUpperCase()}</Text>
                          <Text style={{color:colors.shuttleGray,
                              fontSize:18,fontFamily:'Montserrat',textAlign:'right',paddingRight:30}}>{
                              field == 'birthday' ?
                              partner[field] ? moment(partner[field]).format('MM/DD/YYYY') : ''
                              : partner[field] ? partner[field].toString().toUpperCase() : ''
                            }</Text>
                            <Image
                                style={{width:15,height:15,position:'absolute',right:0,top:23}}
                                source={{uri:'assets/icon-lock.png'}}
                                resizeMode={Image.resizeMode.contain}/>

                          </View>
                        )
                    })}

                  </View>
                }


                  { partner.phone && !partner.user_id && !partner.id &&
                    <View>
                    <View style={{height:120,width:120,alignItems:'center',alignSelf:'center',marginBottom:20}}>
                      <Image
                        style={[styles.userimage]}
                        key={partner.thumb_url}
                        source={{uri: 'assets/iconModalDenied@3x'}}
                        resizeMode={Image.resizeMode.contain}/>

                      </View>
                      <View style={styles.middleTextWrap}>
                        <Text style={styles.middleText}>We're still waiting for your partner to join! Remind them to join with a text message, or update their contact info if we've got the wrong number. </Text>
                      </View>
                      <BoxyButton
                        text={"NOTIFY YOUR PARTNER"}
                        leftBoxStyles={styles.iconButtonLeftBoxCouples}
                        innerWrapStyles={styles.iconButtonCouples}
                        outerButtonStyle={{
                          alignSelf:'stretch',
                          flexDirection:'row',
                          marginHorizontal:MagicNumbers.screenPadding/2,
                          marginBottom:20
                        }}
                        underlayColor={colors.mediumPurple20}
                        _onPress={this.handleSendMessage.bind(this)}
                      >
                        <Image
                          source={{uri: 'assets/chat@3x.png'}}
                          resizeMode={Image.resizeMode.contain}
                          style={{height:30,width:101,tintColor:colors.mediumPurple}}
                        />
                      </BoxyButton>
                      <BoxyButton
                        text={"UPDATE PARTNER"}
                        leftBoxStyles={styles.iconButtonLeftBoxCouples}
                        innerWrapStyles={styles.iconButtonCouples}
                        outerButtonStyle={{
                          alignSelf:'stretch',
                          flexDirection:'row',
                          marginHorizontal:MagicNumbers.screenPadding/2
                        }}
                        underlayColor={colors.mediumPurple20}
                        _onPress={this.invitePartner.bind(this)}
                      >
                        <Image
                          source={{uri: 'assets/ovalInvite@3x.png'}}
                          resizeMode={Image.resizeMode.contain}
                          style={{height:30,width:101}}
                        />
                      </BoxyButton>
                    </View>

                  }

                  {partner.phone &&
                    <View>
                    <View style={{paddingHorizontal: 25,}}>

                    <View style={styles.formHeader}>
                      <Text style={styles.formHeaderText}>Contact Info</Text>
                    </View>
                    </View>
                    {['phone'].map((field) => {
                      return  (
                        <View  key={'key'+field}  style={{height:60,borderBottomWidth:1,borderColor:colors.shuttleGray, alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:25}}>
                            <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{ field.toUpperCase()}</Text>
                          <Text style={{color:colors.shuttleGray,
                              fontSize:18,fontFamily:'Montserrat',textAlign:'right',paddingRight:30}}>{
                              partner[field] && formatPhone(partner[field])
                            }</Text>
                            <Image
                                style={{width:15,height:15,position:'absolute',right:0,top:23}}
                                source={{uri:'assets/icon-lock.png'}}
                                resizeMode={Image.resizeMode.contain}/>

                          </View>
                        )
                      })}
                      </View>
                  }

                  {!partner.phone &&
                    <View>
                    <View style={{height:120,width:120,alignItems:'center',alignSelf:'center',marginBottom:20}}>
                      <Image
                        style={[styles.userimage]}
                        key={partner.thumb_url}
                        source={{uri: 'assets/iconModalDenied@3x'}}
                        resizeMode={Image.resizeMode.contain}/>

                      </View>
                      <View style={styles.middleTextWrap}>
                        <Text style={styles.middleText}>Oh no! You don't have a partner! Go ahead and invite someone now</Text>
                      </View>
                      <BoxyButton
                        text={"INVITE YOUR PARTNER"}
                        leftBoxStyles={styles.iconButtonLeftBoxCouples}
                        innerWrapStyles={styles.iconButtonCouples}
                        outerButtonStyle={{
                          alignSelf:'stretch',
                          flexDirection:'row',
                          marginHorizontal:MagicNumbers.screenPadding/2
                        }}
                        underlayColor={colors.mediumPurple20}
                        _onPress={this.invitePartner.bind(this)}>

                        <Image source={{uri: 'assets/ovalInvite@3x.png'}}
                                  resizeMode={Image.resizeMode.contain}
                                      style={{height:30,width:101}} />

                    </BoxyButton>
                    </View>
                  }

      </ScrollView>
      </View>

    )
  }
}

export default SettingsCouple

const styles = StyleSheet.create({
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },

 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'stretch',
   position:'relative',
   alignSelf: 'stretch',
   backgroundColor:colors.outerSpace
  //  overflow:'hidden'
 },
 inner:{
   flex: 1,
   alignItems: 'stretch',
   backgroundColor:colors.outerSpace,
   flexDirection:'column',
   justifyContent:'flex-start'
 },

 blur:{
   flex:1,
   alignSelf:'stretch',
   alignItems:'center',
   paddingTop: 60,
   paddingBottom: 40,

 },
 closebox:{
   height:40,
   width:40,
   backgroundColor:'blue'
 },

 formHeader:{
   marginTop:40
 },
 formHeaderText:{
   color: colors.rollingStone,
   fontFamily: 'omnes'
 },
 formRow: {
   alignItems: 'center',
   flexDirection: 'row',

   alignSelf: 'stretch',
   paddingTop:0,
   height:50,
   flex:1,
   borderBottomWidth: 2,
   borderBottomColor: colors.rollingStone

 },
 tallFormRow: {
   width: 250,
   left:0,
   height:220,
   alignSelf:'stretch',
   alignItems: 'center',
   flexDirection: 'row',
   justifyContent: 'center'
 },
 sliderFormRow:{
   height:160,
   paddingLeft: 30,
   paddingRight:30
 },
 picker:{
   height:200,
   alignItems: 'stretch',
   flexDirection: 'column',
   alignSelf:'flex-end',
   justifyContent:'center',
 },
 halfcell:{
   width:DeviceWidth / 2,
   alignItems: 'center',
   alignSelf:'center',
   justifyContent:'space-around'


 },

 formLabel: {
   flex: 8,
   fontSize: 18,
   fontFamily:'omnes'
 },
 header:{
   fontSize:24,
   fontFamily:'omnes'

 },
 textfield:{
   color: colors.white,
   fontSize:20,
   alignItems: 'stretch',
   flex:1,
   textAlign: 'left',
   fontFamily:'Montserrat',
 },
userimage:{
  backgroundColor:colors.dark,
  width:120,height:120,borderRadius:60,alignSelf:'center',
},
middleTextWrap: {
  alignItems:'center',
  justifyContent:'center',
  height: 100,
  marginHorizontal:20,
  marginBottom:20
},
middleText: {
  color: colors.rollingStone,
  fontSize: 18,

  textAlign:'center',
},
middleTextSmall:{
  fontSize: 17
},
});
