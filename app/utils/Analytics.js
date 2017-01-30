import RNMixpanel from 'react-native-mixpanel'
import AppInfo from 'react-native-app-info'
import {Settings, NativeModules,Platform} from 'react-native'
import _ from 'lodash'
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';

import RNFB from 'react-native-firebase3'
import SETTINGS_CONSTANTS from './SettingsConstants'
import Mixpanel from './mixpanel'

const iOS = Platform.OS == 'ios';

const {HAS_IDENTITY} = SETTINGS_CONSTANTS
const {RNUXCam} = NativeModules

// const VERSION = 2.5 // parseFloat(AppInfo.getInfoShortVersion());

const __TEST__ = global.__TEST__ || false;

const Firelytics = RNFB.Analytics;

if(!__DEV__){
  global.console.log = () => {}
  global.console.warn = () => {}
}

class Analytics{

  constructor(){
    if(!__DEV__ && !__TEST__){
      this.ga = new GoogleAnalyticsTracker('UA-49096214-2');
      GoogleAnalyticsSettings.setDryRun(false);
      this.ga.allowIDFA(true)
    }
    if(__DEBUG__ || __TEST__) {
      GoogleAnalyticsSettings.setDryRun(true);

      Firelytics.setEnabled(false);
    }
  }

  prepareInitializeIdentity(){
    this.readyToInitialize = true;
  }

  identifyUser(user){

    if(!user || !user.id) return;
    if(!__DEV__ && !__TEST__){
      Firelytics.setUserId(`${user.id}`);
      this.ga.setUser(`${user.id}`);
      RNMixpanel.identify(`${user.id}`);
      this.setFullIdentityOnce(user)
    }
  }

  setFullIdentityOnce(user){
    const mxProps = {
      $phone: user.phone || '',
      $area_code: user.phone ? user.phone.slice(0, 3) : '',
      $name: user.firstname,
      $gender: user.gender,
      $email: user.email,
      $image: user.image_url,
      $relationship_status: user.relationship_status,
      $user_type: user.relationship_status,
      $account_status: user.status,
      '$year-of-birth': user.birth_year,
      $privacy: user.privacy
    };

    this.setUserProperties(mxProps);
    this.userid = user.id;
  }

  setUserProperties(propsToTag){
    // MIXPANEL: assign user extra properties which can help identify them

    if(!propsToTag || typeof propsToTag != 'object' || !Object.keys(propsToTag).length){ return }

    // Object.keys(propsToTag).map(k => RNMixpanel.set(k,propsToTag[k]));
    // RNMixpanel.set(propsToTag)
  }

  increment(prop, amount) {
    // MIXPANEL: track numeric values which are associated with a user

    if(!prop || !amount){ return }

    RNMixpanel.increment(prop, amount);
  }

  event(eventName, eventData = {}){
    if(__TEST__) return;

    const action = eventData.action || eventData.type || undefined;
    const label = eventData.label || eventData.name || undefined;
    const value = eventData.value || eventData.val || undefined;

    __DEV__ && console.log(`Event: ${eventName}`, 'EventData:', ...eventData)

    Firelytics.logEvent(eventName, eventData);

    this.ga.trackEvent(eventName, action, {label, value});

    Mixpanel.track(eventName, eventData)
  }

  screen(screen){
    if(!this.ga || __TEST__ || !screen || !screen.length) return;


    if(iOS){
        RNUXCam.tagScreenName(screen,(result) => {
      });
    }else{
      RNUXCam.tagScreenName(screen)
    }
   this.ga.trackScreenView(screen);
    Mixpanel.track(`Screen ${screen}`);
  }

  extra(eventName, eventData = {}){
    if(__TEST__) return false;

    const action = eventData.action || eventData.type || undefined;
    const label = eventData.label || eventData.name || undefined;
    const value = eventData.value || eventData.val || undefined;
    if(__DEV__ && !label){
      console.log('LABEL NULL');
    }
    if(__DEV__ && !action){
      console.log('action NULL');
    }
    if(__DEV__ && !value){
      console.log('VALUE NULL');
    }
    __DEV__ && console.log(`Event: ${eventName}`, 'EventData:', ...eventData)

    this.ga.trackEvent(eventName, action, {label, value});
  }

  err(error){
    if(!error || (error && error.error && !Object.keys(error.error).length) || (error && !Object.keys(error).length)){
      return;
    }
    __DEV__ && console.log('ERROR:', error)

    __DEV__ && console.warn('ERROR:', JSON.stringify(error || {error: '?'}, null, 2))
    // __DEV__ && console.log(`ERROR:`, error)

    // __DEV__ && console.warn(`ERROR:`, error)
    this.ga && this.ga.trackException( JSON.stringify(error), false);
  }

  log(){
    __DEV__ && console.log('LOG:', {...arguments})
  }

  timeEvent(event, data){
    __DEV__ && console.log(`Event: ${event}`, 'EventData:', ...eventData)

    RNMixpanel.timeEvent(event);
  }

  timeEnd(event){
    Mixpanel.track(event);
  }

  warning(title, body){
    const warningSigns = `\n\n⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n\n`;

    __DEV__ && console.warn(`WARNING - ${title}`, warningSigns + body + warningSigns);
  }
}

export default new Analytics()
