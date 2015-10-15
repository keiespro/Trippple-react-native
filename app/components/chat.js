/* @flow */



import React from 'react-native'
import  { Component, StyleSheet, Text, View, InteractionManager, Image, TextInput, TouchableHighlight, ListView,
          LayoutAnimation, TouchableOpacity, ScrollView, PixelRatio, Dimensions } from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import ActionModal from './ActionModal'
import ThreeDots from '../buttons/ThreeDots'
import FadeInContainer from './FadeInContainer'

import colors from '../utils/colors'
import MatchesStore from '../flux/stores/MatchesStore'

import ChatStore from '../flux/stores/ChatStore'
import MatchActions from '../flux/actions/MatchActions'
import alt from '../flux/alt'
import AltContainer from 'alt/AltNativeContainer'

import InvertibleScrollView from 'react-native-invertible-scroll-view'
import TimeAgo from './Timeago'
import FakeNavBar from '../controls/FakeNavBar'
import MaskableTextInput from '../RNMaskableTextInput.js'

import { BlurView,VibrancyView} from 'react-native-blur'

const styles = StyleSheet.create({
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
    paddingVertical:15,
    marginTop:10,
    marginBottom:5,
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
    marginRight: 10,
  },
  ourMessage:
  {
    marginLeft: 10,
    backgroundColor: colors.dark
  },
  messageTitle:
  {
    fontFamily: 'Montserrat',
    color: colors.shuttleGray,
    fontSize: 12,
    marginBottom: 5
  },
  sendButton:
  {
    margin: 0,
    padding: 5,
    marginLeft: 5,
    borderRadius: 5,
    paddingVertical: 10,
    backgroundColor: colors.dark,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonText:{
    textAlign:'center',
    fontFamily:'omnes',
    fontSize:18,
    color:colors.white
  },
  chatmessage:{

  },
  chatInsideWrap:{
    flexDirection:'column',
    alignItems:'flex-end',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace,
    flex:1,
    position:'relative',
    height:DeviceHeight,
    width:DeviceWidth,
    overflow:'hidden'
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
  listview:{
    backgroundColor:colors.outerSpace,
    flex:1,
    alignSelf:'stretch',
    width:DeviceWidth,
    height:DeviceHeight,
  },
  messageComposer: {
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
  },
  messageComposerInput:{
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
  }
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
            <Image style={[styles.thumb]} source={{uri:this.props.messageData.from_user_info.image_url}} defaultSource={require('image!placeholderUser')}
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

      <View style={[{paddingHorizontal:20,marginBottom:10},{marginLeft: isMessageOurs ? 21 : 77}]}>
        <TimeAgo showSent={true} style={{color:colors.shuttleGray,fontSize:10,fontFamily:'Montserrat'}} time={this.props.messageData.created_timestamp * 1000} />
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
          type: LayoutAnimation.Types.keyboard,
          property: LayoutAnimation.Properties.opacity
        },
        update: {
          delay: 0,
          type: LayoutAnimation.Types.keyboard,
          property: LayoutAnimation.Properties.paddingBottom
        }
      });
    }

  }

  resetKeyboardSpace(frames) {
    var h = frames.startCoordinates && frames.startCoordinates.screenY - frames.endCoordinates.screenY || frames.end && frames.end.height
    if( h == this.state.keyboardSpace){ return false }
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        delay: 0,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.paddingBottom
      }
    });
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
  }

  componentWillReceiveProps(newProps){
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

    if(state.canContinue !== this.state.canContinue) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  }

  sendMessage(){

    if(this.state.textInputValue == ''){ return false }
    MatchActions.sendMessage(this.state.textInputValue, this.props.matchID)

    this._textInput.setNativeProps({text: ''});
    this.setState({ textInputValue: '' })
  }

  onTextInputChange(text){

    this.setState({
      textInputValue: text
    })
  }

  chatActionSheet(){
    var isOpen = this.props.isVisible
    this._textInput && this._textInput.blur()
    this.props.toggleModal()
  }

  renderNoMatches(){
    var matchInfo = this.props.currentMatch,
        theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id),
        them = theirIds.map((id)=> matchInfo.users[id]),
        chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },'')

    return (
      <ScrollView
        {...this.props}
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth}}
        contentInset={{top:0,right:0,left:0,bottom:50}}
        automaticallyAdjustContentInsets={true}
        scrollEnabled={false}
        removeClippedSubviews={true}
        centerContent={true}
        onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
        onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
        style={{ backgroundColor:colors.outerSpace, flex:1, alignSelf:'stretch', width:DeviceWidth}}
        >
        <FadeInContainer delayRender={true} delayAmount={1200} >
          <View style={{flexDirection:'column',justifyContent:'space-between',alignItems:'center',alignSelf:'stretch'}}>
            <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',}} >{
                `YOU MATCHED WITH`
            }</Text>
            <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',}} >{
                `${chatTitle}`
            }</Text>
            <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes'}} >
              <TimeAgo time={matchInfo.created_timestamp*1000} />
            </Text>

            <Image source={{uri:them[1].image_url}} style={{width:250,height:250,borderRadius:125,marginVertical:40 }}  defaultSource={require('image!placeholderUser')} />
            <Text style={{color:colors.shuttleGray,fontSize:20,fontFamily:'omnes'}} >Say something. {
                (them.length == 2 ? 'They\'re' : them[0].gender == 'm' ? 'He\'s' : 'She\'s')
            } already into you.</Text>

          </View>
        </FadeInContainer>
      </ScrollView>
    )
  }

  render(){

    var matchInfo = this.props.currentMatch,
        theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id),
        them = theirIds.map((id)=> matchInfo.users[id]),
        chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },'')

    return (
      <View ref={'chatscroll'} style={[styles.chatInsideWrap,{paddingBottom:this.state.keyboardSpace}]}>


        {this.props.messages.length > 0 ?
        <ListView
          ref={'scroller'}
          matchID={this.props.matchID}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          messages={this.props.messages || []}
          style={styles.listview}
          renderScrollComponent={props =>
            <InvertibleScrollView
              onScroll={(e)=>{ }}
              onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
              onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
              scrollsToTop={true}
              contentContainerStyle={{backgroundColor:colors.outerSpace,justifyContent:'flex-end',width:DeviceWidth,overflow:'hidden'}}
              {...this.props}
              scrollEventThrottle={64}
              contentInset={{top:0,right:0,left:0,bottom:88}}
              automaticallyAdjustContentInsets={true}
              inverted={true}
              style={{ height:DeviceHeight}}
              keyboardDismissMode={'on-drag'}
            />
          }
        />
        : this.renderNoMatches()  }

        <View style={styles.messageComposer}>

          <MaskableTextInput
            multiline={true}
            autoGrow={true}
            ref={component => this._textInput = component}
            style={styles.messageComposerInput}
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
            <View style={{ }}>
              <Text style={{ fontSize:17, padding:1, paddingBottom:7.5, color:colors.outerSpace, }} >{
                  this.state.textInputValue || ' '
              }</Text>
            </View>
          </MaskableTextInput>

          <TouchableHighlight
            style={styles.sendButton}
            underlayColor={colors.outerSpace}
            onPress={this.state.textInputValue.length ? this.sendMessage.bind(this) : null}
            >
            <Text style={[styles.sendButtonText,{
                color: this.state.textInputValue.length ? colors.white : colors.shuttleGray,
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
            <View style={{flexDirection: 'row',opacity:0.5,top:7}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
            </View>
          }
        />

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
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.paddingBottom
      }
    },
    easeInEaseOut: {
      duration: 250,
      create: {
        delay: 0,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.paddingBottom
      }
    }
  }
};

