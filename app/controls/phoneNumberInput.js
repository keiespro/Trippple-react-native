/* @flow */


var React = require('react-native');
var { TextInput  } = React;
// var DocumentSelectionState = require('react-native/Libraries/vendor/document/selection/DocumentSelectionState');
var ReactMaskMixin = require('../mixins/maskedInputMixin.js');

var PhoneNumberInput = React.createClass({
  mixins: [ReactMaskMixin],
  render: function(){
    //selectionState={new DocumentSelectionState(0,5)}
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
