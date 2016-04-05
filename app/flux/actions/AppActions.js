import alt from '../alt'
import UserActions from './UserActions'
import Promise from 'bluebird'
import Api from '../../utils/api'
import Analytics from '../../utils/Analytics'
import AppTelemetry from '../../AppTelemetry'
import {UIManager} from 'react-native'
import {NativeModules} from 'react-native'
import RNFS from 'react-native-fs'
const {RNMail,ReactNativeAutoUpdater} = NativeModules
const ACTUAL_VERSION = ReactNativeAutoUpdater.jsCodeVersion


class AppActions {
  gotCredentials(creds) {
    Analytics.identifyUser(creds.user_id)
    return (dispatch) => {
      dispatch(creds)
    }
  }
   sendFeedback(screen='', defaultSubject='',defaultBody='') {
    return async (dispatch) => {
      var fileName = 'trippple-feedback'+ Date.now() +'.ttt'
      var path = RNFS.DocumentDirectoryPath + '/' + fileName;
      var fileContents = await AppTelemetry.getEncoded();

      try{

        RNFS.writeFile(path, (
`FROM: [${screen}]
JS_V: ${ACTUAL_VERSION}
DATA:
--------------${fileContents}`
        ))
        .then((success) => {
          RNMail.mail({
            subject: defaultSubject,
            recipients: ['hello@trippple.co'],
            body:  defaultBody,
            attachment: {
              path,  // The absolute path of the file from which to read data.
              type: 'html',   // Mime Type: jpg, png, doc, ppt, html, pdf
              name: fileName
            }
          }, (error, event) => {
              if(error) {
                AlertIOS.alert('Error', 'Could not send mail. Please email feedback@trippple.co directly.');
              }
              dispatch({error,event})
          });
        })
        .catch((err) => {

          dispatch({err})
        });
      }catch(err){
        dispatch({err})

        Analytics.log(err)

      }
    }
  }
  noCredentials(err) {
    return (dispatch) => {
      dispatch(err)
    };
  }
  remoteFail(){
    return true
  }
  loadingUser(){
    return true
  }
  showCheckmark(copy){
    return copy || '';
  }
  hideCheckmark(){
    return true
  }
  updateRoute(d){
    return d;
  }
  toggleOverlay(){
    return true
  }
  showMaintenanceScreen(){
    return true
  }
  storeContactsToBlock(contacts){
    return contacts;
  }
  grantPermission(perm){
    return perm;
  }
  denyPermission(perm){
    return perm;
  }

  saveStores() {
    return (dispatch) => {
      dispatch(true);
    };
  }
  screenshot(){
    return {}
    // return (dispatch) => {
    //   // UIManager.takeSnapshot('window', {format: 'jpeg', quality: 0.8}).then((x)=>{dispatch(x)})
    // };
  }
  async sendTelemetry(user){

    try{
      const Telemetry = await AppTelemetry.getEncoded();
      return await Api.sendTelemetry(Telemetry)
    }catch(err){
      return (err)
    }

  }
}

export default alt.createActions(AppActions)
