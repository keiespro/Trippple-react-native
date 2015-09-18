 import KeyboardEvents from 'react-native-keyboardevents'
 const { Emitter } = KeyboardEvents

 const keyboardMixin = {
   // getDefaultProps(){

   //   return { keyboardSpace: 0, isKeyboardOpened: false };
   // },
   updateKeyboardSpace(frames) {
     console.log(frames)
     this.setState({
       keyboardSpace: frames.endCoordinates ? frames.endCoordinates.height : frames.end.height,
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
     Emitter.on(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
     Emitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
   },

   componentWillUnmount() {
     Emitter.off(KeyboardEvents.KeyboardWillShowEvent, this.updateKeyboardSpace.bind(this));
     Emitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace.bind(this));
   }

 }
 export default keyboardMixin

