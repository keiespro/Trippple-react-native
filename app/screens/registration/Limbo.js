
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
import LoadingOverlay from '../../components/LoadingOverlay'



class Limbo extends Component{
  componentWillMount(){
    UserActions.updateUserStub({status:'onboarded'})
  }
  render(){
    return (
      <LoadingOverlay visible={true}/>
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
