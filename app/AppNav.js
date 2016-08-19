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
import Chat from './components/screens/chat/chat'
import Matches from './components/screens/matches/matches'


import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation'


const Router = createRouter(() => ({
  Potentials: () => Potentials,
  Settings: () => Settings,
  SettingsBasic: () => SettingsBasic,
  SettingsPreferences: () => SettingsPreferences,
  SettingsSettings: () => SettingsSettings,
  SettingsCouple: () => SettingsCouple,
  Matches: () => Matches,
  Chat: () => Chat,
  UserProfile: () => UserProfile,
  FacebookImageSource: () => FacebookImageSource
}))


export default class AppNav extends React.Component {
  render() {
    return (
      <NavigationProvider style={{zIndex:0}} router={Router}>
        <StackNavigation
            defaultRouteConfig={{
              styles:{
                zIndex:0,
                backgroundColor:colors.outerSpace,

              },
              navigationBar: {
                visible: true,
                borderBottomWidth: 0,
                style:{
                  borderBottomWidth: 0,
                },
                tintColor:'#fff',
                backgroundColor:colors.outerSpace,
                titleStyle:{
                  color:'#fff',
                  fontFamily:'Montserrat',
                  borderBottomWidth: 0,
                  elevation: 0
                }

              },
            }}
            initialRoute={Router.getRoute('Potentials',{show:true})}
          />
      </NavigationProvider>
    )
  }
}
