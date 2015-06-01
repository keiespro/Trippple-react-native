var alt = require('../alt');
var UserActions     = require('../actions/UserActions');
var RegisterActions = require('../actions/RegisterActions');

const server = 'http://api2.trippple.co';

class RegisterStore {

  constructor() {

    this.bindAction(UserActions.REGISTER, this.handleSubmit);
    this.bindAction(RegisterActions.ON_FIELD_CHANGE, this.handleSubmit);

    this.phone= '';
    this.password= '';
    this.password2= '';
    this.isLoading= false;
    this.error= false;
  }

  handleSubmit (newState) {
    this.setState(newState);
  }
}

module.exports = alt.createStore(RegisterStore, 'RegisterStore');
