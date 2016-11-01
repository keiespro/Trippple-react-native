import {NativeModules} from 'react-native'

const NativeRNHotline = NativeModules.RNHotline;


const RNHotline = {
  showFaqs() {
    NativeRNHotline.showFaqs();
  },
  showConvos() {
    NativeRNHotline.showConvos();
  },
  setUser(id, name, email, phone, ...meta) {
    NativeRNHotline.setUser(id, name, email, phone, meta);
  },
  logOut() {
    NativeRNHotline.logOut()
  }
};

export default RNHotline;
