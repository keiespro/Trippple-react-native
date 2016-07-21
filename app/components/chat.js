/* @flow */

import React, {Component} from "react";

import {StyleSheet, Text, View, InteractionManager, Image, TextInput, TouchableHighlight, ListView, LayoutAnimation, TouchableOpacity, ScrollView, Animated, PixelRatio, Easing, Dimensions} from "react-native";

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../DeviceConfig'
import dismissKeyboard from 'dismissKeyboard'
import ActionModal from './ActionModal'
import ThreeDots from '../buttons/ThreeDots'
import FadeInContainer from './FadeInContainer'
import colors from '../utils/colors'
import MatchesStore from '../flux/stores/MatchesStore'
import ChatStore from '../flux/stores/ChatStore'
import MatchActions from '../flux/actions/MatchActions'
import alt from '../flux/alt'
import AltContainer from 'alt-container/native';
import InvertibleScrollView from 'react-native-invertible-scroll-view'
import TimeAgo from './Timeago'
import FakeNavBar from '../controls/FakeNavBar'
import moment from 'moment'
import { BlurView, VibrancyView } from 'react-native-blur'
import Analytics from '../utils/Analytics';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
// import TimerMixin from 'react-timer-mixin';
// import reactMixin from 'react-mixin'

const styles = StyleSheet.create({
  container: {

    backgroundColor: colors.white,
    paddingTop:50,
    paddingBottom:50
  },
  chatContainer: {

    margin: 0,
    flexDirection: 'column',
    // alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor:colors.dark,

    // bottom: 50,
    // top:60
  },
  messageList: {

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
    flexDirection: 'column',
    maxWidth:DeviceWidth-100,
  },
  row:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginHorizontal: 10,

  },
  col:{
    flexDirection: 'column',

    alignSelf:'stretch',
    alignItems:'stretch',
    justifyContent:'space-around',

  },
  theirMessage:{
    backgroundColor: colors.mediumPurple,
    marginRight: MagicNumbers.is4s ? 0 : 10,
    alignSelf:'flex-start',

  },
  ourMessage:
  {
    // marginLeft: MagicNumbers.is4s ? 0 : 10,
    backgroundColor: colors.dark,
    alignSelf:'flex-end',

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
  chatInsideWrap:{
    flexDirection:'column',
    alignItems:'flex-end',
    alignSelf:'stretch',
    backgroundColor: colors.dark,

    position:'relative',
    height:DeviceHeight,
    width:DeviceWidth,
    overflow:'hidden'
  },
  messageText: {
    fontSize: 16,
    fontWeight: '200',
    // flexWrap: 'wrap',
    color: colors.white
  },
  thumb: {
    borderRadius:MagicNumbers.is4s ? 20 : 24,
    width: MagicNumbers.is4s ? 40 : 48,
    height:MagicNumbers.is4s ? 40 :  48,
    position:'relative',
    marginHorizontal:MagicNumbers.is4s ?  0 : 5,
    marginRight: 5
  },
  listview:{
    backgroundColor:colors.outerSpace,

    alignSelf:'stretch',
    width:DeviceWidth,
    // height:DeviceHeight,
  },
  messageComposer: {
    flexDirection:'row',
    backgroundColor:colors.dark,
    alignItems:'center',
    justifyContent:'center',
    width:DeviceWidth,
    margin:0,
    height:80,
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
    fontSize:17,
    color:colors.white,
    borderBottomColor:colors.white,
    borderBottomWidth:1,
    overflow:'hidden',
  },
  invertedContentContainer:{
    backgroundColor:colors.outerSpace,
    justifyContent:'flex-end',
    width:DeviceWidth,
    overflow:'hidden'
  }
});

