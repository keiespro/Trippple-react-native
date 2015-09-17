/* @flow */



var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  View,
  // AsyncStorage,
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

var ChatStore = require('../flux/stores/ChatStore');
var MatchActions = require('../flux/actions/MatchActions');
var alt = require('../flux/alt');
var AltContainer = require('alt/AltNativeContainer');
var InvertibleScrollView = require('react-native-invertible-scroll-view');
import TimeAgo from './Timeago'

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
    backgroundColor:colors.dark,

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
    backgroundColor:colors.dark,
    margin:0,
    bottom:0
  },
  bubble: {
    borderRadius:4,
    paddingHorizontal: 20,
    paddingVertical:10,
    marginHorizontal: 10,
    marginVertical:15,
    flex: 1,
              flexWrap:'wrap',
    alignSelf:'stretch',
    flexDirection: 'row',
  flexDirection: 'column',
    flex:1,
    backgroundColor: colors.mediumPurple,
    borderRadius:4,
    padding: 10,

    // height:50,
    overflow:'hidden'

},
row:{
    flexDirection: 'row',
    flex: 1
},
  theirMessage:{
    alignSelf:'flex-start',
    alignItems:'flex-start',
    justifyContent:'flex-start',

  },
  ourMessage:{
    alignSelf:'flex-end',
    alignItems:'flex-end',
    justifyContent:'flex-end',


    backgroundColor: colors.dark
},
messageTitle:{
  fontFamily:'Montserrat',
  color:colors.shuttleGray
},
  sendButtonText:{
    textAlign:'center',
    fontFamily:'omnes',
    fontSize:18,
    color:colors.white
  },
  chatmessage:{
    },
  messageText: {
    fontSize: 18,
    fontWeight: '200',
    flexWrap: 'wrap',
    color: colors.white
  },
  thumb: {
    borderRadius: 24,
    width: 48,
    height: 48,
    position:'relative'
  },
});

class ChatMessage extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    var isMessageOurs = (this.props.messageData.from_user_info.id === this.props.user.id || this.props.messageData.from_user_info.id === this.props.user.partner_id);

    return (
      <View style={[styles.row,{alignItems:'center'}]}>


        {!isMessageOurs && <View style={[]}>
          <Image
            style={[styles.thumb]}
            source={{uri: this.props.pic}}
            defaultSource={require('image!placeholderUser')}
            resizeMode={Image.resizeMode.cover}
          />
          </View>
        }


        <View style={[styles.bubble,(isMessageOurs ? styles.ourMessage : styles.theirMessage)]}>
          <Text style={[styles.messageText,styles.messageTitle,{color: isMessageOurs ? colors.shuttleGray : colors.lavender}]}
                numberOfLines={2}>{this.props.messageData.from_user_info.name}</Text>
          <Text style={styles.messageText} numberOfLines={2}>{this.props.text}</Text>
        </View>

        {isMessageOurs && <View style={[]}>
          <Image
            style={[styles.thumb]}
            source={{uri: this.props.pic}}
            defaultSource={require('image!placeholderUser')}
            resizeMode={Image.resizeMode.cover}
          />
          </View>
        }
    </View>
    );
  }
}
class ChatInside extends Component{
  constructor(props){
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});


    this.state = {
      dataSource: ds.cloneWithRows(props.messages),
      keyboardSpace: 0,
      isKeyboardOpened: false,
      textInputValue: '',
      lastPage: 0
    }
    MatchActions.getMessages(props.matchID);

  }


  updateKeyboardSpace(frames) {
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
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
    // KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillChangeFrameEvent, (frames) => {
    //   console.log('will change', frames);
    // });
    // this.refs.scroller.refs.listviewscroll.scrollTo(0)
      MatchActions.getMessages(this.props.matchID);
}

