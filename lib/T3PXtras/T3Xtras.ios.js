/**
 * @providesModule T3Xtras
 * @flow
 */
'use strict';

var NativeT3Xtras = require('NativeModules').T3Xtras;

/**
 * High-level docs for the T3Xtras iOS API can be written here.
 */

var T3Xtras = {
  test: function() {
    NativeT3Xtras.test();
  }
};

module.exports = T3Xtras;
