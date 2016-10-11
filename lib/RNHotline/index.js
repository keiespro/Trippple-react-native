
 const NativeRNHotline = require('NativeModules').RNHotline;


 const RNHotline = {
   showFaqs() {
     NativeRNHotline.showFaqs ? NativeRNHotline.showFaqs() : NativeRNHotline.showFAQs();
   },
   showConvos() {
     NativeRNHotline.showConvos ? NativeRNHotline.showConvos() : NativeRNHotline.showConversations();
   },
   setUser(id, name, email, phone, ...meta){
      NativeRNHotline.setUser(id, name, phone, meta);
   },
   logOut(){
      NativeRNHotline.logOut()
   }
 };

 export default RNHotline;
