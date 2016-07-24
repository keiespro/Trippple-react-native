/* @flow */


import React, {Component} from "react";

import {PixelRatio, Navigator, ScrollView, StyleSheet, Settings, Linking, InteractionManager, Text, Image, Alert, TouchableHighlight, AsyncStorage, TouchableOpacity, Dimensions, View,Modal} from "react-native";
import dismissKeyboard from 'dismissKeyboard'
import SettingsView from './settings'
import Matches from './matches'
import Potentials from './potentials'
import CheckMarkScreen from '../screens/CheckMark'
import CustomSceneConfigs from '../utils/sceneConfigs'
import colors from '../utils/colors'
import alt from '../flux/alt'
import Chat from './chat'
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin'
import MatchActions from '../flux/actions/MatchActions'
import MatchesStore from '../flux/stores/MatchesStore'
import PotentialsStore from '../flux/stores/PotentialsStore'
import CouplingStore from '../flux/stores/CouplingStore'
import FakeNavBar from '../controls/FakeNavBar'
import AppActions from '../flux/actions/AppActions'
import NotificationActions from '../flux/actions/NotificationActions'
import AltContainer from 'alt-container/native';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import Analytics from '../utils/Analytics'
import NotificationPermissions from '../modals/NewNotificationPermissions'
import Coupling from '../coupling/'
import url from 'url'
import {SHOW_COUPLING} from '../utils/SettingsConstants'
//
const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: '#000',
    flex: 1,
    flexDirection:'column',
    justifyContent:'space-between',
    height:DeviceHeight,
    width:DeviceWidth,
  },
  touchables:{
    margin:0,
    top:0,
  },
  navBar: {
    backgroundColor: 'transparent',
    height: 60,
    justifyContent:'space-between',
    alignSelf: 'flex-start',
    alignItems:'flex-start',
    flexDirection:'row',
    flex:1,
    top:-10,
    padding:0,
    overflow:'hidden',
    margin:0,
    borderColor:colors.shuttleGray,
    borderBottomWidth:0
  },
  navBarText: {
    fontSize: 16,
  },
  navBarLeftButton: {
    paddingLeft:10
  },
  navBarRightButton: {
    paddingRight:10,
  },
  navBarButtonText: {
    color: colors.white,
    fontFamily:'omnes'
  },
  scene: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: colors.outerSpace,
    justifyContent: 'center'
  },
});




const SettingsRoute = {
  component: SettingsView,
  index: 1,
  title: 'Settings',
  id: 'Settings',
  navigationBar: (
    <FakeNavBar
      blur={true}
      backgroundStyle={{backgroundColor:colors.shuttleGray,top:0}}
      hideNext={true}
      customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12}}
      source={{uri:'assets/close@3x.png'}}/>}
      onPrev={(nav,route)=> nav.pop()}
      title={'SETTINGS'}
      titleColor={colors.white}
    />)
}

const MatchesRoute = {

  component: Matches,
  index: 2,
  title: 'MESSAGES',
  id: 'matches',
  name: 'Matches',
  navigationBar: (
    <FakeNavBar
      hideNext={true}
      backgroundStyle={{backgroundColor:colors.shuttleGray}}
      titleColor={colors.white}
      title={'MESSAGES'} titleColor={colors.white}
      onPrev={(nav,route)=> nav.pop()}
      customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12}} source={{uri:'assets/close@3x.png'}} />
      }
    />
  ),
    // sceneConfig: Navigator.SceneConfigs.PushFromRight
}


const ChatRoute = {

  component: Chat,
  index: 2,
  title: 'Matches',
  id: 'matches',
  name: 'Chat',
  navigationBar: (
    <FakeNavBar
      hideNext={true}
      backgroundStyle={{backgroundColor:'transparent'}}
      titleColor={colors.white}
      blur={true}
      title={'Matches'} titleColor={colors.white}
      onPrev={(nav,route)=> nav.pop()}
      customPrev={   <View style={[styles.navBarLeftButton,{marginTop:10}]}>
          <Text textAlign={'left'} style={[styles.bottomTextIcon]}>◀︎ </Text>
          <Text textAlign={'left'} style={[styles.bottomText]}>Go back</Text>
        </View>
      }
    />
  ),
    // sceneConfig: Navigator.SceneConfigs.PushFromRight
}


const PotentialsRoute = {
  index: 0,
  title: 'Trippple',
  id: 'potentials',
  name: 'Potentials',
  component: Potentials,
  navigationBar: (
    <FakeNavBar
      backgroundStyle={{backgroundColor:'transparent'}}
      customTitle={
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{width:80,height:30,tintColor: __DEV__ ? colors.mandy : colors.white}}
          source={{uri:'assets/tripppleLogoText@3x.png'}}
        />
      }
      onPrev={(navigator,route) => navigator.push(SettingsRoute)}
      customPrev={
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{width:28,top:-10,height:30,alignSelf:'flex-start',tintColor: __DEV__ ? colors.mandy : colors.white}}
          source={{uri:'assets/gear@3x.png'}}
        />
      }
      onNext={(navigator,route) => {navigator.push(MatchesRoute)}}
      customNext={
        <Image
          resizeMode={Image.resizeMode.contain}
          style={{opacity:0.6,width:30,top:0,height:30,alignSelf:'flex-end',tintColor: __DEV__ ? colors.mandy : colors.white}}
          source={{uri:'assets/chat@3x.png'}}
        />
      }
    />)
};


 module.exports = { PotentialsRoute, SettingsRoute, MatchesRoute, ChatRoute }
