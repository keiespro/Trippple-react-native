import RNMixpanel from 'react-native-mixpanel'
// import AppInfo from 'react-native-app-info'
import {Settings} from 'react-native'
// import _ from 'lodash'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import RNFB from 'react-native-firebase3'
import SETTINGS_CONSTANTS from './SettingsConstants'
import Mixpanel from './mixpanel'

const {HAS_IDENTITY} = SETTINGS_CONSTANTS

// const VERSION = 2.5 // parseFloat(AppInfo.getInfoShortVersion());

const __TEST__ = global.__TEST__ || false;

const Firelytics = RNFB.Analytics;

if (!__DEV__){
  global.console.log = () => {}
  global.console.warn = () => {}
}

class Analytics{

  constructor(){
    if (!__TEST__){
      GoogleAnalytics.setTrackerId('UA-49096214-2');
      GoogleAnalytics.allowIDFA(false);
    }
    if (__DEBUG__ || __TEST__) {
      // Firelytics.setEnabled(false);
    }
  }

  prepareInitializeIdentity(){
    this.readyToInitialize = true;
  }

  identifyUser(user){
    console.log(user);
    if (!user || !user.id) return;
    // if(!this.userid){
      //  if(!Settings.get(HAS_IDENTITY)){
      // }
    // }
    // __DEV__ && console.log(`Analytics -> Indentified user #${user.id}`);
    if (!__TEST__){
      Firelytics.setUserId(`${user.id}`);

      GoogleAnalytics.setUser(`${user.id}`);
      RNMixpanel.identify(`${user.id}`);
      RNMixpanel.registerSuperProperties({
        Gender: user.gender,
        'User Type': user.relationship_status
      });
      this.setFullIdentityOnce(user)


      Object.keys(user).forEach(k => {
        if (typeof user[k] != 'object'){
          Firelytics.setUserProperty(k, `${user[k]}`);
        }
      });
    }
  }

  setFullIdentityOnce(user){
    __DEV__ && console.log('setFullIdentityOnce', user);
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
    __DEV__ && console.log(mxProps);

    this.setUserProperties(mxProps);


    // Settings.set({[HAS_IDENTITY]: true});
    this.userid = user.id;
  }

  setUserProperties(propsToTag){
    // MIXPANEL: assign user extra properties which can help identify them

    if (!propsToTag || typeof propsToTag != 'object' || !Object.keys(propsToTag).length){ return }

    // Object.keys(propsToTag).map(k => RNMixpanel.set(k,propsToTag[k]));
    // RNMixpanel.set(propsToTag)
  }

  increment(prop, amount) {
    // MIXPANEL: track numeric values which are associated with a user

    if (!prop || !amount){ return false }

    RNMixpanel.increment(prop, amount);
  }

  event(eventName, eventData = {}){
    if (__TEST__ || !GoogleAnalytics) return false;

    const action = eventData.action || eventData.type || undefined;
    const label = eventData.label || eventData.name || undefined;
    const value = eventData.value || eventData.val || undefined;
    if (!label){
      console.log('LABEL NULL');
    }
    if (!action){
      console.log('action NULL');
    }
    if (!value){
      console.log('VALUE NULL');
    }
    __DEV__ && console.log(`Event: ${eventName}`, 'EventData:', ...eventData)

    Firelytics.logEvent(eventName, eventData);

    GoogleAnalytics.trackEvent(eventName, action, {label, value});

    Mixpanel.track(eventName, eventData)
  }

  screen(screen){
    if (__TEST__ || !GoogleAnalytics || !screen) return false;

    // __DEV__ && console.log(`Screen: ${screen}`)
    GoogleAnalytics.trackScreenView(screen);
    Mixpanel.track(`Screen ${screen}`);
  }

  extra(eventName, eventData = {}){
    if (__TEST__ || !GoogleAnalytics) return false;

    const action = eventData.action || eventData.type || undefined;
    const label = eventData.label || eventData.name || undefined;
    const value = eventData.value || eventData.val || undefined;
    if (!label){
      console.log('LABEL NULL');
    }
    if (!action){
      console.log('action NULL');
    }
    if (!value){
      console.log('VALUE NULL');
    }
    __DEV__ && console.log(`Event: ${eventName}`, 'EventData:', ...eventData)

    GoogleAnalytics.trackEvent(eventName, action, {label, value});
  }

  err(error){
    if (!error || (error && error.error && !Object.keys(error.error).length) || (error && !Object.keys(error).length)){
      return;
    }
    __DEV__ && console.log('ERROR:', error)

    __DEV__ && console.warn('ERROR:', JSON.stringify(error || {error: '?'}, null, 2))
    // __DEV__ && console.log(`ERROR:`, error)

    // __DEV__ && console.warn(`ERROR:`, error)
    // GoogleAnalytics.trackException( JSON.stringify(error), false);
  }

  log(){
    __DEV__ && console.log('LOG:', {...arguments})
  }

  all(){
    // console.log('<Log>')

//     window && window.__SHOW_ALL && __DEV__ && __DEBUG__ && [...arguments].map((arg,i)=>{
//       console.log('<Log> ', arg)
//     })
    // console.log('</Log>')

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
