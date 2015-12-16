/*
* @providesModule trippple
* @flow
*/

import React, { AppRegistry } from 'react-native'
import Boot from './app/Boot'

class trippple extends React.Component{

  render = () => <Boot/>

}

export default trippple

AppRegistry.registerComponent('trippple', () => trippple)
