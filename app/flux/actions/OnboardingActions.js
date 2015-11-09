import alt from '../alt'
import Api from '../../utils/api'
import UserActions from './UserActions'


class OnboardingActions {

  updateUserInfo(payload){

      this.dispatch(payload)
      UserActions.updateUser.defer(payload)
  }
  updateRoute(newIndex){
    this.dispatch(newIndex)


  }
  proceedToNextScreen(payload){

      this.dispatch(payload)
      UserActions.updateUser.defer(payload)

  }

  proceedToPrevScreen(){

      this.dispatch()

  }

}

export default alt.createActions(OnboardingActions)
