import ActionMan from  '../actions/';
import { connect } from 'react-redux';

import config from '../../config'
const {WEBSOCKET_URL} = config;
import React,{Component} from "react";

import {View, Alert, AsyncStorage, AppState, PushNotificationIOS, VibrationIOS} from "react-native";

const io = require('./socket.io')
import Notification from './NotificationTop'
import TimerMixin from 'react-timer-mixin'
import colors from './colors'
import reactMixin from 'react-mixin'
import Analytics from './Analytics'
import PushNotification from 'react-native-push-notification'
import {NavigationStyles, withNavigation} from '@exponent/ex-navigation';

@withNavigation
class NotificationCommander extends Component{
  constructor(props){
    super()

    this.state = {
      socketConnected: false,
      notifications: [],
      processing:false,
    }
    this.socket = io(WEBSOCKET_URL, {
      jsonp:false,
      transports: ['websocket'],
      // ['force new connection']: true
    })

  }
  componentDidMount(){
    const dispatch = this.props.dispatch.bind(this);
    const handleAction = this.handleAction.bind(this);

    PushNotification.configure({
      onRegister(token) {
        __DEV__ && console.log( 'TOKEN:', token );
        dispatch(ActionMan.updateUser({push_token: token.token}))
      },
      onNotification(notification) {
        // {
        //   foreground: false, // BOOLEAN: If the notification was received in foreground or not
        //   userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
        //   message: 'My Notification Message', // STRING: The notification message
        //   data: {}, // OBJECT: The push data
        // }
        Analytics.event('Handle push notification',{action:JSON.stringify(notification)})

        console.log( 'NOTIFICATION:', notification );
        notification.data && handleAction(notification)
      },
      // senderID: "YOUR GCM SENDER ID", // ANDROID ONLY: (optional) GCM Sender ID.
      popInitialNotification: true,
      requestPermissions: false,
    });

    let creds = global.creds || {};

    if(creds.api_key && creds.user_id){
      this.connectSocket()
    }

    PushNotificationIOS.addEventListener('register', (push_token) =>{
      __DEV__ && console.log( 'TOKEN:', push_token );
      if(push_token){
        this.props.dispatch({type:'SAVE_PUSH_TOKEN',payload: push_token})
      }else{
        this.props.dispatch({type:'SAVE_PUSH_TOKEN_FAILED',payload: null})
      }
    })


    PushNotification.checkPermissions((perms) => {
      this.props.dispatch({type:'CHECK_PUSH_PERMISSIONS',payload: perms})
      if(perms.alert){
        PushNotificationIOS.requestPermissions().then(console.log).catch(console.error)
      }
    })
  }

  componentWillReceiveProps(nProps){

    if(!this.state.socketConnected && nProps.auth.api_key){
      this.connectSocket()
    }
  }

