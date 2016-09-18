
import { View, TextInput, Animated, Dimensions } from 'react-native';
import React from 'react';

import ThreeDotsActionButton from '../../buttons/ThreeDotsAction';

import dismissKeyboard from 'dismissKeyboard'
import NoMessages from './NoMessages'
import ActionModal from '../../modals/ActionModal';
import Analytics from '../../../utils/Analytics';
import { BlurView, VibrancyView } from 'react-native-blur'
import FadeInContainer from '../../FadeInContainer';
import TimeAgo from '../../controls/Timeago';
import colors from '../../../utils/colors';
import { MagicNumbers } from '../../../utils/DeviceConfig'
import InvertibleScrollView from 'react-native-invertible-scroll-view'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
import MessageComposer from './MessageComposer'
import { connect } from 'react-redux';
import styles from './chatStyles'
import ActionMan from '../../../actions/';

import {NavigationStyles, withNavigation} from '@exponent/ex-navigation';
import ChatBubble from './ChatBubble'
import ChatInside from './ChatInside'

@withNavigation
class Chat extends React.Component {

  static route = {
    navigationBar: {
      visible: true,
      translucent:true,
      backgroundColor: colors.shuttleGrayAnimate,
      title(params) {
        let p = params || {}
        let title = p.title;
        return `${title}`
      },
      renderRight(route, props) {
        return (
          <ThreeDotsActionButton route={route} sendProps={{...props, ...route.params}} match={props.match} dotColor={colors.white}/>
        )
      }
    }
  };

  constructor(props) {
    super()
    this.state = {
      isVisible: props.isVisible ? JSON.parse(props.isVisible) : false
    }

    console.log(props);
  }
  actionModal() {}
  componentWillMount() {
    console.log(this.props)
    this.props.dispatch({type:'CHAT_IS_OPEN',payload:{match_id:this.props.match_id}})
  }
  componentDidMount() {
      console.log(this.props.navigator);
    setTimeout(()=>{
      this.props.navigator.updateCurrentRouteParams({title: this.props.match_id, match:this.props.match })

    },2000) 
  }
  componentWillUnmount() {
    dismissKeyboard()
    // MatchActions.resetUnreadCount(this.props.match_id);
    // TODO : REPLACE WITH NEW

    this.props.dispatch(ActionMan.getMatches( ))
    this.props.dispatch({type:'CHAT_IS_CLOSED',payload:{match_id: this.props.match_id}})
  }

  toggleModal() {
    dismissKeyboard();
    this.setState({
      isVisible: !this.state.isVisible,
    })
  }

  render() {

    return (
      <View>
        <ChatInside
          user={this.props.user}
          match={this.props.match || this.props.currentMatch}
          currentMatch={this.props.match || this.props.currentMatch}
          messages={this.props.messages}
          dispatch={this.props.dispatch}
          key={ `chat-${this.props.user.id}-${this.props.match_id}` }
          fromNotification={this.props.fromNotification}
         />
      </View>
    );
  }

}


const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    messages: state.messages[ownProps.match_id],
    match: state.matches[ownProps.match_id] || state.newMatches[ownProps.match_id],
    currentMatch: state.matches[ownProps.match_id] || state.newMatches[ownProps.match_id]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);



const SIZES = {
  big: {
    dimensions: {
      closed: 200,
      open: 140,
    },
    margin: {
      closed: 40,
      open: 20,
    }
  },
  small: {
    dimensions: {
      closed: 100,
      open: 50
    },
    margin: {
      closed: 20,
      open: 10,
    }
  }
};
