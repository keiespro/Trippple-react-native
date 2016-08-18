import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React from 'react';

import dismissKeyboard from 'dismissKeyboard'
import NoMessages from './NoMessages'
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
import styles from './chatStyles'
import ActionMan from  '../../../actions/';

import ChatBubble from './ChatBubble'
import ChatInside from './ChatInside'




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
    currentMatch: ownProps.matchInfo
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
