const TRIPPPLE_WEBSOCKET_URL = 'http://x.local:9919'
import React from 'react-native';
import { Component, View, AsyncStorage, AppStateIOS, PushNotificationIOS } from 'react-native'

import Promise from 'bluebird'
import NotificationActions from '../flux/actions/NotificationActions'
import MatchActions from '../flux/actions/MatchActions'
import UserActions from '../flux/actions/UserActions'
import io from 'socket.io-client/socket.io'


const checkPermissions = Promise.promisify(PushNotificationIOS.checkPermissions)

class NotificationCommander extends Component{


  constructor(props){
    super(props)

    this.state = {
      appState: AppStateIOS.currentState
    }

    this.socket = io(TRIPPPLE_WEBSOCKET_URL, {jsonp:false})


  }

  componentDidMount(){
    AppStateIOS.addEventListener('change', this._handleAppStateChange);
    AppStateIOS.addEventListener('memoryWarning', this._handleMemoryWarning);

    this.connectSocket()
  }
  componentWillUnmount(){
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
    AppStateIOS.removeEventListener('memoryWarning', this._handleMemoryWarning);

  }

  shouldComponentUpdate =()=> false

  _handleAppStateChange =(appState)=> {
    console.log(appState)
    appState === 'background' ? this.disconnectSocket() : this.connectSocket()
    this.setState({ appState });

  }
  _handleMemoryWarning =()=> {
      // does this even work?
  }

  connectSocket =()=> {
    this.socket.on('user.connect', (data) => {
      this.online_id = data.online_id;
      const myApikey = this.props.apikey
      const myID = this.props.user_id

      this.socket.emit('user.connect', {
        online_id: data.online_id,
        api_uid: (`${myApikey || 'xxx'}:${myID}`)
      })
    })


    this.socket.on('system', (payload) => {

      const { data } = payload;

      if(data.action && data.action === 'retrieve' && data.match_id) {
        console.log('NOTIFICATION');
      }else if(data.action === 'match_removed'){
        console.log('MATCH REMOVED');
      }else if(data.action && (data.action === 'imageflagged' || 'statuschange')) {

      }
    })

    this.socket.on('chat', (payload) => {
      console.log('NOTIFICATION',payload);
      var data = payload.data;
      if(data.action && data.action === 'retrieve' && data.match_id) {
        console.log('NOTIFICATION',data);
        MatchActions.getMessages(data.match_id)
      }
    })

  }

  disconnectSocket =()=> {
    const {apikey,user_id} = this.props

    this.socket.emit('user.disconnect',{
      online_id: this.online_id,
      api_uid: `${apikey || 'xxx'}:${user_id}`
    });
    this.socket.removeAllListeners()
  }

  onNotification(){



  }

  render(){ return <View style={{opacity:0,height:0,width:0}}/> }
}


export default NotificationCommander
