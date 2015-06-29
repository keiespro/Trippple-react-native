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
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },

  componentWillUnmount() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

};
