// /**
//  * @providesModule RNHotline
//  * @flow
//  */
// 'use strict';
//
// var NativeRNHotline = require('NativeModules').RNHotline;
//
// /**
//  * High-level docs for the RNHotline iOS API can be written here.
//  */
//
// const RNHotline = {
//   showFaqs() {
//     NativeRNHotline.showFaqs();
//   },
//   showConvos() {
//     NativeRNHotline.showFaqs();
//   }
// };
//
// export default RNHotline;



import { requireNativeComponent } from 'react-native';

module.exports = requireNativeComponent('RNHotline', null);
