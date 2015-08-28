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
  Image,
  AsyncStorage,
  Navigator
} from  'react-native';

import SegmentedView from '../controls/SegmentedView';
import scrollable from 'react-native-scrollable-decorator';
import Dimensions from 'Dimensions';
import ParallaxView from  '../controls/ParallaxScrollView'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import DistanceSlider from '../controls/distanceSlider';
import ToggleSwitch from '../controls/switches';
import UserActions from '../flux/actions/UserActions'
import CameraControl from '../controls/cameraControl';
import SelfImage from '../screens/registration/SelfImage';
import Privacy from './privacy';
import Modal from 'react-native-swipeable-modal';
import { FacebookButton } from '../screens/registration/facebook'
import FeedbackButton from '../screens/feedbackButton';
import Contacts from '../screens/contacts';
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs';
import EditPage from './EditPage'
import CloseButton from './CloseButton'
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
    this.props.navigator.push({
      component: EditPage,
      id: 'settingsedit',
      passProps: {
        val: this.props.val,
        navigator: this.props.navigator
      }
    })
  }

  render(){
    return (
      <TouchableHighlight style={{marginTop:10}} onPress={this._editField}>
        <View style={styles.formRow}>
          <Text style={styles.textfield}>{this.props.val}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class BasicSettings extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    let u = this.props.user;
    return (
      <View style={styles.inner}>


        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Personal Info</Text>
        </View>
        <ProfileField navigator={this.props.navigator} field={'firstname'} val={u.firstname} />
        <ProfileField navigator={this.props.navigator} field={'birthday'} val={u.bday_month} />
        <ProfileField navigator={this.props.navigator} field={'gender'} val={u.gender} />

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Contact Info</Text>
        </View>
        <ProfileField navigator={this.props.navigator} field={'phone'} val={u.phone} />
        <ProfileField navigator={this.props.navigator} field={'email'} val={u.email || 'ADD EMAIL'} />

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Details</Text>
        </View>
        <ProfileField navigator={this.props.navigator} field={'height'} val={u.height} />
        <ProfileField navigator={this.props.navigator} field={'body_type'} val={u.body_type} />

        <View style={styles.formHeader}>
          <Text style={styles.formHeaderText}>Get more matches</Text>
        </View>
	      <FacebookButton justTheButton={true} wrapperStyle={{height:100,padding:0}}/>

      </View>
    )
  }
}

class PreferencesSettings extends React.Component{
  constructor(props){
    super(props)
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
      </View>
    )
  }
}

class SettingsSettings extends React.Component{
  constructor(props){
    super(props)
  }
  _editField=()=>{ }
  render(){
    return (
      <View style={styles.inner}>
        <TouchableHighlight onPress={this._editField}>
          <View style={styles.formRow}>
            <Text style={styles.textfield}>{this.props.user.gender}</Text>
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
      isModalOpen: true
    }
  }
  getScrollResponder() {
    return this._scrollView.getScrollResponder();
  }

  setNativeProps(props) {
    this._scrollView.setNativeProps(props);
  }

  _pressNewImage=()=>{
    console.log('change image');
    this.props.navigator.push({
      component: SelfImage,
      id: 'settingsimage'
    });
  }
  _editField=()=>{

  }


  _updateAttr(updatedAttribute){
    this.setState(()=>{return updatedAttribute});
  }
  renderInnerView(){
    let CurrentPage = SettingsPageAtIndex[this.state.index];

    return (
      <View style={{height:800,backgroundColor:colors.outerSpace}}>
        <CurrentPage user={this.props.user} navigator={this.props.navigator}/>
      </View>
    )
  }

  render(){

    let innerView = this.renderInnerView()
    return (
<ParallaxView
        showsVerticalScrollIndicator={false}
          key={this.props.user.image_url}
          backgroundSource={{uri: this.props.user.image_url}}
          windowHeight={300}
          navigator={this.props.navigator}
          style={{backgroundColor:colors.outerSpace}}
          header={(
          <View  style={[styles.userimageContainer,styles.blur]}>

            <TouchableOpacity onPress={this._pressNewImage}>
              <Image
                style={styles.userimage}
                key={this.props.user.image_url}
                source={{uri: this.props.user.image_url}}
                defaultSource={require('image!defaultuser')}
                resizeMode={Image.resizeMode.cover}/>

            </TouchableOpacity>

            <Text>{this.props.user.firstname}</Text>
            <Text>View Profile</Text>
            <CloseButton navigator={this.props.navigator}/>

          </View>
      )}>

      <SegmentedView
        barPosition={'bottom'}
        style={{backgroundColor:colors.dark}}
        barColor={colors.mediumPurple}
        titleStyle={styles.segmentTitles}
        titles={['BASIC', 'PREFERENCES', 'SETTINGS']}
         index={this.state.index}
         stretch
         onPress={index => this.setState({ index })}
         />

      {innerView}

      <FeedbackButton />
      <LogOutButton/>

    </ParallaxView>

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

  showModalTransition(transition) {
    transition('opacity', {duration: 200, begin: 0, end: 1});
    transition('height', {duration: 200, begin: DeviceHeight * 2, end: DeviceHeight});
  }
  hideModalTransition(transition) {
    transition('height', {duration: 200, begin: DeviceHeight, end: DeviceHeight * 2, reset: true});
    transition('opacity', {duration: 200, begin: 1, end: 0});
  }

  modalWindow(){
    if(!this.state.isModalOpen){ return false; }
    switch (this.state.isModalOpen){
      case 'privacy':
      return (<Privacy key={"modalw"} saveAndClose={this.closeModal.bind(this)} user={this.props.user}/>);
      case 'EditImage':
        return (<CameraControl key={"modalw"} user={this.props.user}/>);
      case 'invite':
        return (<Contacts key={"modalw"} user={this.props.user}/>);
      case 'default':
        return null;
    }
  }
  render(){
    return (
      <View style={styles.container}>
          <SettingsInside user={this.props.user} openModal={this.openModal} navigator={this.props.navigator}/>
           <Modal
            height={DeviceHeight - 60}
            style={styles.modal}
            swipeableAreaStyle={styles.swipeableAreaStyle}
            modalStyle={styles.modalStyle}
            contentStyle={styles.contentStyle}
            isVisible={this.state.isModalOpen && this.state.isModalOpen !== ''}
           >
            {this.modalWindow()}
          </Modal>

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
   height: 200,
   width:200,
   alignItems: 'stretch',
   position:'relative',
   borderRadius:100,
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
   justifyContent: 'flex-end',
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
}
});
