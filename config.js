const APP_ENV = 'staging';

global.__DEBUG__ = false;
global.__DEV__ = false;
global.__TEST__ = false

// // // // // //
global.__DEBUG__ = false;
global.__DEV__ = false;
// // // // //
__DEBUG__ = false;
__DEV__ = false;
// // //

const defaultConfig = {
  INVITE_FRIENDS_APP_LINK: 'https://fb.me/656380827843911' 
}

const configurations = {

  production: {
    SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co'
  },

  staging: {
    SERVER_URL: 'https://staging-api2.trippple.co',
    WEBSOCKET_URL: 'https://staging-ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'staging1.trippple.co'
  },

  dev: {
    SERVER_URL: 'http://x.local:9920',
    WEBSOCKET_URL: 'http://x.local:9920',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co'
  },

  devAlex: {
    SERVER_URL: 'http://api2.trippple.local',
    WEBSOCKET_URL: "http://api.trippple.local",
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co'
  },

  devDante: {
    SERVER_URL: 'http://mbp-elrik-iii.local:9999',
    WEBSOCKET_URL: 'http://mbp-elrik-iii.local:9919',
    KEYCHAIN_NAMESPACE: 'dev.trippple.co'
  }


}
const config = {
  ...defaultConfig,
  ...configurations[APP_ENV]
};
config.invertColors = false;

export default config
