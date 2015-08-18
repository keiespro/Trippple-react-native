
import React from 'react-native';

import moment from 'moment'
import Promise from 'bluebird'
import NotificationActions from '../flux/actions/NotificationActions'
import { View, AsyncStorage, AppStateIOS, PushNotificationIOS } from 'react-native'

// const window = window || {};
// window.navigator = {};
window.navigator.userAgent = 'rn'

const TRIPPPLE_WEBSOCKET_URL = 'http://x.local:3000'
import io from 'socket.io-client/socket.io'


const checkPermissions = Promise.promisify(PushNotificationIOS.checkPermissions)

class NotificationCommander extends React.Component{


  constructor(props){
    super()
    //  var x = window.navigator.userAgent
    //  x = userAgent
    window.navigator.userAgent = 'rn'
     console.log(window.navigator.userAgent,window.navigator.userAgent.match('x'));

    this.state = {
      currentAppState: AppStateIOS.currentState
    }
    this.socket = null
  }

  componentDidMount(){
    this.socket = io(TRIPPPLE_WEBSOCKET_URL, {jsonp:false})

    this.connectSocket()
  }
  componentWillUnmount(){
    this.socket.removeAllListeners() && this.socket.destroy()
  }
  shouldComponentUpdate(){
    return false
  }

  connectSocket(){
    // this.socket.on('user.connect',(data)=> {
    //   console.log(data);
    //   this.online_id = data.online_id;
    //   this.socket.emit('user.connect', {
    //     online_id: this.online_id,
    //     api_uid: (this.props.user.apikey + ':' + this.props.user.id)
    //   });
    // });

    // this.socket.on('system', (payload) => {
    //   console.log(payload,payload.data);
    //   var data = payload.data;
    //   console.log('NOTIFICATION',data);
    //
    //   if(data.action && data.action === 'retrieve' && data.match_id) {
    //     console.log('NOTIFICATION');
    //
    //   }else if(data.action === 'match_removed'){
    //
    //       console.log('MATCH REMOVED');
    //   }else if(data.action && (data.action === 'imageflagged' || 'statuschange')) {
    //
    //
    //   }
    //
    // });
    //
    // this.socket.on('chat', (payload) => {
    //   console.log('NOTIFICATION',payload);
    //   var data = payload.data;
    //   if(data.action && data.action === 'retrieve' && data.match_id) {
    //     console.log('NOTIFICATION',data);
    //
    //
    //   }
    //
    // });

  }
  startListening(){
    // return
  }

  onNotification(){



  }

  render(){ return (<View style={{opacity:0,height:0}}/>) }
}


export default NotificationCommander
