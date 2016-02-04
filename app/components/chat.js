/* @flow */

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  InteractionManager,
  Image,
  TextInput,
  TouchableHighlight,
  ListView,
  LayoutAnimation,
  TouchableOpacity,
  ScrollView,
  Animated,
  PixelRatio,
  Easing,
  Dimensions
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../DeviceConfig'

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
import Log from '../Log';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

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
    marginRight: MagicNumbers.is4s ? 0 : 10,
  },
  ourMessage:
  {
    marginLeft: MagicNumbers.is4s ? 0 : 10,
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
    backgroundColor: colors.dark,
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
    borderRadius:MagicNumbers.is4s ? 20 : 24,
    width: MagicNumbers.is4s ? 40 : 48,
    height:MagicNumbers.is4s ? 40 :  48,
    position:'relative',
    marginHorizontal:MagicNumbers.is4s ?  0 : 5,
    marginRight: 5
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
  },
  invertedContentContainer:{
    backgroundColor:colors.outerSpace,
    justifyContent:'flex-end',
    width:DeviceWidth,
    overflow:'hidden'
  }
});

class ChatMessage extends React.Component {
  constructor(props){

    super();
  }

  render() {
    const isMessageOurs = (this.props.messageData.from_user_info.id === this.props.user.id || this.props.messageData.from_user_info.id === this.props.user.partner_id);
    if(!isMessageOurs){
      var {thumb_url,image_url} = this.props.messageData.from_user_info;

      /*
       * TODO:
       * this deals with test bucket urls
       * but not very maintainable
       */

      var thumb;
      var img = (thumb_url && typeof thumb_url === 'string' ? thumb_url : image_url);
      if(img && img.includes('test')){
        var u = img;
        var x = u.split('/test/')[0].split('uploads') + u.split('test')[1];
        thumb = x.split('/images')[0] + x.split('/images')[1]
      }else{
        thumb = img+'';
      }



    }
    return (
      <View style={[styles.col]}>
        <View style={[styles.row]}>
          <View style={{flex:1,position:'relative',alignSelf:'stretch',alignItems:'center',flexDirection:'row', justifyContent:'center',backgroundColor: this.props.messageData.ephemeral && __DEV__ ? colors.sushi : 'transparent'}}>

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
              style={{left:1,width:10,height:22}}
            /> : null
          }

            <View style={[styles.bubble,(isMessageOurs ? styles.ourMessage : styles.theirMessage),{alignSelf:'stretch'}]}>

              <Text style={[styles.messageText, styles.messageTitle,
                    {color: isMessageOurs ? colors.shuttleGray : colors.lavender, fontFamily:'Montserrat'} ]}
              >{ this.props.messageData.from_user_info.name.toUpperCase() }</Text>

              <Text style={styles.messageText} >{
                this.props.text
              }</Text>

            </View>

            {isMessageOurs ?
              <Image
                resizeMode={Image.resizeMode.contain}
                source={{uri: 'assets/TriangleDark@3x.png'}}
                style={{right:0,width:10,height:22}}
              /> : null
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
    var h = frames.startCoordinates && frames.startCoordinates.screenY - frames.endCoordinates.screenY || frames.end && frames.end.height
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
    if(prevProps.messages.length !== this.props.messages.length){
    }
    // this.refs.scroller && this.refs.scroller.refs.listviewscroll.scrollTo(0,0)
  }

  componentWillReceiveProps(newProps){
    if(!this.ds) {return }
    this.setState({
      dataSource: this.ds.cloneWithRows(newProps.messages)
    })
  }

  saveToStorage(){
    AsyncStorage.setItem('ChatStore', alt.takeSnapshot(ChatStore))
      .catch((error) => {Log('AsyncStorage error: ' + error.message)})
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
    this.refs.scroller && this.refs.scroller.refs.listviewscroll.scrollTo(0,0)

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

   const sizes = {
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
    let size =  MagicNumbers.is4s ? sizes.small : sizes.big

    return  {
                width:this.state.isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
                height:this.state.isKeyboardOpened ? size.dimensions.open : size.dimensions.closed,
                borderRadius:this.state.isKeyboardOpened ? size.dimensions.open/2 : size.dimensions.closed/2,
                marginVertical:this.state.isKeyboardOpened ? size.margin.open : size.margin.closed,
                backgroundColor:colors.dark
              }
  }

  renderNoMessages(){
    const matchInfo = this.props.currentMatch,
          theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id),
          them = theirIds.map((id)=> matchInfo.users[id]),
          chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },'')

