/*
* @providesModule trippple
* @flow
*/

import React from 'react-native'
import { Component, AppRegistry } from 'react-native'
import App from './app/components/app'

((global) => { global.AppRoot = './app/'; global.keychainUrl = 'trippple.co' }(window ? window : global))

window.React = React

// for devtools



class trippple extends Component{




  render = () => <App key="app"/>




}

export default trippple

AppRegistry.registerComponent('trippple', () => trippple)
