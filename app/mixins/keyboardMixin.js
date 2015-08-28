// import KeyboardEvents from 'react-native-keyboardevents'
// const { Emitter } = KeyboardEvents

// const keyboardMixin = {
//   // getDefaultProps(){

//   //   return { keyboardSpace: 0, isKeyboardOpened: false };
//   // },
//   updateKeyboardSpace(frames) {
//     this.setState({
//       keyboardSpace: frames.end.height,
//       isKeyboardOpened: true
//     });
//   },

//   resetKeyboardSpace(){
//     this.setState({
//       keyboardSpace: 0,
//       isKeyboardOpened: false
//     });
//   },

//   componentDidMount() {
//     Emitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
//     Emitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
//   },

//   componentWillUnmount() {
//     Emitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
//     Emitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
//   }

// }
// export default keyboardMixin
//
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

module.exports =  {

  getInitialState() {
    return {
      keyboardSpace: 0,
      isKeyboardOpened: false
    };
  },

  updateKeyboardSpace(frames) {
    this.setState({
      keyboardSpace: frames.end.height,
      isKeyboardOpened: true
    });
  },

  resetKeyboardSpace() {
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  },

  componentDidMount() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
  },

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
  }

};
