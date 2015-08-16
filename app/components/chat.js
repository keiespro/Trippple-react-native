/* @flow */

 ;

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  InteractionManager,
  Image,
  TextInput,
  TouchableHighlight,
  ListView,
  LayoutAnimation,
  ScrollView,
  PixelRatio
} = React;
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;


var colors = require('../utils/colors');

var ChatStore = require("../flux/stores/ChatStore");
var MatchActions = require("../flux/actions/MatchActions");
var alt = require('../flux/alt');
var AltContainer = require('alt/AltNativeContainer');
var InvertibleScrollView = require('react-native-invertible-scroll-view');

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    backgroundColor:colors.shuttleGray,
    margin:0,
    bottom:0
  },
  bubble: {
    borderRadius:4,
    paddingHorizontal: 20,
    paddingVertical:10,
    marginHorizontal: 30,
    marginVertical:15,
    flex: 1,
    justifyContent:'space-between',
    flexDirection: 'row',
    flexWrap:'wrap',
  },
  theirMessage:{
    alignSelf:'flex-end',
    position:'absolute',
    left:-20
  },
  ourMessage:{
    alignSelf:'flex-start',
    position:'absolute',
    right:-20
  },
  sendButtonText:{
    textAlign:'center',
    fontFamily:'omnes',
    fontSize:18,
    color:colors.white
  },
  chatmessage:{
    flexDirection: 'column',
    flex:1,
    backgroundColor: colors.shuttleGray,

    width:undefined,
    flexWrap:'wrap',
    justifyContent:'flex-start',
    // height:50,
    overflow:'hidden'
  },
  messageText: {
    fontSize: 18,
    fontWeight: '200',
    flexWrap: 'wrap',

  },
  thumb: {
    borderRadius: 16,
    width: 32,
    height: 32,
    borderColor: colors.white,
    borderWidth: 3/PixelRatio.get()
  },
});

class ChatMessage extends React.Component {
  constructor(props){
    super(props);
    console.log(props.messageData);
  }
  render() {
    var isMessageOurs = (this.props.messageData.from_user_info.id == this.props.user.id || this.props.messageData.from_user_info.id == this.props.user.partner_id);

    console.log(this.props.messageData.from_user_info.id, this.props.user.id ,this.props.user.partner_id, isMessageOurs);

    return (
      <View style={[styles.bubble]}>
        <View style={[styles.chatmessage]}>
          <Text style={styles.messageText} numberOfLines={2}>{this.props.text}</Text>
        </View>
        <View style={[(isMessageOurs ? styles.ourMessage : styles.theirMessage)]}>
          <Image
            style={[styles.thumb]}
            source={{uri: this.props.pic}}
            defaultSource={require('image!defaultuser')}
            resizeMode={Image.resizeMode.cover}
          />
        </View>
      </View>
    );
  }
}
class ChatInside extends React.Component{
  constructor(props){
    super(props);
    MatchActions.getMessages(props.matchID);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});


    this.state = {
      dataSource: ds.cloneWithRows(props.messages),
      keyboardSpace: 0,
      isKeyboardOpened: false

    }

  }



  updateKeyboardSpace(frames) {
    console.log(frames)
    this.setState({
      keyboardSpace: frames.end.height,
      isKeyboardOpened: true
    });
  }

  resetKeyboardSpace() {
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  }


  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
  }
  componentDidMount(){
    console.log('mount chat')
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillChangeFrameEvent, (frames) => {
      // console.log('will change', frames);
      // this.refs.chatscroll.setNativeProps({
      //   paddingBottom: DeviceHeight - frames.end.height
      // })
    });
    console.log(this.refs.scroller)
    // this.refs.scroller.refs.listviewscroll.scrollTo(0)
    // InteractionManager.runAfterInteractions(() => {
      MatchActions.getMessages(this.props.matchID);
    //   this.saveToStorage();
    // })
    // this.refs.lister.refs.listviewscroll.scrollTo.call(this,0,0)
  }
  componentDidUpdate(prevProps){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.refs.scroller.refs.listviewscroll.scrollTo(0,0)

    if(prevProps.messages && prevProps.messages.length < this.props.messages.length )
    this.setState({
      dataSource: ds.cloneWithRows(this.props.messages)
    })
  }
  saveToStorage(){
    console.log('save??')
    // AsyncStorage.setItem('ChatStore', alt.takeSnapshot(ChatStore))
    //   .then(() => {console.log('saved chat store')})
    //   .catch((error) => {console.log('AsyncStorage error: ' + error.message)})
    //   .done();
  }
  _renderRow(rowData, sectionID: number, rowID: number) {
    console.log(rowData)
    return (
      <ChatMessage user={this.props.user} messageData={rowData} key={rowID+'msg'} text={rowData.message_body} pic={rowData.from_user_info.image_url}/>
    )
  }

  componentWillUpdate(props, state) {
    console.log(props,state)
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  }
  sendMessage(){

    console.log('send')
  }
  render(){

    console.log(this.state.keyboardSpace)
    return (
      <View ref={'chatscroll'} style={{flexDirection:'column',
        alignItems:'flex-end',
        alignSelf:'stretch',
        flex:1,
        paddingBottom:this.state.keyboardSpace,
        height:DeviceHeight,
        width:DeviceWidth,
        backgroundColor:colors.outerSpace}}>
        <ListView
          ref={'scroller'}
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          matchID={this.props.matchID}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          messages={this.props.messages || []}
          contentContainerStyle={{justifyContent:'flex-end',}}
          style={{backgroundColor:'transparent',flex:15,alignSelf:'stretch',width:DeviceWidth,height:DeviceHeight-20,paddingTop:40}}/>
        <View style={{
            height:50,

            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            alignSelf:'stretch',
            width:DeviceWidth,
            backgroundColor:colors.white,
            padding:5}}>

          <TextInput multiline={true}
            textAlignVertical={'center'} style={{
              flex:1,
              padding:3,
              flexWrap:'wrap',
              fontSize:18,
              backgroundColor:colors.mediumPurple,
              borderRadius:4}}/>
          <TouchableHighlight style={{
              margin:5,
              padding:8,
              borderRadius:4,
              backgroundColor:colors.mediumPurple,
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'center'}} onPress={this.sendMessage.bind(this)}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

var animations = {
  layout: {
    spring: {
      duration: 250,

      create: {
        duration: 250,
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.paddingBottom
      }
    },
    easeInEaseOut: {
      duration: 250,
      create: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.paddingBottom
      }
    }
  }
};

var Chat = React.createClass({
  componentWillMount(){
    console.log(this.props)
    MatchActions.getMessages(this.props.matchID || this.props.match_id);

  },

  render(){
    return (
      <AltContainer

          stores={{
            messages: (props) => {
              console.log(props.match_id)
              return {
                store: ChatStore,
                value: ChatStore.getMessagesForMatch(props.match_id || this.props.matchID)
              }
            }
          }}>
          <ChatInside
            user={this.props.user}
            matchID={this.props.matchID}
          />
      </AltContainer>
    );
  }

});

module.exports = Chat;
