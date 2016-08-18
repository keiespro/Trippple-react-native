/* @flow */


import React from "react";

import {StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TextInput, ScrollView, Switch, Animated, Picker, PixelRatio, Image, AsyncStorage, Navigator} from "react-native";
import SegmentedView from '../controls/SegmentedView'
import ScrollableTabView from '../scrollable-tab-view'
import FakeNavBar from '../controls/FakeNavBar';
import {MagicNumbers} from '../DeviceConfig'

import dismissKeyboard from 'dismissKeyboard'
import moment from 'moment'

import Dimensions from 'Dimensions'
import ParallaxView from  '../controls/ParallaxScrollView'
import PhoneNumberInput from '../controls/phoneNumberInput'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import DistanceSlider from '../controls/distanceSlider'
import ToggleSwitch from '../controls/switches'
import UserActions from '../flux/actions/UserActions'
import EditImage from '../screens/EditImage'
import SelfImage from './loggedin/SelfImage'

import FacebookButton from '../buttons/FacebookButton'

import Contacts from '../screens/contacts'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import CloseButton from './CloseButton'

import TrackKeyboardMixin from '../mixins/keyboardMixin'
import reactMixin from 'react-mixin'
import Analytics from '../utils/Analytics'

import FieldModal from './FieldModal'
import formatPhone from '../utils/formatPhone'

var PickerItem = Picker.Item;

class ProfileField extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      selectedDropdown: props.user[props.fieldName] || '',
    }
  }

  formattedPhone(){
    return formatPhone(this.props.user[this.props.fieldName])
  }
  render(){
    var field = this.props.field || {};

    var get_values = typeof field.values == 'object' && Object.keys(field.values).map(key => key) || field.values;
    var get_key_vals = typeof field.values == 'object' && field.values || {};

    var displayField = (theField) => {
      switch (theField.field_type) {
        case 'input':
          return (
             <TextInput
                autofocus={true}
                style={[styles.displayTextField,{fontSize: this.props.fieldName == 'email' ? 20 : 30 }]}
                onChangeText={(text) => this.setState({text})}
                placeholder={theField.placeholder ? theField.placeholder.toUpperCase() : fieldLabel.toUpperCase()}
                autoCapitalize={'words'}
                maxLength={10}
                placeholderTextColor={colors.white}
                autoCorrect={false}
                returnKeyType={'done'}
                autoFocus={true}
                keyboardType={this.props.fieldName == 'email' ? 'email-address' : 'default'}
                keyboardAppearance={'dark'}
                ref={component => this._textInput = component}
                clearButtonMode={'always'}
            />
          );
        case 'phone_input':
          return (
            <PhoneNumberInput
              key={'updatephone'}
              style={styles.phoneInput}
            />
          )
        case 'dropdown':
          // always add an empty option at the beginning of the array

          return (
            <Picker
              style={{alignSelf:'center',width:330,backgroundColor:'transparent',marginHorizontal:0,alignItems:'stretch'}}
              itemStyle={{fontSize: 24, color: colors.white, textAlign: 'center'}}
              selectedValue={this.state.selectedDropdown || field.values[this.state.selectedDropdown] || null}
              >
              {get_values.map((val) => {

                return ( <PickerItem
                  key={val}
                  value={get_key_vals[val] || val}
                  label={(field.labelPrefix || '') + (get_key_vals[val] || val) + (field.labelSuffix || '')}
                  />
                )
              }
              )}
            </Picker>
          );

        default:
          return (
             null
          );
      }
    }
    if(!field.label){ return false}
    let fieldLabel = field.label || ''
    if(MagicNumbers.isSmallDevice && field.label.indexOf(' ') > 0){
      fieldLabel = field.label.substr(0,field.label.indexOf(' '))
    }

    var getValue = (this.props.user[this.props.fieldName] || '');
    getValue = (get_key_vals[getValue] || getValue);
    var displayValueText = (field.labelPrefix || '') + getValue.toString().toUpperCase() + (field.labelSuffix || '');

    if (field.field_type == 'phone_input') {
      displayValueText = this.formattedPhone();
    }

    displayFieldText = fieldLabel ? fieldLabel.toUpperCase() : '';

    return (
        <TouchableHighlight onPress={(f)=>{
            //trigger modal
            this.props.navigator.push({
              component: FieldModal,
              name: `Edit ${fieldLabel}`,
              key:`edit${fieldLabel}`,
              passProps: {
                inputField: displayField(field),
                field,
                fieldName:this.props.fieldName,
                cancel: ()=>{dismissKeyboard(); this.props.navigator.pop()},
                fieldValue: this.props.user[this.props.fieldName] || (field.values && field.values.length > 0 && field.values[0]) || '',
                dispatch:this.props.dispatch
              }
            })
          }} underlayColor={colors.dark} style={styles.paddedSpace}>
          <View  style={{height:60,borderBottomWidth:1,borderColor:colors.shuttleGray,alignItems:'center',justifyContent:'space-between',flexDirection:'row',alignSelf:'stretch'}}>
            <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{ displayFieldText }</Text>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat',textAlign:'right'}}>{ displayValueText }</Text>
          </View>
        </TouchableHighlight>
    )
  }
}

