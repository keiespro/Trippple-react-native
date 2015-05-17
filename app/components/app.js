/*
* @flow
*/

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableHighlight,
  NavigatorIOS,
  TextInput,
  Navigator
} = React;

var alt = require('../flux/alt');
var Login = require('./login');
var Main = require('./main');
var UserStore = require('../flux/stores/UserStore');

var AltContainer = require('alt/AltNativeContainer');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'red',
    alignSelf:'stretch',
    flexDirection:'row'
  },
  wrapper: {
    backgroundColor: 'pink',
    alignSelf:'stretch'

  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});


class TopLevel extends React.Component{

  constructor(props){
    super(props);

  }
    _renderScene (route, navigator){
      return (<route.component {...route.passProps}  user={this.props.user} navigator={navigator}/>);

  }

  _noop(){
    console.log('noop')
  }
  render(){

    var userStatus = this.props.user ? this.props.user.status : null;
    console.log(userStatus)
    switch(userStatus){
        case "onboarded":
          return (
            <Navigator
              style={styles.container}
              pointerEvents={'box-none'}
              renderScene={this._renderScene.bind(this)}
              itemWrapperStyle={styles.wrapper}
              initialRoute={{
                component: Main,
                title: 'Main',
                passProps: {
                  user: this.props.user,
                },
              }}
              configureScene={(route) => {
                if (route.sceneConfig) {
                  return route.sceneConfig;
                }
                return Navigator.SceneConfigs.FloatFromBottom
              }}
           />)
        case null:
        default:
          return (<Login  pointerEvents={'box-none'} key={'loginscene'} />)
      }
  }
  // renderScene(route, navigator){
  //   console.log(route);
  //
  //
  //   var userStatus = this.props.user ? this.props.user.status : null;
  //   console.log(userStatus)
  //   switch(userStatus){
  //       case "onboarded":
  //         return (<Main  pointerEvents={'box-none'} route={route} navigator={navigator}  key={'mainscene'} user={this.props.user} />)
  //       case null:
  //       default:
  //         return (<Login  pointerEvents={'box-none'} route={route} navigator={navigator} key={'loginscene'} />)
  //     }
  //
  // }
  // render(){
  //   return(
  //     <Navigator
  //       initialRoute={{
  //         component: Login,
  //         name:"login",
  //         index:0
  //       }}
  //       key={'topnav'}
  //       renderScene={this.renderScene.bind(this)}
  //     />
  //   )
  // }
}

class App extends React.Component{

  render(){
    return (
      <AltContainer
          stores={{
            user: function (props) {
              return {
                store: UserStore,
                value: UserStore.getUser()
              }
            }
          }}>
          <TopLevel/>
      </AltContainer>
    );
  }

}

module.exports = App;
