import { View, Settings, Linking } from 'react-native';
import React, {Component} from 'react';
import Analytics from './Analytics'
import url from 'url'
import {NavigationStyles, withNavigation} from '@exponent/ex-navigation';


@withNavigation
export default class DeepLinkHandler extends Component{

  componentDidMount(){
    Linking.addEventListener('url', this.handleDeepLink.bind(this))
  }

  componentWillUnmount(){
    Linking.removeEventListener('url', this.handleDeepLink.bind(this))
  }
  handleDeepLink(event){
    const deeplink = url.parse(event.url);
    __DEV__ && console.log('DEEPLINK',event,deeplink);

    Analytics.event('Interaction',{type: 'deeplink', name: deeplink.href})
    switch(deeplink.host){
      case 'joincouple':
        this.handleCoupleDeepLink(deeplink)
        break;
      default:
        break;
    }
  }

  handleCoupleDeepLink(deeplink){
      const pin = deeplink.path.substring(1,deeplink.path.length);
      Settings.set({'co.trippple.deeplinkCouplePin': pin});
      this.props.navigator.push(this.props.navigator.navigationContext.router.getRoute('EnterCouplePin'),{deeplink,pin})
  }

  render(){

    return <View/>

  }

}
