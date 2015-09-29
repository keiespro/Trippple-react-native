/* @flow */



import React from 'react-native'
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
  PixelRatio,
  Dimensions
} = React;
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import ActionModal from './ActionModal'
import ThreeDots from '../buttons/ThreeDots'


var colors = require('../utils/colors');
var MatchesStore = require('../flux/stores/MatchesStore');

var ChatStore = require('../flux/stores/ChatStore');
var MatchActions = require('../flux/actions/MatchActions');
var alt = require('../flux/alt');
var AltContainer = require('alt/AltNativeContainer');

import InvertibleScrollView from 'react-native-invertible-scroll-view'
import TimeAgo from './Timeago'
import FakeNavBar from '../controls/FakeNavBar'

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
   },

  inputField: {
    height: 50,
    backgroundColor:colors.dark,
    margin:0,
    bottom:0
  },

  bubble: {
    borderRadius:10,
    padding: 10,

    paddingHorizontal: 20,
    paddingVertical:10,
    marginVertical:10,
    flex:1,
  },
  row:{
    flexDirection: 'row',
    flex: 1,
    alignSelf:'stretch',
    alignItems:'stretch',
    justifyContent:'space-between',
    marginHorizontal: 10,

  },
  col:{
    flexDirection: 'column',
    flex: 1,
    alignSelf:'stretch',
    alignItems:'stretch',
    justifyContent:'space-around',

  },

  theirMessage:{
      backgroundColor: colors.mediumPurple,
      marginRight:10,
  },
  ourMessage:{
  marginLeft:10,
      backgroundColor: colors.dark
},
messageTitle:{
  fontFamily:'Montserrat',
  color:colors.shuttleGray,
  marginBottom:5
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
    fontSize: 16,
    fontWeight: '200',
    flexWrap: 'wrap',
    color: colors.white
  },
  thumb: {
    borderRadius: 24,
    width: 48,
    height: 48,
    position:'relative',
    marginHorizontal:5
  },
});

class ChatMessage extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    var isMessageOurs = (this.props.messageData.from_user_info.id === this.props.user.id || this.props.messageData.from_user_info.id === this.props.user.partner_id);

    return (
      <View style={[styles.col]}>

      <View style={[styles.row]}>


         <View style={{flex:1,position:'relative',alignSelf:'stretch',alignItems:'center',flexDirection:'row', justifyContent:'center'}}>

        {!isMessageOurs &&
          <View style={{backgroundColor:'transparent'}}>
            <Image style={[styles.thumb]} source={{uri: this.props.pic}} defaultSource={require('image!placeholderUser')}
                    resizeMode={Image.resizeMode.cover}
            />
          </View>
        }

        { !isMessageOurs &&
          <Image resizeMode={Image.resizeMode.contain} source={require('image!TrianglePurple')}
                  style={{left:0,width:10,height:22}}/>

          }




          <View style={[styles.bubble,(isMessageOurs ? styles.ourMessage : styles.theirMessage),{alignSelf:'stretch'}]}>

            <Text style={[styles.messageText, styles.messageTitle,
                  {color: isMessageOurs ? colors.shuttleGray : colors.lavender, fontFamily:'Montserrat'} ]}
            >{
                    this.props.messageData.from_user_info.name.toUpperCase()
            }</Text>

            <Text style={styles.messageText} >{
              this.props.text
            }</Text>

        </View>

          {isMessageOurs &&
            <Image resizeMode={Image.resizeMode.contain} source={require('image!TriangleDark')}
                  style={{right:0,width:10,height:22}}/>

          }

        </View>
      </View>

      <View style={[{paddingHorizontal:20,marginBottom:10},{marginLeft: isMessageOurs ? 10 : 60}]}>
        <TimeAgo style={{color:colors.shuttleGray,fontFamily:'Montserrat'}} time={this.props.messageData.created_timestamp * 1000} />
      </View>

      </View>
    );
  }
}
class ChatInside extends Component{
  constructor(props){
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});

    console.log(props);

    this.state = {
      dataSource: this.ds.cloneWithRows(props.messages),
      keyboardSpace: 0,
      isKeyboardOpened: false,
      textInputValue: '',
      lastPage: 0,
      isVisible: false
    }

  }


  updateKeyboardSpace(frames){
    console.log('updateKeyboardSpace',frames,this.refs)
    // var h = frames.endCoordinates && frames.endCoordinates.height |
    var h = frames.startCoordinates && frames.startCoordinates.screenY - frames.endCoordinates.screenY || frames.end && frames.end.height
    if( h == this.state.keyboardSpace){ return false }
    this.setState({
      keyboardSpace: h,
      isKeyboardOpened: true
    });
    if(frames.endCoordinates ){
      var duration
      if( frames.duration < 100){
        return false
        // duration = frames.duration/1000
      }else{
        duration = frames.duration
      }
      LayoutAnimation.configureNext({
        duration: frames.duration/2,

        create: {
          delay: 0,
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity
        },
        update: {
          delay: 0,
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.paddingBottom
        }
      });
    }

  }

  resetKeyboardSpace(frames) {
  console.log('resetKeyboardSpace',frames)
    var h = frames.startCoordinates && frames.startCoordinates.screenY - frames.endCoordinates.screenY || frames.end && frames.end.height
    if( h == this.state.keyboardSpace){ return false }
    if(frames.endCoordinates ){
      var duration
      if( frames.duration < 100){
        return false
        // duration = frames.duration/1000
      }else{
        duration = frames.duration
      }
    }
    LayoutAnimation.configureNext({
      duration: frames.duration,

      create: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.paddingBottom
      }
    });
    this.setState({
      keyboardSpace: h,
      isKeyboardOpened: false
    });

  }
  changeKeyboardSpace(frames) {
    console.log('changeKeyboardSpace',frames)
    var h = frames.startCoordinates && frames.startCoordinates.screenY - frames.endCoordinates.screenY || frames.end && frames.end.height

    this.setState({
      keyboardSpace: h,
      isKeyboardOpened: false
    });
  }


  componentDidMount(){
    MatchActions.getMessages(this.props.matchID);
  }

