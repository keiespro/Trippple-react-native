import alt from '../alt'
import Api from '../../utils/api'
import UserActions from './UserActions'


class OnboardingActions {

  updateUserInfo(payload) {
    return function(dispatch) {
      UserActions.updateUser.defer(payload)
      dispatch(payload)
    };
  }
  acceptInvitation(phone) {
    return function(dispatch) {
      Api.joinCouple(phone)
      dispatch()
    };
  }

  updateRoute(newIndex){
    return newIndex;;


  }
  proceedToNextScreen(payload) {
    return function(dispatch) {
      if(payload && Object.keys(payload).length){
        UserActions.updateUser.defer(payload)
      }
      dispatch(payload)
    };
  }

  proceedToPrevScreen(){

      return;;

  }

}

export default alt.createActions(OnboardingActions)
