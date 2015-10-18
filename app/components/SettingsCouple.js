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
import FieldModal from './FieldModal'

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
        case "phone_input":
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
    if(!field.label){ return false}

    return (
        <View style={{borderBottomWidth:1,borderColor:colors.shuttleGray,marginHorizontal:25}}>
          <View  style={{height:50,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            <Text style={{color:colors.rollingStone,fontSize:20,fontFamily:'Montserrat'}}>{field.label && field.label.toUpperCase()}</Text>
          <Text style={{color:colors.white,fontSize:20,fontFamily:'Montserrat',textAlign:'right'}}>{this.props.user[this.props.fieldName] ? this.props.user[this.props.fieldName].toString().toUpperCase() : ''}</Text>
          </View>
        </View>
    )
  }
}

class SettingsCouple extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};
    console.log('settingOptions',settingOptions);

    var {partner} = this.props.user
    var partner = {
      firstname: 'xxx',
      phone: '33333333',
      gender: 'f',
      birthday: '11'
    }
    // if(!partner) {return false}
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
          title={`${partner.firstname}`}
          titleColor={colors.white}
          />
        <ScrollView style={{flex:1,marginTop:50}} contentContainerStyle={{   paddingTop:25}} >


                  <View style={{height:150,width:150,alignItems:'center',alignSelf:'center'}}>
                    <Image
                      style={styles.userimage}
                      key={partner.image_thumb}
                      source={{uri: partner.image_thumb}}
                      defaultSource={require('image!defaultuser')}
                      resizeMode={Image.resizeMode.contain}/>
                      <View style={{width:35,height:35,borderRadius:17.5,backgroundColor:colors.mediumPurple,position:'absolute',top:8,left:8,justifyContent:'center',alignItems:'center'}}>
                        <Image
                            style={{width:18,height:18}}
                            source={require('image!cog')}
                            resizeMode={Image.resizeMode.contain}/>
                        </View>
                    </View>
                    <View style={{paddingHorizontal: 25,}}>
                      <View style={styles.formHeader}>
                        <Text style={styles.formHeaderText}>Your Partner</Text>
                      </View>
                      </View>
                    {['firstname','birthday','gender'].map((field) => {
                      return <ProfileField user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
                    })}
                    <View style={{paddingHorizontal: 25,}}>

                    <View style={styles.formHeader}>
                      <Text style={styles.formHeaderText}>Contact Info</Text>
                    </View>
                    </View>

                    {['phone'].map((field) => {
                      return <ProfileField user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
                    })}



      </ScrollView>
      </View>

    )
  }
}

export default SettingsCouple

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
userimage:{
  backgroundColor:colors.dark,
  width:120,height:120,borderRadius:60,alignSelf:'center',
}
});
