/**
 * @providesModule OSPermissions
 * @flow
 */
'use strict';

var NativeOSPermissions = require('NativeModules').OSPermissions



const OSPermissions = {

  get(){
    return NativeOSPermissions
  }

}

export default OSPermissions
