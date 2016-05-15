
import Mixpanel from 'react-native-mixpanel'
import mixpanel from './mixpanel'
import AppInfo from 'react-native-app-info'

import _ from 'lodash'
const MIXPANEL_TOKEN = '18b301fab3deb8a70729d6407210391c'
var GoogleAnalytics = require('react-native-google-analytics-bridge')

const VERSION = parseFloat(AppInfo.getInfoShortVersion());


class Analytics{
  constructor(){

  }
  identifyUser(userid){
    if(!Mixpanel || !GoogleAnalytics || !userid) return false;

    GoogleAnalytics.setUser(userid);
    Mixpanel.identify(userid);

  }

  tagUser(propsToTag){    // MIXPANEL: assign user extra properties which can help identify them
    if(!GoogleAnalytics) return false;

    if(!propsToTag || typeof propsToTag != 'object' || !Object.keys(propsToTag).length ){ return false }

    // Mixpanel.set(propsToTag);

  }

  bumpUserProp(prop,val){    // MIXPANEL: track numeric values which are associated with a user
    if(!GoogleAnalytics) return false;

    if( !props || !val ){ return false }

    // Mixpanel.people.increment({[prop]: val});

  }

  event(eventName, eventData={}){
    if(!GoogleAnalytics) return false;

    let { action, label, value } = eventData;

    __DEV__ && console.log(`Event: ${eventName}`, 'EventData:', ...eventData)

    GoogleAnalytics.trackEvent(eventName, action, {label, value});

    // mixpanel.track(eventName, eventData)

    // Mixpanel.trackWithProperties(eventName, eventData)

  }

  screen(screen){
    if(!GoogleAnalytics) return false;

    __DEV__ && console.log(`Screen: ${screen}`)
    GoogleAnalytics.trackScreenView(screen);

  }

  err(error){
    if(!GoogleAnalytics) return false;
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
    __DEV__ && __DEBUG__ && [...arguments].map((arg,i)=>{
      console.log(arg)
    })

  }
  timeEvent(event){
    Mixpanel.timeEvent(event);
    // console.log(event,Date.now())
  }
  timeEnd(event){
    Mixpanel.track(event);
    // console.log(event, Date.now())

  }
}

export default new Analytics()
