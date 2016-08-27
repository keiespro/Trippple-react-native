// 'use strict';
//
//
// import React, {Component} from "react";
//
// import {PixelRatio, Navigator, ScrollView, StyleSheet, Settings, Linking, InteractionManager, Text, Image, Alert, TouchableHighlight, AsyncStorage, TouchableOpacity, Dimensions, View,Modal} from "react-native";
// import dismissKeyboard from 'dismissKeyboard'
// import SettingsView from './settings'
// import Matches from './matches'
// import Potentials from './potentials'
// import CheckMarkScreen from '../screens/CheckMark'
// import CustomSceneConfigs from '../utils/sceneConfigs'
// import colors from '../utils/colors'
// import alt from '../flux/alt'
// import Chat from './chat'
// import TimerMixin from 'react-timer-mixin';
// import reactMixin from 'react-mixin'
// import MatchActions from '../flux/actions/MatchActions'
// import MatchesStore from '../flux/stores/MatchesStore'
// import PotentialsStore from '../flux/stores/PotentialsStore'
// import CouplingStore from '../flux/stores/CouplingStore'
// 
// import AppActions from '../flux/actions/AppActions'
// import NotificationActions from '../flux/actions/NotificationActions'
// import AltContainer from 'alt-container/native';
// const DeviceHeight = Dimensions.get('window').height;
// const DeviceWidth = Dimensions.get('window').width;
// import Analytics from '../utils/Analytics'
// import NotificationPermissions from '../modals/NewNotificationPermissions'
// import Coupling from '../coupling/'
// import url from 'url'
// import {SHOW_COUPLING} from '../utils/SettingsConstants'
// import MainRoutes from './MainRoutes'
// const { PotentialsRoute, SettingsRoute, MatchesRoute, ChatRoute } = MainRoutes;
// const ROUTE_STACK = [PotentialsRoute,SettingsRoute,MatchesRoute];
//
// class Main extends Component{
//
//   constructor(props){
//     super();
//
//     this.state = {
//       modalVisible: false
//     }
//   }
//
//   componentWillMount(){
//     const { relevantUser } = this.props;
//
//   }
//   componentWillUnmount(){
//     Linking.removeEventListener('url',this.handleDeeplinks.bind(this))
//   }
//   componentDidMount(){
//     const initCouplePin = Settings.get('co.trippple.deeplinkCouplePin');
//     Analytics.screen('Potentials')
//
//     this.refs.nav.navigationContext.addListener('didfocus', (nav)=>{
//       var route = nav.target.currentRoute;
//       AppActions.updateRoute.defer({title: route.title, route: route.title, match_id: route.passProps && route.passProps.match_id || null})
//       var routeName = route.name || route.id || (route.title && route.title.length ? route.title : false) || route.component && route.component.displayName;
//       Analytics.screen(routeName)
//
//     })
//
//     if(this.props.user.id){
//       Analytics.identifyUser(this.props.user);
//     }
//
//     Linking.addEventListener('url',this.handleDeeplinks.bind(this))
//
//     if( Settings.get([SHOW_COUPLING])){
//       AppActions.showInModal({
//         component: Coupling,
//         passProps: {},
//       })
//     }
//
//     MatchActions.getPotentials()
//
//     if( initCouplePin && this.props.user.relationship_status == 'single'){
//       this.setTimeout(()=>{
//         AppActions.showInModal({
//           component: Coupling,
//           passProps: {
//             pin: initCouplePin,
//             initialScreen:'EnterCouplePin'
//           },
//         })
//       },2000)
//     }
//
//   }
//
//   handleDeeplinks(event){
//     const deeplink = url.parse(event.url);
//
//     Analytics.event('Interaction',{type: 'deeplink', name: deeplink.href})
//
//     if(deeplink.host.indexOf('couplecode') > -1){
//       AppActions.showInModal({
//         component: Coupling,
//         passProps:{
//          initialScreen: 'CouplePin'
//         }
//       })
//     }
//     if(deeplink.host == 'join.couple' && this.props.user.relationship_status == 'single'){
//       const pin = deeplink.path.substring(1,deeplink.path.length);
//       Settings.set({'co.trippple.deeplinkCouplePin': pin});
//
//       AppActions.showInModal({
//         component: Coupling,
//         passProps:{
//           pin,
//           initialScreen: 'EnterCouplePin'
//         }
//       })
//      }
//   }
//
//   componentWillReceiveProps(nProps){
//
//     if(nProps.currentRoute){
//       if(this.refs.nav && nProps.currentRoute != this.refs.nav.state.presentedIndex){
//         if(this.props.currentRoute && nProps.currentRoute && this.props.currentRoute.match_id && nProps.currentRoute.match_id && nProps.currentRoute.match_id == this.props.currentRoute.match_id){
//           return
//         }else if(nProps.currentRoute.route && nProps.currentRoute.route == 'chat'){
//           const routs = this.refs.nav.getCurrentRoutes()
//
//           if(routs[this.refs.nav.state.presentedIndex].id == 'chat'){
//             this.refs.nav.replace({
//               ...ChatRoute,
//               sceneConfig: Navigator.SceneConfigs.PushFromRight,
//               passProps:{
//                 match_id: nProps.currentRoute.match_id,
//                 currentMatch: nProps.currentMatch,
//                 currentRoute: nProps.currentRoute,
//               }
//             })
//           }else{
//             dismissKeyboard();
//            this.refs.nav.push({
//               ...ChatRoute,
//               sceneConfig: Navigator.SceneConfigs.PushFromRight,
//               passProps:{
//                 match_id: nProps.currentRoute.match_id,
//                 currentMatch: nProps.currentMatch,
//                 currentRoute: nProps.currentRoute,
//               }
//             })
//
//           }
//         }else if(nProps.currentRoute.route && nProps.currentRoute.route == 'checkmark'){
//           const nowRoute = this.refs.nav.navigationContext._currentRoute;
//           this.refs.nav.replace({
//             component: CheckMarkScreen,
//             passProps:{
//               continueAfter: 1000,
//               exitCheckMarkScreen: () => {
//                 this.refs.nav.replace(nowRoute)
//               }
//             }
//           })
//         }
//       }
//     }
//   }
//
//   selectScene(route, navigator){
//     var navBar;
//     if(!route.component ){
//       route.component = Potentials
//     }
//     const RouteComponent = route.component;
//
//     if (route.navigationBar) {
//       navBar = React.cloneElement(route.navigationBar, {
//         navigator: navigator,
//         route: route,
//         style: styles.navBar,
//       });
//     }
//
//     return (
//       <View style={{ flex: 1,  width: DeviceWidth, height: DeviceHeight,  }} pointerEvents={'box-none'}>
//
//         {route.id == 'settings' ? navBar : null}
//
//         <RouteComponent
//           navigator={navigator}
//           route={route}
//           navBar={navBar}
//
//           {...route.passProps}
//           user={this.props.user}
//         />
//
//         {route.id == 'potentials' || route.id == 'settings' || route.id == 'matches' ? null : navBar}
//
//       </View>
//     );
//   }
//   _setModalVisible(s){
//
//     this.setState({modalVisible:false})
//
//   }
//
//   render() {
//
//      return (
//       <View style={styles.appContainer}>
//         <Navigator
//           ref={'nav'}
//           initialRoute={ROUTE_STACK[0]}
//           configureScene={route => (route && route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromBottom)}
//           navigator={this.props.navigator}
//           renderScene={this.selectScene.bind(this)}
//           modalVisible={this.state.modalVisible}
//           setModalVisible={this._setModalVisible.bind(this)}
//         />
//       </View>
//     );
//   }
//
// }
//
// Main.displayName = 'Main';
//
//
// const styles = StyleSheet.create({
//   appContainer: {
//     backgroundColor: '#000',
//     flex: 1,
//     flexDirection:'column',
//     justifyContent:'space-between',
//     height:DeviceHeight,
//     width:DeviceWidth,
//   },
//   touchables:{
//     margin:0,
//     top:0,
//   },
//   navBar: {
//     backgroundColor: 'transparent',
//     height: 60,
//     justifyContent:'space-between',
//     alignSelf: 'flex-start',
//     alignItems:'flex-start',
//     flexDirection:'row',
//     flex:1,
//     top:-10,
//     padding:0,
//     overflow:'hidden',
//     margin:0,
//     borderColor:colors.shuttleGray,
//     borderBottomWidth:0
//   },
//   navBarText: {
//     fontSize: 16,
//   },
//   navBarLeftButton: {
//     paddingLeft:10
//   },
//   navBarRightButton: {
//     paddingRight:10,
//   },
//   navBarButtonText: {
//     color: colors.white,
//     fontFamily:'omnes'
//   },
//   scene: {
//     flex: 1,
//     paddingTop: 40,
//     backgroundColor: colors.outerSpace,
//     justifyContent: 'center'
//   },
// });
//
// reactMixin(Main.prototype, TimerMixin);
//
// module.exports = Main;
