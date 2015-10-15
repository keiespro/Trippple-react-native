/* @flow */


import React from 'react-native';
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
  AsyncStorage,
  Navigator
} from  'react-native'
import Mixpanel from '../utils/mixpanel';
import SegmentedView from '../controls/SegmentedView'
import ScrollableTabView from '../scrollable-tab-view'
import FakeNavBar from '../controls/FakeNavBar';
import MaskableTextInput from '../RNMaskableTextInput.js'

import dismissKeyboard from 'dismissKeyboard'

import scrollable from 'react-native-scrollable-decorator'
import Dimensions from 'Dimensions'
import ParallaxView from  '../controls/ParallaxScrollView'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import AgePrefs from '../controls/AgePrefs'

import DistanceSlider from '../controls/distanceSlider'
import ToggleSwitch from '../controls/switches'
import UserActions from '../flux/actions/UserActions'
import EditImage from '../screens/registration/EditImage'
import SelfImage from './loggedin/SelfImage'
import Privacy from './privacy'
import FacebookButton from '../buttons/FacebookButton'

import Contacts from '../screens/contacts'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import EditPage from './EditPage'
import CloseButton from './CloseButton'
import Api from '../utils/api'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import reactMixin from 'react-mixin'
import FieldModal from './FieldModal'


var PickerItemIOS = PickerIOS.Item;


class  SettingsPreferences extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      looking_for_mf: props.user.looking_for_mf || false,
      looking_for_mm: props.user.looking_for_mm || false,
      looking_for_ff: props.user.looking_for_ff || false,
    }
  }
  toggleField(field){
    var newState = {}
    newState[field] = !this.state[field]
    UserActions.updateUser(newState)
    this.setState(newState)
  }
  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};
    console.log('settingOptions',settingOptions);

    var {looking_for_mf,looking_for_mm,looking_for_ff} = this.state

        return (
          <View style={styles.inner}>

          <FakeNavBar
              blur={true}
              backgroundStyle={{backgroundColor:colors.shuttleGray}}
              hideNext={true}
               navigator={this.props.navigator}
              customPrev={
                  <View style={{flexDirection: 'row',opacity:0.5,top:7}}>
                    <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
                  </View>
              }
              onPrev={(nav,route)=> nav.pop()}
              title={`PREFERENCES`}
              titleColor={colors.white}
              />
            <ScrollView style={{flex:1,marginTop:50,paddingVertical:20}}   >
              <View style={{paddingHorizontal: 25,}}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formHeaderText}>About My Match</Text>
                </View>
              </View>
              <View style={{marginVertical: 20,}}>

              <TouchableHighlight onPress={(f)=>{
                  //trigger modal
                  this.props.navigator.push({
                    component: FieldModal,
                    passProps: {
                      inputField: ()=>{
                        return(
                        <MaskableTextInput
                           autofocus={true}
                           style={{
                               alignSelf: 'stretch',
                               padding: 8,
                               fontSize: 20,
                               color: colors.white,
                               height:60,
                               width:DeviceWidth-40
                           }}
                           placeholder={''}
                           autoGrow={true}
                           maxHeight={300}
                           autoCapitalize={'sentences'}
                           placeholderTextColor={colors.white}
                           autoCorrect={true}
                           returnKeyType={'go'}
                           multiline={true}
                           ref={component => this._textArea = component}
                           clearButtonMode={'always'}
                       />)},
                       field:{label:'bio',field_type:'textarea'},
                      fieldName:'bio',
                      cancel: ()=>{dismissKeyboard(); this.props.navigator.pop()},
                      fieldValue: this.props.user.bio
                    }
                  })
                }} >
                <View  style={{marginHorizontal:25,height:100,width:DeviceWidth-50,flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',flexDirection:'column',borderBottomWidth:2,borderColor:colors.shuttleGray}}>
                <Text style={{color:colors.white,fontSize:20,flexWrap:'wrap',fontFamily:'Montserrat'}}>{this.props.user.bio ? this.props.user.bio : ''}</Text>
                </View>
              </TouchableHighlight>

              </View>


              <TouchableHighlight underlayColor={colors.dark} style={{paddingHorizontal: 25,}} onPress={()=>{this.toggleField('looking_for_mf')}}>
                <View  style={[{height:50,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                  <Text style={{color: looking_for_mf ? colors.white : colors.rollingStone,
                      fontSize:14,fontFamily:'Montserrat'}}>MALE + FEMALE COUPLES</Text>
                    <Image source={looking_for_mf ? require('image!ovalSelected') : require('image!ovalDashed')}/>
                </View>
              </TouchableHighlight>

              <TouchableHighlight underlayColor={colors.dark} style={{paddingHorizontal: 25,}} onPress={()=>{this.toggleField('looking_for_mm')}}>
                <View  style={[{height:50,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                  <Text style={{color: looking_for_mm ? colors.white : colors.rollingStone,
                      fontSize:14,fontFamily:'Montserrat'}}>MALE + MALE COUPLES</Text>
                    <Image source={looking_for_mm ? require('image!ovalSelected') : require('image!ovalDashed')}/>
                </View>
              </TouchableHighlight>

              <TouchableHighlight underlayColor={colors.dark} style={{paddingHorizontal: 25,}} onPress={()=>{this.toggleField('looking_for_ff')}}>
                <View  style={[{height:50,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                  <Text style={{color: looking_for_ff ? colors.white : colors.rollingStone,
                      fontSize:14,fontFamily:'Montserrat'}}>FEMALE + FEMALE COUPLES</Text>
                    <Image source={looking_for_ff ? require('image!ovalSelected') : require('image!ovalDashed')}/>
                </View>
              </TouchableHighlight>
            <View  style={{marginVertical:20}}>
              <AgePrefs user={this.props.user} />
            </View>
          </ScrollView>
          </View>




    )
  }
}

export default SettingsPreferences




var styles = StyleSheet.create({


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

});
