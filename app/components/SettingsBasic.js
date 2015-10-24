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
  PixelRatio,
  Image,
  AsyncStorage,
  Navigator
} from  'react-native'
import Mixpanel from '../utils/mixpanel';
import SegmentedView from '../controls/SegmentedView'
import ScrollableTabView from '../scrollable-tab-view'
import FakeNavBar from '../controls/FakeNavBar';

import dismissKeyboard from 'dismissKeyboard'
import moment from 'moment'
import scrollable from 'react-native-scrollable-decorator'
import Dimensions from 'Dimensions'
import ParallaxView from  '../controls/ParallaxScrollView'
import PhoneNumberInput from '../controls/phoneNumberInput.js'

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

import FieldModal from './FieldModal'
import formatPhone from '../utils/formatPhone'

var PickerItemIOS = PickerIOS.Item;

class ProfileField extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      selectedDropdown: '',
    }
  }

  _editField=()=>{}
  formattedPhone(){
    return formatPhone(this.props.user[this.props.fieldName])
  }
  render(){
    var field = this.props.field || {};
    console.log('ProfileField',field);

    var displayField = (field) => {
      switch (field.field_type) {
        case 'input':
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
                placeholder={field.placeholder ? field.placeholder.toUpperCase() : field.label.toUpperCase()}
                autoCapitalize={'words'}
                maxLength={10}
                placeholderTextColor={colors.white}
                autoCorrect={false}
                returnKeyType={'go'}
                autoFocus={true}
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
          }} underlayColor={colors.dark} style={{ paddingHorizontal:25,}}>
          <View  style={{height:60,borderBottomWidth:1,borderColor:colors.shuttleGray,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
          <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{field.label && field.label.toUpperCase()}</Text>
            <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat',textAlign:'right'}}>{
              field.field_type == 'phone_input' ? this.formattedPhone() :
              this.props.user[this.props.fieldName] ? this.props.user[this.props.fieldName].toString().toUpperCase() : ''
            }</Text>
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
        console.log('settings fb button',fbUser,this.state.fbUser)
        this.setState({fbUser});


  }
  render(){
    let user = this.props.user;
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
          title={`BASIC`}
          titleColor={colors.white}
          />
        <ScrollView style={{flex:1,marginTop:55}} contentContainerStyle={{}} >

        <ScrollableTabView style={{overflow:'hidden'}} renderTabBar={(props)=><CustomTabBar {...props}/>}>
          <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,paddingTop:60}}  tabLabel={'GENERAL'}>

          <View style={{height:150,width:150,alignSelf:'center'}}>
            <Image
              style={styles.userimage}
              key={user.image_thumb}
              source={{uri: user.image_thumb}}
              defaultSource={require('image!placeholderUser')}
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
                <Text style={styles.formHeaderText}>Personal Info</Text>
              </View>
              </View>
            {['firstname'].map((field) => {
              return <ProfileField user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
            })}

            {['birthday','gender'].map((field) => {
              return (
                <View  style={{height:60,borderBottomWidth:1,borderColor:colors.shuttleGray, alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:25}}>
                  <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{ field.toUpperCase()}</Text>
                <Text style={{color:colors.shuttleGray,
                    fontSize:18,fontFamily:'Montserrat',textAlign:'right',paddingRight:30}}>{
                    field == 'birthday' ?
                    this.props.user[field] ? moment(this.props.user[field]).format('MM/DD/YYYY') : ''
                    : this.props.user[field] ? this.props.user[field] : ''
                  }</Text>
                  <Image
                      style={{width:15,height:15,position:'absolute',right:0,top:23}}
                      source={require('image!icon-lock')}
                      resizeMode={Image.resizeMode.contain}/>
                </View>
              )
            })}
            <View style={{paddingHorizontal: 25,}}>

            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Contact Info</Text>
            </View>
            </View>

            {['phone','email'].map((field) => {
              return <ProfileField user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
            })}

        </View>
        <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,  }}  tabLabel={'DETAILS'}>
        <View style={{paddingHorizontal: 25,}}>

            <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Details</Text>
            </View>

          </View>

          {['height','body_type','ethnicity','eye_color','hair_color','smoke','drink'].map((field) => {
            return <ProfileField user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
          })}


          </View>
        </ScrollableTabView>

        {!this.props.user.facebook_user_id ?

        <View style={{paddingHorizontal: 25,}}>
        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Get More Matches</Text>
        </View>
        </View> : null }

        {!this.props.user.facebook_user_id ?
          <View style={{paddingHorizontal: 25,marginTop:10}}>

          <FacebookButton shouldLogoutOnTap={true} _onPress={this.onPressFacebook.bind(this)} buttonType={'settings'} buttonTextStyle={{fontSize:20,fontFamily:'Montserrat-Bold'}} wrapperStyle={{height:100,padding:0}}/>

          </View>
        : null}

        {!this.props.user.facebook_user_id ?

        <View style={{paddingHorizontal: 25,marginBottom:25}}>
          <Text style={{color:colors.shuttleGray,textAlign:'center',fontSize:18}}>Don’t worry, we wont tell your friends or post on your wall.</Text>
        </View> : null }

      </ScrollView>
      </View>

    )
  }
}

export default SettingsBasic




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

 phoneInput: {
   height: 60,
   padding: 8,
   flex:1,
   width:DeviceWidth-40,
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
      <TouchableOpacity key={name} onPress={() => {this.props.goToPage(page)}}>
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