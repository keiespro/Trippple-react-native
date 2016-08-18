// import alt from '../alt'
// // import UserActions from './UserActions'
// import Promise from 'bluebird'
// import Api from '../../utils/api'
// import Analytics from '../../utils/Analytics'
// import AppTelemetry from '../../AppTelemetry'
//
// import {NativeModules,UIManager,Alert} from 'react-native'
// import RNFS from 'react-native-fs'
// const {RNMail,RNMessageComposer} = NativeModules
// const ACTUAL_VERSION =  "2.4.2"
//
//
// class AppActions {
//   gotCredentials(creds) {
//     Analytics.identifyUser(creds.user_id || creds.username)
//     return (dispatch) => {
//       dispatch(creds)
//     }
//   }
//    sendFeedback(screen='', defaultSubject='',defaultBody='') {
//
//
//     return async (dispatch) => {
//       var fileName = 'trippple-feedback'+ Date.now() +'.ttt'
//       var path = RNFS.DocumentDirectoryPath + '/' + fileName;
//       var fileContents = await AppTelemetry.getEncoded();
//
//       try{
//
//         RNFS.writeFile(path, (
// `FROM: [${screen}]
// JS_V: ${ACTUAL_VERSION}
// DATA:
// --------------${fileContents}`
//         ))
//         .then((success) => {
//           RNMail.mail({
//             subject: defaultSubject,
//             recipients: ['hello@trippple.co'],
//             body:  defaultBody,
//             attachment: {
//               path,  // The absolute path of the file from which to read data.
//               type: 'html',   // Mime Type: jpg, png, doc, ppt, html, pdf
//               name: fileName
//             }
//           }, (error, event) => {
//               if(error) {
//                 Alert.alert('Error', 'Could not send mail. Please email feedback@trippple.co directly.');
//               }
//
//               Analytics.event('Support',{
//                 name: 'Send Feedback',
//                 type: 'tap',
//                 file: JSON.stringify(fileContents)
//               })
//
//               dispatch({error,event})
//           });
//         })
//         .catch((err) => {
//
//           dispatch({err})
//         });
//       }catch(err){
//         dispatch({err})
//
//         Analytics.log(err)
//
//       }
//     }
//   }
//   noCredentials(err) {
//     return (dispatch) => {
//       dispatch(err)
//     };
//   }
//   remoteFail(){
//     return true
//   }
//   loadingUser(){
//     return true
//   }
//   showCheckmark(copy){
//     return copy || '';
//   }
//   hideCheckmark(){
//     return true
//   }
//   updateRoute(d){
//     return d;
//   }
//   toggleOverlay(){
//     return true
//   }
//   showMaintenanceScreen(){
//     return true
//   }
//   storeContactsToBlock(contacts){
//     return contacts;
//   }
//
//   clearMatchesData(){
//     return {}
//   }
//
//
//   showInModal(route){
//     return route;
//   }
//   killModal(){
//     return {success:true}
//   }
//   sendMessageScreen(payload){
//     return (dispatch) => {
//       const {pin,messageText} = payload;
//         RNMessageComposer.composeMessageWithArgs({ messageText }, (result) => {
//
//           switch(result) {
//             case RNMessageComposer.Sent:
//               dispatch({result})
//               break;
//             case RNMessageComposer.Failed:
//               Alert.alert('Whoops','Try that again')
//               dispatch({result})
//               break;
//             case RNMessageComposer.NotSupported:
//               Alert.alert('Error','Unable to send messages')
//               dispatch({result})
//               break;
//             case RNMessageComposer.Cancelled:
//             default:
//               dispatch({result})
//               break;
//           }
//         })
//       }
//   }
//   showNotificationModalWithLikedUser(relevantUser){
//     return (dispatch) => {
//       dispatch(relevantUser);
//     };
//
//   }
//   disableNotificationModal(){
//     return (dispatch) => {
//       dispatch({});
//     };
//   }
//
//   saveStores() {
//     return (dispatch) => {
//       dispatch(true);
//     };
//   }
//
//   screenshot(){
//     return (dispatch) => {
//       UIManager.takeSnapshot('window', {format: 'jpeg', quality: 0.8}).then((x)=>{dispatch(x)})
//     };
//   }
//
//   async sendTelemetry(user){
//
//     try{
//       const Telemetry = await AppTelemetry.getEncoded();
//       return await Api.sendTelemetry(Telemetry)
//     }catch(err){
//       return (err)
//     }
//
//   }
// }
//
// export default alt.createActions(AppActions)
