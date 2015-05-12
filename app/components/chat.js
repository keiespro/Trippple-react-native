/* @flow */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ScrollView,
  PixelRatio
} = React;


var Api = require("../utils/api");

var ChatInput = require("../controls/chatinput");

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff0000',
    padding: 0
  },
  chatContainer: {
    flex: 1,
    bottom: 0
  },
  inputField: {
    height: 50,
    backgroundColor:'#aaaaaa'
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    height:100,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginLeft: 15,
  },
});

class ChatMessage extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View
        style={styles.button}>
        <Text style={styles.messageText}>{this.props.text}</Text>
      </View>
    );
  }
}


class Chat extends React.Component{

  constructor(props){
    console.log(props);
    super(props);
    this.state = {
      messages: []
    }
  }

  componentDidMount(){
    console.log('didmount',this.props);
    Api.getMessages({match_id: this.props.matchId})
    .then((res) => {
      console.log(res);
      this.setState({messages: res.response.message_thread})

    })

  }

  shouldComponentUpdate(){
    return true
  }
  render(){
    console.log('messagesrender',this.props.matchId,this.state.messages)
    if(!this.state.messages.length){
      console.log('none')
      return (
        <View style={styles.container}>
        </View>
      )
    }
    var messagesList = this.state.messages.map((el,i) =>{
      console.log(el.message_body)
      return (
        <ChatMessage key={el.id+'msg'} text={el.message_body}></ChatMessage>
      )
    });
    return (
      <View style={styles.chatContainer}>
        <ScrollView
          id="chatview"
          ref="chat"
          matchid={this.props.matchId}
          keyboardDismissMode={'onDrag'}>
          {messagesList}
        </ScrollView>
        <ChatInput/>
      </View>
    );
  }

}

module.exports = Chat;