var Chat = React.createClass({
  getInitialState(){
    return ({
      isVisible: false
    })
  },
  componentWillMount(){
    MatchActions.getMessages(this.props.matchID || this.props.match_id)
  },
  toggleModal(){
    console.log(this.state.isVisible)
    this.setState({
      isVisible:!this.state.isVisible,
    })
  },
  render(){
    var storesForChat = {
      messages: (props) => {
        return {
          store: ChatStore,
          value: ChatStore.getMessagesForMatch(props.match_id || this.props.matchID)
        }
      },
      currentMatch: (props) => {
        console.log('ALT',props)
        return {
          store: MatchesStore,
          value: MatchesStore.getMatchInfo(this.props.matchID)
        }
      }
    }

    return (
      <AltContainer stores={storesForChat}>


        <ChatInside
          navigator={this.props.navigator}
          user={this.props.user}
          closeChat={this.props.closeChat}
          matchID={this.props.matchID}
          toggleModal={this.toggleModal}
        />
        {this.state.isVisible ? <View
          style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]}>

           <FadeInContainer duration={300} >
             <TouchableOpacity activeOpacity={0.5} onPress={this.toggleModal}                 style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]} >

               <BlurView
                 blurType="light"
                 style={[{width:DeviceWidth,height:DeviceHeight}]} >
                 <View style={[{ }]}/>
               </BlurView>
             </TouchableOpacity>
           </FadeInContainer>
         </View> : <View/>}

        <ActionModal
                  user={this.props.user}
                  toggleModal={this.toggleModal}
                  navigator={this.props.navigator}
                  isVisible={this.state.isVisible}
                />
      </AltContainer>
    );
  }

});

module.exports = Chat;
