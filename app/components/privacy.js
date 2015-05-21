var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight
} = React;



var Privacy = React.createClass({
  goPrivate(){

    console.log(this.props.navigator);

  },
  goPublic(){

  },
  render() {

    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.goPublic}>
          <Text style={styles.textS}>Public</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.goPrivate}>
          <Text style={[styles.textS,styles.textbottom]}>Private</Text>
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
  textS:{
    color:'#111',
    fontSize:30,
    fontFamily:'omnes'
  },
  textbottom:{
    marginTop: 20,
  }
});


module.exports = Privacy;
