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
  PickerIOS,
  Image,
  AsyncStorage,
  Navigator
} from  'react-native'
import Mixpanel from '../utils/mixpanel';
import SegmentedView from '../controls/SegmentedView'
import ScrollableTabView from 'react-native-scrollable-tab-view'


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
// import {BlurView} from 'react-native-blur';

var bodyTypes = [
  'Athletic',
  'Average',
  'Curvy',
  'Heavy set',
  'Slender',
  'Stocky',
  'Rather not say'
];

class ProfileField extends React.Component{

  _editField=()=>{
    // this.props.navigator.push({
    //   component: EditPage,
    //   id: 'settingsedit',
    //   passProps: {
    //     val: this.props.val,
    //     navigator: this.props.navigator
    //   }
    // })
  }

  render(){
    var field = this.props.field || {};
    console.log('ProfileField',field);

    // var displayField = (
    //   <Text>empty</Text>
    // );

    // if (field.field_type == 'dropdown') {
    //   displayField = (
        // <PickerIOS
        //   selectedValue={this.state.carMake}
        //   onValueChange={(carMake) => this.setState({carMake, modelIndex: 0})}>
        //   {Object.keys(CAR_MAKES_AND_MODELS).map((carMake) => (
        //     <PickerItemIOS
        //       key={carMake}
        //       value={carMake}
        //       label={CAR_MAKES_AND_MODELS[carMake].name}
        //       />
        //     )
        //   )}
        // </PickerIOS>
    //   )
    // }

      var displayField = (field) => {
        switch (field.field_type) {
          case "input":
            return (
               <TextInput
              style={{height: 40, width:100, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({text})} 
              placeholder={field.label}
              />
            );
          default:
            return (
               <Text>empty</Text>
            );
        }
      }

    return (
        <View style={styles.formRow}>
          { displayField(field) }
        </View>
    )
  }
}

class BasicSettings extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    let u = this.props.user;
    let settingOptions = this.props.settingOptions || {};
    console.log('settingOptions',settingOptions);
    return (
      <View style={styles.inner}>

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Personal Info</Text>
        </View>

        {['firstname','birthday','gender'].map((field) => {
          console.log('settingOptions -> ',field, settingOptions[field], settingOptions);
          return <ProfileField navigator={this.props.navigator} field={settingOptions[field]} val={u[field]} />
        })}

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Contact Info</Text>
        </View>

        {['phone','email'].map((field) => {
          return <ProfileField navigator={this.props.navigator} field={settingOptions[field]} val={u[field]} />
        })}

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Details</Text>
        </View>

        {['height','body_type'].map((field) => {
          return <ProfileField navigator={this.props.navigator} field={settingOptions[field]} val={u[field]} />
        })}

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Get more matches</Text>
        </View>


      </View>
    )
  }
}

class PreferencesSettings extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      colorFalseSwitchIsOn: false
    }
  }

  _editField=()=>{ }

  render(){
    return (
      <View style={styles.inner}>
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


      </View>
    )
  }
}

class SettingsSettings extends React.Component{
  componentDidMount() {
    Mixpanel.track('On - Setings Screen');
  }
  constructor(props){
    super(props)
  }
  _editField=()=>{ }
  render(){
    return (
      <View style={styles.inner}>
        <TouchableHighlight onPress={this._editField}>
          <View style={styles.formRow}>
            <Text style={styles.textfield}>{this.props.user.gender}fpfoe</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const SettingsPageAtIndex = [ BasicSettings, PreferencesSettings, SettingsSettings ]

@scrollable
class SettingsInside extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      index: 0,
      isModalOpen: true,
      settingOptions: {},
    }
  }
  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  componentDidMount() {
    Api.getProfileSettingsOptions().then((options) => {
      if (options.settings) {
        this.setState({
          settingOptions: options.settings
        });
      } else {
        console.warn('SettingsInside -> componentDidMount -> state',this.state.settingOptions);
      }
    });
  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }
  handleImages(imgs){
    console.log(imgs);
    UserActions.uploadImage(imgs.croppedImage,'profile')

    navigator.jumpForward();
  }

  _pressNewImage =()=>{
    this.props.navigator.push({
      component: SelfImage,
      passProps: {


      }
    });
  }
  _editField=()=>{

  }


  _updateAttr(updatedAttribute){
    this.setState(()=>{return updatedAttribute});
  }

  onPressFacebook(fbUser){
    console.log('settings fb button',fbUser,this.state.fbUser)
    this.setState({fbUser});
    return (
      <View style={{height:800,backgroundColor:colors.outerSpace}}>
        <CurrentPage user={this.props.user} navigator={this.props.navigator} />
      </View>
    )
  }

