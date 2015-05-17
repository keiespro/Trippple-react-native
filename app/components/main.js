/* @flow */

'use strict';

var React = require('react-native');
var Settings = require('./settings');
var Matches = require('./matches');
var Potentials = require('./potentials');

var {
  PixelRatio,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  AsyncStorage,
  TouchableOpacity,
  View
} = React;


var alt = require('alt');
var cssVar = require('cssVar');
var Chat = require("./chat");
var ChatActions = require("../flux/actions/ChatActions");

var ROUTE_STACK = [
  {component: Settings, index: 0, title: 'Settings', id: 'settings'},
  {component: Potentials, index: 1, title: 'Trippple', id: 'potentials'},
  {component: Matches, index: 2, title: 'Matches', id: 'matches'},
];



  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {
      if(route.id == 'settings') return null;

      if(route.id == 'photo'){
        return (
          <TouchableOpacity
            onPress={() => {
              navigator.pop();
              }}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                V
              </Text>
            </View>
          </TouchableOpacity>
        )
      }

      if(route.id == 'chat'){
        return (
          <TouchableOpacity
            onPress={() => {
              navigator.pop();
              }}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                back
              </Text>
            </View>
          </TouchableOpacity>
        )
      }

      if(route.id == 'matches'){
        return (
          <TouchableOpacity
            onPress={() => navigator.pop()}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                Trippple
              </Text>
            </View>
          </TouchableOpacity>
        )
      }

      return (
        <TouchableOpacity
          onPress={() => navigator.pop()}>
          <View style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              settings
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

    RightButton: function(route, navigator, index, navState) {
      if(route.id == 'photo' || route.id == 'chat' || route.id == 'matches') return null;

      if(route.id == 'settings'){
        return (
          <TouchableOpacity
            onPress={() => navigator.push(ROUTE_STACK[1])}>
            <View style={styles.navBarLeftButton}>
              <Text style={[styles.navBarText, styles.navBarButtonText]}>
                Trippple
              </Text>
            </View>
          </TouchableOpacity>
        )
      }
      return (
        <TouchableOpacity
          onPress={() => navigator.push(ROUTE_STACK[2])}>
          <View style={styles.navBarRightButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              matches
            </Text>
          </View>
        </TouchableOpacity>
      );
    },

    Title: function(route, navigator, index, navState) {

      return (

          <View >
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
              {route.title}
            </Text>
          </View>
      );
    },

  };


  class Main extends React.Component{

    constructor(props){
      super(props);

    }

    componentDidMount(){
      ChatActions.InitializeMatches();
    }

    selectScene(route, navigator){
      // if(route.id === 'photo' || route.id === 'photo2'){
      return (<route.component {...route.passProps}  user={this.props.user}  navigator={navigator}/>);
      // }else{

      //   switch(route.id){
      //
      //     case 'chat':
      //       return (<Chat style={styles.scene} matchID={route.passProps.matchID} navigator={navigator} />)
      //     case 'settings':
      //       return (<Settings user={this.props.user} style={styles.scene} navigator={navigator} />)
      //     case 'matches':
      //       return (<Matches user={this.props.user} style={styles.scene} navigator={navigator} />)
      //     case 'potentials':
      //     default:
      //       return (<Potentials style={styles.scene} navigator={navigator} />)
      //
      //   }
      // }
    }

    render() {

      return (
        <Navigator
          debugOverlay={true}
          key={'naaaaav'}
          initialRoute={ROUTE_STACK[1]}
          initialRouteStack={ROUTE_STACK}
          configureScene={(route) => {
            if (route.sceneConfig) {
              return route.sceneConfig;
            }
            return Navigator.SceneConfigs.HorizontalSwipeJump
          }}
          style={styles.appContainer}
          renderScene={this.selectScene.bind(this)}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={NavigationBarRouteMapper}
              style={styles.navBar}
            />
          }
        />
      );
    }

  }




  var styles = StyleSheet.create({
    messageText: {
      fontSize: 17,
      fontWeight: '500',
      fontFamily:'omnes',
      padding: 15,
      marginLeft: 15,
    },
    appContainer: {
      overflow: 'hidden',
      backgroundColor: '#dddddd',
      flex: 1,
    },
    button: {
      backgroundColor: 'white',
      padding: 15,
      borderBottomWidth: 1 / PixelRatio.get(),
      borderBottomColor: '#CDCDCD',
      fontFamily:'omnes'

    },
    buttonText: {
      fontSize: 17,
      fontWeight: '500',
      fontFamily:'omnes'
    },
    navBar: {
      backgroundColor: '#39365c',
      height: 50
    },
    navBarText: {
      fontSize: 16,
      marginVertical: 5,
    },
    navBarTitleText: {
      color: '#ffffff',
      fontWeight: '500',
      marginVertical: 5,
      fontFamily:'omnes'
    },
    navBarLeftButton: {
      paddingLeft: 10,
    },
    navBarRightButton: {
      paddingRight: 10,
    },
    navBarButtonText: {
      color: '#dddddd',
      fontFamily:'omnes'
    },
    scene: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: '#ffffff',
      justifyContent: 'center'
    },
  });


module.exports = Main;
