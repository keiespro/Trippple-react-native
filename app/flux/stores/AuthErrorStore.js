import alt from '../alt'
import UserActions from '../actions/UserActions'
import Log from '../../Log'

class AuthErrorStore {

  constructor() {

    this.bindListeners({
      handleRequestPinErrors: UserActions.REQUEST_PIN_LOGIN,
      handleVerifyPinErrors: UserActions.VERIFY_SECURITY_PIN
    });

    this.on('init', () => {/*noop*/})
    this.on('error', (err, payload, currentState) => {
        Log(err, payload, currentState);
    })

  }

  handleRequestPinErrors(err) {
    if(!err.error){
      return false;
    }

    this.setState({
      phoneError: err.error,
    })
  }

  handleVerifyPinErrors(err) {
    if(!err.error){
      return false;
    }

    this.setState({
      verifyError: err.error
    });
  }




}

export default alt.createStore(AuthErrorStore, 'AuthErrorStore');
