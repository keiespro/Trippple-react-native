/* @flow */
import React, {Component} from "react";

import {StyleSheet, Text, View, Image, ScrollView, Navigator, Dimensions, TouchableHighlight,TouchableOpacity} from "react-native";

import TimerMixin from 'react-timer-mixin'

import colors from '../../utils/colors'
import FadeInContainer from '../FadeInContainer'

import TrackKeyboard from '../../mixins/keyboardMixin';


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


import UserActions from '../../flux/actions/UserActions';

import FacebookLogin from './FacebookLogin';
import TopTabs from '../../controls/topSignupSigninTabs';
import Login from './login';
import Register from './register';


const styles = StyleSheet.create({

  container: {
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    top:0,
    left:0,
    position:'absolute',
    bottom:0,
    right:0,
    width: DeviceWidth,
    margin:0,
    padding:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
  },
  wrap: {
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
    padding:20

  },
  phoneInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 50,
    alignSelf: 'stretch'
  },
  phoneInputWrapSelected:{
    // marginBottom:60,
    borderBottomColor: colors.mediumPurple,
  },
  phoneInput: {
    height: 50,
    padding: 4,
    fontSize: 21,
    fontFamily:'Montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 21,
    fontFamily:'Montserrat',

  },

  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'omnes'
  },
  imagebg:{
    alignSelf:'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});


class Auth extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab: props.initialTab
    }
  }

  handleBack(){
    this.props.navigator.pop();
  }
  toggleTab(newTab){
    if(newTab == this.state.activeTab) return;
    this.setState({
      activeTab:newTab
    })
  }
  triggerPhoneLogin(){
    this.props.navigator.push({
      component:Login,
      title: 'Log in ',
      id:'login',
      passProps: {

      }
    });

  }
  render(){

    return (
      <View style={styles.container}>
        <TopTabs toggleTab={this.toggleTab.bind(this)} active={this.state.activeTab}/>
        <FadeInContainer delayAmount={0} duration={300}>
          <View>
            <FacebookLogin dispatch={this.props.dispatch} navigator={this.props.navigator} tab={this.state.activeTab} />

          </View>
        </FadeInContainer>
      </View>
    );
  }
}

Auth.displayName = "Auth"

export default Auth;