    return (
      <ScrollView
        {...this.props}
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth,height:DeviceHeight,paddingBottom:this.state.keyboardSpace,flex:1}}
        contentInset={{top:0,right:0,left:0,bottom:50}}
        automaticallyAdjustContentInsets={true}
        scrollEnabled={false}
        removeClippedSubviews={true}
        onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
        onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
        style={{ backgroundColor:colors.outerSpace, flex:1, alignSelf:'stretch', width:DeviceWidth, height:DeviceHeight,paddingBottom:this.state.keyboardSpace}}
        >
        <FadeInContainer delayRender={true} delayAmount={500} duration={1200} >
          <View style={{flexDirection:'column',justifyContent:'center',flex:1,height:DeviceHeight,paddingBottom:this.state.keyboardSpace,alignItems:'center',alignSelf:'stretch'}}>
          <View style={{width:DeviceWidth,alignSelf:'center',alignItems:'center',flexDirection:'column',justifyContent:'center',flex:1,}}>
          <Text style={{color:colors.white,fontSize:22,opacity:this.state.isKeyboardOpened ? 0 : 1,fontFamily:'Montserrat-Bold',textAlign:'center',}} >{
                `YOU MATCHED WITH`
            }</Text>
            <Text style={{color:colors.white,fontSize:22,fontFamily:'Montserrat-Bold',textAlign:'center',
            opacity:this.state.isKeyboardOpened ? 0 : 1}} >{
                `${chatTitle}`
            }</Text>
            <Text style={{color:colors.shuttleGray,
              fontSize:20,fontFamily:'omnes',opacity:this.state.isKeyboardOpened ? 0 : 1}} >
              <TimeAgo time={matchInfo.created_timestamp*1000} />
            </Text>



            <Image
              source={{uri:them[1].image_url}}
              style={this.getThumbSize()}
              defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            />
            <Text style={{color:colors.shuttleGray,fontSize:20,textAlign:'center',fontFamily:'omnes'}} >Say something. {
              (them.length == 2 ? 'They\'re' : them[0].gender == 'm' ? 'He\'s' : 'She\'s')
            } already into you.</Text>
          </View>

          </View>
        </FadeInContainer>
      </ScrollView>
    )
  }

  render(){
    const matchInfo = this.props.currentMatch,
        theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id),
        them = theirIds.map((id)=> matchInfo.users[id]),
        chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },'');

    return (
      <View ref={'chatscroll'} style={[styles.chatInsideWrap,{paddingBottom:this.state.keyboardSpace}]}>
        {this.props.messages.length > 0 ?
        <ListView
          ref={'scroller'}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          messages={this.props.messages || []}
          style={styles.listview}
          renderScrollComponent={(props) =>{
            return (
              <InvertibleScrollView
                inverted={true}
                onKeyboardWillShow={this.updateKeyboardSpace.bind(this)}
                onKeyboardWillHide={this.resetKeyboardSpace.bind(this)}
                scrollsToTop={true}
                contentContainerStyle={styles.invertedContentContainer}
                {...this.props}
                scrollEventThrottle={64}
                contentInset={{top:0,right:0,left:0,bottom:54}}
                automaticallyAdjustContentInsets={true}
                style={{ height:DeviceHeight,backgroundColor:colors.outerSpace}}
                keyboardDismissMode={'interactive'}
              />
            )
          }}
        />
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
            <View style={{ }}>
              <Text style={{ fontSize:17, padding:1, paddingBottom:7.5, color:colors.outerSpace, }} >{
                  this.state.textInputValue || ' '
              }</Text>
            </View>
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
            <View style={{flexDirection: 'row',opacity:0.5,top:7}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
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
  getInitialState(){
    return ({
      isVisible: false
    })
  },
  componentWillUnmount(){
    MatchActions.setAccessTime.defer({match_id:this.props.match_id,timestamp: Date.now()})
  },
  componentDidMount(){
    MatchActions.getMessages(this.props.match_id)

    if(this.props.handle){
      InteractionManager.clearInteractionHandle(this.props.handle)
    }
    MatchActions.setAccessTime.defer({match_id:this.props.match_id,timestamp: Date.now()})

  },

  toggleModal(){
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
    }

    return (
      <AltContainer stores={storesForChat}>
        <ChatInside
          navigator={this.props.navigator}
          user={this.props.user}
          closeChat={this.props.closeChat}
          match_id={this.props.match_id}
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
