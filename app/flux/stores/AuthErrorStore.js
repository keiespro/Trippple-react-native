import alt from '../alt'
import UserActions from '../actions/UserActions'
import Analytics from '../../utils/Analytics'

class AuthErrorStore {

  constructor() {

    this.bindListeners({
      handleRequestPinErrors: UserActions.REQUEST_PIN_LOGIN,
      handleVerifyPinErrors: UserActions.VERIFY_SECURITY_PIN
    });

    this.on('init', () => {
      // Analytics.all('INIT AuthErrorStore');
    });

    this.on('error', (err, payload, currentState) => {
      
      Analytics.all('ERROR AuthErrorStore',err, payload, currentState);
      Analytics.err({...err, payload})

    });

    // this.on('bootstrap', (bootstrappedState) => {    });

    // this.on('afterEach', (x) => {    });

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
