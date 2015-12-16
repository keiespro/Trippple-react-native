/*
* @providesModule trippple
* @flow
*/

import React, { AppRegistry } from 'react-native'
import Boot from './app/Boot'

if(__DEV__){ window.React = React }

export default class trippple extends React.Component{
  constructor(props){
    super()
  }

  render = () => <Boot/>

}

AppRegistry.registerComponent('trippple', () => trippple)