class ChatMessage extends React.Component{
  render(){
    const isMessageOurs = (this.props.messageData.from_user_info.id === this.props.user.id || this.props.messageData.from_user_info.id === this.props.user.partner_id);
    var thumb = ''
    if(!isMessageOurs){
      const {from_user_info} = this.props.messageData;
      const {thumb_url,image_url} = from_user_info;

      /*
       * TODO:
       * this deals with test bucket urls
       * but not very maintainable
       */

      // var thumb = '';
      // var img = (thumb_url && typeof thumb_url === 'string' ? thumb_url : image_url);
      // if(img && img.includes('test')){
      //   var u = img;
      //   var x = u.split('/test/')[0].split('uploads') + u.split('test')[1];
      //   thumb = x.split('/images')[0] + x.split('/images')[1]
      // }else{
      //   thumb = img+'';
      // }
       thumb = image_url+'';
    }else{
       thumb = '';

    }

    return (
      <View style={[styles.col]}>
        <View style={[styles.row]}>
          <View style={{flexDirection:'column', alignItems:isMessageOurs ? 'flex-end' : 'flex-start', alignSelf: 'stretch', flex:1, justifyContent:'center',backgroundColor: this.props.messageData.ephemeral && __DEV__ ? colors.sushi : 'transparent'}}>
          <View style={{alignSelf: isMessageOurs ? 'flex-end' : 'flex-start',justifyContent:'center',alignItems:'center',maxWidth:MagicNumbers.screenWidth,backgroundColor:'transparent',flexDirection:'row'}}>
            {!isMessageOurs ?
              <View style={{backgroundColor:'transparent'}}>
              <Image style={[styles.thumb,{backgroundColor:colors.dark}]}
                  source={{uri: thumb}}
                  resizeMode={Image.resizeMode.cover}
                  defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                />
              </View> : null
            }
            { !isMessageOurs ?
              <Image
                resizeMode={Image.resizeMode.contain}
                source={{uri: 'assets/TrianglePurple@3x.png'}}
                style={{left:1,width:10,height:22,opacity:1}}
              /> : null
            }
            <View style={[styles.bubble,(isMessageOurs ? styles.ourMessage : styles.theirMessage),{flexWrap:'wrap',flexDirection:'column' },]}>

              <Text style={[styles.messageText, styles.messageTitle,
                    {color: isMessageOurs ? colors.shuttleGray : colors.lavender, fontFamily:'Montserrat'} ]}
              >{ this.props.messageData.from_user_info.name.toUpperCase() }</Text>

              <Text style={[styles.messageText,{flex:1}]} >{
                this.props.text
              }</Text>

            </View>

            {isMessageOurs ?
              <Image
                resizeMode={Image.resizeMode.contain}
                source={{uri: 'assets/TriangleDark@3x.png'}}
                style={{right:0,width:10,height:22,tintColor:colors.darks,opacity:1}}
              /> : null
            }
            </View>
          </View>
        </View>

        <View style={[{paddingHorizontal:20,marginBottom:10},{marginLeft: isMessageOurs ? 2 : 62,alignSelf: isMessageOurs ? 'flex-end' : 'flex-start' }]}>
          <TimeAgo showSent={true} style={{color:colors.shuttleGray,fontSize:10,fontFamily:'Montserrat'}} time={this.props.messageData.created_timestamp * 1000} />
        </View>

      </View>
    );

}
}




