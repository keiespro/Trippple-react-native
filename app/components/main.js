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
  InteractionManager,
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
      if(reoute.id == 'settings') return false;
      if(route.id == 'photo' || route.id == 'photo2'){
        return (
          <TouchableOpacity
            onPress={() => {
              // navigator.jumpTo(ROUTE_STACK[0]);
              navigator.popToTop();
              // navigator.immediatelyResetRouteStack(ROUTE_STACK);

              // navigator.jumpBack();

              InteractionManager.runAfterInteractions(() => {
                navigator.replaceAtIndex(ROUTE_STACK[1],1);
                navigator.replaceAtIndex(ROUTE_STACK[2],2);
                console.log(navigator.getCurrentRoutes())
              });

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
            onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
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
          onPress={() => navigator.jumpTo(ROUTE_STACK[0])}>
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
            onPress={() => navigator.jumpTo(ROUTE_STACK[1])}>
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
          onPress={() => navigator.jumpTo(ROUTE_STACK[2])}>
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
      return (<route.component {...route.passProps} navigator={this.props.navigator} user={this.props.user} />);
    }

    render() {
      console.log(this.props.nav)
      return (
        <View style={styles.appContainer}>
        <Navigator
          initialRoute={ROUTE_STACK[1]}
          initialRouteStack={ROUTE_STACK}
          onItemRef={ (ref) => { console.log('onItemRef',ref) }}
          onDidFocus={(x,y)=>{console.log('onDIDfocus',x,y)}}
          onWillFocus={(x,y)=>{console.log('onwillfocus',x,y)}}
          configureScene={(route) => {
            return route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.HorizontalSwipeJump
          }}
          navigator={this.props.navigator}
          renderScene={this.selectScene.bind(this)}
          navigationBar={
            <Navigator.NavigationBar
              routeMapper={NavigationBarRouteMapper}
              style={styles.navBar}
            />
          }
        />
      </View>
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
      backgroundColor: '#39365c',
      flex: 1,

      alignSelf:'stretch'
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
      height: 50,
      justifyContent:'space-around',
      alignSelf: 'stretch',
      alignItems:'flex-start',
      flexDirection:'column'
    },
    navBarText: {
      fontSize: 16,
    },
    navBarTitleText: {
      color: '#ffffff',
      fontWeight: '500',
      fontFamily:'omnes',
      height: 50,

    },
    navBarLeftButton: {
      paddingLeft: 10,
      height: 50,

    },
    navBarRightButton: {
      paddingRight: 10,
      height: 50,

    },
    navBarButtonText: {
      color: '#dddddd',
      fontFamily:'omnes'
    },
    scene: {
      flex: 1,
      paddingTop: 50,
      backgroundColor: '#39365c',
      justifyContent: 'center'
    },
  });


module.exports = Main;
