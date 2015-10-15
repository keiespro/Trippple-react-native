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

import dismissKeyboard from 'dismissKeyboard'

import scrollable from 'react-native-scrollable-decorator'
import Dimensions from 'Dimensions'
import ParallaxView from  '../controls/ParallaxScrollView'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import DistanceSlider from '../controls/distanceSlider'
import ToggleSwitch from '../controls/switches'
import UserActions from '../flux/actions/UserActions'
import EditImage from '../screens/registration/EditImage'
import SelfImage from './loggedin/SelfImage'
import Privacy from './privacy'
import FacebookButton from '../buttons/FacebookButton'
import FeedbackButton from '../screens/feedbackButton'
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

class ProfileField extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      selectedDropdown: '',
    }
  }

  _editField=()=>{}

  render(){
    var field = this.props.field || {};
    console.log('ProfileField',field);

    var displayField = (field) => {
      switch (field.field_type) {
        case "input":
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

        case "dropdown":
          // always add an empty option at the beginning of the array
          field.values.unshift('');

          return (
            <PickerIOS
              style={{alignSelf:'center',width:330,backgroundColor:'red',marginHorizontal:0,alignItems:'stretch'}}
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
    if(!field.label){ return false}

    return (
        <TouchableHighlight onPress={(f)=>{
            //trigger modal
            this.props.navigator.push({
              component: FieldModal,
              passProps: {
                inputField: displayField(field),
                field,
                fieldName:this.props.fieldName,
                cancel: ()=>{dismissKeyboard(); this.props.navigator.pop()},
                fieldValue: this.props.user[this.props.fieldName]
              }
            })
          }} style={{borderBottomWidth:2,borderColor:colors.shuttleGray}}>
          <View  style={{height:50,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.rollingStone,fontSize:22,fontFamily:'Montserrat'}}>{field.label && field.label.toUpperCase()}</Text>
            <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat',textAlign:'right'}}>{this.props.user[this.props.fieldName] ? this.props.user[this.props.fieldName].toUpperCase() : ''}</Text>
          </View>
        </TouchableHighlight>
    )
  }
}

class  SettingsPreferences extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      colorFalseSwitchIsOn: false
    }
  }
  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};
    console.log('settingOptions',settingOptions);

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
          <ScrollView style={{flex:1,marginTop:50}} contentContainerStyle={{   paddingHorizontal: 25,}} >

            <TouchableHighlight onPress={this._editField}>
              <View style={styles.formRow}>
                <Text style={styles.textfield}>{this.props.user.relationship_status}</Text>
              </View>
              </TouchableHighlight>
              <View style={styles.formRow}>
              <SwitchIOS
                onValueChange={(value) => this.setState({colorFalseSwitchIsOn: value})}
                onTintColor={colors.dark}
                style={{marginVertical: 10}}
                thumbTintColor={colors.mediumPurple}
                tintColor={colors.dusk}
                value={this.state.colorFalseSwitchIsOn} />
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

});
