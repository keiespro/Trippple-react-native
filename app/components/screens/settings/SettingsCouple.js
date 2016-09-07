'use strict';


import React from "react";
import moment from 'moment';

import BoxyButton from '../../controls/boxyButton';
import Contacts from '../contacts';
import colors from '../../../utils/colors';
import formatPhone from '../../../utils/formatPhone';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import {
  NavigationStyles,
} from '@exponent/ex-navigation';
import ActionMan from '../../../actions'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  SwitchIOS,
  Animated,
  PickerIOS,
  Alert,
  Image,
  NativeModules,
  AsyncStorage,
  Navigator
} from  'react-native'


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width





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


  static route = {
    styles: NavigationStyles.FloatHorizontal,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return `COUPLE`
      }
    }
  };
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
              this.props.dispatch(ActionMan.getUserInfo())
            }
          }

        })

  }

  decouple(){
    Alert.alert(
      `Leave ${this.props.user.partner.firstname}?`,
      'Are you sure you want to leave this couple?',
      [
        {text: 'Yes', onPress: () => {
          this.props.dispatch(ActionMan.decouple())
          this.props.navigator.pop()
        }},
        {text: 'No', onPress: () => {return false}},
      ]
    )



  }

  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};

    var {partner} = this.props.user;

    return (

        <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex:1,paddingTop:50}} contentContainerStyle={{   paddingTop: 0}} >

        { partner.phone && (partner.user_id || partner.id) &&
          <View>
                  <View style={{height:120,width:120,alignItems:'center',alignSelf:'center'}}>
                    <Image
                      style={styles.userimage}
                      key={partner.thumb_url}
                      source={{uri: partner.thumb_url}}
                      defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                      resizeMode={Image.resizeMode.cover}/>

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

                  <TouchableHighlight
                    style={{
                      alignSelf:'stretch',
                      marginVertical:50,
                      borderRadius:5,
                      flexDirection:'row',
                      marginHorizontal:MagicNumbers.screenPadding/2,
                      backgroundColor:'transparent',
                      borderColor:colors.mandy,
                      borderWidth:2
                    }}
                    underlayColor={colors.darkShadow}
                    onPress={this.decouple.bind(this)}
                  >
                    <View style={{padding:20,flex:1}}>
                      <Text style={{
                          backgroundColor:'transparent',
                          color:colors.mandy,
                          fontSize:18,
                          textAlign:'center',
                          fontFamily:'Montserrat'
                        }}>LEAVE COUPLE</Text>
                    </View>
                </TouchableHighlight>

                  {/*!partner.phone &&
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
                    */}

      </ScrollView>


    )
  }
}
SettingsCouple.displayName = "SettingsCouple"

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
   paddingTop: 0,
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
