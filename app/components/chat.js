/* @flow */

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  InteractionManager,
  Image,
  TextInput,
  ListView,
  ScrollView,
  PixelRatio
} = React;



var ChatStore = require("../flux/stores/ChatStore");
var MatchActions = require("../flux/actions/MatchActions");
var alt = require('../flux/alt');
var AltContainer = require('alt/AltNativeContainer');
// var InvertibleScrollView = require('react-native-invertible-scroll-view');
var TripppleChat = require('TripppleChat');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:50,
    paddingBottom:50
  },
  chatContainer: {
    flex: 1,
    margin: 0,
    flexDirection: 'column',
    // alignItems: 'stretch',
    alignSelf: 'stretch',
    // bottom: 50,
    // top:60
  },
  messageList: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // transformMatrix: [
    //    1,  0,  0,  0,
    //    0, -1,  0,  0,
    //    0,  0,  1,  0,
    //    0,  0,  0,  1,
    // ],
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
    marginVertical:5,
    // flex: 1,
    alignSelf: 'stretch',

    flexDirection: 'row'
    // transformMatrix: [
    //    1,  0,  0,  0,
    //    0, -1,  0,  0,
    //    0,  0,  1,  0,
    //    0,  0,  0,  1,
    // ],

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
  constructor(props){
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});


    this.state = {
      dataSource: ds.cloneWithRows(this.props.messages)
    }

  }
  componentDidMount(){
    console.log('mount chat',this.refs.lister)
    // InteractionManager.runAfterInteractions(() => {
      MatchActions.getMessages(this.props.matchID);
    //   this.saveToStorage();
    // })
    // this.refs.lister.refs.listviewscroll.scrollTo.call(this,0,0)
  }

  saveToStorage(){
    console.log('save??')
    // AsyncStorage.setItem('ChatStore', alt.takeSnapshot(ChatStore))
    //   .then(() => {console.log('saved chat store')})
    //   .catch((error) => {console.log('AsyncStorage error: ' + error.message)})
    //   .done();
  }
  _renderRow(rowData, sectionID: number, rowID: number) {
    return (
      <ChatMessage key={rowID+'msg'} text={rowData.message_body} pic={rowData.from_user_info.image_url}/>
    )
  }

  render(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log(TripppleChat);
    
    // var children = this.state.messages.map((el,i) => {
    //   return (
    //     
    //   )
    // })
    return (
      <View style={{backgroundColor:'#fff',flex:1,alignSelf:'stretch'}}>
        <TripppleChat>
          <ListView
            initialListSize={12}
            removeClippedSubviews={true}
            dataSource={ ds.cloneWithRows([this.state.messages]) }
            renderRow={this._renderRow.bind(this)}
          />
        </TripppleChat>
      </View>
    )
  }
};

var Chat = React.createClass({

  
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
            key="afvehbdjkn"
            matchID={this.props.matchID}
          />
    </AltContainer>
    );
  }

});

module.exports = Chat;
