var alt = require('../alt');

class RegisterActions {
  onFieldChange (fName, newValue) {
    this.dispatch({
      [fName]: newValue
    , error: false
    });
  }
}

module.exports = alt.createActions(RegisterActions);
