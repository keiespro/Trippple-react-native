/* @flow */


var {
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  LayoutAnimation,
  TextInput
} = require('react-native')

var TrackKeyboard = require('../mixins/keyboardMixin');

var colors = require('../utils/colors')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var UserActions = require('../flux/actions/UserActions');

var Facebook = require('./facebook');
var TopTabs = require('../controls/topSignupSigninTabs');
var Login = require('./login');
var Register = require('./register');


var styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    padding:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
  },
  wrap: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    height: DeviceHeight,
    backgroundColor: 'transparent',
    padding:20

  },
  phoneInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: colors.rollingStone,
    height: 50,
    alignSelf: 'stretch'
  },
  phoneInputWrapSelected:{
    // marginBottom:60,
    borderBottomColor: colors.mediumPurple,
  },
  phoneInput: {
    height: 50,
    padding: 4,
    fontSize: 21,
    fontFamily:'Montserrat',
    color: colors.white
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 21,
    fontFamily:'Montserrat',

  },

  buttonText: {
    fontSize: 18,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'omnes'
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});


class Auth extends Component{

  constructor(props){
    super(props);
    this.state = {
      activeTab: props.initialTab
    }
  }

  handleBack(){
    this.props.navigator.pop();
  }
  toggleTab(newTab){
    console.log(newTab)
    if(newTab == this.state.activeTab) return;
    this.setState({
      activeTab:newTab
    })
  }
  render(){
    var activeTab = () => {
      switch(this.state.activeTab){
        case 'login':
          return ( <Login navigator={this.props.navigator} handleBack={this.handleBack.bind(this)} /> );
        case 'register':
          return ( <Register navigator={this.props.navigator} handleBack={this.handleBack.bind(this)} /> );
      }

    }
    return (
      <View style={styles.container}>
        <TopTabs toggleTab={this.toggleTab.bind(this)} active={this.state.activeTab}/>
        { activeTab() }
      </View>
    );
  }
}



module.exports = Auth;
