import alt from '../alt'
import UserActions from '../actions/UserActions'

class AuthErrorStore {

  constructor() {

    this.bindListeners({
      handleRequestPinErrors: UserActions.REQUEST_PIN_LOGIN,
      handleVerifyPinErrors: UserActions.VERIFY_SECURITY_PIN
    });

  }

  handleRequestPinErrors(err) {
    if(!err.error){
      return false;
    }
    console.log(err.error)

    this.setState({
      phoneError: err.error,
    })
  }

  handleVerifyPinErrors(err) {
    if(!err.error){
      return false;
    }
    console.log(err.error)

    this.setState({
      verifyError: err.error
    });
  }




}

export default alt.createStore(AuthErrorStore, 'AuthErrorStore');
