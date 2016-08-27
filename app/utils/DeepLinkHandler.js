import { View, Settings, Linking } from 'react-native';
import React, {Component} from 'react';
import Analytics from './Analytics'
import url from 'url'

export default class DeepLinkHandler extends Component{

  componentDidMount(){
    Linking.addEventListener('url', this.handleDeepLink.bind(this))
  }

  componentWillUnmount(){
    Linking.removeEventListener('url', this.handleDeepLink.bind(this))
  }
  handleDeepLink(event){
    const deeplink = url.parse(event.url);
    __DEV__ && console.log('DEEPLINK',event);

    Analytics.event('Interaction',{type: 'deeplink', name: deeplink.href})
    switch(deeplink.host){
      case 'join.couple':
        this.handleCoupleDeepLink(deeplink)
        break;
      default:
        break;
    }
  }

  handleCoupleDeepLink(deeplink){
      const pin = deeplink.path.substring(1,deeplink.path.length);
      Settings.set({'co.trippple.deeplinkCouplePin': pin});
  }

  render(){

    return <View/>

  }

}
