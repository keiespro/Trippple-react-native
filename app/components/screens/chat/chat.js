/* @flow */

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ListView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import React, {Component} from "react";
import moment from 'moment';
import dismissKeyboard from 'dismissKeyboard'

import ActionModal from '../../modals/ActionModal';
import Analytics from '../../../utils/Analytics';
import { BlurView, VibrancyView } from 'react-native-blur'
import FadeInContainer from '../../FadeInContainer';
import TimeAgo from '../../controls/Timeago';
import colors from '../../../utils/colors';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
import MessageComposer from './MessageComposer'
import { connect } from 'react-redux';

import ActionMan from  '../../../actions/';

const ChatMessage = (props) => {
    const isMessageOurs = (props.messageData.from_user_info.id === props.user.id || props.messageData.from_user_info.id === props.user.partner_id);
    var thumb = ''
    if(!isMessageOurs){
      const {from_user_info} = props.messageData;
      const {thumb_url,image_url} = from_user_info;
       thumb = (image_url)+'';
    }else{
       thumb = '';

    }

    return (
      <View style={[styles.col]} shouldRasterizeIOS={true}>
        <View style={[styles.row]}>
          <View style={{flexDirection:'column', alignItems:isMessageOurs ? 'flex-end' : 'flex-start', alignSelf: 'stretch', flex:1, justifyContent:'center',backgroundColor: props.messageData.ephemeral && __DEV__ ? colors.sushi : 'transparent'}}>
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
              >{ props.messageData.from_user_info.name.toUpperCase() }</Text>

              <Text style={[styles.messageText,{flex:1}]} >{
                props.text
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
          <TimeAgo showSent={true} style={{color:colors.shuttleGray,fontSize:10,fontFamily:'Montserrat'}} time={props.messageData.created_timestamp * 1000} />
        </View>

      </View>
    );

}





class ChatInside extends Component{
  constructor(props){
    super();

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(props.messages || []),
      isKeyboardOpened: false,
      textInputValue: '',
      fetching: false,
      lastPage: 0,
    }
  }

  componentDidMount(){
    Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardChange.bind(this));

  }
  componentWillUnmount(){
    Keyboard.removeListener('keyboardWillChangeFrame', this.onKeyboardChange.bind(this));
  }
  componentWillReceiveProps(newProps){
    if(!this.ds || !newProps.messages) {return }
    this.setState({
      dataSource: this.ds.cloneWithRows(newProps.messages)
    })
  }
onKeyboardChange(event){
  const {duration, easing, endCoordinates,startCoordinates} = event;
  this.setState({
    isKeyboardOpened: startCoordinates.screenY == DeviceHeight
  })
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
    this.props.dispatch(ActionMan.createMessage(this.state.textInputValue, this.props.match_id, timestamp))
    // TODO : REPLACE WITH NEW
    // this.props.dispatch(ActionMan.sendMessage(this.state.textInputValue, this.props.match_id, timestamp))

    // MatchActions.sendMessageToServer.defer(this.state.textInputValue, this.props.match_id)
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

  }

  renderNoMessages(){

    const matchInfo = this.props.currentMatch,
          theirIds = Object.keys(matchInfo.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id),
          them = theirIds.map((id)=> matchInfo.users[id]),
          chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ` & ` : '')  },'')

    return (
      <ScrollView
        {...this.props}
        contentContainerStyle={{backgroundColor:colors.outerSpace,width:DeviceWidth,}}
        contentInset={{top:0,right:0,left:0,bottom:50}}
        automaticallyAdjustContentInsets={true}
        scrollEnabled={false}
        key={'scrollnomsgs'+this.props.user.id}
        removeClippedSubviews={true}
        style={{  alignSelf:'stretch',width:DeviceWidth,}}
      >
      <KeyboardAvoidingView  style={{flex:1,width:DeviceWidth,height:DeviceHeight,backgroundColor:colors.outerSpace}} behavior={'padding'}>

        <FadeInContainer delayAmount={1300} duration={1000}>

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
        <MessageComposer
          textInputValue={this.state.textInputValue}
          onTextInputChange={this.onTextInputChange.bind(this)}
          sendMessage={this.sendMessage.bind(this)}
        />
      </KeyboardAvoidingView>
      </ScrollView>
    )
  }


  render(){
    const matchInfo = this.props.currentMatch;
    if(!matchInfo){
      console.log('no matchInfo');
      return <View/>
    }
    const theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
        them = theirIds.map((id)=> matchInfo.users[id]),
        chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ` & ` : '')  },'');

    return (
      <View  style={{flex:1,width:DeviceWidth,height:DeviceHeight,position:'relative',top:0}}>
      <KeyboardAvoidingView  style={{flex:1}} behavior={'padding'}>

        {this.props.messages && this.props.messages.length > 0  ?
        (<View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            onEndReached={this.onEndReached.bind(this)}
            messages={this.props.messages || []}
            style={[styles.listview,{ backgroundColor:colors.outerSpace,marginBottom:60}]}
            renderScrollComponent={props => (
              <InvertibleScrollView
                inverted={true}
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
          />
          <MessageComposer
            textInputValue={this.state.textInputValue}
            onTextInputChange={this.onTextInputChange.bind(this)}
            sendMessage={this.sendMessage.bind(this)}
          />
        </View>)
        : this.renderNoMessages()}

{/*
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
        /> */}
      </KeyboardAvoidingView></View>
    )
  }
}




const Chat = React.createClass({
  displayName:"Chat",
  getInitialState(){
    return ({
      isVisible: this.props.isVisible ? JSON.parse(this.props.isVisible) : false
    })
  },
  componentWillUnmount(){
    dismissKeyboard()
    // MatchActions.resetUnreadCount(this.props.match_id);
    // TODO : REPLACE WITH NEW

  },
  componentDidMount(){
  },

  toggleModal(){
    dismissKeyboard();
    this.setState({
      isVisible:!this.state.isVisible,
    })
  },

  render(){

    return  (
      <View>
      <ChatInside
        {...this.props}

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
    );
  }

});


 const mapStateToProps = (state, ownProps) => {
  console.log('state',state,'ownProps',ownProps); // state
  return {
    ...ownProps,
    user: state.user,
    messages: state.messages[ownProps.match_id],
    currentMatch: state.matches[ownProps.match_id]
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);



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

   const styles = StyleSheet.create({
     container: {

       backgroundColor: colors.white,
       paddingTop: 0,
       paddingBottom:50
     },
     chatContainer: {

       margin: 0,
       flexDirection: 'column',
       // alignItems: '  stretch',
       alignSelf: 'stretch',
       backgroundColor:colors.dark,

       // bottom: 50,
       // top:60
     },
     messageList: {

       flexDirection: 'column',
       alignSelf: 'stretch',
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
     messageTitle: {
       fontFamily: 'Montserrat',
       color: colors.shuttleGray,
       fontSize: 12,
       marginBottom: 5
     },

     chatInsideWrap:{
       flexDirection:'column',
       alignItems:'flex-end',
       alignSelf:'stretch',
       flex:1,
       backgroundColor: colors.dark,

       position:'relative',
       height:DeviceHeight,
         width:DeviceWidth,
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
       // alignSelf:'stretch',
       // bottom:80,
       flex:1,
       width:DeviceWidth,
     },
     invertedContentContainer:{
       backgroundColor:colors.outerSpace,
       justifyContent:'center',
       width:DeviceWidth,
     }
   });
