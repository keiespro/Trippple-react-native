import alt from '../alt'
import Api from '../../utils/api'

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
}

export default alt.createActions(AppActions)
