import config from '../config'
const {WEBSOCKET_URL} = config;
import React,{Component} from "react";

import {View, Alert, AsyncStorage, AppState, PushNotificationIOS, VibrationIOS} from "react-native";

import io from '../socket.io'

// import Firebase from 'firebase'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import UserActions from '../flux/actions/UserActions'
import Notification from './NotificationTop'
import TimerMixin from 'react-timer-mixin'
import colors from './colors'
import reactMixin from 'react-mixin'
import Analytics from './Analytics'

// const userListRef = new Firebase("https://blistering-torch-607.firebaseio.com");
// const myUserRef = userListRef.push();
// var connectedRef;

class NotificationCommander extends Component{
  constructor(props){
    super()

    this.state = {
      appState: AppState.currentState,
      socketConnected: false,
      notifications: [],
      processing:false,
    }
    this.socket = io(WEBSOCKET_URL, {jsonp:false})

  }
  componentWillMount(){
    AppState.addEventListener('change', this._handleAppStateChange.bind(this) );

  }
  componentDidMount(){

    if(this.props.user_id){

    }

    PushNotificationIOS.addEventListener('notification', this._onPushNotification.bind(this) )

    if(this.props.api_key && this.props.user_id){
      this.connectSocket()
    }
    const newNotification = PushNotificationIOS.popInitialNotification()
    if(newNotification){
      this.handlePushData(newNotification)
    }
  }

  componentWillUnmount(){
    PushNotificationIOS.removeEventListener('notification', this._onPushNotification.bind(this) )

    AppState.removeEventListener('change', this._handleAppStateChange.bind(this) );
  }

  componentDidUpdate(prevProps,prevState){
    if(!prevProps.api_key && this.props.api_key && !prevState.socketConnected && !this.state.socketConnected){

    }

    if(this.state.processing && !prevState.processing){
      this.setTimeout(()=>{
        this.setState({processing:false})
      },500)
    }

  }

  _onPushNotification(pushNotification){
    this.handlePushData(pushNotification)
  }

  handlePushData(pushNotification){
    if(!pushNotification){ return false }
    Analytics.event('Handle push notification',{action:JSON.stringify(pushNotification)})

    const data = pushNotification.getData();

    if(!data.action){ /* shot a blank */}

    if(data.action === 'retrieve' && data.type == 'potentials') {

      MatchActions.getPotentials()

    }else if(data.action === 'retrieve' && data.match_id) {

      // NotificationActions.receiveNewMatchNotification(data,true)
      VibrationIOS.vibrate()
      MatchActions.getMatches()
      AppActions.updateRoute({route:'chat',match_id: data.match_id,})
      NotificationActions.updateBadgeNumber.defer(-1)

    }else if(data.action === 'chat' && data.match_id){

      // NotificationActions.receiveNewMessageNotification(data,true)
      VibrationIOS.vibrate()
      MatchActions.getMessages(data.match_id)
      AppActions.updateRoute({route:'chat',match_id: data.match_id,})
      NotificationActions.updateBadgeNumber.defer(-1)

    }else if(data.action === 'notify') {
      VibrationIOS.vibrate()
      Alert.alert(data.title, JSON.stringify(data.body));

    }else if(data.action === 'match_removed'){

      NotificationActions.receiveMatchRemovedNotification(data)

    }else if(data.action && data.action == 'coupleready') {

      UserActions.getUserInfo.defer()
      Alert.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');
      VibrationIOS.vibrate()

    }else if(data.action && data.action == 'statuschange' || data.action == 'imageflagged') {

      UserActions.getUserInfo.defer()

    }else if(data.action == 'logout'){

      UserActions.logOut()

    }else if(data.action == 'report'){

      AppActions.sendTelemetry()

    }else if(data.action === 'checkupdate'){

      // ReactNativeAutoUpdater.checkUpdate()

    }
    // Alert.alert('APN Push Notification',JSON.stringify(pushNotification.getData()));
  }
  _handleAppStateChange(appState){
    if(appState == 'active'){
       this.socket.connect()
      const newNotification = PushNotificationIOS.popInitialNotification();
      if(newNotification){
        this.handlePushData(newNotification)
      }
    }else{
      this.socket.disconnect()
    }
    this.setState({ appState });

  }
  connectSocket(){
    this.socket.on('user.connect', (data) => {
      this.online_id = data.online_id;

      const myApikey = this.props.api_key,
        myID = this.props.user_id;

        this.socket.emit('user.connect', {
          online_id: data.online_id,
          api_uid: (`${myApikey}:${myID}`)
        });
        __DEV__ && console.log('WEBSOCKET CONNECTED')

        this.setState({socketConnected:true})
    })


    this.socket.on('system', (payload) => {


      Analytics.event('Webocket notification',{action: payload.data.action, label: 'system'})

      let tempData;
      if(typeof payload == 'object'){
        tempData = payload.data
      }else{
        tempData = JSON.parse(payload.data)
      }
      // console.log(tempData);

      let data = tempData;
      this.setState({processing:true});


      if(data.action && data.action === 'retrieve' && data.match_id) {

        NotificationActions.receiveNewMatchNotification(data)

      }else if(data.action === 'match_removed'){

        NotificationActions.receiveMatchRemovedNotification(data)

      }else if(data.action && data.action == 'statuschange' || data.action == 'imageflagged') {

        UserActions.getUserInfo()

      }else if(data.action && data.action == 'coupleready') {
        UserActions.getUserInfo()
        Alert.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');

      }else if(data.action && data.action === 'logout') {

        UserActions.logOut()

      }else if(data.action === 'checkupdate'){

        // ReactNativeAutoUpdater.checkUpdate()

      }else if(data.action && data.action === 'display') {

        NotificationActions.receiveGenericNotification(data)

      }


    })

    this.socket.on('chat', (payload) => {


      Analytics.event('Webocket notification',{action: 'New Message', label: 'chat'})

      this.setState({processing:true});

      NotificationActions.receiveNewMessageNotification(payload)

    })

  }

  disconnectSocket(){
    const {apikey,user_id} = this.props

    this.socket.emit('user.disconnect',{
      online_id: this.online_id,
      api_uid: `${apikey}:${user_id}`
    });
    __DEV__ && console.log('WEBSOCKET DISCONNECTED')

    this.socket.removeAllListeners()
    this.setState({socketConnected:false})
  }



  render(){
    const devStyles =  {
      position:'absolute',
      top:0,
      left:0,
      width: this.state.processing ? 5 : 2,
      height: this.state.processing ? 5 : 2,
      borderRadius: 1,
      backgroundColor: this.state.socketConnected ? colors.sushi : colors.mandy
    };

    const noStyles = {
      top:0,
      left:0,
      width:0,
      height:0,
    }

    return <View style={ __DEV__ ? devStyles : noStyles} />
  }

}

reactMixin(NotificationCommander.prototype,TimerMixin)


export default NotificationCommander
