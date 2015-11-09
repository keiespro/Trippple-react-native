import alt from '../alt'
import Api from '../../utils/api'


class OnboardingActions {

  updateUserInfo(payload){

      this.dispatch(payload)

  }
  updateRoute(newIndex){
    this.dispatch(newIndex)


  }
  proceedToNextScreen(payload){

      this.dispatch(payload)

  }

  proceedToPrevScreen(){

      this.dispatch()

  }

}

export default alt.createActions(OnboardingActions)