// shouldComponentUpdate(nextProps,nextState){
//   return nextProps.messages.length == this.props.messages.length
// }
  componentDidUpdate(prevProps){
    if(prevProps.messages.length !== this.props.messages.length){
      this.refs.scroller.refs.listviewscroll.scrollTo(0,0)
  }
    if(prevProps.messages && prevProps.messages.length < this.props.messages.length ){
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.messages)
      })
    }
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
      <ChatMessage
      user={this.props.user}
      messageData={rowData}
      key={`${rowID}-msg`}
      text={rowData.message_body}
      pic={rowData.from_user_info.image_url}
      />
    )
  }

  componentWillUpdate(props, state) {
    if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  }
  sendMessage(){
    MatchActions.sendMessage(this.state.textInputValue, this.props.matchID)
    this.setState({
      textInputValue: ''
    })
    this._textInput.setNativeProps({text: ''});
  }
  onTextInputChange(text){

    this.setState({
      textInputValue: text
    })
  }
  render(){
    this._textInput && this._textInput.measure((x, y, width, height)=>{
       console.log(x, y, width, height);
  });
   this._textInput && this._textInput.measureLayout(4,(x, y, width, height)=>{
       console.log(x, y, width, height);
    });

    return (
      <View ref={'chatscroll'} style={{
        flexDirection:'column',
        alignItems:'flex-end',
        alignSelf:'stretch',
        flex:1,
        paddingBottom:this.state.keyboardSpace,
        height:DeviceHeight,
        width:DeviceWidth,
        backgroundColor:colors.outerSpace}}>

        <ListView
          ref={'scroller'}
          renderScrollComponent={props =>
            <InvertibleScrollView
            onScroll={(e)=>{
              if(e.nativeEvent.contentOffset.y > e.nativeEvent.contentSize.height - 800){
                var nextPage = this.state.lastPage;
                if(this.state.fetching || nextPage === this.state.lastPage){ return  }
                this.setState({fetching:true,lastPage: nextPage+1 })
                MatchActions.getMessages({match_id: props.matchID,page: nextPage+1});
                this.setState({fetching:false})

              }
            }}
            scrollEventThrottle={128}
            scrollsToTop={false}
              contentContainerStyle={{justifyContent:'flex-end',width:DeviceWidth,overflow:'hidden'}}
              {...this.props}
              inverted={true}
              keyboardDismissMode={'interactive'}
          />}
          matchID={this.props.matchID}
          dataSource={this.state.dataSource}
              onEndReached={()=>{console.log('END')}}
          renderRow={this._renderRow.bind(this)}
          messages={this.props.messages || []}
          style={{
            backgroundColor:colors.outerSpace,
            flex:1,
            alignSelf:'stretch',
            width:DeviceWidth,
            height:DeviceHeight - 20,
            paddingTop:40}}/>

        <View style={{
            flexDirection:'row',
            backgroundColor:colors.dark,
            alignItems:'center',
            justifyContent:'center',
            width:DeviceWidth,
            margin:0,
            padding:20,
            // paddingBottom:10,
            // paddingTop:15
        }}>

          <TextInput multiline={true}
            ref={component => this._textInput = component}
            style={{
              flex:1,
              paddingHorizontal:2.5,
               paddingTop:0,
               paddingBottom:10,

              flexWrap:'wrap',
              fontSize:16,
              color:colors.white,
              borderBottomColor:colors.mediumPurple,
              borderBottomWidth:1,
              overflow:'hidden',
            }}
              returnKeyType={'send'}

              onChangeText={this.onTextInputChange.bind(this)}
              onLayout={(e) => { console.log(e,e.nativeEvent)}}
             >
             <View style={{
             }}><Text
             style={{
               fontSize:16,
               padding:0,
               paddingBottom:7.5,

               color:colors.outerSpace,
              }}
             >{this.state.textInputValue || ' '}</Text></View>
          </TextInput>

          <TouchableHighlight style={{
              margin:0,
              padding:5,
    backgroundColor:colors.dark,
                            flexDirection:'column',
              alignItems:'center',
              justifyContent:'center'}} onPress={this.sendMessage.bind(this)}>
              <Text style={[styles.sendButtonText,{
                color:colors.shuttleGray,
                fontFamily:'Montserrat',
              }]}>SEND</Text>
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
