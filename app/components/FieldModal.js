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
  DatePickerIOS,
  PickerIOS,
  Image,
  AsyncStorage,
  Navigator
} from  'react-native'
import Mixpanel from '../utils/mixpanel';
import SegmentedView from '../controls/SegmentedView'
import ScrollableTabView from '../scrollable-tab-view'
import FakeNavBar from '../controls/FakeNavBar';
import CustomSceneConfigs from '../utils/sceneConfigs'

import dismissKeyboard from 'dismissKeyboard'
import {MagicNumbers} from '../DeviceConfig'

import scrollable from 'react-native-scrollable-decorator'
import Dimensions from 'Dimensions'
import moment from 'moment'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import UserActions from '../flux/actions/UserActions'
import PinScreen from './pin'

import colors from '../utils/colors'
import CloseButton from './CloseButton'
import TrackKeyboardMixin from '../mixins/keyboardMixin'
import reactMixin from 'react-mixin'

function getMaxLength(fieldName){
  let len = 20
  switch(fieldName){
    case 'firstname':
      len = 10; break;
    case 'email':
      len = 30; break;
  }
  return len
}

@reactMixin.decorate(TrackKeyboardMixin)
class FieldModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      keyboardSpace: 0,
      value:props.fieldValue,
      phoneValue:props.fieldValue,
      canContinue:props.field.field_type == 'dropdown' ? !!props.fieldValue : false
    }
  }
  componentWillMount(){
    if(this.props.field.field_type == 'textarea'){
      this.setState({value: this.props.fieldValue ? this.props.fieldValue+'\n' : ''})
    }
  }
  componentDidMount(){
    if(this.props.field.field_type == 'textarea' && this.refs._textArea){

      this.refs._textArea.focus()
      this.refs._textArea.setNativeProps({value: this.props.fieldValue ? this.props.fieldValue+'\n' : ''})
      // this.refs._textArea.setSelectionRange((this.props.fieldValue ? this.props.fieldValue.length : this.state.value.length),(this.props.fieldValue ? this.props.fieldValue.length : this.state.value.length))

    }
  }
  onChange(val){
    if(!val) return
    var isValid = true;

    if(this.props.fieldName == 'email'){
      isValid = (/.+\@.+\..+/.test(val))
    }
    if(val.length > 0 && isValid){
      this.setState({
        canContinue:true,
        error: false,
        value: val.trim()
      })
    }else{
      this.setState({
        canContinue:false,
        error: true,
        value: val
      })
    }
  }
  onChangePhone({phone}){
    if(phone.length == 10){
      this.setState({
        canContinue:true,
        phoneValue: phone
      })
    }else{
      this.setState({
        canContinue:false,
        phoneValue: phone
      })
    }
  }

  getValueFromKey(data, key) {
    var value = null;
    Object.keys(data).forEach(function(i) {
       if (i == key) {
          value = data[i];
       }
    });

    return { key: key, value: value};
  }

  // onDateChange(date){
  //
  //   var isLegal = moment(date).diff(moment(), 'years') < -18;
  //   if(!isLegal){
  //    this.setState({
  //       error:true,
  //       inputFieldValue: date,
  //       date: date
  //
  //   })
  //
  //   }else{
  //     this._root.setNativeProps({date:date})
  //
  //     this.setState({
  //       error:false,
  //       date: date,
  //       canContinue:true
  //     })
  //   }
  // }
  submit(){
    if(!this.state.canContinue){return false}

    if(this.props.field.field_type == 'phone_input'){
      this.props.navigator.push({
        component: PinScreen,
        title: '',
        id:'pinupdate',
        sceneConfig: CustomSceneConfigs.HorizontalSlide,
        passProps: {
          goBack: this.props.cancel,
          phone: this.state.phoneValue,
          initialKeyboardSpace: this.state.keyboardSpace
        }
      })
    }else{
      var payload = {}
      payload[`${this.props.fieldName}`] = this.state.value;
      UserActions.updateUser(payload)
      this.props.cancel()
    }
  }

  renderButtons(){
    return (
      <View style={{bottom:-2,flexDirection:'row',height:70,alignSelf:'stretch',alignItems:'center',width:DeviceWidth}}>
        <TouchableHighlight underlayColor={colors.dark} onPress={this.props.cancel}
          style={{ borderTopWidth: 1, borderColor: colors.rollingStone,flex:1,paddingVertical:20}}>
          <View>
            <Text style={{color:colors.white,fontSize:20,fontFamily:'Montserrat',textAlign:'center'}}>
              CANCEL
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={colors.mediumPurple} onPress={this.submit.bind(this)}
          style={{
            borderTopWidth: 1,
            flex:1,
            backgroundColor: this.state.canContinue ? colors.mediumPurple20 : 'transparent',
            borderColor: this.state.canContinue ? colors.mediumPurple : colors.rollingStone,
            borderLeftWidth:1,
            alignItems:'center',
            paddingVertical:20
          }}>
          <View>
            <Text style={{color: this.state.canContinue ? colors.white : colors.rollingStone,
              fontSize:20,fontFamily:'Montserrat',textAlign:'center'}}>
              UPDATE
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  render(){
    var {field,fieldValue,inputField} = this.props
    var purpleBorder
    if(field.field_type == 'phone_input'){
      purpleBorder =  this.state.canContinue || (this.state.phoneValue && this.state.phoneValue.length == 0)
    }else{
      purpleBorder = this.state.canContinue ||  (this.state.value && this.state.value.length == 0)
    }
    var borderColor = purpleBorder ? colors.mediumPurple : colors.rollingStone
    if(this.state.error) borderColor = colors.mandy

    //console.info('init fieldmodal render:', {state:this.state, field:field, fieldValue:fieldValue, inputField:inputField});

    fieldLabel = (fieldValue.label || fieldValue);
    fieldValue = (fieldValue.value || fieldValue);

    fieldValue = fieldValue ? fieldValue.toString().toUpperCase() : '';

    var selectedFieldLabel = (this.state.value || fieldLabel || '');
    var selectedFieldValue = (this.state.value || fieldValue || '');

    if (typeof field.values == 'object' && selectedFieldValue) {
      selectedFieldLabel = this.getValueFromKey(field.values, selectedFieldValue).value || selectedFieldLabel;
    }

    var displayStateFieldValue = selectedFieldLabel.toString().toUpperCase();
    displayStateFieldValue = (field.labelPrefix || '') + displayStateFieldValue + (field.labelSuffix || '');

    var inside = () =>{
      switch(field.field_type ){
        case 'dropdown':
        return (
          <View style={{ alignSelf:'stretch',flex:1}}>
            <View style={{ alignSelf:'stretch',flex:1,height:DeviceHeight-170,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone,alignItems:'center',justifyContent:'center',alignSelf:'stretch' }}>
                <Text style={{
                    color: colors.rollingStone,
                    fontSize: 20,textAlign:'center',
                    textAlign:'center',
                    fontFamily:'Omnes-Regular',alignSelf:'stretch',
                    marginBottom:MagicNumbers.screenPadding,

                }}>{field.long_label ? field.long_label : field.label}</Text>
                <Text style={{
                    padding: 8,
                  fontSize: 30,
                  width:MagicNumbers.screenWidth,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.rollingStone,
                  textAlign:'center',
                  fontFamily:'Montserrat',
                  color: colors.white}}>{displayStateFieldValue}</Text>
              </View>
            </View>
            {this.renderButtons()}
            <View style={{backgroundColor:colors.white, flex:1,flexDirection:'column',alignItems:'center', width:DeviceWidth,justifyContent:'center',padding:0}}>
              {React.cloneElement(inputField,{
                onValueChange: this.onChange.bind(this),
                selectedValue: (selectedFieldValue || null),
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
                fontSize: 20,textAlign:'center',
                fontFamily:'Omnes-Regular',
                marginBottom:40,
              }}>{field.long_label ? field.long_label : field.label}</Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: borderColor }}>
              {React.cloneElement(inputField,{
              maxLength: getMaxLength(this.props.fieldName),
              defaultValue: this.props.fieldName == 'firstname' ? fieldValue ? fieldValue.slice(0,10) : '' : fieldValue,
              onChangeText:(value) => {
                this.onChange(value.trim())
              },
              autoCapitalize:'characters',
              ref: (textField) => { this.textField = textField }
            }
          )}
          </View>
          {field.sub_label ? <Text  style={{
              color: colors.rollingStone,
              fontSize: 18,textAlign:'center',
              fontFamily:'Omnes-Regular',
              marginTop:15,
            }}>{field.sub_label}</Text> : null}
          </View>

            {/*
              this.state.error &&
                <View style={styles.bottomErrorTextWrap}>
                  <Text textAlign={'right'} style={[styles.bottomErrorText]}></Text>
                </View>
            */}


          {this.renderButtons()}

        </View>
      )

    case 'phone_input':
      return (
        <View style={{ alignSelf:'stretch',flex:1,justifyContent:'space-between'}}>
          <View style={{ alignSelf:'stretch',flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column',padding:20}}>
            <Text style={{
                color: colors.rollingStone,
                fontSize: 20,textAlign:'center',
                fontFamily:'Omnes-Regular',
                marginBottom:40,alignSelf:'stretch'

              }}>{field.long_label ? field.long_label : field.label}</Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone }}>
              {React.cloneElement(inputField,{
              handleInputChange:(value) => {
                this.onChangePhone(value)
              },
              ref: (phoneField) => { this.phoneField = phoneField }
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
            <View style={{ alignSelf:'stretch',flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column',paddingHorizontal:MagicNumbers.screenPadding/2,paddingVertical:5,margin:0}}>
              <Text  style={{
                  color: colors.rollingStone,
                  fontSize: 20,textAlign:'center',
                  fontFamily:'Omnes-Regular',
                  marginBottom:MagicNumbers.screenPadding/2,
                }}>{field.long_label ? field.long_label : field.label}</Text>
              <View style={{ borderBottomWidth: 1, borderBottomColor: purpleBorder ? colors.mediumPurple : colors.rollingStone }}>

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
        keyboardShouldPersistTaps={true}
        keyboardDismissMode={'interactive'}

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

   bottomText: {
     marginTop: 0,
     color: colors.rollingStone,
     fontSize: 16,
     fontFamily:'Omnes-Regular',
   },
   bottomErrorTextWrap:{

   },
   bottomErrorText:{
     marginTop: 0,
     color: colors.mandy,
     fontSize: 16,
     fontFamily:'Omnes-Regular',

   },
   pinInputWrap: {
     borderBottomWidth: 2,
     borderBottomColor: colors.rollingStone,
     height: 60,
     alignSelf: 'stretch'
   },
   pinInputWrapSelected:{
     borderBottomColor: colors.mediumPurple,
   },
   pinInputWrapError:{
     borderBottomColor: colors.mandy,
   },
   pinInput: {
     height: 60,
     padding: 8,
     fontSize: 30,
     fontFamily:'Montserrat',
     color: colors.white
   },
   middleTextWrap: {
     alignItems:'center',
     justifyContent:'center',
     marginBottom:10,
     height: 60
   },
   middleText: {
     color: colors.rollingStone,
     fontSize: 20,
     fontFamily:'omnes',
   },
});
