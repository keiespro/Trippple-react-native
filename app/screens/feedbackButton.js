/* @flow */

'use strict';

var React = require('react-native');
var {
 StyleSheet,
 Text,
 View,
 AlertIOS,
 TouchableHighlight
} = React;


var Mailer = require('NativeModules').RNMail;

var FeedbackButton = React.createClass({
  handleHelp: function() {
    Mailer.mail({
      subject: 'I\'m have an issue in the app',
      recipients: ['feedback@trippple.co'],
      body: 'Help!'
    }, (error, event) => {
        if(error) {
          AlertIOS.alert('Error', 'Could not send mail. Please email feedback@trippple.co directly.');
        }
    });
  },
  render: function() {
    return (
      <TouchableHighlight onPress={this.handleHelp} underlayColor="#f7f7f7">
        <View style={styles.button}>
          <Text style={styles.buttonText}>
          Feedback
          </Text>
        </View>
     </TouchableHighlight>
    );
  }
});

module.exports = FeedbackButton;

var styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
    fontFamily:'omnes'

  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#FE6650',
    borderColor: '#111',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },

});
