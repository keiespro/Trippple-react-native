/*
* @providesModule trippple
* @flow
*/

import React, { AppRegistry } from 'react-native'
import Boot from './app/Boot'

if(__DEV__){ window.React = React }

class trippple extends React.Component{

  render = () => <Boot/>

}

export default trippple

AppRegistry.registerComponent('trippple', () => trippple)
