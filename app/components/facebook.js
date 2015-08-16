 ;
var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
} = React;

var FBLoginManager = require('NativeModules').FBLoginManager;
var colors = require('../utils/colors')

var FBLoginMock = React.createClass({
  propTypes: {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  },

  getInitialState: function(){
    return {
      user: null,
    };
  },

  handleLogin: function(){
    var _this = this;
    FBLoginManager.login(function(error, data){
      if (!error) {
        _this.setState({ user : data});
        _this.props.onLogin && _this.props.onLogin();
      } else {
        console.log(error, data);
      }
    });
  },

  handleLogout: function(){
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

  onPress: function(){
    this.state.user
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  },

  componentWillMount: function(){
    var _this = this;
    FBLoginManager.getCredentials(function(error, data){
      if (!error) {
        _this.setState({ user : data})
      }
    });
  },

  render: function() {
    var text = this.state.user ? "LOG OUT" : "LOG IN WITH FACEBOOK";
    return (
      <View style={this.props.style}>
        <TouchableHighlight
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
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LogoBox: {
    width: 40
  },
  FBLoginButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 60,
    paddingLeft: 2,

    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.mediumPurple,

  },
  TextBox: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,


  },
  FBLoginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Montserrat',
    fontSize: 14.2,
  },
  FBLoginButtonTextLoggedIn: {
    marginLeft: 5,
  },
  FBLoginButtonTextLoggedOut: {
    marginLeft: 18,
  },
  FBLogo: {
    position: 'absolute',
    height: 14,
    width: 14,
    opacity: 0.7,
    left: 7,
    top: 7,
  },
});

module.exports = FBLoginMock;
