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

import Contacts from '../screens/contacts'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import EditPage from './EditPage'
import CloseButton from './CloseButton'
import Api from '../utils/api'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import reactMixin from 'react-mixin'


@reactMixin.decorate(TrackKeyboardMixin)
class FieldModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      keyboardSpace: 0,
      value:this.props.fieldValue,
      canContinue:false
    }
  }
  onChange(val){
    // if(this.dropdown){
    //   this.dropdown.setNativeProps({
    //     selectedValue: val
    //   })
    // }
    if(val.length > 0){
      this.setState({
        canContinue:true,
        value: val
      })
    }
  }
  submit(){
    if(!this.state.canContinue){return false}
    var payload = {}
    payload[`${this.props.fieldName}`] = this.state.value;
    UserActions.updateUser(payload)
    this.props.cancel()
  }
  renderButtons(){
    return (
      <View style={{flexDirection:'row',height:60,alignSelf:'stretch',alignItems:'center',width:DeviceWidth}}>
        <TouchableHighlight underlayColor={colors.dark} onPress={this.props.cancel}
          style={{ borderTopWidth: 1, borderColor: colors.rollingStone,flex:1,paddingVertical:20}}>
          <View>
            <Text style={{color:colors.white,fontSize:20,fontFamily:'Montserrat-Bold',textAlign:'center'}}>
              CANCEL
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={colors.mediumPurple} onPress={this.submit.bind(this)}
          style={{ borderTopWidth: 1, flex:1,
            backgroundColor: this.state.canContinue ? colors.mediumPurple20 : 'transparent',
            borderColor: this.state.canContinue ? colors.mediumPurple : colors.rollingStone,
            borderLeftWidth:1,alignItems:'center',paddingVertical:20
          }}>
          <View>
            <Text style={{color: this.state.canContinue ? colors.white : colors.rollingStone,
              fontSize:20,fontFamily:'Montserrat-Bold',textAlign:'center'}}>
              UPDATE
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  render(){
    var {field,fieldValue,inputField} = this.props

    var inside = () =>{
      switch(field.field_type ){
        case 'dropdown':
        return (
          <View style={{ alignSelf:'stretch',flex:1}}>
            <View style={{ alignSelf:'stretch',flex:1,height:DeviceHeight-170,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
              <View style={{ borderBottomWidth: 2, borderBottomColor: colors.rollingStone, }}>
                <Text style={{
                    color: colors.rollingStone,
                    fontSize: 16,textAlign:'center',
                    fontFamily:'Omnes-Regular',
                }}>{field.label}</Text>
                <Text style={{
                    padding: 8,
                  fontSize: 30,
                  width:DeviceWidth-40,
                  borderBottomWidth: 2,
                  borderBottomColor: colors.rollingStone,
                  textAlign:'center',
                  fontFamily:'Montserrat',
                  color: colors.white}}>{this.state.value ? this.state.value.toString().toUpperCase() : fieldValue ? fieldValue.toString().toUpperCase() : ''}</Text>
              </View>
            </View>
            {this.renderButtons()}
            <View style={{backgroundColor:colors.white,flex:1,flexDirection:'column',alignItems:'center',width:DeviceWidth,justifyContent:'center',padding:0}}>
              {React.cloneElement(inputField,{
                onValueChange:(value) => {
                  this.onChange(value)
                },
                selectedValue:this.state.value || fieldValue,
                ref: (dropdown) => { this.dropdown = dropdown }
              }
            )}
            </View>
          </View>
        )

    case 'input':
      return (
        <View style={{ alignSelf:'stretch',flex:1,justifyContent:'space-between'}}>
          <View style={{ alignSelf:'stretch',flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column',padding:20}}>
            <Text style={{
                color: colors.rollingStone,
                fontSize: 16,textAlign:'center',
                fontFamily:'Omnes-Regular',
            }}>{field.label}</Text>
            <View style={{ borderBottomWidth: 2, borderBottomColor: colors.rollingStone, }}>
              {React.cloneElement(inputField,{
              defaultValue:fieldValue,
              onChangeText:(value) => {
                this.onChange(value)
              },
              autoCapitalize:'characters',
              ref: (textField) => { this.textField = textField }
            }
          )}
          </View>

          </View>
          {this.renderButtons()}

        </View>
      )
    case 'textarea':
        return (
          <View style={{ alignSelf:'stretch',flex:1,justifyContent:'space-between'}}>
            <View style={{ alignSelf:'stretch',flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column',padding:20}}>
              <Text style={{
                  color: colors.rollingStone,
                  fontSize: 16,textAlign:'center',
                  fontFamily:'Omnes-Regular',
              }}>{field.label}</Text>
              <View style={{ borderBottomWidth: 2, borderBottomColor: colors.rollingStone, }}>

                {React.cloneElement(this.props.inputField(),{
                defaultValue:fieldValue,
                onChangeText:(value) => {
                  this.onChange(value)
                }
              })}

            </View>

            </View>
            {this.renderButtons()}

          </View>
        )

      }
    }
    return (
      <ScrollView
        scrollEnabled={false}
        onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
        onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
        style={{flex:1}}
        contentContainerStyle={[styles.container,{
          backgroundColor:colors.outerSpace,
          padding:0,
          alignSelf:'stretch',
          paddingBottom:this.state.keyboardSpace
        }]}>

        {inside()}

      </ScrollView>
    )
  }
}
export default FieldModal


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
