import { View, TextInput, ListView, Keyboard, Animated, Dimensions, KeyboardAvoidingView, } from 'react-native';
import React, {Component} from "react";
import moment from 'moment';
import styles from './chatStyles'
import _ from 'lodash'
import dismissKeyboard from 'dismissKeyboard'
import NoMessages from './NoMessages'
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
import emojiCheck from '../../../utils/emoji-regex';
import ActionMan from '../../../actions/';
import ChatBubble from './ChatBubble'


const shouldMakeBigger = (msg) => {
  if(msg.length > 9 || msg.length == 0)return false;
  return emojiCheck().test(msg)
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
    this.props.dispatch({type:'MARK_CHAT_READ', payload: {match_id: this.props.match.match_id}})
  }
  componentWillUnmount(){
    Keyboard.removeListener('keyboardWillChangeFrame', this.onKeyboardChange.bind(this));
    this.props.dispatch({type:'MARK_CHAT_READ', payload: {match_id: this.props.match.match_id}})
  }
  componentWillReceiveProps(newProps){
    __DEV__ && console.log('newProps.messages',newProps);

    if(this.props.match && !newProps.match){
     this.props.pop();
    }
    if(!this.ds || !newProps.messages) {return }
    this.setState({
      dataSource: this.ds.cloneWithRows(_.sortBy(newProps.messages, (msg) => msg.created_timestamp ).reverse())
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
      <ChatBubble
          specialText={shouldMakeBigger(rowData.message_body) ? 40 : null}
          user={this.props.user}
          messageData={rowData}
          key={`${rowID}-msg`}
          text={rowData.message_body}
          pic={rowData.from_user_info.thumb_url}
      />
    )
  }

  sendMessage(msg){
    const timestamp = moment().utc().unix();
    this.props.dispatch(ActionMan.createMessage(msg, this.props.match.match_id, timestamp))
    this.refs.scroller && this.refs.scroller.scrollTo({x:0,y:0})

  }

  onTextInputChange(text){
    this.setState({
      textInputValue: text
    })
  }


  getThumbSize(){

    let size = MagicNumbers.is4s ? SIZES.small : SIZES.big
    return {
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

    Analytics.event('Interaction',{type: 'scroll', name: 'Load more messages', page: nextPage})

  }


  render(){
    const matchInfo = this.props.currentMatch || this.props.matchInfo;
    if(!matchInfo){
      console.log('no matchInfo');
      return <View/>
    }
    const theirIds = Object.keys(matchInfo.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id),
      them = theirIds.map((id)=> matchInfo.users[id]),
      chatTitle = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ` & ` : '') },'');

    return (
      <View style={{flex:1,width:DeviceWidth,height:DeviceHeight,position:'relative',top:0}}>
          <KeyboardAvoidingView style={{flex:1}} behavior={'padding'}>

              {this.props.messages && this.props.messages.length > 0 ?
                  (<View style={{flex:1,justifyContent:'space-between',alignItems:'center',flexDirection:'column'}}>
                      <ListView
                          dataSource={this.state.dataSource}
                          renderRow={this._renderRow.bind(this)}
                          onEndReached={this.onEndReached.bind(this)}
                          messages={this.props.messages || []}
                          style={[styles.listview,{ backgroundColor:colors.outerSpace,marginBottom:0,marginTop:3}]}
                          renderScrollComponent={props => (
                              <InvertibleScrollView
                                  inverted={true}
                                  scrollsToTop={true}
                                  contentContainerStyle={styles.invertedContentContainer}
                                  scrollEventThrottle={16}
                                  indicatorStyle={'white'}
                                  ref={c => {this.scroller = c}}
                                  key={`${this.props.match_id}x`}
                                  keyboardDismissMode={'interactive'}
                                  contentInset={{top:0,right:0,left:0,bottom:60}}
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
                  : <NoMessages
                      {...this.props}
                      textInputValue={this.state.textInputValue}
                      onTextInputChange={this.onTextInputChange.bind(this)}
                      sendMessage={this.sendMessage.bind(this)}
                      isKeyboardOpened={this.state.isKeyboardOpened}
                    />}

          </KeyboardAvoidingView></View>
    )
  }
}


export default ChatInside
