
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

import ChatBubble from './ChatBubble'
import ChatInside from './ChatInside'


class Chat extends React.Component {

  static route = {
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      title(params) {
        return `${params.title}`
      },

      renderRight(route, props) {
        console.log(route,props)
        return (
          <ThreeDotsActionButton route={route} {...props} dotColor={colors.white}/>
        )
      }
    }
  };

  constructor(props) {
    super()
    this.state = {
      isVisible: props.isVisible ? JSON.parse(props.isVisible) : false
    }
  }
  actionModal() {}
  componentDidMount() {}
  componentWillUnmount() {
    dismissKeyboard()
    // MatchActions.resetUnreadCount(this.props.match_id);
    // TODO : REPLACE WITH NEW

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
          {...this.props}
          key={ `chat-${this.props.user}-${this.props.match_id}` }
          toggleModal={  this.toggleModal }
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
    currentMatch: state.matches[ownProps.match_id]
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
