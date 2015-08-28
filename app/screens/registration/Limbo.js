
var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  LayoutAnimation,
} = React;

var UserActions = require('../../flux/actions/UserActions');
var colors = require('../../utils/colors')
var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;


class LogOutButton extends React.Component{
  _doLogOut(){
    AsyncStorage.multiRemove(['ChatStore','MatchesStore'])
    .then(() => UserActions.logOut())

  }
  render(){

    return (
      <TouchableHighlight underlayColor={colors.dark} onPress={this._doLogOut}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class Limbo extends Component{

  render(){
    return (
      <View>
        <LogOutButton/>
        <Text>LIMBO</Text>
      </View>
    )
  }
}
export default Limbo

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
})
