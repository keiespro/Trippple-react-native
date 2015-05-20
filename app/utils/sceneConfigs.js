'use strict';

var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');

var buildStyleInterpolator = require('buildStyleInterpolator');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

//
//
// var FadeIn = {
//   opacity: {
//     from: 0,
//     to: 1,
//     min: 0.5,
//     max: 1,
//     type: 'linear',
//     extrapolate: false,
//     round: 100,
//   },
// };
//
// var FadeOut = {
//   opacity: {
//     from: 1,
//     to: 0,
//     min: 0,
//     max: 0.5,
//     type: 'linear',
//     extrapolate: false,
//     round: 100,
//   },
// };

var ToTheLeft = {
  transformTranslate: {
    from: {x: 0, y: 0, z: 0},
    to: {x: -Dimensions.get('window').width, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  opacity: {
    value: 1.0,
    type: 'constant',
  },

  translateX: {
    from: 0,
    to: -Dimensions.get('window').width,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};

var FromTheRight = {
  opacity: {
    value: 1.0,
    type: 'constant',
  },

  transformTranslate: {
    from: {x: Dimensions.get('window').width, y: 0, z: 0},
    to: {x: 0, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },

  translateX: {
    from: Dimensions.get('window').width,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },

  scaleX: {
    value: 1,
    type: 'constant',
  },
  scaleY: {
    value: 1,
    type: 'constant',
  },
};

var FromTheLeft = {
  ...FromTheRight,
  transformTranslate: {
    from: {x: -SCREEN_WIDTH, y: 0, z: 0},
    to: {x: 0, y: 0, z: 0},
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
  translateX: {
    from: -SCREEN_WIDTH,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PixelRatio.get(),
  },
};




var SPRING_FRICTION = 26,
    SPRING_TENSION = 200,
    GESTURE_DETECT_MOVEMENT = 2,
    NOT_MOVING = 0.5,
    DIRECTION_RATIO = 0.66,
    SNAP_VELOCITY = 2,
    EDGE_HIT_WIDTH = 40,
    STILL_COMPLETION_RATIO = (3/5);


var BaseOverswipeConfig = {
  frictionConstant: 1,
  frictionByDistance: 1.5,
};

var BaseLeftToRightGesture = {

  // If the gesture can end and restart during one continuous touch
  isDetachable: false,

  // How far the swipe must drag to start transitioning
  gestureDetectMovement: GESTURE_DETECT_MOVEMENT,

  // Amplitude of release velocity that is considered still
  notMoving: NOT_MOVING,

  // Fraction of directional move required.
  directionRatio: DIRECTION_RATIO,

  // Velocity to transition with when the gesture release was "not moving"
  snapVelocity: SNAP_VELOCITY,

  // Region that can trigger swipe. iOS default is 30px from the left edge
  edgeHitWidth: EDGE_HIT_WIDTH,

  // Ratio of gesture completion when non-velocity release will cause action
  stillCompletionRatio: STILL_COMPLETION_RATIO,

  fullDistance: SCREEN_WIDTH,

  direction: 'left-to-right',

};

var BaseRightToLeftGesture = {
  ...BaseLeftToRightGesture,
  direction: 'right-to-left',
};




var CustomSceneConfigs = {
  HorizontalSlide: {
    // Rebound spring parameters when transitioning FROM this scene
    springFriction: SPRING_FRICTION,
    springTension: SPRING_TENSION,

    // Velocity to start at when transitioning without gesture
    defaultTransitionVelocity: 1.5,

    gestures: {
      jumpBack: {
        ...BaseLeftToRightGesture,
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: EDGE_HIT_WIDTH,
        isDetachable: true,
      },
      jumpForward: {
        ...BaseRightToLeftGesture,
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: EDGE_HIT_WIDTH,
        isDetachable: true,
      },
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheRight),
      out: buildStyleInterpolator(ToTheLeft),
    },
  }
};

module.exports = CustomSceneConfigs;
