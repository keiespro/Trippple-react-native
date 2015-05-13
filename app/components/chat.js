/* @flow */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  PixelRatio
} = React;


var ChatInput = require("../controls/chatinput");
var ChatStore = require("../flux/stores/ChatStore");

var AltContainer = require('alt/AltNativeContainer');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0
  },
  chatContainer: {
    flex: 1,
    bottom: 0,
    margin: 0,
    flexDirection: 'column',
    // alignItems: 'stretch',
    alignSelf: 'stretch'
  },
  messageList: {
    bottom: 50,
    top:60,
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'flex-end',
    alignSelf: 'stretch'
  },

  inputField: {
    height: 50,
    backgroundColor:'#aaaaaa',
    margin:0,
    bottom:0
  },
  bubble: {
    borderRadius:4,
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical:5,
    marginHorizontal: 10,
    marginVertical:5
  },
  messageText: {
    fontSize: 15,
    fontWeight: '200',
  },
  thumb: {
    borderRadius: 16,
    width: 32,
    height: 32,
    borderColor: '#ffffff',
    borderWidth: 3/PixelRatio.get()
  },
});

class ChatMessage extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View
        style={styles.bubble}>
        <Text style={styles.messageText}>{this.props.text}</Text>
          <Image
            style={styles.thumb}
            source={{uri: this.props.pic}}
            defaultSource={require('image!defaultuser')}
            resizeMode={Image.resizeMode.cover}

          />
      </View>
    );
  }
}
class ChatInside extends React.Component{
  render(){
    console.log('messagesrender',this.props.matchID,this.props.messages)
    if(!this.props.messages.length){
      console.log('none')
      return (
        <View style={styles.container}>
        </View>
      )
    }
    var messagesList = this.props.messages.map((el,i) =>{
      return (
        <ChatMessage key={el.id+'msg'} text={el.message_body} pic={el.from_user_info.image_url}></ChatMessage>
      )
    });
    return (
      <View style={styles.container}>
        <View style={styles.chatContainer}>
          <ScrollView
            id="chatview"
            ref="chat"
            style={styles.messageList}
            matchID={this.props.matchID}
            keyboardDismissMode={'onDrag'}>
            {messagesList}
          </ScrollView>

          /// TODO: use ios inputaccessorybar for input
          <ChatInput/>
        </View>
      </View>
    )
  }
}

class Chat extends React.Component{

  constructor(props){
    console.log(props);
    super(props);

  }


  render(){
    return(
      <AltContainer
          stores={{
            messages: (props) => {
              return {
                store: ChatStore,
                value: ChatStore.getMessagesForMatch(this.props.matchID)
              }
            }
          }}>
          <ChatInside
            matchID={this.props.matchID}
          />
    </AltContainer>
    );
  }

}

module.exports = Chat;
