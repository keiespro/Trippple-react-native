
import Promise from 'bluebird'
import {NativeModules,Alert,VibrationIOS,PushNotificationIOS,Platform} from 'react-native'
import PushNotification from 'react-native-push-notification'
import api from '../utils/api'
const getBadgeNumber = Promise.promisify(PushNotification.getApplicationIconBadgeNumber)
import ApiActionCreators from './ApiActionCreators'
const iOS = Platform.OS == 'iOS';

const NOTIFICATION_TYPES = {
  NEW_MATCH:       'getMatches',
  NEW_MESSAGE:     'getMessages',
  MATCH_REMOVED:   'getMatches',
  COUPLE_READY:    'getUserInfo',
  DECOUPLE:        'getUserInfo',
  GENERIC:         'getUserInfo',
  GET_POTENTIALS:  'getPotentials'
};

// export const receiveNotification = (notification) => dispatch => dispatch({ type: 'RECEIVE_NOTIFICATION',
//   payload: new Promise((resolve, reject) => {


//     const notificationType = notification.type || 'generic';
//     const subsequentEndpoint = NOTIFICATION_TYPES[notificationType];

//     dispatch({type: `RECEIVE_${notificationType}`, payload: notification.payload });
//     dispatch(ActionMan[subsequentEndpoint](notification.payload));

//     resolve(notification.payload)

//   })
// }).then(() => notification).catch(console.warn);


export const updateBadgeNumber = (delta) => dispatch => dispatch({ type: 'UPDATE_BADGE_NUMBER',
  payload: new Promise((resolve, reject) => {
    getBadgeNumber()
    .then(currentBadge => PushNotification.setApplicationIconBadgeNumber(currentBadge + delta))
    .then(resolve)
    .catch(reject)
  })
});


export const handleNotification = notification => dispatch => dispatch({ type: 'HANDLE_NOTIFICATION',
  payload: new Promise((resolve, reject) => {

    __DEV__ && console.log(notification);

    const {data, action, label} = notification

    if(!notification) return false;

    if(data.vibrate && iOS) VibrationIOS.vibrate();

    let nType;
    let nRequests = [];
    let nQueue;
    let nData = data;

    switch(data.action){
        case 'retrieve':

          if(data.type == 'potentials') {

            nType = `GET_POTENTIALS`;
            nRequests.push({
              getPotentials: {}
            });

          }else if(label == 'NewMatch') {

            nType = `NEW_MATCH`;
            nRequests.push({
              getNewMatches: {},
              getMatches: {}
            })
            nQueue = true;

          }else if(label == 'NewMessage'){

            nType = `NEW_MESSAGE`;
            nRequests.push({
              getMessages: {match_id: nData.match_id}
            })
            nQueue = true;

          }

          break;

        case 'notify':

          Alert.alert(data.title, JSON.stringify(data.body));
          break;

        case 'match_removed':

          nType = `MATCH_REMOVED`;
          nRequests.push('getMatches')
          break;

        case 'coupleready':

          nType = `COUPLE_READY`;
          nRequests.push('getUserInfo')
          nRequests.push('getPotentials')
          nQueue = true;
          nData.body = `Congratulations! You're in a couple!`
          nData.title = `JOINED COUPLE`
          nData.label = 'display';
          dispatch({ type: 'KILL_MODAL', payload: {}});
          break;

        case 'decouple':

          nType = `DECOUPLE`;
          nRequests.push('getUserInfo')
          nRequests.push('getPotentials')
          nQueue = true;
          nData.body = `Congratulations! You're single again!`
          nData.title = `LEFT COUPLE`
          nData.label = 'display';
          break;

        case 'statuschange':

          nType = 'STATUS_CHANGE';
          nRequests.push('getUserInfo')
          break;

        case 'imageflagged':

          nType = 'IMAGE_FLAGGED';
          nRequests.push('getUserInfo')
          break;

        case 'logout':

          nType = 'LOG_OUT';
          nRequests.push('getUserInfo')
          break;

        case 'report':
        case 'send_telemetry':

          nType = 'SEND_TELEMETRY';
          // nPayload = api.sendTelemetry()
          break;

        case 'display':

          nType = 'DISPLAY';
          nQueue = true;
          break;
    }


    __DEV__ && console.log(nType);

    if(!nType){
      reject(notification)
      return false;
    }

    const n = {...notification, ...nData, data: nData};

    if(nQueue){
      dispatch({type: `ENQUEUE_NOTIFICATION`, payload: n})
    }

    nRequests.forEach(nRequest => {
      if(typeof nRequest == 'string'){
        dispatch(ApiActionCreators[nRequest](...notification.data))
      }else if(typeof nRequest == 'object'){
        Object.keys(nRequest).forEach(req => {
          dispatch(ApiActionCreators[req](nRequest[req]))
        })
      }
    })

    dispatch({type: `HANDLE_NOTIFICATION_${nType}`, payload: n})

    resolve(n)
  })

})
