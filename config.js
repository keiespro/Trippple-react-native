var React = require('react_native')
// const SERVER_ENV = 'production'

var rcnConfig = require('NativeModules').RCNconfig;
var SERVER_ENV = rcnConfig.constantsToExport
// global.__DEV__ = false;
global.__TEST__ = false;
global.__DEBUG__ = false;

const defaultConfig = {
  INVITE_FRIENDS_APP_LINK: 'https://fb.me/656380827843911'
}
switch(SERVER_ENV){
	case production:
	const configurations = {
		production: {
    // SERVER_URL: 'http://192.168.0.100:9920',
    SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
  },
}
	break;
	case Debug:
	const configurations = {
		Debug: {
    // SERVER_URL: 'http://192.168.0.100:9920',
    SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
  },
}
	break;
	case staging:
	const configurations = {
		staging: {
    // SERVER_URL: 'http://192.168.0.100:9920',
    SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
  },
}
	break;
	default:
	const configurations = {
		production: {
    // SERVER_URL: 'http://192.168.0.100:9920',
    SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
  },
}




}



// const configurations = {

//   production: {
//     // SERVER_URL: 'http://192.168.0.100:9920',
//     SERVER_URL: 'https://api2.trippple.co',
//     WEBSOCKET_URL: 'ws://ws.trippple.co',
//     KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
//     GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
//   },


// }

const glyphs = {
ff: '⚢',
mm: '⚣',
mf: '⚤',
fm: '⚤',
}

const config = {
  glyphs,
  ...defaultConfig,
  ...configurations[SERVER_ENV]
};
config.invertColors = false;

export default config
