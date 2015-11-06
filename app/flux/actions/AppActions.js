import alt from '../alt'
import Api from '../../utils/api'
import {PushNotificationIOS} from 'react-native'
class AppActions {
  initApp(){
     this.dispatch()
  }
  gotCredentials(creds){
     this.dispatch(creds)
  }
  noCredentials(err){
    console.log('FAIL',err)
    this.dispatch(err)
  }
  remoteFail(){
    this.dispatch()
  }
  loadingUser(){
    this.dispatch()
  }
  showCheckmark(copy){
    this.dispatch(copy)
  }
  hideCheckmark(){
    this.dispatch()
  }
  updateRoute(d){
    this.dispatch(d)
  }
  toggleOverlay(){
    this.dispatch();
  }
  storeContactsToBlock(contacts){
    this.dispatch(contacts)
  }
  grantPermission(perm){
    this.dispatch(perm)
  }
  denyPermission(perm){
    this.dispatch(perm)
  }
  requestNotificationsPermission(){
    PushNotificationIOS.requestPermissions()
    PushNotificationIOS.addEventListener('register',AppActions.grantPermission('notifications'))
    this.dispatch()

  }
}

export default alt.createActions(AppActions)
