const APP_ENV = 'production';

__DEBUG__ = false;
__DEV__ = false;
const configurations = {

  production: {
    SERVER_URL: 'https://api2.trippple.co/user',
    WEBSOCKET_URL: 'https://api.trippple.co',
    KEYCHAIN_NAMESPACE: 'http://api2.trippple.co'
  },

  staging: {
    SERVER_URL: 'https://staging-api2.trippple.co/user',
    WEBSOCKET_URL: 'https://staging-api.trippple.co',
    KEYCHAIN_NAMESPACE: 'staging1.trippple.co'
  },

  dev: {
    SERVER_URL: 'https://dev-api2.trippple.co/user',
    WEBSOCKET_URL: 'https://dev-api.trippple.co',
    KEYCHAIN_NAMESPACE: 'dev.trippple.co'
  },

  devAlex: {
    SERVER_URL: 'http://x.local:9999/user',
    WEBSOCKET_URL: "http://x.local:9919/",
    KEYCHAIN_NAMESPACE: 'dev.trippple.co'
  },

  devDante: {
    SERVER_URL: 'http://mbp-elrik-iii.local:9999/user',
    WEBSOCKET_URL: 'http://mbp-elrik-iii.local:9919',
    KEYCHAIN_NAMESPACE: 'dev.trippple.co'
  }

}

config = configurations[APP_ENV];
config.invertColors = false;

export default config
