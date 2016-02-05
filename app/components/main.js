/* @flow */


import React,{
  Component,
  PixelRatio,
  Navigator,
  ScrollView,
  StyleSheet,
  InteractionManager,
  Text,
  Image,
  AlertIOS,
  TouchableHighlight,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  View
} from 'react-native'

import Settings from './settings'
import Matches from './matches'
import Potentials from './potentials'
import CheckMarkScreen from '../screens/CheckMark'
import CustomSceneConfigs from '../utils/sceneConfigs'
import colors from '../utils/colors'
import alt from '../flux/alt'
import Chat from './chat'
import MatchActions from '../flux/actions/MatchActions'
import MatchesStore from '../flux/stores/MatchesStore'
import Mixpanel from '../utils/mixpanel'
import FakeNavBar from '../controls/FakeNavBar'
import AppActions from '../flux/actions/AppActions'
import NotificationActions from '../flux/actions/NotificationActions'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import Log from '../Log'

class Main extends Component{

  constructor(props){
    super();
  }

  componentWillMount(){
    // bootstrap stores from asyncstorage
    AsyncStorage.multiGet(['ChatStore','MatchesStore','UserStore'])
    .then((data) => {
      if (data){
        const savedMatches = JSON.parse(data[1][1]);
        const savedChats = JSON.parse(data[0][1]);
        const saved = {...JSON.parse(savedChats),...JSON.parse(savedMatches)}
        Log('Saved stores',saved);
        alt.bootstrap(JSON.stringify(saved));
      }
    }).catch((err) => {
      dispatch({error: err})
    })

  }

  componentDidMount(){
    this.refs.nav.navigationContext.addListener('didfocus', (e)=>{
      AppActions.updateRoute.defer(this.refs.nav.state.presentedIndex)
    })
    NotificationActions.scheduleNewPotentialsAlert.defer()
      AppActions.sendTelemetry(this.props.user)
  }

  componentWillReceiveProps(nProps){

    if(nProps.currentRoute){
      if(this.refs.nav && nProps.currentRoute != this.refs.nav.state.presentedIndex){
        if(this.props.currentRoute && nProps.currentRoute && this.props.currentRoute.match_id && nProps.currentRoute.match_id && nProps.currentRoute.match_id == this.props.currentRoute.match_id){
          return
        }else if(nProps.currentRoute.route && nProps.currentRoute.route == 'chat'){
          const routs = this.refs.nav.getCurrentRoutes()

          if(routs[this.refs.nav.state.presentedIndex].id == 'chat'){
            this.refs.nav.replace({
              ...ChatRoute,
              sceneConfig: Navigator.SceneConfigs.PushFromRight,
              passProps:{
                match_id: nProps.currentRoute.match_id,
                currentMatch: nProps.currentMatch,
                currentRoute: nProps.currentRoute,
              }
            })
          }else{
           this.refs.nav.push({
              ...ChatRoute,
              sceneConfig: Navigator.SceneConfigs.PushFromRight,
              passProps:{
                match_id: nProps.currentRoute.match_id,
                currentMatch: nProps.currentMatch,
                currentRoute: nProps.currentRoute,
              }
            })

          }
        }else if(nProps.currentRoute.route && nProps.currentRoute.route == 'checkmark'){
          const nowRoute = this.refs.nav.navigationContext._currentRoute;
          this.refs.nav.replace({
            component: CheckMarkScreen,
            passProps:{
              continueAfter: 1000,
              exitCheckMarkScreen: () => {
                this.refs.nav.replace(nowRoute)
              }
            }
          })
        }
      }
    }
  }

