'use strict';
var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
} = React;

var FBLoginManager = require('NativeModules').FBLoginManager;
var colors = require('../../utils/colors')
var UserActions = require('../../flux/actions/UserActions')
var BoxyButton = require('../../controls/boxyButton')
var NameScreen = require('./name');


var FBLoginMock = React.createClass({
  propTypes: {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  },

  getInitialState(){
    return {
      user: null,
    };
  },

  handleLogin(){
    FBLoginManager.login( (error, data) => {
      if (!error) {
        this.setState({ user : data});
        this.props.onLogin && this.props.onLogin(data);

      } else {
        console.log(error, data);
      }
    });
  },

  handleLogout(){
    var _this = this;
    FBLoginManager.logout(function(error, data){
      if (!error) {
        _this.setState({ user : null});
        _this.props.onLogout && _this.props.onLogout();
      } else {
        console.log(error, data);
      }
    });
  },

  onPress(){
    this.state.user
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  },

  componentWillMount(){
    var _this = this;
    FBLoginManager.getCredentials(function(error, data){
      if (!error) {
        _this.setState({ user : data})
      }
    });
  },


  skipFacebook(){
    this.props.navigator.push({
             component: NameScreen,
             title: 'About You',
             id:'aboutyou'
           })
  },

  render() {
    // var text = this.state.user ? "LOG OUT" : "LOG IN WITH FACEBOOK";
    return (
      <View style={styles.container}>
{/*        <TouchableHighlight
          style={styles.container}
          onPress={this.onPress}
        >
          <View style={styles.FBLoginButton}>
            <View style={styles.LogoBox}>
              <Text style={[styles.FBLoginButtonText, this.state.user ? styles.FBLoginButtonTextLoggedIn : styles.FBLoginButtonTextLoggedOut]}>F</Text>
            </View>
               <Image style={styles.FBLogo} source={require('image!fBlogo')} />
              <View style={styles.TextBox}>
                <Text style={[styles.FBLoginButtonText, this.state.user ? styles.FBLoginButtonTextLoggedIn : styles.FBLoginButtonTextLoggedOut]}
              numberOfLines={1}>{text}</Text>
              </View>

          </View>
        </TouchableHighlight>
*/}

        <View style={styles.middleTextWrap}>
          <Text style={styles.middleText}>Save time. Get more matches </Text>
        </View>
        <BoxyButton
            text={"VERIFY WITH FACEBOOK"}
            leftBoxStyles={styles.iconButtonLeftBoxCouples}
            innerWrapStyles={styles.iconButtonCouples}
            onPress={this.handleLogin}>

          <Image source={require('image!fBLogo')}
                    resizeMode={Image.resizeMode.cover}
                        style={{height:40,width:20}} />
        </BoxyButton>
        <View style={styles.middleTextWrap}>
          <Text style={styles.middleText}>Don’t worry, we wont tell your friends or post on your wall </Text>
        </View>

        <TouchableHighlight
            style={styles.middleTextWrap}
            onPress={this.skipFacebook}
          >
           <Text style={styles.middleText}>No thanks</Text>

        </TouchableHighlight>







      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    padding:20
  },
  LogoBox: {
    width: 40
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },
  middleText: {
    color: colors.rollingStone,
    fontSize: 21,
    textAlign:'center',
    fontFamily:'Montserrat',
  },

  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonLeftBoxCouples: {
      backgroundColor: colors.mediumPurple20,
      borderRightColor: colors.mediumPurple,
      borderRightWidth: 1
    },
});

module.exports = FBLoginMock;
