import alt from '../alt'
import OnboardingActions from '../actions/OnboardingActions'

class OnboardingStore {

  constructor() {

    this.routeIndex = 0
    this.currentStack = 'single'
    this.userInfo = {}

    this.bindListeners({
      handleProceedToPrev: OnboardingActions.PROCEED_TO_PREV_SCREEN,
      handleProceedToNext: OnboardingActions.PROCEED_TO_NEXT_SCREEN,
      handleUpdateUserInfo: OnboardingActions.UPDATE_USER_INFO,
      handleUpdateRoute: OnboardingActions.UPDATE_ROUTE

    });

    this.on('init',()=>{
      console.log('Onboarding store init')
    })

    this.on('bootstrap', () => { })

    this.on('error', (err, payload, currentState) => {
        console.log('error', err, payload)
    })

  }

  handleProceedToPrev(){
    const newIndex = this.routeIndex - 1

    this.setState({
      routeIndex: newIndex,
      popped: true
    })

  }

  handleProceedToNext(payload) {
    console.log(payload,'Onboarding store next')

    const newIndex = this.routeIndex + 1,
          newInfo = {...this.userinfo, ...payload}

    var newState = {
      routeIndex: newIndex,
      userInfo: newInfo,
      popped: false
    }

    if(payload.relationship_status && payload.relationship_status == 'couple'){
      newState.currentStack = 'couple'
    }

    this.setState(newState)

  }
  handleUpdateRoute(newIndex) {

    this.setState({
      routeIndex: newIndex,
      popped: false
    })
    // this.preventDefault();
    console.log('updateroute',newIndex)
  }

  handleUpdateUserInfo(payload) {
    console.log(payload,'Onboarding store update user')

    const newInfo = {...this.userinfo, ...payload}

    var newState = {
      userInfo: newInfo,
      popped: false
    }

    if(payload.relationship_status && payload.relationship_status == 'couple'){
      newState.currentStack = 'couple'
    }

    this.setState(newState)

  }


}

export default alt.createStore(OnboardingStore, 'OnboardingStore');
