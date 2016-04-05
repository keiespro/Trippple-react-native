import alt from '../alt'
import UserActions from './UserActions'
import Promise from 'bluebird'
import Api from '../../utils/api'
import Analytics from '../../utils/Analytics'
import AppTelemetry from '../../AppTelemetry'

class AppActions {
  gotCredentials(creds) {
    Analytics.identifyUser(creds.user_id)
    return (dispatch) => {
      dispatch(creds)
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