class SettingsBasic extends React.Component{
  constructor(props){
    super(props)
  }
  onPressFacebook(fbUser){
    this.setState({fbUser});
  }
  _pressNewImage(){
    this.props.navigator.push({
      component: SelfImage,
      sceneConfig: Navigator.SceneConfigs.PushFromRight,
      passProps: {
        user: this.props.user,
      }
    });
  }
  render(){
    let user = this.props.user;
    let settingOptions = this.props.settingOptions || {};
    const singleImage = this.props.user.localUserImage || {uri: this.props.user.image_url },
          singleImageThumb = this.props.user.localUserImage || {uri: this.props.user.thumb_url };

    return (
      <View style={styles.inner}>


      <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,height:DeviceHeight}}>

      <ScrollableTabView startPage={this.props.startPage} style={{overflow:'hidden',}} onChangeTab={(tab)=>{

      Analytics.screen(`SettingsBasic`+ [' GENERAL',' DETAILS'][tab.i]);
      }} padded={false} renderTabBar={(props)=><CustomTabBar {...props}/>}>
      <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth, flex:1,paddingVertical:MagicNumbers.screenPadding/2,height:DeviceHeight}}  tabLabel={'GENERAL'}>
      <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginTop: 0,flex:1 }}
          contentContainerStyle={{alignItems:'flex-start', width:DeviceWidth,minHeight:DeviceHeight,height:DeviceHeight*1.25}} >
          <View style={[styles.paddedSpace,{flex:1}]}>

          {user.relationship_status == 'single' ? null : <View style={{height:150,width:150,alignSelf:'center'}}>
          <TouchableOpacity onPress={this._pressNewImage.bind(this)} style={{marginTop:20,}}>
          <Image
            style={[ styles.userimage, { backgroundColor:colors.dark}]}
            key={this.props.user.id+'thumb'}
            defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            resizeMode={Image.resizeMode.cover}
            source={{uri:singleImageThumb.uri || 'assets/placeholderUser@3x.png'}}
          />

                <View style={{width:35,height:35,borderRadius:17.5,backgroundColor:colors.mediumPurple,position:'absolute',top:8,left:8,justifyContent:'center',alignItems:'center'}}>
                  <Image
                    style={{width:18,height:18}}
                    source={{uri: 'assets/cog@3x.png'}}
                    resizeMode={Image.resizeMode.contain}
                  />
                </View>
              </TouchableOpacity>
            </View>
          }
            <View style={styles.paddedSpace}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>Personal Info</Text>
              </View>
            </View>

            {['firstname'].map((field,i) => {
              return <ProfileField key={field+'key'+(i*10)} user={this.props.user} dispatch={this.props.dispatch} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
            })}

            {['birthday'].map((field,i) => {
              return (
                <View key={field+'key'+i} style={styles.wrapperBirthdayGender}>
                  <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{ field.toUpperCase()}</Text>
                  <Text style={{
                    color:colors.shuttleGray,
                    fontSize:18,
                    fontFamily:'Montserrat',
                    textAlign:'right',
                    paddingRight:30
                  }}>{
                    field == 'birthday' ?
                    this.props.user[field] ? moment(this.props.user[field]).format('MM/DD/YYYY') : '' : this.props.user.gender == 'f' ? 'FEMALE' : 'MALE'
                  }</Text>
                  <Image
                    style={{width:15,height:15,position:'absolute',right:0,top:23}}
                    source={{uri:'assets/icon-lock.png'}}
                    resizeMode={Image.resizeMode.contain}
                  />
                </View>
              )
            })}
           {['gender'].map((field,i) => {
            return (

              <ProfileField dispatch={this.props.dispatch}  key={field+'key'+(i*1000)}  user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
            )
          })}
            <View style={styles.paddedSpace}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>Contact Info</Text>
              </View>
            </View>
            <View style={{}}>
            {['phone'].map((field,i) => {
              return (
                <View key={field+'key'+(i*100)}  style={styles.wrapperBirthdayGender}>
                  <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{ field.toUpperCase()}</Text>
                  <Text style={{
                    color:colors.shuttleGray,
                    fontSize:18,
                    fontFamily:'Montserrat',
                    textAlign:'right',
                    paddingRight:30
                  }}>
                  { formatPhone(this.props.user[field]) }
                  </Text>

                  <Image
                    style={{width:15,height:15,position:'absolute',right:0,top:23}}
                    source={{uri:'assets/icon-lock.png'}}
                    resizeMode={Image.resizeMode.contain}
                  />
                </View>
              )
            })}

            {['email'].map((field,i) => {
              return <ProfileField dispatch={this.props.dispatch}  key={field+'key'+(i*1000)}  user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
            })}

            </View>
            </View>
            </ScrollView>
                </View>

                <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth, paddingBottom:40,height:DeviceHeight }}  tabLabel={'DETAILS'}>
                <ScrollView
                showsVerticalScrollIndicator={false}
                style={{marginTop: 0,}}
                contentContainerStyle={{alignItems:'flex-start',height:DeviceHeight*1.05}} >
                <View style={styles.paddedSpace}>
            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Details</Text>
            </View>
          </View>
          <View style={{alignSelf:'stretch',alignItems:'stretch',width:DeviceWidth}}>
          {['height','body_type','ethnicity','eye_color','hair_color','smoke','drink'].map((field,i) => {
            return (
              <View key={field+'key'+(i*10000)} style={{alignSelf:'stretch',alignItems:'stretch',width:DeviceWidth}}>
                <ProfileField
                dispatch={this.props.dispatch}
                  user={this.props.user}
                  navigator={this.props.navigator}
                  fieldName={field}
                  field={settingOptions[field]}
                />
              </View>
            )
          })}
          </View>
          </ScrollView>
          </View>
        </ScrollableTabView>

      </View>

      {/* <FakeNavBar
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
        title={`BASIC`}
        titleColor={colors.white}
        /> */}
      </View>

    )
  }
}
SettingsBasic.displayName = "SettingsBasic"
export default SettingsBasic




