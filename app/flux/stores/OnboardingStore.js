import alt from '../alt'
import OnboardingActions from '../actions/OnboardingActions'
import UserActions from '../actions/UserActions'

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
      handleGetUserInfo: UserActions.GET_USER_INFO,
      handleInitSuccess: UserActions.INIT_SUCCESS,


    });

    this.on('init',()=>{
      console.log('Onboarding store init')
    })

    this.on('bootstrap', () => { })

    this.on('error', (err, payload, currentState) => {
        console.log('error', err, payload)
    })

  }
  handleInitSuccess(res){
    this.setState({userInfo: res.response.user_info})
  }


  handleGetUserInfo(res){
    this.setState({userInfo: res.response.user_info})
  }

  handleProceedToPrev(){
    const newIndex = this.routeIndex - 1

    this.setState({
      routeIndex: newIndex,
      popped: true,
      pushed: false
    })

  }

  handleProceedToNext(payload) {
    console.log(payload,'Onboarding store next')

    const newIndex = this.routeIndex + 1,
          newInfo = {...this.userinfo, ...payload}

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
    console.log('updateroute',newIndex)
  }

  handleUpdateUserInfo(payload) {
    console.log(payload,'Onboarding store update user')

    const newInfo = {...this.userinfo, ...payload}

    var newState = {
      userInfo: newInfo,
    }

    if(payload.relationship_status && payload.relationship_status == 'couple' && this.stack == 'single'){
      newState.currentStack = 'couple'
    }else if(payload.relationship_status && payload.relationship_status == 'single' && this.stack == 'couple'){
      newState.currentStack = 'single'
    }

    if(payload.ready){
      UserActions.updateUserInfo(this.userInfo)
      console.log('update user')
    }
    this.setState(newState)

  }


}

export default alt.createStore(OnboardingStore, 'OnboardingStore');
