import alt from '../alt'
import UserActions from './UserActions'


class AppActions {
  gotCredentials(creds) {
    return creds
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
    return copy;
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
      dispatch();
    };
  }

}

export default alt.createActions(AppActions)