const styles = StyleSheet.create({


 container: {
   justifyContent: 'center',
   alignItems: 'stretch',
   position:'relative',
   alignSelf: 'stretch',
   backgroundColor:colors.outerSpace,
   height:DeviceHeight+100,

  //  overflow:'hidden'
 },
 inner:{
   alignItems: 'stretch',
   backgroundColor:colors.dark,
   flexDirection:'column',
   height:DeviceHeight,
   justifyContent:'flex-start'
 },

 blur:{

   alignSelf:'stretch',
   alignItems:'center',
   paddingTop: 0,
   paddingBottom: 40,

 },

 phoneInput: {
   height: 60,
   padding: 8,
   flex:1,
   width:MagicNumbers.screenWidth,
   alignSelf:'stretch',
   fontSize: 26,
   fontFamily:'Montserrat',
   color: colors.white
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
   borderBottomWidth: 1,
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
 tab: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 10,
  width:(DeviceWidth/2),

},

tabs: {
  height: 50,
  flexDirection: 'row',
  marginTop: 0,
  borderWidth: 1,
  flex:1,
  backgroundColor:colors.dark,
  width:DeviceWidth,
  overflow:'hidden',
  borderTopWidth: 0,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderBottomColor: colors.dark,
},
userimage:{
  backgroundColor:colors.dark,
  width:120,height:120,borderRadius:60,alignSelf:'center',

},
displayTextField:{
    height: 60,
    alignSelf: 'stretch',
    padding: 8,
    fontSize: 30,
    fontFamily:'Montserrat',
    color: colors.white,
    flex:1,
    width:MagicNumbers.screenWidth,
    textAlign:'center',
  },
  wrapperBirthdayGender:{
    height:60,
    borderBottomWidth:1,
    borderColor:colors.shuttleGray,
     alignItems:'center',
     justifyContent:'space-between',
     flexDirection:'row',
     marginHorizontal:MagicNumbers.screenPadding/2,
     alignSelf: 'stretch',


   },
   paddedSpace:{
     paddingHorizontal:MagicNumbers.screenPadding/2
   }
});

var TAB_UNDERLINE_REF = 'TAB_UNDERLINE';


var CustomTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.object,
    tabs: React.PropTypes.array,
    pageNumber:React.PropTypes.number
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.pageNumber === page;

    return (
      <TouchableOpacity key={name+page} onPress={() => {this.props.goToPage(page)}}>
        <View style={[styles.tab]}>
          <Text style={{fontFamily:'Montserrat',textAlign:'center',fontSize:15,padding:0,color: isTabActive ? colors.white : colors.shuttleGray}}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    var numberOfTabs = this.props.tabs ? this.props.tabs.length : 0;
    var w = DeviceWidth / numberOfTabs

    var tabUnderlineStyle = {
      position: 'absolute',
      width: DeviceWidth / numberOfTabs,
      height: 2,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
      left:0,
      transform: [
        {
          translateX: this.props.activeTab ? this.props.activeTab.interpolate({
              inputRange: this.props.tabs.map((c,i) => (w * i) ),
              outputRange: [0,w]
            }) : 0
          }]

    };

    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <Animated.View style={tabUnderlineStyle} ref={TAB_UNDERLINE_REF} />
      </View>
    );
  },
});
