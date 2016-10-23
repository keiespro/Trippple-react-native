import React from 'react';
import { StatusBar, View, Easing, Image, Animated, PanResponder, Dimensions, InteractionManager, Platform } from 'react-native';
import { NavigationActions } from '@exponent/ex-navigation'

import {pure} from 'recompose'
import Analytics from '../../../utils/Analytics';
import Card from './Card';
import styles from './styles';
import ActionMan from '../../../actions/';
import ApproveIcon from './ApproveIcon'
import DenyIcon from './DenyIcon'
import Router from '../../../Router'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const iOS = Platform.OS == 'ios';

const THROW_THRESHOLD_DENY = -1 * (10);
const THROW_THRESHOLD_APPROVE = 10;
const THROW_SPEED_THRESHOLD = 1;

const SWIPE_THRESHOLD_DENY = -180;
const SWIPE_THRESHOLD_APPROVE = 140;

// @pure
class CardStack extends React.Component {

  static displayName = 'CardStack';

  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
      animatedIn: false,
      offsetY: new Animated.Value(0),
      likedPotentials: [],
    };
  }

  componentWillMount() {
    this._panResponder = {};
  }

  componentDidMount() {
    Animated.timing(this.state.offsetY, {
      toValue: 1,
      duration: 300,
      delay: 150,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      this.initializePanResponder();
      this.setState({ animatedIn: true });
    });
  }

  componentWillReceiveProps(nProps) {
    if (nProps && this.state.animatedIn && this.props.potentials && this.props.potentials[0].user.id !== nProps.potentials[0].user.id) {
      this.state.pan.setValue({ x: 0, y: 0 });
      this.initializePanResponder()
    }
    if (nProps && !this.state.animatedIn && !nProps.potentials.length) {
      this.state.offsetY.setValue(0);
        // this.initializePanResponder()
    }

        // this.setState({ interactedWith: null });
  }

  initializePanResponder() {
    delete this._panResponder;

    const isCouple = this.props.user.relationship_status === 'couple';
    const openProfile = (p) => {
      this.killPanResponder()
      this.props.navigator.push(Router.getRoute('UserProfile', {
        potential: p,
        user: this.props.user
      }))
    };

    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: () => false,

      onMoveShouldSetPanResponder: (e) => {
        console.log(e.nativeEvent);

        // if(e.nativeEvent.locationY > DeviceHeight - 160){
        //   openProfile(this.props.potentials[0]);
        //   return false;
        // }

        return !this.props.profileVisible && (isCouple || true)
      },

      onStartShouldSetPanResponder: (e) => {
        console.log(e.nativeEvent);
        if(e.nativeEvent.locationY > DeviceHeight - 160 && !this.props.profileVisible){
          openProfile(this.props.potentials[0]);
          return false;
        }

        return !this.props.profileVisible && isCouple
      },

      onStartShouldSetPanResponderCapture: () => false,

      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
        useNativeDriver: !iOS
      }]),

      // onPanResponderReject: (e, gestureState) => {
      //   console.log('onPanResponderReject',gestureState)
      // },
      // onPanResponderTerminate: (e, gestureState) => {
      //   console.log('onPanResponderTerminate',gestureState)
      // },
      // onPanResponderTerminationRequest: (e, gestureState) => {
      //   console.log('onPanResponderTerminationRequest',gestureState)
      // },
      // onPanResponderGrant: (e, gestureState) => {
      //   console.log('onPanResponderGrant',gestureState)
      // },
      // onPanResponderStart: (e, gestureState) => {
      //   console.log('onPanResponderStart',gestureState)
      // },
      //
      // onPanResponderEnd: (e, gestureState) => {
      //   console.log('onPanResponderEnd',gestureState)
      // },

      onPanResponderRelease: (e, gestureState) => {
        let toValue = {x: 0, y: 0};
        let velocity = 1;
        let likeStatus;

        const { dx, dy, vx, vy } = gestureState;

        const likeUserId = this.props.potentials[0].user.id;

        // animate back to center or off screen left or off screen right
        if (dx > SWIPE_THRESHOLD_APPROVE || (dx > (THROW_THRESHOLD_APPROVE - 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          __DEV__ && console.log(dx > SWIPE_THRESHOLD_APPROVE ? 'SWIPE' : (dx > (THROW_THRESHOLD_APPROVE - 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD) && 'THROW');

          toValue = { x: DeviceWidth + 100, y: dy };
          velocity = { x: parseInt(vx), y: parseInt(vy) };
          likeStatus = 'approve';

          if (!this.state.likedPotentials.indexOf(likeUserId)) {
            likeStatus = null;
          }
        } else if (dx < SWIPE_THRESHOLD_DENY || (dx < (THROW_THRESHOLD_DENY + 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          toValue = { x: -DeviceWidth - 100, y: dy };
          velocity = { x: vx, y: vy };
          likeStatus = 'deny';
        } else {
          // nothing!
        }

        // if (!likeUserId) {
        //
        // } else if (likeStatus && likeStatus.length > 0) {
        //
        // }

        if (likeStatus) {
          const relstatus = this.props.rel === 'single' ? 'couple' : 'single';
          const otherParams = { relevantUser: this.props.potentials[0] };
          if (!this.props.potentials[0].starter){
            // this.props.dispatch(ActionMan.sendLike(likeUserId, likeStatus, relstatus, this.props.rel, otherParams));
          } else {
            this.props.dispatch({type: 'SEND_LIKE_FULFILLED', payload: {relevantUser: this.props.potentials[0], like_status: likeStatus }});
          }

          Animated.timing(this.state.pan, {
            toValue,
            duration: 120,
            easing: Easing.inOut(Easing.ease),
            deceleration: 1.1,
            velocity: velocity || { x: 1, y: 1 },
            useNativeDriver: !iOS
          }).start(() => {
            if (!this.props.potentials[0].starter){
              // InteractionManager.runAfterInteractions(() => {
                // this.props.dispatch(ActionMan.sendLike(likeUserId, likeStatus, relstatus, this.props.rel, otherParams));

                // this.setState({
                //     interactedWith: likeUserId,
                //     likedPotentials: [...this.state.likedPotentials, likeUserId]
                // });

              // })
            }
          });

          if (!this.props.potentials[0].starter){
            InteractionManager.runAfterInteractions(() => {
              this.props.dispatch(ActionMan.sendLike(likeUserId, likeStatus, relstatus, this.props.rel, otherParams));
            });
          }
        } else {
          Animated.timing(this.state.pan, {
            toValue,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: !iOS
            // velocity: { x: (vx)*2, y: (vy)*2 },
            // tension: 20,
            // friction: 5,
          }).start();
        }
      },
    });
  }

  _showProfile(potential) {
    Analytics.event('Interaction', { type: 'tap', name: 'Open card profile', potential });
    // this.props.toggleProfile(potential);
    this.props.dispatch({type: 'OPEN_PROFILE', payload: {}});
  }

  _hideProfile() {
    this.props.toggleProfile();
    this.state.pan.setValue({ x: 0, y: 0 });
  }

  _toggleProfile() {
    this.props.toggleProfile();
    this.state.pan.setValue({ x: 0, y: 0 });
  }
  killPanResponder(){

    console.log(this._panResponder,PanResponder);
    // this._panResponder = {
    //   panHandlers: {
    //     noop: ''
    //   }
    // }
  }

  render() {
    const { potentials, user } = this.props;

    if (this.state.animatedIn && !this._panResponder.panHandlers) {
      this.initializePanResponder();
    }
    if (potentials && potentials.length > 1 && potentials[1]){
      const nextUp = potentials[1];
      if (nextUp.user.image_url){
        Image.prefetch(nextUp.user.image_url);
      }
    }
    return (
      <View
        pointerEvents={'box-none'}
        style={{
          flex: 10,
          alignSelf: 'stretch',
          alignItems: 'center',
          top: 0,
          overflow: 'visible',
          bottom: 0,
          paddingTop: 0,
        }}
        toggleProfile={this._toggleProfile.bind(this)}
      >
        {this.props.profileVisible &&
          <StatusBar animated barStyle="light-content" />
        }
        <View
          style={{
            height: this.props.profileVisible ? 0 : 40,
            width:DeviceWidth,
          }}
          pointerEvents={this.props.profileVisible ? 'box-none' : 'none'}
        />
        { potentials && potentials.length >= 1 && potentials[1] &&
          <Animated.View
            style={[styles.shadowCard, {
              alignSelf: 'center',
              borderRadius: 8,
              // bottom: this.props.profileVisible ? 0 : 75,
              position: 'absolute',
              overflow: 'hidden',
              opacity: this.state.animatedIn ? this.state.pan.x.interpolate({
                inputRange: [-500, -200, -50, 0, 50, 200, 500],
                outputRange: [0.99, 0.55, 0.05, 0.1, 0.05, 0.55, 0.99],
                extrapolate: 'clamp',
              }) : this.state.offsetY,
              transform: [
                {
                  scale: this.state.animatedIn ? (~~this.props.profileVisible || this.state.pan.x.interpolate({
                    inputRange: [-400, -250, -100, 0, 100, 250, 400],
                    outputRange: [0.915, 0.87, 0.85, 0.80, 0.85, 0.87, 0.915],
                    extrapolate: 'clamp',
                  })) : this.state.offsetY,
                },
              ],
            }]}
            key={`${potentials[1].id || potentials[1].user.id}-wrapper`}
            ref={(card) => { this.card = card; }}
          >
            <Card
              user={user}
              key={`${potentials[1].id || potentials[1].user.id}-activecard`}
              rel={user.relationship_status}
              isTopCard={false}
              pan={this.state.pan}
              animatedIn={this.state.animatedIn}
              profileVisible={false}
              dispatch={this.props.dispatch}
              potential={potentials[1]}
            />
          </Animated.View>
            }

        { potentials && potentials[0] &&
        <Animated.View  pointerEvents={!this.props.profileVisible ? 'box-only' : 'auto'}
          style={[{
            alignSelf: 'center',
            borderRadius: 11,
            backgroundColor:'red',
            overflow: this.props.profileVisible ? 'hidden' : 'hidden',
            marginHorizontal: 0,
            transform: [
              {
                translateX: this.state.pan ? this.state.pan.x : 0,
              },
              {
                translateY: this.state.animatedIn ? this.state.pan.y.interpolate({
                  inputRange: [-300, 0, 300],
                  outputRange: [-300, 0, 300],
                  extrapolate: 'clamp',
                }) : this.state.offsetY,
              },
              {
                scale: 0.92
              },
            ],
          }]}
          key={`${potentials[0].id || potentials[0].user.id}-wrapper`}
          ref={(card) => { this.card = card; }}
          {...this._panResponder.panHandlers}
        >
          <Card
            user={user}
            navigator={this.props.navigator}
            key={`${potentials[0].id || potentials[0].user.id}-activecard`}
            rel={user.relationship_status}
            isTopCard
            pan={this.state.pan}
            animatedIn={this.state.animatedIn}
            profileVisible={this.props.profileVisible}
            hideProfile={this._hideProfile.bind(this)}
            toggleProfile={this._toggleProfile.bind(this)}
            showProfile={this._showProfile.bind(this)}
            potential={potentials[0]}
            dispatch={this.props.dispatch}
          />
        </Animated.View>
      }
        <DenyIcon pan={this.state.pan}/>
        <ApproveIcon pan={this.state.pan}/>

      </View>
    );
  }
}

export default CardStack;
