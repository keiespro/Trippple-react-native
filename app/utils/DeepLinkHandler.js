import { View, Settings, Linking } from 'react-native';
import React, {Component} from 'react';
import Analytics from './Analytics'

export default class DeepLinkHandler extends Component{

  componentDidMount(){

    Linking.addEventListener('url', this.handleDeepLink.bind(this))

  }

  componentWillUnmount(){

    Linking.removeEventListener('url', this.handleDeepLink.bind(this))
  }
  handleDeepLink(data){

    console.log('DEEPLINK',data);
  }

  handleCoupleDeepLink(event){
    const deeplink = url.parse(event.url);

    Analytics.event('Interaction',{type: 'deeplink', name: deeplink.href})

    if(deeplink.host == 'join.couple'){
      const pin = deeplink.path.substring(1,deeplink.path.length);
      Settings.set({'co.trippple.deeplinkCouplePin': pin});
    }
  }
  render(){

    return <View/>

  }

}