  render(){

    console.log('this.state',this.state);

    return (
      <View style={{flex:1}}>



<ParallaxView
        showsVerticalScrollIndicator={false}
          key={this.props.user.image_url}
          navBar={this.props.navBar}
          backgroundSource={{uri: this.props.user.image_url}}
          windowHeight={320}
          navigator={this.props.navigator}
          style={{backgroundColor:colors.outerSpace,paddingTop:0}}
          header={(
          <View  style={[styles.userimageContainer,styles.blur]}>
            <TouchableOpacity onPress={this._pressNewImage}>
              <Image
                style={styles.userimage}
                key={this.props.user.image_thumb}
                source={{uri: this.props.user.image_thumb}}
                defaultSource={require('image!defaultuser')}
                resizeMode={Image.resizeMode.cover}/>

            </TouchableOpacity>

            <Text>{this.props.user.firstname}</Text>
            <Text>View Profile</Text>

          </View>
      )}>

      <ScrollableTabView renderTabBar={() => <CustomTabBar  />}>
        <View style={{height:800,backgroundColor:colors.outerSpace,width:DeviceWidth}}  tabLabel={'BASIC'}>
          <BasicSettings settingOptions={this.state.settingOptions} user={this.props.user} navigator={this.props.navigator}/>
        </View>
        <View style={{height:800,backgroundColor:colors.outerSpace,width:DeviceWidth}} tabLabel={'PREFERENCES'}>
          <PreferencesSettings  user={this.props.user} navigator={this.props.navigator} />
         </View>
        <View style={{height:800,backgroundColor:colors.outerSpace,width:DeviceWidth}} tabLabel={'SETTINGS'}>
          <SettingsSettings  user={this.props.user} navigator={this.props.navigator} />
         </View>

      </ScrollableTabView>




      <FacebookButton _onPress={this.onPressFacebook.bind(this)} buttonType={'connectionStatus'} wrapperStyle={{height:100,padding:0}}/>


      <FeedbackButton />
      <LogOutButton/>

    </ParallaxView>
</View>
)
  }
}

class LogOutButton extends React.Component{
  _doLogOut(){
    AsyncStorage.multiRemove(['ChatStore','MatchesStore'])
    .then(() => UserActions.logOut())

  }
  render(){

    return (
      <TouchableHighlight underlayColor={colors.dark} onPress={this._doLogOut}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class Settings extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isModalOpen: false
    }
  }

  openModal = (page: string) => { this.setState({isModalOpen: page}) }

  closeModal = () => { this.setState({isModalOpen: false}) }

  render(){
    return (
      <View style={styles.container}>
        <SettingsInside user={this.props.user} navBar={this.props.navBar} openModal={this.openModal} navigator={this.props.navigator}/>
        {this.props.navBar}
      </View>
    )
  }
}
export default Settings

var styles = StyleSheet.create({

  modalStyle: {

    },
    contentStyle: {
        justifyContent:'center',
    },
    swipeableAreaStyle: {
        position: 'absolute',
        top:0, left:0, right:0, height:20
    },
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
   paddingHorizontal: 25,

 },

 userimageContainer: {
   padding: 0,
   alignItems: 'center'

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
 userimage: {
   padding:0,
   height: 180,
   width:180,
   alignItems: 'stretch',
   position:'relative',
   borderRadius:90,
   overflow:'hidden'
 },
 changeImage: {
  //  position:'absolute',
   color:colors.white,
   fontSize:22,
  //  right:0,
   fontFamily:'omnes',
   alignItems:'flex-end'
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
 privacy:{
   height:100,
   alignItems: 'center',
   flexDirection: 'column',
   paddingVertical: 30,
   paddingHorizontal:20
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
 buttonText: {
   fontSize: 18,
   color: '#111',
   alignSelf: 'center',
   fontFamily:'omnes'

 },
 button: {
   height: 45,
   flexDirection: 'row',
   backgroundColor: '#FE6650',
   borderColor: '#111',
   borderWidth: 1,
   borderRadius: 8,
   marginBottom: 10,
   marginTop: 10,
   alignSelf: 'stretch',
   justifyContent: 'center'
 },
 modal:{
   padding:0,
   height:DeviceHeight - 100,
   flex:1,
   alignItems: 'stretch',
   alignSelf: 'stretch',
  //  position:'absolute',
  //  top:0

 },
 modalwrap:{
   padding:0,
   paddingLeft:0,
   paddingRight:0,
   paddingTop:0,
   margin:0,
   paddingBottom:0,
   backgroundColor:'red'
 },
segmentTitles:{
  color:colors.white,
  fontFamily:'Montserrat'
},
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    width:DeviceWidth/3,

  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    marginTop: -10,
    borderWidth: 1,
    flex:1,
    backgroundColor:colors.dark,
    width:DeviceWidth,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: colors.dark,
  },

});

var precomputeStyle = require('precomputeStyle');
var TAB_UNDERLINE_REF = 'TAB_UNDERLINE';


var CustomTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  renderTabOption(name, page) {
    var isTabActive = this.props.activeTab === page;

    return (
      <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)}>
        <View style={[styles.tab]}>
          <Text style={{color: isTabActive ? colors.mediumPurple : colors.white}}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  setAnimationValue(value) {
    this.refs[TAB_UNDERLINE_REF].setNativeProps(precomputeStyle({
      left: (DeviceWidth * value) / this.props.tabs.length
    }));
  },

  render() {
    var numberOfTabs = this.props.tabs.length;
    var tabUnderlineStyle = {
      position: 'absolute',
      width: DeviceWidth / numberOfTabs,
      height: 4,
      backgroundColor: colors.mediumPurple,
      bottom: 0,
    };

    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        <View style={tabUnderlineStyle} ref={TAB_UNDERLINE_REF} />
      </View>
    );
  },
});
