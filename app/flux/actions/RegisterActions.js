var alt = require('../alt');

class RegisterActions {
  onFieldChange (fName, newValue) {
    this.dispatch({[fName]: newValue});
  }
}

module.exports = alt.createActions(RegisterActions);
