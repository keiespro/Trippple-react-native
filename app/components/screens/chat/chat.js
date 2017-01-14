import { View, Keyboard, Dimensions, Platform, Text} from 'react-native';
import React from 'react';

import reactMixin from 'react-mixin'
import {pure} from 'recompose'
import TimerMixin from 'react-timer-mixin';
import { connect } from 'react-redux';
import {withNavigation,NavigationStyles} from '@exponent/ex-navigation';
import {SlideHorizontalIOS,FloatHorizontal} from '../../../ExNavigationStylesCustom'
import ActionMan from '../../../actions/';
import ChatInside from './ChatInside'
import ThreeDotsActionButton from '../../buttons/ThreeDotsAction';
import colors from '../../../utils/colors';


//
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


@withNavigation
@reactMixin.decorate(TimerMixin)
class Chat extends React.Component {

  static route = {
    styles: Platform.select({ios: SlideHorizontalIOS, android: NavigationStyles.SlideHorizontal}),
    navigationBar: {
      visible: true,
      translucent:false,
      backgroundColor: colors.transparent,
      height:55,
      overrideStyle:{
        width:DeviceWidth,height:55,backgroundColor:'red'
      },
      style: {
        width:DeviceWidth,height:55,backgroundColor:'red'

      },
      title(params) {
        return params.title ? params.title : ''
      },
      tintColor: colors.white,
      renderRight(route, props) {
        return (
          <ThreeDotsActionButton
            fromChat
            match={props.match}
            dotColor={colors.white}
            style={{height:40,backgroundColor:colors.sushi,top:-30,alignItems:'center',alignSelf:'flex-start'}}
          />
        )

      }
    }
  }

  constructor(props) {
    super()
    this.state = {
      isVisible: props.isVisible ? JSON.parse(props.isVisible) : false
    }
  }
  componentWillMount() {
    this.props.dispatch({type: 'CHAT_IS_OPEN', payload: {match_id: this.props.match_id}})
  }
  componentDidMount() {
    this.props.dispatch(ActionMan.getMessages({match_id: this.props.match.match_id}))

    if(this.props.fromNotification){
      const matchInfo = this.props.match;
      const theirIds = Object.keys(matchInfo.users).filter((u) => u != this.props.user.id && u != this.props.user.partner_id);
      const them = theirIds.map((id) => matchInfo.users[id]);
      const chatTitle = them.reduce((acc, u, i) => { return acc + u.firstname.toUpperCase() + (them[1] && i == 0 ? ' & ' : '') }, '');
      this.setTimeout(() => {
        this.props.navigator.updateCurrentRouteParams({title: chatTitle, match: this.props.match })
      }, 1200)
    }
  }
  componentWillUnmount() {
    Keyboard.dismiss()
    this.props.dispatch(ActionMan.getNewMatches())
    this.props.dispatch(ActionMan.getMatches())
    this.props.dispatch({type: 'CHAT_IS_CLOSED', payload: {match_id: this.props.match_id}})
  }

  toggleModal() {
    Keyboard.dismiss()

     this.setState({
      isVisible: !this.state.isVisible,
    })
  }

  render() {
    return (
      <View style={{flexGrow:1,backgroundColor: colors.outerSpace,top:0}}>
        <ChatInside
          user={this.props.user}
          match={this.props.match || this.props.currentMatch}
          currentMatch={this.props.match || this.props.currentMatch}
          messages={this.props.messages}
          dispatch={this.props.dispatch}
          key={`chat-${this.props.user.id}-${this.props.match_id}`}
          pop={() => { this.props.navigator.pop() }}
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
