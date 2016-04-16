
import Mixpanel from 'react-native-mixpanel'
import mixpanel from './mixpanel'
import AppInfo from 'react-native-app-info'

import _ from 'lodash'
const MIXPANEL_TOKEN = '39438c7679290b25ea2dbb0b2aa5714f'
var GoogleAnalytics = require('react-native-google-analytics-bridge')

const VERSION = parseFloat(AppInfo.getInfoShortVersion());


class Analytics{
  constructor(){


    // if(!Mixpanel || !GoogleAnalytics) return false;

    // Mixpanel.registerSuperProperties({
    //
    //
    // });


  }
  identifyUser(userid){
    if(!Mixpanel || !GoogleAnalytics) return false;

    GoogleAnalytics.setUser(userid);
    Mixpanel.identify(userid);

  }

  tagUser(propsToTag){    // MIXPANEL: assign user extra properties which can help identify them
    if(!Mixpanel || !GoogleAnalytics) return false;

    if(!propsToTag || typeof propsToTag != 'object' || !Object.keys(propsToTag).length ){ return false }

    Mixpanel.set(propsToTag);

  }

  bumpUserProp(prop,val){    // MIXPANEL: track numeric values which are associated with a user
    if(!Mixpanel || !GoogleAnalytics) return false;

    if( !props || !val ){ return false }

    Mixpanel.people.increment({[prop]: val});

  }

  event(eventName, eventData={}){
    if(!Mixpanel || !GoogleAnalytics) return false;

    let { action, label, value } = eventData;

    __DEV__ && console.log(`Event: ${eventName}`, 'EventData:', ...eventData)

    GoogleAnalytics.trackEvent(eventName, action, {label, value});

    mixpanel.track(eventName, eventData)

  }

  screen(screen){
    if(!Mixpanel || !GoogleAnalytics) return false;

    __DEV__ && console.log(`Screen: ${screen}`)
    GoogleAnalytics.trackScreenView(screen);
    mixpanel.track(screen);

  }

  err(error){
    if(!Mixpanel || !GoogleAnalytics) return false;
    if(!error || (error && error.error && !Object.keys(error.error).length) ||  (error && !Object.keys(error).length) ){
      return;
    }
    __DEV__ && console.log(error)
    GoogleAnalytics.trackException( JSON.stringify(error), false);

  }
  log(){
    __DEV__ && console.log({...arguments})
  }
  all(){
    __DEV__ && __DEBUG__ && console.log({...arguments})

  }
}

export default new Analytics()
