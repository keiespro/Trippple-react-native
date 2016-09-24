
global.APP_ENV = APP_ENV = process.env.NODE_ENV || 'production';

global.SERVER_ENV = SERVER_ENV = 'production' //process.env.TRIPPPLE_SERVER || APP_ENV;

global.__DEBUG__ = __DEBUG__ = false;
global.__DEV__ = __DEV__ = APP_ENV == 'development';
global.__TEST__ = APP_ENV == 'test';


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
        WEBSOCKET_URL: 'ws://staging-ws.trippple.co',
        KEYCHAIN_NAMESPACE: 'staging1.trippple.co'
    },

    development: {
        SERVER_URL: 'http://x.local:9920',
        WEBSOCKET_URL: 'http://x.local:9920',
        KEYCHAIN_NAMESPACE: 'http://api2.trippple.co'
    },

    test: {
        SERVER_URL: 'http://localhost:3336',
        WEBSOCKET_URL: 'http://localhost:3337',
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
    ...configurations[SERVER_ENV]
};
config.invertColors = false;

export default config
