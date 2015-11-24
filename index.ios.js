/*
* @providesModule trippple
* @flow
*/

import React, { AppRegistry } from 'react-native'
import App from './app/components/app'

((g) =>{ g.AppRoot = './app/' }(window ? window : global))

window.React = React
// for devtools



class trippple extends React.Component{

  render = () => <App key="app"/>

}

export default trippple

AppRegistry.registerComponent('trippple', () => trippple)