class ChatInside extends Component{
  constructor(props){
    super();

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(props.messages || []),
      keyboardSpace: 0,
      isKeyboardOpened: false,
      textInputValue: '',
      fetching: false,
      lastPage: 0,
      bottomColor: new Animated.Value(0)
    }
  }

  updateKeyboardSpace(frames){


    var h = frames.endCoordinates.height//frames.startCoordinates.screenY - frames.endCoordinates.screenY;

    if( h == this.state.keyboardSpace){ return false }
    this.setState({
      keyboardSpace: h,
      isKeyboardOpened: true
    });
    if(frames.endCoordinates ){
      var duration;
      if( frames.duration < 100){
        return false
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
    // console.log(frames);
    var h = frames.startCoordinates && frames.startCoordinates.screenY - frames.endCoordinates.screenY || frames.end && frames.end.height;
    if( h == this.state.keyboardSpace){ return false }
    this.setState({
      keyboardSpace: h,
      isKeyboardOpened: false
  });
      LayoutAnimation.configureNext({
      duration: 50,
      create: {
        delay: 0,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.paddingBottom
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.paddingBottom
      }
    });


  }

  componentDidUpdate(prevProps){
    if(this.props.messages && prevProps.messages && prevProps.messages.length !== this.props.messages.length){

    }

    // this.refs.scroller && this.refs.scroller.refs.listviewscroll.scrollTo(0,0)
  }

  componentWillReceiveProps(newProps){
    if(!this.ds || !newProps.messages) {return }
    this.setState({
      dataSource: this.ds.cloneWithRows(newProps.messages)
    })
  }

  saveToStorage(){
    AsyncStorage.setItem('ChatStore', alt.takeSnapshot(ChatStore))
      .catch((error) => {Analytics.log('AsyncStorage error: ' + error.message)})
      .done();
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

  sendMessage(){
    if(this.state.textInputValue == ''){ return false }
    const timestamp = moment().utc().unix();
    this._textInput.setNativeProps({text: ''});
    MatchActions.sendMessage(this.state.textInputValue, this.props.match_id, timestamp)
    MatchActions.sendMessageToServer.defer(this.state.textInputValue, this.props.match_id)
    this.setState({ textInputValue: '' })
    this.refs.scroller && this.refs.scroller.scrollTo({x:0,y:0})

  }

  onTextInputChange(text){
    this.setState({
      textInputValue: text
    })
  }

  chatActionSheet(){
    const isOpen = this.props.isVisible;
    this._textInput && this._textInput.blur && this._textInput.blur()
    this.props.toggleModal()
  }
  getThumbSize(){

    let size =  MagicNumbers.is4s ? SIZES.small : SIZES.big
    return  {
                width: this.state.isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
                height: this.state.isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
                borderRadius: this.state.isKeyboardOpened ? size.dimensions.open/2 : size.dimensions.closed/2,
                marginVertical: this.state.isKeyboardOpened ? size.margin.open : size.margin.closed,
                backgroundColor: colors.dark
              }
  }
  onEndReached(e){
    if(!this.props.messages){ return false}
    const nextPage = parseInt(this.props.messages.length / 20) + 1;
    if(this.state.fetching || nextPage == this.state.lastPage){ return false }

    this.setState({
      lastPage: nextPage,
      isRefreshing: false,
      loadingMore: true
    })

    // this.setTimeout(()=>{
    //   this.setState({
    //     loadingMore:false
    //   })
    // },3000);

    Analytics.event('Interaction',{type: 'scroll', name: 'Load more messages', page: nextPage})

    MatchActions.getMessages(this.props.match_id, nextPage);
  }

  renderNoMessages(){
    const matchInfo = this.props.currentMatch,
          theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
          them = theirIds.map((id)=> matchInfo.users[id]),
          chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ` & ` : '')  },'')

    return (
      <ScrollView
        {...this.props}
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth,height:DeviceHeight}}
        contentInset={{top:0,right:0,left:0,bottom:50}}
        automaticallyAdjustContentInsets={true}
        scrollEnabled={false}
        key={'scrollnomsgs'+this.props.user.id}
        removeClippedSubviews={true}
        onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
        onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
        style={{  alignSelf:'stretch',width:DeviceWidth,}}
      >
        <FadeInContainer delayAmount={1000} duration={1000}>

          <View style={{flexDirection:'column',justifyContent:this.state.isKeyboardOpened ? 'flex-start' : 'center',top:this.state.isKeyboardOpened ? 40 : 0,alignItems:this.state.isKeyboardOpened ? 'flex-start' : 'center',alignSelf:'stretch',flex: 1  }}>
            <View style={{width:DeviceWidth,alignSelf:this.state.isKeyboardOpened ? 'flex-start' : 'center',alignItems:'center',flexDirection:'column',justifyContent:'center' }}>

              <Text style={{color:colors.white,fontSize:20,fontFamily:'Montserrat-Bold',textAlign:'center',}} >{
                    `YOU MATCHED WITH`
              }</Text>

    					<Text style={{color:colors.white,fontSize:20,fontFamily:'Montserrat-Bold',textAlign:'center',
                }} >{
                    `${chatTitle}`
              }</Text>

            <View style={{}} >
                <TimeAgo style={{color:colors.shuttleGray, fontSize:16,fontFamily:'omnes',}} time={matchInfo.created_timestamp*1000} />
              </View>

              <Image
                source={{uri:them[0].image_url}}
                style={this.getThumbSize()}
                defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
              />
    					<Text style={{color:colors.shuttleGray,fontSize:20,textAlign:'center',fontFamily:'omnes', backgroundColor: 'transparent'}} >Say something. {
                  (them.length == 2 ? 'They\'re' : them[0].gender == 'm' ? 'He\'s' : 'She\'s')
                } already into you.</Text>
            </View>

          </View>
        </FadeInContainer>
      </ScrollView>
    )
  }


  render(){
    console.log(this.props.currentMatch);
    const matchInfo = this.props.currentMatch,
        theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
        them = theirIds.map((id)=> matchInfo.users[id]),
        chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ` & ` : '')  },'');
