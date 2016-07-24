/*
* @noflow
*/

import React, {Component} from "react";

import {StyleSheet, Text, View, Image, ScrollView, Navigator, Dimensions, TouchableHighlight, NativeModules} from "react-native";

import TimerMixin from 'react-timer-mixin'

import colors from '../../utils/colors'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import Carousel from './carousel'

import Auth from './auth'
import Facebook from '../../screens/registration/facebook'
import Analytics from '../../utils/Analytics'

import SettingsDebug from '../SettingsDebug'
const LOGIN   = 'login';
const REGISTER = 'register'

import {MagicNumbers} from '../../DeviceConfig'


const IntroScreen = React.createClass({
  displayName:'Intro',

  getInitialState(){
    return {
      isAnimating: false
    }
  },

  mixins: [TimerMixin],

  activateAnimatingState(){
    this.setState({isAnimating:true})

    this.setTimeout(
     () => { this.setState({isAnimating:false}) },
     500
   );
  },

  handleNext(selectedTab){

      switch(selectedTab) {

      case LOGIN:
          Analytics.event("Interaction",{type: 'tap', target: "Login"});
          break;

      case REGISTER:
          Analytics.event("Interaction",{type: 'tap', target: "Register"});
          break;
      }

    this.activateAnimatingState();
    this.props.navigator.push({
      component: Auth,
      title: 'Log in or Sign up',
      id:'auth',
      passProps: {
        initialTab: selectedTab,
        navigator: this.props.navigator
      }
    })
  },

  componentDidMount() {
      setTimeout(()=> {
          Analytics.screen('Welcome Screen')
      }, 1000);

  },

  render(){
    return(
      <View style={[styles.container]}>
        <Carousel/>
        {__DEV__ &&
          <TouchableHighlight
            style={{position:'absolute',top:0,left:0}}
            onPress={ () => {this.props.navigator.push({component:SettingsDebug}) }}
             underlayColor={colors.outerSpace}>
             <Text style={styles.buttonText}>DEV</Text>
          </TouchableHighlight>
        }
        <View style={styles.bottomButtons}>
          <TouchableHighlight
          ref="loginbtn"
            style={[styles.bottomButton,(this.state.isAnimating ? styles.activeButton : styles.loginButton )]}
            onPress={ () => this.handleNext(LOGIN)}
             underlayColor={colors.outerSpace}>
             <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableHighlight>
          <TouchableHighlight
          ref="registerbtn"
             style={[styles.bottomButton,(this.state.isAnimating ? styles.activeButton : styles.registerButton )]}
             onPress={ () => this.handleNext(REGISTER)}
             underlayColor={colors.outerSpace}>
             <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
})


export default IntroScreen

const styles = StyleSheet.create({
  dot: {
    backgroundColor: colors.shuttleGray,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
    borderWidth: 2,

    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.mediumPurple,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 2,
    marginBottom: 2,
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  },
  container: {
    width: DeviceWidth,
    margin:0,
    padding:0,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace,
    alignItems:'stretch',
    justifyContent:'space-between',
    alignSelf:'stretch',

  },
  textplain:{
    color: colors.white,
    alignSelf:'center',
    fontSize:22,
    fontFamily:'omnes',
    textAlign:'center'
  },
  buttonText: {
    fontSize: 22,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'Montserrat'
  },
  carousel:{
    marginTop:50,
    width: DeviceWidth,
    height:DeviceHeight-150,

  },
  slide:{
    width: DeviceWidth,
    flexDirection:'column',
    height:DeviceHeight-150,
    justifyContent:'flex-start',
    alignItems:'center',
    padding:MagicNumbers.screenPadding/2
  },


  bottomarea:{
    height:140,
    width: undefined,
    alignSelf:'stretch',
    bottom:100
  },
  textwrap:{
    alignItems:'center',
    height:50,
    justifyContent:'center',
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  bottomButton: {
    height: 80,
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  loginButton:{
    backgroundColor: colors.shuttleGray,
  },
  activeButton:{
    backgroundColor: colors.outerSpace,
  },
  registerButton:{
    backgroundColor: colors.mediumPurple,
  },
  wrap:{
    marginTop:0,
    alignItems: 'center',
    justifyContent:'center',
    alignSelf: 'stretch',
    paddingBottom: 0
  },
  bottomButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignSelf:'stretch',
    width: undefined
  },
  // dot: {
  //   backgroundColor: colors.shuttleGray,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderColor: colors.shuttleGray
  // },
  // activeDot: {
  //   backgroundColor: colors.mediumPurple20,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   marginLeft: 8,
  //   marginRight: 8,
  //   marginTop: 3,
  //   marginBottom: 3,
  //   borderWidth: 2,
  //   borderColor: colors.mediumPurple
  // }
});
