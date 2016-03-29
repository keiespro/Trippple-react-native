require("babel-polyfill");

var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var origJs = require.extensions['.js'];


require('react-native/packager/react-packager/src/Resolver/polyfills/babelHelpers.js');
// global.__DEV__ = true;
// global.__fbBatchedBridgeConfig = {
//   remoteModuleConfig: [],
//   localModulesConfig: [],
// };

// global.Promise = require('promise');
// global.regeneratorRuntime = require('regenerator-runtime-only');


require.extensions['.js'] = function (module, fileName) {
  var output;

  // check if we are loading react-native, if so replace it with a mock file
  if (fileName.indexOf('node_modules/react-native/Libraries/react-native/react-native.js') > -1) {
    fileName = path.resolve('test/unit/mocks/react-native.js');
  }

  if (fileName.indexOf('blur') >= 0 || fileName.indexOf('dismissKeyboard') >= 0 ) {
    fileName = path.resolve('test/unit/mocks/react-native.js');
  }

  if (fileName.indexOf('facebook') >= 0 ) {
    fileName = path.resolve('test/unit/mocks/react-native.js');
  }


    // if (fileName.indexOf('test/integration') >= 0 || fileName.indexOf('test/unit') >= 0 ) {
    // return
    //   // fileName = path.resolve('./mocks/react-native.js');
    // }

  // don't transpile some files from node_modules
  if (fileName.indexOf('node_modules/') >= 0 && fileName.indexOf('react-native') < 0 && fileName.indexOf('blur') < 0 && fileName.indexOf('dismissKeyboard') < 0) {
    return (origJs || require.extensions['.js'])(module, fileName);
  }

  var src = fs.readFileSync(fileName, 'utf8');
  output = babel.transform(src, {
    filename: fileName,
    sourceFileName: fileName,
    plugins: [
      "transform-object-rest-spread",
    ],
    presets: [ 'es2015', 'react','stage-0'],
    sourceMaps: false
  }).code;

  return module._compile(output, fileName);
};
