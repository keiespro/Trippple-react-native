import alt from '../alt'
import UserActions from './UserActions'


class AppActions {
  gotCredentials(creds){
    UserActions.getUserInfo.defer()
    this.dispatch(creds)
  }
  noCredentials(err){
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
  saveStores(){
    this.dispatch();
  }

}

export default alt.createActions(AppActions)
