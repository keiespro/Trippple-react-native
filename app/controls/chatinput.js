/**
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Text,
  TextInput,
  View,
  StyleSheet,
} = React;



var styles = StyleSheet.create({
  well: {
    height: 60,
    bottom:0
  },
  default: {
    height: 50,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    fontSize: 13,
    padding: 4,
    bottom:0,
  },
});

class ChatInput extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      curText: null,
      prevText: null
    }

  }

  render(){
    return (
      <View style={styles.well}>
        <TextInput
          placeholder="Say something"
          returnKeyType={"send"}
          enablesReturnKeyAutomatically={true}
          autoCorrect={false}
          clearButtonMode="never"
          multiline={false}
          onChange={(event) => this.updateText(
            event.nativeEvent.text
          )}
          // onEndEditing={(event) => this.updateText(
          //   'onEndEditing text: ' + event.nativeEvent.text
          // )}
          // onSubmitEditing={(event) => this.updateText(
          //   'onSubmitEditing text: ' + event.nativeEvent.text
          // )}
          // onFocus={() => this.updateText('onFocus')}
          // onBlur={() => this.updateText('onBlur')}
          style={styles.default}
          />
      </View>
    )
  }


  updateText(text) {
      this.setState({
        curText: text,
        prevText: this.state.curText,
      });
  }

}


module.exports = ChatInput;
