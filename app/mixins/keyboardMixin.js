import KeyboardEvents from 'react-native-keyboardevents'
const { Emitter } = KeyboardEvents

const keyboardMixin = {
  // getDefaultProps(){

  //   return { keyboardSpace: 0, isKeyboardOpened: false };
  // },
  updateKeyboardSpace(frames) {
    this.setState({
      keyboardSpace: frames.end.height,
      isKeyboardOpened: true
    });
  },

  resetKeyboardSpace(){
    this.setState({
      keyboardSpace: 0,
      isKeyboardOpened: false
    });
  },

  componentDidMount() {
    Emitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
    Emitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },

  componentWillUnmount() {
    Emitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace);
    Emitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

}
export default keyboardMixin