  connectSocket(){
    __DEV__ && console.log('WEBSOCKET CONNECT ->');

    this.socket.on('connect_error', (err) => {
      __DEV__ && console.log('SOCKETIO CONNECT ERR',err);
    });

    this.socket.on('error', (err) => {
      __DEV__ && console.log('SOCKETIO ERR',err);
    });
    this.socket.on('user.disconnect', (data) => {
      this.props.dispatch({type:'WEBSOCKET_CONNECTED',payload: data})
    });

    this.socket.on('user.connect', (data) => {
      __DEV__ && console.log('WEBSOCKET CONNECTED !')
      this.props.dispatch({type:'WEBSOCKET_CONNECTED',payload: data})
      this.online_id = data.online_id;

      const myApikey = global.creds.api_key,
        myID = global.creds.user_id;

      this.socket.emit('user.connect', {
        online_id: data.online_id,
        api_uid: (`${myApikey}:${myID}`)
      });
      __DEV__ && console.log('WEBSOCKET CONNECTED')

      this.setState({socketConnected:true})
    })

    this.socket.on('system', (payload) => {
      console.log('WEBOSCKET system',payload);
      Analytics.event('Webocket notification',{action: payload.data.action, label: 'system'})

      // let tempData;
      // if(typeof payload == 'object'){
      //   tempData = payload.data
      // }else{
      //   tempData = JSON.parse(payload.data)
      // }
      //
      // let data = tempData;
      this.setState({processing:true});

      this.handleAction({...payload, label: 'NewMatch'})

    })

    this.socket.on('chat', (payload) => {
      __DEV__ && console.log('chat weboscket',payload);
      Analytics.event('Webocket notification',{action: 'New Message', label: 'NewMessage'})
      __DEV__ && console.log('NewMessage payload',payload);
      this.setState({processing:true});
      this.handleAction({...payload, label: 'NewMessage'})

    })

  }
  openChat(match_id){
    this.props.navigator.push(this.props.navigator.navigation.router.getRoute('Chat', {match_id}))
  }
  handleAction(notification){
    const {data,action,label} = notification
    console.log(notification);
    if(!notification) return false;
    if(data.vibrate){

    }
    if(data.action === 'retrieve' && data.type == 'potentials') {

      this.props.getPotentials()

    }else if(data.action === 'retrieve' && data.match_id && label == 'NewMatch') {

      this.props.receiveNewMatchNotification({...data,label})
      // this.props.getMatches()
      // this.openChat()
      // this.props.updateBadgeNumber(-1)

    }else if(data.action === 'retrieve' && data.match_id && label == 'NewMessage'){
      console.log('NewMessage');
      this.props.receiveNewMessageNotification({...data,label})
      // this.props.getMessages(data.match_id)
      // this.openChat()
      // this.props.updateBadgeNumber(-1)
    }else if(data.action === 'notify') {
      VibrationIOS.vibrate()
      Alert.alert(data.title, JSON.stringify(data.body));

    }else if(data.action === 'match_removed'){

      this.props.receiveMatchRemovedNotification(data)
        // TODO: update to new

    }else if(data.action == 'coupleready') {
        // Alert.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');
      this.props.receiveCoupleCreatedNotification(data);

    }else if(data.action == 'decouple') {

        // Alert.alert('Your partner has joined!','You can now enjoy the full Trippple experience!');
      this.props.receiveDecoupleNotification(data);

    }else if(data.action == 'statuschange' || data.action == 'imageflagged') {

      this.props.getUserInfo()

    }else if(data.action == 'logout'){

      this.props.logOut()

    }else if(data.action == 'report'){

      this.props.sendTelemetry()

    }else if(data.action === 'display') {
      console.log(data)
      this.props.receiveGenericNotification({...data, type:'display'})
      // TODO: update to new

    }

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


const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    auth: state.auth,
    notifications: state.notifications
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPotentials:                                          (p) => dispatch(ActionMan.getPotentials()),
    receiveNewMatchNotification:                            (p) => dispatch(ActionMan.receiveNotification({type:'NewMatch',payload: p})),
    getMatches:                                             (p) => dispatch(ActionMan.getMatches()),
    receiveNewMessageNotification:                          (p) => dispatch(ActionMan.receiveNotification({type:'NewMessage',payload: p})),
    getMessages:                                            (p) => dispatch(ActionMan.getMessages()),
    updateRoute:                                            (p) => dispatch(ActionMan.updateRoute(p)),
    updateBadgeNumber:                                      (p) => dispatch(ActionMan.updateBadgeNumber(p)),
    receiveMatchRemovedNotification:                        (p) => dispatch(ActionMan.receiveNotification({type:'MatchRemoved',payload: p})),
    receiveCoupleCreatedNotification:                       (p) => dispatch(ActionMan.receiveNotification({type:'CoupleCreated',payload: p})),
    receiveDecoupleNotification:                            (p) => dispatch(ActionMan.receiveNotification({type:'Decouple',payload: p})),
    getUserInfo:                                            (p) => dispatch(ActionMan.getUserInfo()),
    logOut:                                                 (p) => dispatch(ActionMan.logOut()),
    sendTelemetry:                                          (p) => dispatch(ActionMan.sendTelemetry()),
    receiveGenericNotification:                             (p) => dispatch(ActionMan.receiveNotification({type:'Generic',payload: p})),
    dispatch
  };
}
reactMixin(NotificationCommander.prototype,TimerMixin)

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCommander);
