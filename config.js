import { NativeModules } from 'react-native';

var rcnConfig =  NativeModules.RCNconfig;
var environment = rcnConfig.buildEnvironment;

// const SERVER_ENV = 'production'
// global.__DEV__ = false;
global.__TEST__ = false;
global.__DEBUG__ = false;

const defaultConfig = {
  INVITE_FRIENDS_APP_LINK: 'https://fb.me/656380827843911'
}

const configurations = {
  Production: {
    // SERVER_URL: 'http://192.168.0.100:9920',
    SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
  },
  Debug: {
  	SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
  },
  Staging:{
  	SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co',
    GOOGLE_MAPS_API_KEY: 'AIzaSyCqRsmlKQJmHmaHb52I9lhIAMqyZbeQrbA'
  }
}

const glyphs = {
ff: '⚢',
mm: '⚣',
mf: '⚤',
fm: '⚤',
}

const config = {
  glyphs,
  ...defaultConfig,
  ...configurations[environment]
};
config.invertColors = false;

export default config
