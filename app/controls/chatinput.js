/**
 * @flow
 */
 ;

var React = require('react-native');
var {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
} = React;



var styles = StyleSheet.create({
  well: {
    height: 60,
    bottom:0,
    padding:10,
    backgroundColor:'#ddd',
    flexDirection: 'row',
    alignItems:'stretch'

  },
  default: {
    height: 40,
    borderWidth: 0.5,
    borderColor: '#0f0f0f',
    fontSize: 13,
    padding: 4,
    bottom:0,
    backgroundColor:'#fff'

  },
  sendButton: {
    borderRadius: 3,
    backgroundColor: '#aaa'
  }
});

class ChatInput extends Component{

  constructor(props){
    super(props);
    this.state = {
      curText: null,
      prevText: null
    }

  }
  _pressSend(){
    console.log('SEND: ',this.state.curText)
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
          <TouchableHighlight onPress={() => this._pressSend()}>
            <View style={styles.sendButton}>
              <Text>Send</Text>
            </View>
            </TouchableHighlight>

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
