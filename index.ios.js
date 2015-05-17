/*
* @providesModule Trippple
* @flow
*/

'use strict';

var React = require('react-native');
var {
  AppRegistry
} = React;

var App = require('./app/components/app.js');


class Trippple extends React.Component{

  render(){
    return (
      <App/>
    );
  }

}

module.exports = Trippple;

AppRegistry.registerComponent('Trippple', () => Trippple);
