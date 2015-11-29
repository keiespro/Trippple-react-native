/* @flow */



var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;
// var Composer = require('NativeModules').RNMessageComposer;



var PendingPartner = React.createClass({

  handleSendMessage(){
    // Composer.composeMessageWithArgs(
    // {
    //     'messageText':'http://appstore.com/trippple',
    //     'subject':'Come join me on Trippple!',
    //     'recipients':[this.props.user.partner.phone]
    // },
    // (result) => {
    //     switch(result) {
    //         case Composer.Sent:
    //             break;
    //         case Composer.Cancelled:
    //             break;
    //         case Composer.Failed:
    //             break;
    //         case Composer.NotSupported:
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // );
  },
  render() {

    return (
      <View style={styles.container}>
          <Text style={[styles.textplain]}>PENDING PARTNER</Text>
            <TouchableHighlight
               style={styles.button}
               onPress={this.handleSendMessage}
               underlayColor="black">
               <Text style={styles.buttonText}>send text</Text>
            </TouchableHighlight>
      </View>
    );
  },


});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textplain:{
    color:'#111',
    fontSize:30,
    fontFamily:'omnes'
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    alignSelf: 'center',
    fontFamily:'omnes'

  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});


module.exports = PendingPartner;
