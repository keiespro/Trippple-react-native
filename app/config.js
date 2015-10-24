const APP_ENV = 'dev'

const config = {

  production: {
    SERVER_URL: 'https://api2.trippple.co/user',
    WEBSOCKET_URL: 'https://api.trippple.co',
    KEYCHAIN_NAMESPACE: 'trippple.co'
  },

  staging: {
    SERVER_URL: 'https://52.26.56.31/user',
    WEBSOCKET_URL: 'https://52.26.56.31:9919',
    KEYCHAIN_NAMESPACE: 'trippple.co'
  },

  dev: {
    SERVER_URL: 'https://dev-api2.trippple.co/user',
    WEBSOCKET_URL: 'https://dev-api.trippple.co',
    KEYCHAIN_NAMESPACE: 'dev.trippple.co'
  },

  devAlex: {
    SERVER_URL: 'http://x.local:9999/user',
    WEBSOCKET_URL: 'http://x.local:9919',
    KEYCHAIN_NAMESPACE: 'dev.trippple.co'
  },

  devDante: {
    SERVER_URL: 'http://mbp-elrik-iii.local:9999/user',
    WEBSOCKET_URL: 'http://mbp-elrik-iii.local:9919',
    KEYCHAIN_NAMESPACE: 'dev.trippple.co'
  }

}

export default config[APP_ENV]


// KEYCHAIN ERROR WHEN RUNNING APP FROM XCODE
// We debugged it a lot and it seems an issue accessing the keychain when the app is launched from the background. This is only happening with the debugger (i.e. when launched from Xcode). We think the issue might be related in our case to the debugger keeping alive the app even if it should be killed by the OS. We tried in fact to run the app and then put it in background and launch many other app to occupy RAM. With the debugger the bug came up when resuming the app from the background, while without the debugger it didn't (we did run at least 10 tests each).
