/* @flow */

'use strict';

var React = require('react-native');
var Settings = require('./settings');
var Matches = require('./matches');
var Potentials = require('./potentials');

var {
  PixelRatio,
  Navigator,
  TabBarIOS,
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





  class Main extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        selectedTab: 'blueTab'
      }
    }

    componentDidMount(){
      ChatActions.InitializeMatches();
    }




    render() {
       return (
        <View style={styles.appContainer}>

         <TabBarIOS>
          <TabBarIOS.Item
            title="Settings"
            selected={this.state.selectedTab === 'blueTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab',
              });
            }}>
            <Settings user={this.props.user}/>
          </TabBarIOS.Item>
          <TabBarIOS.Item
            systemIcon="history"
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
                notifCount: this.state.notifCount + 1,
              });
            }}>
            <Potentials user={this.props.user}/>
          </TabBarIOS.Item>
          <TabBarIOS.Item
            systemIcon="more"
            selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'greenTab',
                presses: this.state.presses + 1
              });
            }}>
            <Matches user={this.props.user}/>
          </TabBarIOS.Item>
        </TabBarIOS>

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
