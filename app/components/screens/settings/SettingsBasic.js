'use strict';


import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Animated,
  Picker,
  Image,
  Navigator,
} from 'react-native';
import React from "react";
import moment from 'moment';
import dismissKeyboard from 'dismissKeyboard'
import { connect } from 'react-redux'

import Analytics from '../../../utils/Analytics';
import FieldModal from '../../modals/FieldModal';
import PhoneNumberInput from '../../controls/phoneNumberInput';
import ScrollableTabView from '../../scrollable-tab-view';
import SelfImage from '../../SelfImage';
import colors from '../../../utils/colors';
import formatPhone from '../../../utils/formatPhone';
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import {MagicNumbers} from '../../../utils/DeviceConfig'
import {
  NavigationStyles,
} from '@exponent/ex-navigation';

var PickerItem = Picker.Item;

class ProfileField extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      selectedDropdown: props.user[props.fieldName] || '',
    }
  }

  formattedPhone(){
    if(!this.props.user.phone) return '';
    return formatPhone(this.props.user.phone)
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
            this.props.navigator.push(this.props.navigation.router.getRoute('FieldModal',{
              key:`edit${fieldLabel}`,
                inputField: displayField(field),
                field,
                fieldName:this.props.fieldName,
                title:'PROFILE',
                cancel: ()=>{dismissKeyboard(); this.props.navigator.pop()},
                fieldValue: this.props.user[this.props.fieldName] || (field.values && field.values.length > 0 && field.values[0]) || '',
                dispatch:this.props.dispatch
            }))
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

  static route = {
    styles: NavigationStyles.FloatHorizontal,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(params){
        return `PROFILE`
      }
    }
  };
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
  formattedPhone(){
    if(!this.props.user.phone) return '';
    return formatPhone(this.props.user.phone)
  }
  render(){
    let user = this.props.user;
    let settingOptions = this.props.settingOptions || {};
    const singleImage = this.props.user.localUserImage || {uri: this.props.user.image_url },
          singleImageThumb = this.props.user.localUserImage || {uri: this.props.user.thumb_url };

    return (



      <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,height:DeviceHeight,overflow:'hidden',flex:1,paddingTop:60}}>

      <ScrollableTabView startPage={this.props.startPage} onChangeTab={(tab)=>{

      Analytics.screen(`SettingsBasic`+ [' GENERAL',' DETAILS'][tab.i]);
      }} padded={false} renderTabBar={(props)=><CustomTabBar {...props}/>}>
      <ScrollView
          showsVerticalScrollIndicator={false}
          style={{  height:DeviceHeight-60 }}  tabLabel={'GENERAL'}>
          <View style={[{  }]}>

              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>Personal Info</Text>
              </View>

            {['firstname'].map((field,i) => {
              return <ProfileField  navigation={this.props.navigation}  key={field+'key'+(i*10)} user={this.props.user} dispatch={this.props.dispatch} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
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

              <ProfileField dispatch={this.props.dispatch}  key={field+'key'+(i*1000)}  user={this.props.user} navigator={this.props.navigator} navigation={this.props.navigation} fieldName={field} field={settingOptions[field]} />
            )
          })}
              <View style={styles.formHeader}>
                <Text style={styles.formHeaderText}>Contact Info</Text>
              </View>
            <View style={{}}>
            {['phone'].map((field,i) => {
              return (

                 <ProfileField navigation={this.props.navigation} dispatch={this.props.dispatch} key={field+'key'+(i*1000)} user={this.props.user} navigator={this.props.navigator} fieldName={field} field={{...settingOptions[field], label:'PHONE'}} />

              )
            })}

            {['email'].map((field,i) => {
              return <ProfileField   navigation={this.props.navigation}  dispatch={this.props.dispatch}  key={field+'key'+(i*1000)}  user={this.props.user} navigator={this.props.navigator} fieldName={field} field={settingOptions[field]} />
            })}

            </View>
            </View>
            </ScrollView>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height:DeviceHeight-110}}
                tabLabel={'DETAILS'}>
             <View style={styles.formHeader}>
              <Text style={styles.formHeaderText}>Details</Text>
           </View>
          <View style={{alignSelf:'stretch',alignItems:'stretch',flex:1,width:DeviceWidth,paddingBottom:30}}>
          {['height','body_type','ethnicity','eye_color','hair_color','smoke','drink'].map((field,i) => {
            return (
              <View key={field+'key'+(i*10000)} style={{alignSelf:'stretch',alignItems:'stretch',width:DeviceWidth}}>
                <ProfileField
                  dispatch={this.props.dispatch}
                  user={this.props.user}
                  navigator={this.props.navigator}
                  fieldName={field}
                  navigation={this.props.navigation}
                  field={settingOptions[field]}
                />
              </View>
            )
          })}
          </View>
          </ScrollView>

        </ScrollableTabView>

      </View>


    )
  }
}

SettingsBasic.displayName = "SettingsBasic"



const mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBasic);



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
   marginTop:40,
   marginHorizontal:MagicNumbers.screenPadding/2
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
