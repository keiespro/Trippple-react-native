var alt = require('../alt');
var UserActions = require('../actions/UserActions');

const server = 'http://api2.trippple.co';

class RegisterStore {

  constructor() {

    this.bindAction(UserActions.REGISTER, this.handleSubmit);
    this.phone= '3052063460';
    this.password= 'password';
    this.password2= 'password';
    this.isLoading= false;
    this.error= false;
  }

  handleSubmit (sAttempt) {
    this.setState(sAttempt);
  }
}

module.exports = alt.createStore(RegisterStore, 'RegisterStore');
