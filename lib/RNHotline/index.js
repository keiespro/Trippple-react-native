import {NativeModules} from '../../node_modules/react-native'

const RNHotlineConroller = NativeModules.RNHotlineConroller;

// 
// const RNHotline = {
//   showFaqs() {
//     RNHotlineConroller.showFaqs();
//   },
//   showConvos() {
//     RNHotlineConroller.showConvos();
//   },
//   setUser(id, name, email, phone, ...meta) {
//     RNHotlineConroller.setUser(id, name, email, phone, meta);
//   },
//   logOut() {
//     RNHotlineConroller.logOut()
//   }
// };

export default RNHotlineConroller;
