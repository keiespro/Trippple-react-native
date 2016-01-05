import alt from '../alt'
import Api from '../../utils/api'
import UserActions from './UserActions'


class OnboardingActions {

  updateUserInfo(payload) {
    return (dispatch) => {
      UserActions.updateUser.defer(payload)
      dispatch(payload)
    }
  }

  acceptInvitation(phone) {
    return (dispatch) => {
      Api.joinCouple(phone)
      dispatch()
    }
  }

  updateRoute(newIndex){
    return newIndex
  }

  proceedToNextScreen(payload) {
    return (dispatch) => {
      if(payload && Object.keys(payload).length){
        UserActions.updateUser.defer(payload)
      }
      dispatch(payload)
    }
  }

  proceedToPrevScreen(){
    return true
  }

}

export default alt.createActions(OnboardingActions)
