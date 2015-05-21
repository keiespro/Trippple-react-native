var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;



var PendingPartner = React.createClass({
  render() {

    return (
      <View style={styles.container}>
          <Text style={[styles.textplain]}>PENDING PARTNER</Text>
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
  }
});


module.exports = PendingPartner;