// shouldComponentUpdate(nextProps,nextState){
//   return nextProps.messages.length == this.props.messages.length
// }
  componentDidUpdate(prevProps){
    if(prevProps.messages.length !== this.props.messages.length){
      this.refs.scroller.refs.listviewscroll.scrollTo(0,0)
    }
    // if(prevProps.messages && prevProps.messages.length < this.props.messages.length ){
    // }
  }

  componentWillReceiveProps(newProps){
   console.log(newProps)
      this.setState({
        dataSource: this.ds.cloneWithRows(newProps.messages)
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
    return (
      <ChatMessage
        user={this.props.user}
        messageData={rowData}
        key={`${rowID}-msg`}
        text={rowData.message_body}
        pic={rowData.from_user_info.thumb_url}
      />
    )
  }

  componentWillUpdate(props, state) {
    // if (state.isKeyboardOpened !== this.state.isKeyboardOpened) {
    //   LayoutAnimation.configureNext({
    //   layout: {
    //     spring: {
    //       duration: 250,

    //       create: {
    //         delay: 0,
    //         type: LayoutAnimation.Types.easeInEaseOut,
    //         property: LayoutAnimation.Properties.opacity
    //       },
    //       update: {
    //         delay: 0,
    //         type: LayoutAnimation.Types.easeInEaseOut,
    //         property: LayoutAnimation.Properties.paddingBottom
    //       }
    //     },

    //   });
    // }

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  }
  sendMessage(){

    if(this.state.textInputValue == ''){ return false }
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
  chatActionSheet(){
    var isOpen = this.state.isVisible
    this._textInput && this._textInput.blur()
    this.setState({
      isVisible:!isOpen,
    })


  }
  renderNoMatches(){
    var match = this.props.matches
    var theirIds = Object.keys(match.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> match.users[id])

    return (
     <ScrollView
        {...this.props}

          contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth}}
            contentInset={{top:0,right:0,left:0,bottom:44}}
            automaticallyAdjustContentInsets={true}
            scrollEnabled={false}
            centerContent={true}
            onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
            onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
          style={{
            backgroundColor:colors.outerSpace,
            flex:1,
            alignSelf:'stretch',
            width:DeviceWidth}} >
        <View style={{color:colors.white,textAlign:'center',flexDirection:'column',justifyContent:'space-between',alignItems:'center',alignSelf:'stretch'}}>
        <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',}} >{`YOU MATCHED WITH`}</Text>
        <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',}} >{`${chatTitle}`}</Text>
        <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes'}} >
          <TimeAgo time={match.created} />
        </Text>

        <Image source={{uri:them[1].image_url}} style={{width:250,height:250,borderRadius:125,marginVertical:40 }} defaultSource={require('image!placeholderUser')} />
        <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes'}} >Say something. {
        them[0].couple ? 'They\'re' :
          them[0].gender == 'm' ? 'He\'s' : 'She\'s'} already into you.</Text>

        </View>

        </ScrollView>
      )
  }
  render(){
    console.log('props in chat',this.props)
    // this._textInput && this._textInput.measure((x, y, width, height)=>{
    //    console.log(x, y, width, height);
  // });
   // this._textInput && this._textInput.measureLayout(4,(x, y, width, height)=>{
    //    console.log(x, y, width, height);
    // });
    //
    //
    var match = this.props.matches
    if(match){
    var theirIds = Object.keys(match.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> match.users[id])
    //
    }
    chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },"")

    console.log(this.props,them,'chatTitle',chatTitle);

    return (
      <View ref={'chatscroll'} style={{
        flexDirection:'column',
        alignItems:'flex-end',
        alignSelf:'stretch',
        backgroundColor: colors.outerSpace,
        flex:1,
        position:'relative',
        paddingBottom:this.state.keyboardSpace,
        height:DeviceHeight,
        width:DeviceWidth,
        overflow:'hidden'
        }}>


       {this.props.messages.length > 0 ? <ListView
          ref={'scroller'}
          renderScrollComponent={props =>
            <InvertibleScrollView
            onScroll={(e)=>{
              //TODO: use animated api to move input with keyboard
              // console.log('onscrollchat',e,e.nativeEvent,DeviceHeight - this.state.keyboardSpace,e.nativeEvent.contentOffset.y ,Math.abs(e.nativeEvent.contentOffset.y - ( DeviceHeight - this.state.keyboardSpace)) )
              // // if( ){
              //   var h = DeviceHeight - e.nativeEvent.contentOffset.y
              //   this.setState({
              //     keyboardSpace: parseInt(h),
              //   });

              // }
              // if(e.nativeEvent.contentOffset.y > e.nativeEvent.contentSize.height - 800){
                // var nextPage = this.state.lastPage;
                // if(this.state.fetching || nextPage === this.state.lastPage){ return  }
                // this.setState({fetching:true,lastPage: nextPage+1 })
                // MatchActions.getMessages({match_id: props.matchID,page: nextPage+1});
                // this.setState({fetching:false})
              // }
            }}
            onScroll={(e)=>{console.log(e.nativeEvent)}}
            onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
            onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
            scrollsToTop={true}
            contentContainerStyle={{backgroundColor:colors.outerSpace,justifyContent:'flex-end',width:DeviceWidth,overflow:'hidden'}}
            {...this.props}
            scrollEventThrottle={64}
            contentInset={{top:0,right:0,left:0,bottom:44}}
            automaticallyAdjustContentInsets={true}
            inverted={true}
             keyboardDismissMode={'interactive'}
          />}
          matchID={this.props.matchID}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          messages={this.props.messages || []}
          style={{
            backgroundColor:colors.outerSpace,
            flex:1,
            alignSelf:'stretch',
            width:DeviceWidth,
            height:DeviceHeight,
          }}
        />
        :  this.renderNoMatches()  }

        <View style={{
            flexDirection:'row',
            backgroundColor:colors.dark,
            alignItems:'center',
            justifyContent:'center',
            width:DeviceWidth,
            margin:0,
            paddingLeft:20,
            paddingVertical:15,
            paddingRight:10,
            borderTopWidth: 1 / PixelRatio.get() ,
            borderTopColor:'#000'
            // paddingBottom:10,
            // paddingTop:15
        }}>

          <TextInput multiline={true}
            ref={component => this._textInput = component}
            style={{
              flex:1,
              paddingHorizontal:3,
               paddingTop:0,
               paddingBottom:10,
              flexWrap:'wrap',
              fontSize:17,
              color:colors.white,
              borderBottomColor:colors.white,
              borderBottomWidth:1,
              overflow:'hidden',
            }}
              returnKeyType={'send'}
              keyboardAppearance={'dark'/*doesnt work*/}
              autoCorrect={true}
              placeholder={'Type Message...'}
              placeholderTextColor={colors.shuttleGray}
              autoFocus={false}
              clearButtonMode={'never'}
              onChangeText={this.onTextInputChange.bind(this)}
              onLayout={(e) => { console.log(e,e.nativeEvent)}}
             >
             <View style={{
             }}><Text
             style={{
               fontSize:17,
               padding:0,
               paddingBottom:7.5,

               color:colors.outerSpace,
              }}
             >{this.state.textInputValue || ' '}</Text></View>
          </TextInput>

          <TouchableHighlight
            style={{
              margin:0,
              padding:5,
              marginLeft:5,
              borderRadius:5,

              backgroundColor:colors.dark,
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'center'
            }}

            underlayColor={colors.outerSpace}
            onPress={this.sendMessage.bind(this)}>

            <Text
              style={[styles.sendButtonText,{
                color:colors.shuttleGray,
                fontFamily:'Montserrat',
                textAlign:'center'
              }]}>SEND</Text>
          </TouchableHighlight>

        </View>
        <FakeNavBar
          navigator={this.props.navigator}
          route={this.props.route}
          customNext={<ThreeDots/>}
          onNext={this.chatActionSheet.bind(this)}
          backgroundStyle={{backgroundColor:'transparent'}}
          onPrev={(n,p)=>n.pop()}
          blur={true}
          title={chatTitle}
          titleColor={colors.white}
          customPrev={
            <View style={{flexDirection: 'row',opacity:0.5,top:-3}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
            </View>
        }
        />

      <ActionModal
        currentMatch={this.props.matches}
        user={this.props.user}
        toggleModal={this.chatActionSheet.bind(this)}
        navigator={this.props.navigator}
        isVisible={this.state.isVisible} />
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
            },
            matches: (props) => {
              console.log('ALT',props)
              return {
                store: MatchesStore,
                value: MatchesStore.getMatchInfo(this.props.matchID)
              }
            }

          }}>
          <ChatInside
            navigator={this.props.navigator}
            user={this.props.user}
            closeChat={this.props.closeChat}
            matchID={this.props.matchID}
          />
      </AltContainer>
    );
  }

});

module.exports = Chat;
