import React from 'react';

import FacebookImageSource from './components/screens/FacebookImageSource';
import UserProfile from './components/UserProfile';
import colors from './utils/colors';

import Potentials from './components/screens/potentials/potentials'
import Settings from './components/screens/settings/settings'
import SettingsBasic from './components/screens/settings/SettingsBasic'
import SettingsPreferences from './components/screens/settings/SettingsPreferences'
import SettingsSettings from './components/screens/settings/SettingsSettings'
import SettingsCouple from './components/screens/settings/SettingsCouple'
import SettingsDebug from './components/screens/settings/SettingsDebug'
import Chat from './components/screens/chat/chat'
import Matches from './components/screens/matches/matches'
import WebViewScreen from './components/screens/WebViewScreen'
import FieldModal from './components/modals/FieldModal'
import FBPhotoAlbums from './components/FBPhotoAlbums'
import FBAlbumView from './components/FBAlbumView'
import GenericScreen from './components/screens/Generic'
import Coupling from './components/screens/coupling'
import OnboardModal from './components/modals/OnboardModal'

import { createRouter, NavigationProvider, StackNavigation, } from '@exponent/ex-navigation'


const Router = createRouter(() => ({
  SettingsDebug: () => __DEV__ ? SettingsDebug : false,
  Potentials: () => Potentials,
  Settings: () => Settings,
  SettingsBasic: () => SettingsBasic,
  SettingsPreferences: () => SettingsPreferences,
  SettingsSettings: () => SettingsSettings,
  SettingsCouple: () => SettingsCouple,
  Matches: () => Matches,
  Chat: () => Chat,
  UserProfile: () => UserProfile,
  FacebookImageSource: () => FacebookImageSource,
  WebViewScreen: () => WebViewScreen,
  FieldModal: () => FieldModal,
  FBPhotoAlbums: () => FBPhotoAlbums,
  FBAlbumView: () => FBAlbumView,
  Generic: ()=> GenericScreen,
  Coupling: () => Coupling,
  OnboardModal: () => OnboardModal,


}))


export default class AppNav extends React.Component {
  render() {
    return (
      <NavigationProvider style={{zIndex:0}} router={Router}>
        <StackNavigation
            defaultRouteConfig={{
              navigationBar: {
                visible: true,
                borderBottomWidth: 0,
                translucent:true,
                tintColor:'#fff',
                backgroundColor:colors.outerSpaceAnimate,
                titleStyle:{
                  color:'#fff',
                  fontFamily:'Montserrat',
                  borderBottomWidth: 0,
                }

              },
            }}
            initialRoute={Router.getRoute('Potentials',{show:true})}
          />
      </NavigationProvider>
    )
  }
}