  selectScene(route, navigator){
    const RouteComponent = route.component;
    var navBar;
    Mixpanel.auth(this.props.user.username).track(`HO: On - ${route.id} Screen`);
    if(!route){
      route = ROUTE_STACK[0]
    }
    if (route.navigationBar) {
      navBar = React.cloneElement(route.navigationBar, {
        navigator: navigator,
        route: route,
        style: styles.navBar,
      });
    }

    return (
      <View style={{ flex: 1,  width: DeviceWidth, height: DeviceHeight }}>

        {route.id == 'settings' ? navBar : null}

        <RouteComponent
          navigator={navigator}
          route={route}
          navBar={navBar}
          AppState={this.props.AppState}
          {...route.passProps}
          user={this.props.user}
          pRoute={route.id == 'potentials' ? PotentialsRoute : null}
        />

        {route.id == 'potentials' || route.id == 'settings' || route.id == 'matches' ? null : navBar}

      </View>
    );
  }

  render() {

    return (
      <View style={styles.appContainer}>
        <Navigator
          ref={'nav'}
          initialRoute={ROUTE_STACK[0]}
          configureScene={route => route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom}
          navigator={this.props.navigator}
          renderScene={this.selectScene.bind(this)}
        />
      </View>
    );
  }

}

export default Main;


const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: '#000',
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



const PotentialsRoute = {
  component: Potentials,
  index: 0,
  title: 'Trippple',
  id: 'potentials',
  navigationBar: (
    <FakeNavBar
      backgroundStyle={{backgroundColor:'transparent'}}
      customTitle={<Image resizeMode={Image.resizeMode.contain} style={{width:80,height:30}} source={{uri:'assets/tripppleLogoText@3x.png'}} />}
      onPrev={(navigator,route) => navigator.push(SettingsRoute)}
      customPrev={<Image resizeMode={Image.resizeMode.contain}  style={{width:28,top:-10,height:30,alignSelf:'flex-start',tintColor:colors.white,opacity:1}} source={{uri:'assets/gear@3x.png'}} />}
      onNext={(navigator,route) => {navigator.push(MatchesRoute)}}
      customNext={<Image resizeMode={Image.resizeMode.contain} style={{width:30,top:0,height:30,alignSelf:'flex-end',tintColor:colors.white}} source={{uri:'assets/chat@3x.png'}} />}
    />)
};

const SettingsRoute = {
  component: Settings,
  index: 1,
  title: 'Settings',
  id: 'settings',
  navigationBar: (
    <FakeNavBar
      blur={true}
      backgroundStyle={{backgroundColor:colors.shuttleGray}}
      hideNext={true}
      customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12}}
      source={{uri:'assets/close@3x.png'}}/>}
      onPrev={(nav,route)=> nav.pop()}
      title={'SETTINGS'}
      titleColor={colors.white}
    />)
}

const MatchesRoute = {

  component: Matches,
  index: 2,
  title: 'MESSAGES',
  id: 'matches',
  navigationBar: (
    <FakeNavBar
      hideNext={true}
      backgroundStyle={{backgroundColor:colors.shuttleGray}}
      titleColor={colors.white}
      title={'MESSAGES'} titleColor={colors.white}
      onPrev={(nav,route)=> nav.pop()}
      customPrev={ <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:12,width:12}} source={{uri:'assets/close@3x.png'}} />
      }
    />
  ),
    // sceneConfig: Navigator.SceneConfigs.FloatFromRight
}


const ChatRoute = {

  component: Chat,
  index: 2,
  title: 'Matches',
  id: 'matches',
  navigationBar: (
    <FakeNavBar
      hideNext={true}
      backgroundStyle={{backgroundColor:'transparent'}}
      titleColor={colors.white}
      blur={true}
      title={'Matches'} titleColor={colors.white}
      onPrev={(nav,route)=> nav.pop()}
      customPrev={   <View style={[styles.navBarLeftButton,{marginTop:10}]}>
          <Text textAlign={'left'} style={[styles.bottomTextIcon]}>◀︎ </Text>
          <Text textAlign={'left'} style={[styles.bottomText]}>Go back</Text>
        </View>
      }
    />
  ),
    // sceneConfig: Navigator.SceneConfigs.FloatFromRight
}

const ROUTE_STACK = [PotentialsRoute,SettingsRoute,MatchesRoute];
