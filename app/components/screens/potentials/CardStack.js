import React from "react";
import { StyleSheet, Text, View, AppState, Easing, LayoutAnimation, TouchableHighlight, Image, Animated, PanResponder, Dimensions } from "react-native";
import Analytics from '../../../utils/Analytics';
import Card from './Card';
import styles from './styles';
import ActionMan from '../../../actions/';

const THROW_THRESHOLD_DENY = -50;
const THROW_THRESHOLD_APPROVE = 50;
const SWIPE_THRESHOLD_APPROVE = 200;
const SWIPE_THRESHOLD_DENY = -200;
const THROW_SPEED_THRESHOLD = 0.07;
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


class CardStack extends React.Component {

  static displayName = 'CardStack';

  constructor(props) {
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
    }).start((fin) => {
      this.initializePanResponder();
      this.setState({ animatedIn: true });
    });
  }


  componentWillReceiveProps(nProps) {
    if (nProps && this.state.animatedIn && this.props.potentials && this.props.potentials[0].user.id !== nProps.potentials[0].user.id) {
      this.state.pan.setValue({ x: 0, y: 0 });
        // this.initializePanResponder()
    }
    if (nProps && !this.state.animatedIn && !nProps.potentials.length) {
      this.state.offsetY.setValue(0);
        // this.initializePanResponder()
    }

    this.setState({ interactedWith: null });
  }

  componentDidUpdate(pProps, prevState) {
    if (!this.state.animatedIn && this.state.animatedIn) {
      this.initializePanResponder();
    }
    if (pProps.potentials && pProps.potentials.length && pProps.potentials[0].user.id !== this.props.potentials[0].user.id) {
      // LayoutAnimation.configureNext(animations.layout.spring);

    }
  }

  initializePanResponder() {
    delete this._panResponder;

    const isCouple = this.props.user.relationship_status === 'couple';
    function isVertical(g) {
      return Math.abs(g.dx) > 0 && Math.abs(g.dy) < 5;
    }
    this._panResponder = PanResponder.create({

      onMoveShouldSetPanResponderCapture: (e, gestureState) => false,

      onMoveShouldSetPanResponder: (e, gestureState) => !this.props.profileVisible && (isCouple || true),

      onStartShouldSetPanResponder: (e, gestureState) => !this.props.profileVisible && isCouple,

      onStartShouldSetPanResponderCapture: (e, gestureState) => false,

      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
      }]),

      onPanResponderReject: (e, gestureState) => {
        // console.log('onPanResponderReject',gestureState)
      },
      onPanResponderTerminate: (e, gestureState) => {
        // console.log('onPanResponderTerminate',gestureState)
      },
      onPanResponderTerminationRequest: (e, gestureState) => {
        // console.log('onPanResponderTerminationRequest',gestureState)
      },
      onPanResponderGrant: (e, gestureState) => {
        // console.log('onPanResponderGrant',gestureState)
      },
      onPanResponderStart: (e, gestureState) => {
        // console.log('onPanResponderStart',gestureState)
      },
      onPanResponderEnd: (e, gestureState) => {
        // console.log('onPanResponderEnd',gestureState)
      },

      onPanResponderRelease: (e, gestureState) => {
        let toValue = 0;
        let velocity = 1;
        let likeStatus;

        const { dx, dy, vx, vy } = gestureState;

        // __DEV__ && console.table([gestureState])
        const likeUserId = this.props.potentials[0].user.id;

        // animate back to center or off screen left or off screen right
        if (dx > SWIPE_THRESHOLD_APPROVE || (dx > (THROW_THRESHOLD_APPROVE - 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          toValue = { x: DeviceWidth + 100, y: dy * 2 };
          velocity = { x: parseInt(vx), y: parseInt(vy) };
          likeStatus = 'approve';

          if (!this.state.likedPotentials.indexOf(likeUserId)) {
            likeStatus = null;
          }
        } else if (dx < SWIPE_THRESHOLD_DENY || (dx < (THROW_THRESHOLD_DENY + 0) && Math.abs(vx) > THROW_SPEED_THRESHOLD)) {
          toValue = { x: -DeviceWidth - 100, y: dy * 2 };
          velocity = { x: parseInt(vx), y: parseInt(vy) };
          likeStatus = 'deny';
        } else {
          // nothing!
        }

        if (!likeUserId) {

        } else if (likeStatus && likeStatus.length > 0) {
          this.setState({ interactedWith: likeUserId, likedPotentials: [...this.state.likedPotentials, likeUserId] });
        }

        if (likeStatus) {
          const relstatus = this.props.rel === 'single' ? 'couple' : 'single';
          const otherParams = { relevantUser: this.props.potentials[0] };
          this.props.dispatch(ActionMan.sendLike(likeUserId, likeStatus, relstatus, this.props.rel, otherParams));

          Animated.timing(this.state.pan, {
            toValue,
            velocity: { x: 0, y: 0 },
            duration: 700,
            easing: Easing.out(Easing.exp),
          }).start();
        } else {
          Animated.spring(this.state.pan, {
            toValue,
            velocity: { x: parseInt(vx), y: parseInt(vy) },
            tension: 20,
            friction: 7,
          }).start();
        }
      },
    });
  }

  _showProfile(potential) {
    Analytics.event('Interaction', { type: 'tap', name: 'Open card profile', potential });
    this.props.toggleProfile(potential);
  }

  _hideProfile() {
    this.props.toggleProfile();
    this.state.pan.setValue({ x: 0, y: 0 });
  }

  _toggleProfile() {
    this.props.toggleProfile();
    this.state.pan.setValue({ x: 0, y: 0 });
  }

  render() {
    const { potentials, user } = this.props;

    if (this.state.animatedIn && !this._panResponder.panHandlers) {
      this.initializePanResponder();
    }
    const pan = this.state.pan || 0;
    return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: undefined,
            height: undefined,
            flex: 1,
            alignSelf: 'stretch',
            right: 0,
            bottom: 0,
            alignItems: 'center',
          }}
        >

        { potentials && potentials.length >= 1 && potentials[1] &&
          <Animated.View
            style={[styles.shadowCard,
              {
                alignSelf: 'center',
                left: this.props.profileVisible ? 0 : 20,
                right: this.props.profileVisible ? 0 : 20,
                borderRadius: this.props.profileVisible ? 0 : 8,
                bottom: this.props.profileVisible ? 0 : 75,
                position: 'absolute',
                overflow: 'hidden',
                top: 0,
              },
              {
                transform: [
                  {
                    scale: this.state.animatedIn ?
                    (~~this.props.profileVisible || this.state.pan.x.interpolate({
                      inputRange: [-400, -250, -100, 0, 100, 250, 400],
                      outputRange: [1.00, 0.97, 0.9, 0.9, 0.9, 0.97, 1.00],
                      extrapolate: 'clamp',
                    })) : this.state.offsetY,
                  },
                ],
                opacity: this.state.animatedIn ? this.state.pan.x.interpolate({
                  inputRange: [-500, -200, -50, 0, 50, 200, 500],
                  outputRange: [0.99, 0.55, 0.05, 0.1, 0.05, 0.55, 0.99],
                  extrapolate: 'clamp',
                }) : 0,
              }]
            }
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
              potential={potentials[1]}
            />
            </Animated.View>
          }

        { potentials && potentials[0] &&
          <Animated.View
            style={[styles.shadowCard, {
              alignSelf: 'center',
              top: this.props.profileVisible ? -50 : 0,
              left: this.props.profileVisible ? 0 : 20,
              right: this.props.profileVisible ? 0 : 20,
              borderRadius: 8,
              bottom: this.props.profileVisible ? 0 : 75,
              position: 'absolute',
              overflow: 'hidden',
              opacity: this.state.offsetY,
              transform: [
                {
                  translateX: this.state.pan ? this.state.pan.x : 0,
                },
                {
                  rotate: this.state.pan.x.interpolate({
                    extrapolate: 'clamp',
                    inputRange: [-DeviceWidth, -100, 0, 100, DeviceWidth / 2, DeviceWidth],
                    outputRange: ["-0.1rad", "0rad", "0rad", "0rad", "0.1rad", "0.0rad"],
                  }),
                },
                {
                  translateY: this.state.animatedIn ? this.state.pan.y.interpolate({
                    inputRange: [-300, 0, 300],
                    outputRange: [-300, 0, 300],
                    extrapolate: 'clamp',
                  }) : this.state.offsetY,
                },
                {
                  scale: this.state.animatedIn ?
                  (~~this.props.profileVisible || this.state.pan.x.interpolate({
                    inputRange: [-300, -250, -90, 0, 90, 250, 300],
                    outputRange: [0.98, 0.98, 1, 1, 1, 0.98, 0.98],
                  })) : this.state.offsetY.interpolate({
                    inputRange: [0, 0.9, 1],
                    outputRange: [0.9, 1.0, 0.98],
                  }),
                },
              ],
            }]}
            key={`${potentials[0].id || potentials[0].user.id}-wrapper`}
            ref={(card) => { this.card = card; }}
            { ...this._panResponder.panHandlers}
          >
          <Card
            user={user}
            navigator={this.props.navigator}
            key={`${potentials[0].id || potentials[0].user.id}-activecard`}
            rel={user.relationship_status}
            isTopCard={true}
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
      </View>
    );
  }
}

export default CardStack;
