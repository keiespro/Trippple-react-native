import logger from 'react-native-logger'

const noop = () => {}

const initLogger = () => {

  // review this
  if (__DEV__ && process.env.NODE_ENV !== 'production') {
    Logger = new logger('x.local');
    return Logger;
  }

  return (__DEBUG__ ? console.warn : noop)
}

export default initLogger()

