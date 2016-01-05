import alt from '../alt'
import UserActions from './UserActions'


class AppActions {
  gotCredentials(creds) {
    return function(dispatch) {
      UserActions.getUserInfo.defer()
      dispatch(creds)
    };
  }
  noCredentials(err) {
    return function(dispatch) {
      console.log(err)
      dispatch(err)
    };
  }
  remoteFail(){
    return;;
  }
  loadingUser(){
    return;;
  }
  showCheckmark(copy){
    return copy;;
  }
  hideCheckmark(){
    return;;
  }
  updateRoute(d){
    return d;;
  }
  toggleOverlay(){
    return;;
  }
  storeContactsToBlock(contacts){
    return contacts;;
  }
  grantPermission(perm){
    return perm;;
  }
  denyPermission(perm){
    return perm;;
  }
  saveStores() {
    return function(dispatch) {
      console.log('saveStores')

      dispatch();
    };
  }

}

export default alt.createActions(AppActions)
