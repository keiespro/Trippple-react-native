/* @flow */

 ;

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TextInput
} = React;

var ReactMaskMixin = require('../mixins/maskedInputMixin.js');


var PhoneNumberInput = React.createClass({
  mixins: [ReactMaskMixin],
  render: function(){
    return (
      <TextInput
        ref={component => this._textInput = component}
        {...this.props}
        {...this.mask.props}
      />
    )

  }

})

module.exports = PhoneNumberInput;
