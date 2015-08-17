/* @flow */


var React = require('react-native');
var { TextInput } = React;

var ReactMaskMixin = require('../mixins/maskedInputMixin.js');


var PhoneNumberInput = React.createClass({
  mixins: [ReactMaskMixin],
  render: function(){
    return (
      <TextInput
        maxLength={this.props.mask.length}
        ref={component => this._textInput = component}
        {...this.props}
        {...this.mask.props}
      />
    )

  }

})

module.exports = PhoneNumberInput;
