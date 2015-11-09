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
  NativeModules,
  Image,
  AsyncStorage,
  Navigator
} from  'react-native'

import Mixpanel from '../utils/mixpanel';
import FakeNavBar from '../controls/FakeNavBar';
import MaskableTextInput from '../RNMaskableTextInput.js'
import dismissKeyboard from 'dismissKeyboard'
import Dimensions from 'Dimensions'
import AgePrefs from '../controls/AgePrefs'
import ToggleSwitch from '../controls/switches'
import UserActions from '../flux/actions/UserActions'
import EditImage from '../screens/registration/EditImage'
import SelfImage from './loggedin/SelfImage'
import colors from '../utils/colors'
import reactMixin from 'react-mixin'
import FieldModal from './FieldModal'
import {MagicNumbers} from '../DeviceConfig'
import CheckPermissions from '../modals/CheckPermissions'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

var PickerItemIOS = PickerIOS.Item
var {OSPermissions} = NativeModules

class  SettingsPreferences extends React.Component{
  constructor(props){
    super()
    this.state = {
      scroll: 'on',
      nearMeToggled: parseInt(OSPermissions.location) && (parseInt(OSPermissions.location) - 2),
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
  componentDidUpdate(pProps,pState){
    //i dont know why this is here
    // if(this.state.nearMeToggled != pState.nearMeToggled && this.state.nearMeToggled > 2){
    //   if(OSPermissions.location != this.state.nearMeToggled){
    //     this.setState({nearMeToggled:0})
    //   }
    // }

    // if permission has been denied, show the modal in failedState mode (show settings link)
    if((this.state.nearMeToggled && !pState.nearMeToggled)){
      this.props.navigator.push({
        component:CheckPermissions,
        passProps:{
          title:'PRIORITIZE LOCAL',
          subtitle:'We’ve found 10 matches we think you might like. Should we prioritize the matches closest to you?',
          failedTitle: 'LOCATION DISABLED',
          failCallback:(val)=>{this.props.navigator.pop(); this.setState({nearMeToggled:val})},
          failedSubtitle: 'Geolocation is disabled. You can enable it in your phone’s Settings.',
          failedState: (OSPermissions.location < 3 && this.state.nearMeToggled ? true : false),
          headerImageSource:'iconDeck',
          permissionKey:'location',
          renderNextMethod: 'pop',
          renderMethod:'push',
          renderPrevMethod:'pop',
          AppState:this.props.AppState,

        }
      })
    }
  }
  render(){
    let u = this.props.user;

    const {looking_for_mf,looking_for_mm,looking_for_ff, looking_for_f, looking_for_m} = this.state

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
            <ScrollView style={{flex:1,marginTop:50,paddingVertical:20}}
              scrollEnabled={this.state.scroll == 'on' ? true : false}  >
              <View style={styles.paddedSpace}>
                  <View style={styles.formHeader}>
                    <Text style={styles.formHeaderText}>{`About ${this.props.user.relationship_status == 'single' ? 'My' : 'Our'} Match`}</Text>
                </View>
              </View>
              <View style={{marginTop:10}}>

              <TouchableHighlight  underlayColor={colors.dark}  onPress={(f)=>{
                  //trigger modal
                  this.props.navigator.push({
                    component: FieldModal,
                    passProps: {
                      inputField: ()=>{
                        return(
                        <MaskableTextInput
                           autofocus={true}
                           style={styles.autogrowTextinput}
                           placeholder={''}
                           autoGrow={true}
                           maxHeight={MagicNumbers.isSmallDevice ? 230 : 300}
                           autoCapitalize={'sentences'}
                           placeholderTextColor={colors.white}
                           autoCorrect={true}
                           returnKeyType={'go'}
                           multiline={true}
                           ref={'_textArea'}
                           clearButtonMode={'always'}
                       />)},
                      field:{
                        label: `About ${this.props.user.relationship_status == 'single' ? 'My' : 'Our'} Match`, field_type:'textarea'
                      },
                      fieldName:'bio',
                      cancel: ()=>{dismissKeyboard(); this.props.navigator.pop()},
                      fieldValue: this.props.user.bio || ''
                    }
                  })
                }} >
                <View  style={styles.textareaWrap}>
                <Text numberOfLines={2}  style={{color:colors.white,height:50,fontSize:18,overflow:'hidden',alignSelf:'stretch',flexWrap:'wrap',textAlign:'left'}}>{this.props.user.bio ? this.props.user.bio : ''}</Text>
                </View>
              </TouchableHighlight>

              </View>
              <View style={[styles.paddedSpace,{marginBottom:0}]}>
                <View style={styles.formHeader}>
                  <Text style={styles.formHeaderText}>{`Show Me`}</Text>
                </View>
              </View>

            {this.props.user.relationship_status == 'single' ?
                <TouchableHighlight underlayColor={colors.dark} style={styles.paddedSpace} onPress={()=>{this.toggleField('looking_for_mf')}}>
                <View  style={[{height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                  <Text style={{color: looking_for_mf ? colors.white : colors.rollingStone,
                      fontSize:MagicNumbers.size18,fontFamily:'Montserrat'}}>MALE + FEMALE COUPLES</Text>
                    <Image source={looking_for_mf ? require('../../newimg/ovalSelected.png')) : require('../../newimg/ovalDashed.png'))}/>
                </View>
              </TouchableHighlight>
              : null }

              {this.props.user.relationship_status == 'single' ?

              <TouchableHighlight underlayColor={colors.dark} style={styles.paddedSpace} onPress={()=>{this.toggleField('looking_for_mm')}}>
                <View  style={[{height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                  <Text style={{color: looking_for_mm ? colors.white : colors.rollingStone,
                      fontSize:MagicNumbers.size18,fontFamily:'Montserrat'}}>MALE + MALE COUPLES</Text>
                    <Image source={looking_for_mm ? require('../../newimg/ovalSelected.png')) : require('../../newimg/ovalDashed.png'))}/>
                </View>
              </TouchableHighlight>
              : null }

              {this.props.user.relationship_status == 'single' ?

                <TouchableHighlight underlayColor={colors.dark} style={styles.paddedSpace} onPress={()=>{this.toggleField('looking_for_ff')}}>
                  <View  style={[{height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                    <Text style={{color: looking_for_ff ? colors.white : colors.rollingStone,
                        fontSize:MagicNumbers.size18,fontFamily:'Montserrat'}}>FEMALE + FEMALE COUPLES</Text>
                      <Image source={looking_for_ff ? require('../../newimg/ovalSelected.png')) : require('../../newimg/ovalDashed.png'))}/>
                  </View>
                </TouchableHighlight>
              : null }


              {this.props.user.relationship_status == 'couple' ?
                <TouchableHighlight underlayColor={colors.dark} style={styles.paddedSpace} onPress={()=>{this.toggleField('looking_for_f')}}>
                  <View  style={[{height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                    <Text style={{color: looking_for_f ? colors.white : colors.rollingStone,
                        fontSize:MagicNumbers.size18,fontFamily:'Montserrat'}}>FEMALE SINGLES</Text>
                      <Image source={looking_for_f ? require('../../newimg/ovalSelected.png')) : require('../../newimg/ovalDashed.png'))}/>
                  </View>
                </TouchableHighlight>
              : null }
              {this.props.user.relationship_status == 'couple' ?
                <TouchableHighlight underlayColor={colors.dark} style={styles.paddedSpace} onPress={()=>{this.toggleField('looking_for_m')}}>
                  <View  style={[{height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow]}>
                    <Text style={{color: looking_for_m ? colors.white : colors.rollingStone,
                        fontSize:MagicNumbers.size18,fontFamily:'Montserrat'}}>MALE SINGLES</Text>
                      <Image source={looking_for_m ? require('../../newimg/ovalSelected.png')) : require('../../newimg/ovalDashed.png'))}/>
                  </View>
                </TouchableHighlight>
              : null }


          <View  style={{paddingTop:50}}>

            <View>
              <AgePrefs toggleScroll={this.toggleScroll.bind(this)} user={this.props.user} />
            </View>

              <View style={[styles.paddedSpace,{marginBottom:15}]}>
                <View style={styles.formHeader}>
                  <Text style={styles.formHeaderText}>{`Location`}</Text>
                </View>
                <View style={[{height:60,alignItems:'center',justifyContent:'space-between',flexDirection:'row'},styles.formRow,{borderBottomWidth:0}]}>
                  <Text style={{color:  colors.white, fontSize:18}}>Prioritize Users Near Me</Text>
                  <SwitchIOS
                    onValueChange={(value) => this.setState({nearMeToggled: value})}
                    value={this.state.nearMeToggled > 0 ? true : false}
                    onTintColor={colors.dark}
                    thumbTintColor={this.state.nearMeToggled ? colors.mediumPurple : colors.shuttleGray}
                    tintColor={colors.dark}
                  />
                </View>
              </View>

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
   flex:1,
   borderBottomWidth: 1/PixelRatio.get(),
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
 paddedSpace:{
   paddingHorizontal:MagicNumbers.screenPadding/2
 },

 autogrowTextinput:{
     alignSelf: 'stretch',
     padding: 0,
     fontSize: MagicNumbers.size18 + 2,
     height:200,
     fontFamily:'omnes',
     color: colors.white,

     width:DeviceWidth - MagicNumbers.screenPadding
 },
 textareaWrap:{
   marginHorizontal:MagicNumbers.screenPadding/2,
   height:70,
   width:DeviceWidth - MagicNumbers.screenPadding,
   flexWrap:'wrap',
   alignItems:'center',
   justifyContent:'center',
   flexDirection:'column',
    borderBottomWidth: 1/PixelRatio.get(),
    borderColor:colors.shuttleGray
  }

});
