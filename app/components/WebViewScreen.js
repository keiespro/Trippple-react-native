const helpScript = "jQuery(document).ready(function($){$('a').each(function(i,el){var s = $('<span></span>',{html: $(el).html()});$(el).replaceWith(s)});$('button').remove();})";

const privacyScript = "jQuery().ready(function($){$('button').hide();window.setTimeout(function(){$('a').each(function(i,el){var s = $('<span></span>',{html: $(el).html()});$(el).replaceWith(s)});},1000)})";

import React from 'react-native';
import {
  StyleSheet,
  View,
  WebView,
  Text,
  Component
} from  'react-native'

import colors from '../utils/colors'
import FakeNavBar from '../controls/FakeNavBar';

class WebViewScreen extends Component{
  onNavigationStateChange(){

  }
  render(){
    return (
      <View style={styles.container}>
        <WebView
           ref={'webviewref'}
           automaticallyAdjustContentInsets={false}
           style={styles.webview}
           url={this.props.url}
           onNavigationStateChange={this.onNavigationStateChange.bind(this)}
           startInLoadingState={true}
           injectedJavaScript={this.props.url.indexOf('help') >= 0 ? helpScript : privacyScript}
           scalesPageToFit={true}
           bounces={true}
           scrollEnabled={true}
         />
        <FakeNavBar
          backgroundStyle={{backgroundColor:colors.shuttleGray}}
          hideNext={true}
          navigator={this.props.navigator}
          customPrev={
            <View style={{flexDirection: 'row',opacity:0.5,top:7}}>
              <Text textAlign={'left'} style={[styles.bottomTextIcon,{color:colors.white}]}>◀︎ </Text>
            </View>
          }
          onPrev={(nav,route)=> nav.pop()}
          title={this.props.pageTitle}
          titleColor={colors.white}
        />
     </View>
    )
  }
}
export default WebViewScreen


const styles = StyleSheet.create({


 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'stretch',
   position:'relative',
   alignSelf: 'stretch',
   backgroundColor:colors.outerSpace
 },
 webview:{
   flex: 1,
   justifyContent: 'center',
   alignItems: 'stretch',
   marginTop: 50,
   position:'relative',
   alignSelf: 'stretch',
 }
});
