import alt from '../alt'
import OnboardingActions from '../actions/OnboardingActions'
import UserActions from '../actions/UserActions'
import Analytics from '../../utils/Analytics'

class OnboardingStore {

  constructor() {

    this.routeIndex = 0
    this.currentStack = 'single'
    this.userInfo = {}
    this.popped = false
    this.pushed = false

    this.bindListeners({
      handleProceedToPrev: OnboardingActions.PROCEED_TO_PREV_SCREEN,
      handleProceedToNext: OnboardingActions.PROCEED_TO_NEXT_SCREEN,
      handleUpdateUserInfo: OnboardingActions.UPDATE_USER_INFO,
      handleUpdateRoute: OnboardingActions.UPDATE_ROUTE,
      handleAcceptInvitation: OnboardingActions.ACCEPT_INVITATION,
      handleGetUserInfo: UserActions.GET_USER_INFO,


    });

    this.on('init', () => {/*noop*/})
    this.on('error', (err, payload, currentState) => {
        Analytics.all('ERROR Onboarding', err, payload, currentState);
        Analytics.err({...err, payload})

    })

  }

  handleGetUserInfo(res){
    this.setState({userInfo: res.response.user_info})
  }

  handleAcceptInvitation(){
    this.setState({
      routeIndex: 4,
      popped: false,
      pushed: false
    })
  }

  handleProceedToPrev(){
    const newIndex = this.routeIndex - 1

    this.setState({
      routeIndex: newIndex,
      popped: true,
      pushed: false
    })

  }

  handleProceedToNext(payload = {}) {
    var newIndex, newInfo

    if(payload.ready){
      newInfo = {...this.userInfo, status: 'onboarded' }
    }else{
      newInfo = {...this.userInfo, ...payload}
      newIndex = this.routeIndex + 1
    }

    var newState = {
      routeIndex: newIndex,
      userInfo: newInfo,
      popped: false,
      pushed: true
    }

    if(payload && payload.relationship_status && payload.relationship_status == 'couple' && this.currentStack == 'single'){
      newState.currentStack = 'couple'
    }else if(payload && payload.relationship_status && payload.relationship_status == 'single' && this.currentStack == 'couple'){
      newState.currentStack = 'single'
    }

    this.setState(newState)

  }
  handleUpdateRoute(newIndex) {

    this.setState({
      routeIndex: newIndex,
      popped: false,
      pushed: false
    })
  }

  handleUpdateUserInfo(payload) {

    const newInfo = {...this.userinfo, ...payload}

    var newState = {
      userInfo: newInfo,
    }

    if(payload.relationship_status && payload.relationship_status == 'couple' && this.stack == 'single'){
      newState.currentStack = 'couple'
    }else if(payload.relationship_status && payload.relationship_status == 'single' && this.stack == 'couple'){
      newState.currentStack = 'single'
    }
    const userInfo = {...this.userInfo}
    this.setState(newState)

  }


}

export default alt.createStore(OnboardingStore, 'OnboardingStore');
