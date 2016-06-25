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
  PixelRatio,
  NativeModules,
  Image,
  AsyncStorage,
  Navigator
} from  'react-native'

import Mixpanel from '../utils/mixpanel';
import FakeNavBar from '../controls/FakeNavBar';
import dismissKeyboard from 'dismissKeyboard'
import Dimensions from 'Dimensions'
import AgePrefs from '../controls/AgePrefs'
import PermissionSwitches from './PermissionSwitches'
import UserActions from '../flux/actions/UserActions'
import EditImage from '../screens/registration/EditImage'
import SelfImage from './loggedin/SelfImage'
import colors from '../utils/colors'
import reactMixin from 'react-mixin'
import FieldModal from './FieldModal'
import {MagicNumbers} from '../DeviceConfig'
import CheckPermissions from '../modals/CheckPermissions'
import PartnerMissingModal from '../modals/PartnerMissingModal'
import NotificationPermissions from '../modals/NewNotificationPermissions'
import styles from './settingsStyles'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

var PickerItemIOS = PickerIOS.Item
var {OSPermissions} = NativeModules

class  SettingsPreferences extends React.Component{
  constructor(props){
    super()
    this.state = {
      scroll: 'on',
      nearMeToggled: OSPermissions.location && parseInt(OSPermissions.location) > 2,
      looking_for_mf: props.user.looking_for_mf || false,
      looking_for_mm: props.user.looking_for_mm || false,
      looking_for_ff: props.user.looking_for_ff || false,
      looking_for_m: props.user.looking_for_m || false,
      looking_for_f: props.user.looking_for_f || false,
    }
  }
  toggleField(field){
    var newState = {}
    newState[field] = !this.state[field]
    UserActions.updateUser(newState)
    this.setState(newState)
  }
  toggleScroll(direction){
    this.setState({scroll:direction})
  }
   editBio(){
    this.props.navigator.push({
      component: FieldModal,
      passProps: {
        inputField: ()=>{
          return(
            <TextInput
            autofocus={true}
            style={styles.autogrowTextinput}
            placeholder={''}
            autoGrow={true}
            maxHeight={MagicNumbers.isSmallDevice ? 230 : 300}
            autoCapitalize={'sentences'}
            placeholderTextColor={colors.white}
            autoCorrect={true}
            returnKeyType={'done'}
            multiline={true}
            keyboardAppearance={'dark'}
            ref={'_textArea'}
            clearButtonMode={'always'}
            />
          )
        },
        field:{
          label: `What are you looking for in a Match?`,
          field_type:'textarea'
        },
        fieldName:'bio',
        cancel: ()=>{dismissKeyboard(); this.props.navigator.pop()},
        fieldValue: this.props.user.bio || ''
      }
    })

  }
  onPressSelectable(field){
    if(this.props.user.relationship_status == 'couple' && this.props.user.status == 'onboarded'){
      this.toggleField(field)
    }else if(this.props.user.relationship_status == 'couple' && this.props.user.status != 'onboarded'){
      this.showPartnerMissingModal()
    }else if(this.props.user.relationship_status == 'single'){
      this.toggleField(field)

    }
  }

  showPartnerMissingModal(){
    // if permission has been denied, show the modal in failedState mode (show settings link)
    this.props.navigator.push({
      component:PartnerMissingModal,
      passProps:{
        goBack:()=>{this.props.navigator.pop(); },
      }
    })
  }
  render(){
    let u = this.props.user;

    const {looking_for_mf,looking_for_mm,looking_for_ff, looking_for_f, looking_for_m} = this.state
    const values = {looking_for_mf,looking_for_mm,looking_for_ff, looking_for_f, looking_for_m}
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
            title={`PREFERENCES`}
            titleColor={colors.white}
          />
          <ScrollView
          style={{flex:1,
            marginTop: 54,
            paddingVertical:MagicNumbers.is4s ? 0 : 20}}
            scrollEnabled={this.state.scroll == 'on' ? true : false}
            >
            <View style={styles.paddedSpace}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>
                 What are you looking for in a Match?
                </Text>
              </View>
            </View>

            <View style={{marginTop:10}}>
              <TouchableHighlight underlayColor={colors.dark} onPress={this.editBio.bind(this)}>
                <View style={styles.textareaWrap}>
                  <Text numberOfLines={2} style={styles.bioText}>
                    {this.props.user.bio ? this.props.user.bio : ''}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>

            <View style={[styles.paddedSpace,{marginBottom:0}]}>
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>{`Show Me`}</Text>
              </View>
            </View>

      {this.props.user.relationship_status == 'single' ?
        <Selectable
          field={'looking_for_mf'}
          onPress={this.onPressSelectable.bind(this)}
          label={'MALE + FEMALE COUPLES'}
          values={values}
        /> : null }
      {this.props.user.relationship_status == 'single' ?
        <Selectable
          field={'looking_for_mm'}
          onPress={this.onPressSelectable.bind(this)}
          label={'MALE + MALE COUPLES'}
          values={values}
        /> : null }
      {this.props.user.relationship_status == 'single' ?
        <Selectable
          field={'looking_for_ff'}
          onPress={this.onPressSelectable.bind(this)}
          label={'FEMALE + FEMALE COUPLES'}
          values={values}
        /> : null }

      {this.props.user.relationship_status == 'couple' ?
        <Selectable
          field={'looking_for_f'}
          onPress={this.onPressSelectable.bind(this)}
          label={'FEMALE SINGLES'}
          values={values}
        /> : null }
      {this.props.user.relationship_status == 'couple' ?
        <Selectable
          field={'looking_for_m'}
          onPress={this.onPressSelectable.bind(this)}
          label={'MALE SINGLES'}
          values={values}
        /> : null }

      <View style={{paddingTop:50}}>

        <View>
          <AgePrefs
            toggleScroll={this.toggleScroll.bind(this)}
            user={this.props.user}
            showPartnerMissingModal={this.showPartnerMissingModal.bind(this)}
          />
        </View>

        <PermissionSwitches {...this.props} />
        </View>

        </ScrollView>

      </View>
    )
  }
}


export default SettingsPreferences

class Selectable extends React.Component{
  constructor(props){
    super()
  }
  render(){
    return (
      <TouchableHighlight
        underlayColor={colors.dark}
        style={styles.paddedSpace}
        onPress={() => this.props.onPress(this.props.field) }
        >
        <View style={[styles.insideSelectable,styles.formRow]}>
          <Text
            style={{color: this.props.values[this.props.field] ? colors.white : colors.rollingStone,
              fontSize:MagicNumbers.size18,fontFamily:'Montserrat'
            }}
          >{this.props.label}</Text>
          <Image
            style={{height:30,width:30}}
            source={{ uri:this.props.values[this.props.field] ? 'assets/ovalSelected@3x.png' : 'assets/ovalDashed@3x.png'} }
          />
        </View>
      </TouchableHighlight>
    )
  }
}
