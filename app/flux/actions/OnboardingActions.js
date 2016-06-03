import alt from '../alt'
import Api from '../../utils/api'
import UserActions from './UserActions'
import Analytics from '../../utils/Analytics'

class OnboardingActions {

  updateUserInfo(payload) {
    return (dispatch) => {
      UserActions.updateUser.defer(payload)
      dispatch(payload)
    }
  }

  acceptInvitation(phone) {
    return (dispatch) => {

      Analytics.event('Onboarding',{name:'Accept Partner Invitation', type:'Inferred Invite', phone })

      Api.joinCouple(phone)
      dispatch({phone})
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