console.log(matchInfo);
    return (
      <View  style={[styles.chatInsideWrap,{paddingBottom:this.state.keyboardSpace}]}>
        {this.props.messages && this.props.messages.length > 0  ?
        (<ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
          onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
onEndReached={this.onEndReached.bind(this)}
          messages={this.props.messages || []}
          style={[styles.listview,{ backgroundColor:colors.outerSpace}]}
          renderScrollComponent={props => (
            <InvertibleScrollView inverted={true}
              onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
              onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
              scrollsToTop={true}
              contentContainerStyle={styles.invertedContentContainer}
              scrollEventThrottle={64}
              ref={c => {this.scroller = c}}
              key={`${this.props.match_id}x`}
              keyboardDismissMode={'interactive'}
              contentInset={{top:0,right:0,left:0,bottom:54}}
              automaticallyAdjustContentInsets={true}
              {...props}
            />
          )}

        />)
        : this.renderNoMessages()}

        <View style={styles.messageComposer}>

          <AnimatedTextInput
            multiline={true}
            autoGrow={true}
            ref={component => this._textInput = component}
            style={[styles.messageComposerInput,{
              borderBottomColor: this.state.bottomColor ? this.state.bottomColor.interpolate({
                inputRange: [0, 100],
                outputRange: [colors.shuttleGrayAnimate,colors.whiteAnimate],
              }) : colors.shuttleGray,
            }]}
            returnKeyType={'default'}
            keyboardAppearance={'dark'}
            autoCorrect={true}
            placeholder={'Type Message...'}
            placeholderTextColor={colors.shuttleGray}
            autoFocus={false}
            clearButtonMode={'never'}
            onFocus={(e)=>{
              Animated.timing(this.state.bottomColor, {
                toValue: 100,
                duration: 300
              }).start()
              this.setState({inputFocused:true})
            }}
           onBlur={(e)=>{
                Animated.timing(this.state.bottomColor, {
                  toValue: 0,
                  duration: 300,
                }).start()

                this.setState({inputFocused:false})
              }}
              onChangeText={this.onTextInputChange.bind(this)}
              >
              <Text style={{ fontSize:17, padding:1, paddingBottom:7.5, color:colors.white, }} >{
                  this.state.textInputValue || ''
              }</Text>
          </AnimatedTextInput>

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
          backgroundStyle={{backgroundColor:colors.shuttleGray}}
          onPrev={(n,p)=>{
            MatchActions.getMatches();
            n.pop()
          }}
          blur={false}
          title={chatTitle}
          titleColor={colors.white}
          customPrev={
            <View style={{flexDirection: 'row',opacity:0.5,alignItems:'center',justifyContent:'center',bottom:3,}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white,backgroundColor:'transparent'}]}>◀︎</Text>
            </View>
          }
        />
      </View>
    )
  }
}



const animations = {
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

const Chat = React.createClass({
  displayName:"Chat",
  getInitialState(){
    return ({
      isVisible: false
    })
  },
  componentWillUnmount(){
    dismissKeyboard()
    MatchActions.setAccessTime({match_id:this.props.match_id,timestamp: Date.now()})
  },
  componentDidMount(){


    // if(this.props.handle){
      // InteractionManager.clearInteractionHandle(this.props.handle)
    // }
    // MatchActions.setAccessTime.defer({match_id:this.props.match_id,timestamp: Date.now()})

  },

  toggleModal(){
    dismissKeyboard();
    this.setState({
      isVisible:!this.state.isVisible,
    })
  },

  render(){
    const storesForChat = {
      messages: (props) => {
        return {
          store: ChatStore,
          value: ChatStore.getMessagesForMatch( this.props.match_id )
        }
      },
      currentMatch: (props) => {
        return {
          store: MatchesStore,
          value: MatchesStore.getMatchInfo( this.props.match_id )
        }
      }
    };
    const inside = (props) => {

      return (
        <View>
        <ChatInside
          {...this.props}

          navigator={this.props.navigator}
          user={this.props.user}
          closeChat={this.props.closeChat}
          match_id={this.props.match_id}
          key={`chat-${this.props.user}-${this.props.match_id}`}
          toggleModal={this.toggleModal}
        />
        {this.state.isVisible ? <View
          style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]}>

           <FadeInContainer duration={300} >
             <TouchableOpacity activeOpacity={0.5} onPress={this.toggleModal}
              style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]} >

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
        </View>
      )
    };
    return __TEST__ ? inside(this.props) : (
      <AltContainer stores={storesForChat}>
      <ChatInside
        {...this.props}

        navigator={this.props.navigator}
        user={this.props.user}
        closeChat={this.props.closeChat}
        match_id={this.props.match_id}
        key={`chat-${this.props.user}-${this.props.match_id}`}
        toggleModal={this.toggleModal}
      />
      {this.state.isVisible ? <View
        style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]}>

         <FadeInContainer duration={300} >
           <TouchableOpacity activeOpacity={0.5} onPress={this.toggleModal}
            style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight}]} >

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


export default Chat;


const SIZES = {
      big:{
        dimensions:{
          closed: 200,
          open: 140,
        },
        margin:{
          closed: 40,
          open: 20,
        }
      },
      small: {
        dimensions:{
          closed: 100,
          open: 50
        },
        margin:{
          closed: 20,
          open: 10,
        }
      }
   };
