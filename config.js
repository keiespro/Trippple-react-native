
const SERVER_ENV = 'production'
global.__DEV__   = true;
global.__DEBUG__ = false;
global.__TEST__  = false;

const defaultConfig = {
  INVITE_FRIENDS_APP_LINK: 'https://fb.me/656380827843911'
}

const configurations = {

  production: {
    SERVER_URL: 'https://api2.trippple.co',
    WEBSOCKET_URL: 'ws://ws.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co'
  },


}
const config = {
  ...defaultConfig,
  ...configurations[SERVER_ENV]
};
config.invertColors = false;

export default config
