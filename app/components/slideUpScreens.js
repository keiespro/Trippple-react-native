/* @flow */

'use strict';

var React = require('react-native');
var {
  NavigatorIOS,
  Navigator
} = React;
var ImageUpload = require('./imageUpload');


class SlideUpScreens extends React.Component{
  _renderScene (route, navigator){
      return (<route.component {...route.passProps}  user={this.props.user} navigator={navigator}/>);

  }
  render(){
    return (
      <Navigator
        renderScene={this._renderScene.bind(this)}
        key={'slideups'}
        initialRoute={{
          component: ImageUpload,
          id: 'photo1',
          title:'Photo'
        }}
      />
    )
  }
}
module.exports = SlideUpScreens;
