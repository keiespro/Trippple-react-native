/* @flow */


var React = require('react-native');
var { TextInput,View  } = React;
// var DocumentSelectionState = require('react-native/Libraries/vendor/document/selection/DocumentSelectionState');
var ReactMaskMixin = require('../mixins/maskedInputMixin.js');

var PhoneNumberInput = React.createClass({
  mixins: [ReactMaskMixin],
  render: function(){
    //selectionState={new DocumentSelectionState(0,5)}
    return (
      <View>
      <TextInput
        maxLength={12}
        ref={component => this._textInput = component}
        {...this.props}
        {...this.mask.props}

        iosselectionState={e => console.log(e)}

        onSubmitEditing={e => console.log(e)}
        />
        <TextInput
        maxLength={12}
        style={{height:0,overflow:'hidden'}}
        ref={component => this._textInput2 = component}
        />
        </View>
    )

  }

})

module.exports = PhoneNumberInput;
