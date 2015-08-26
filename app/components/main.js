/* @flow */


var React = require('react-native');
var Settings = require('./settings');
var Matches = require('./matches');
var Potentials = require('./potentials');

// var GearIcon = require('./svg/icon-gear');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var {
  Component,
  PixelRatio,
  Navigator,
  ScrollView,
  StyleSheet,
  InteractionManager,
  Text,
  Image,
  TouchableHighlight,
  AsyncStorage,
  TouchableOpacity,
  View
} = React;
var CustomSceneConfigs = require('../utils/sceneConfigs')

var colors = require('../utils/colors');
var alt = require('alt');
var cssVar = require('cssVar');
var Chat = require("./chat");
var MatchActions = require("../flux/actions/MatchActions");

var ROUTE_STACK = [
  {component: Settings, index: 0, title: 'Settings', id: 'settings'},
  {component: Potentials, index: 1, title: 'Trippple', id: 'potentials'},
  {component: Matches, index: 2, title: 'Matches', id: 'matches'},
];


  //this thing is ugly

  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {
    //   if(route.id == 'settings' || route.id == 'matches' || route.id == 'settingsedit'){
    //     return (
    //       <View style={[styles.touchables,styles.navBarLeftButton]}>
    //
    //         <TouchableOpacity onPress={() => navigator.pop() }>
    //           <View style={styles.navBarLeftButton}>
    //             <Image resizeMode={Image.resizeMode.contain} style={{width:20,height:20,marginTop:15,alignItems:'flex-start'}} source={require('image!close')} />
    //           </View>
    //         </TouchableOpacity>
    //         </View>
    //
    //     )
    //   }

      if(route.id == 'potentials'){
        return (
          <View style={[styles.touchables,styles.navBarLeftButton]}>

            <TouchableOpacity onPress={() => navigator.push(ROUTE_STACK[0])}>
                <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!gear')} />
            </TouchableOpacity>
          </View>
        )
      }


    },

    RightButton: function(route, navigator, index, navState) {
      if(route.id == 'photo' || route.id == 'chat' || route.id == 'matches') return null;

      if(route.id == 'potentials'){

      return (
        <View style={[styles.touchables,styles.navBarRightButton]}>

          <TouchableOpacity
            onPress={() => navigator.push(ROUTE_STACK[2])}>
                <Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30}} source={require('image!chat')} />
          </TouchableOpacity>
        </View>
        );
      }
    },

    Title: function(route, navigator, index, navState) {
      if(route.id == 'potentials'){

        return (
            <View>
              <Image resizeMode={Image.resizeMode.contain} style={{width:80,top:-2}} source={require('image!tripppleLogoText')} />
            </View>
        );
      }
    },

  };


  class Main extends Component{

    constructor(props){
      super(props);

    }

    componentDidMount(){
      // MatchActions.InitializeMatches();
    }

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
      return (<route.component {...route.passProps} navigator={navigator || this.refs.nav} user={this.props.user} />);
    }

    render() {

      return (
        <View style={styles.appContainer}>
          <Navigator
            ref={'nav'}
              initialRoute={ROUTE_STACK[1]}
              configureScene={(route) => { return  route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom}}
              navigator={this.props.navigator}
              renderScene={this.selectScene.bind(this)}
              navigationBar={ <Navigator.NavigationBar routeMapper={NavigationBarRouteMapper} style={styles.navBar} /> }
              onItemRef={ (ref) => { console.log('onItemRef',ref) }}
              onDidFocus={(x,y)=>{console.log('onDIDfocus',x,y)}}
              onWillFocus={(x,y)=>{console.log('onwillfocus',x,y)}}
          />
      </View>
      );
    }

  }

  Main.propTypes = { user: React.PropTypes.any };
  Main.defaultProps = { user: null };




  var styles = StyleSheet.create({


    appContainer: {
      backgroundColor: colors.outerSpace,
      flex: 1,
      flexDirection:'column',
      justifyContent:'space-between',
      height:DeviceHeight,
      width:DeviceWidth,
    },
    touchables:{
      margin:0,
      top:0,
    },

    navBar: {
      backgroundColor: 'transparent',
      height: 60,
      justifyContent:'space-between',
      alignSelf: 'flex-start',
      alignItems:'flex-start',
      flexDirection:'row',
      flex:1,
      top:-10,
      padding:0,
      overflow:'hidden',
      margin:0,
      borderColor:colors.shuttleGray,
      borderBottomWidth:0
    },
    navBarText: {
      fontSize: 16,
    },


    navBarLeftButton: {

      paddingLeft:10

    },
    navBarRightButton: {

      paddingRight:10,


    },
    navBarButtonText: {
      color: colors.white,
      fontFamily:'omnes'
    },
    scene: {
      flex: 1,
      paddingTop: 40,
      backgroundColor: colors.outerSpace,
      justifyContent: 'center'
    },
  });


module.exports = Main;
