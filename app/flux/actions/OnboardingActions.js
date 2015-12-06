import alt from '../alt'
import Api from '../../utils/api'
import UserActions from './UserActions'


class OnboardingActions {

  updateUserInfo(payload){

      UserActions.updateUser.defer(payload)
      this.dispatch(payload)

  }
  acceptInvitation(phone){
    Api.joinCouple(phone)
    this.dispatch()
  }

  updateRoute(newIndex){
    this.dispatch(newIndex)


  }
  proceedToNextScreen(payload){

      if(payload && Object.keys(payload).length){
        UserActions.updateUser.defer(payload)
      }
      this.dispatch(payload)


  }

  proceedToPrevScreen(){

      this.dispatch()

  }

}

export default alt.createActions(OnboardingActions)
