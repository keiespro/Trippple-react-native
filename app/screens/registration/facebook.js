var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  TouchableHighlight,
} = React;

var FBLoginManager = require('NativeModules').FBLoginManager;
var colors = require('../../utils/colors')
var UserActions = require('../../flux/actions/UserActions')
var BoxyButton = require('../../controls/boxyButton')
var NameScreen = require('./name');

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;



class FacebookButton extends React.Component{
  render(){
    return(

      <BoxyButton
        text={"VERIFY WITH FACEBOOK"}
        outerButtonStyle={styles.iconButtonOuter}
        leftBoxStyles={styles.iconButtonLeftBoxCouples}
        innerWrapStyles={styles.iconButtonCouples}
        _onPress={this.props.onPress}>

          <Image source={require('image!fBlogo')}
                    resizeMode={Image.resizeMode.cover}
                        style={{height:40,width:20}} />
        </BoxyButton>

    )

  }
}

var Facebook = React.createClass({
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
      console.log(error, data);

      if (!error) {
        this.setState({ user : data});
        this.props.onLogin && this.props.onLogin(data);

      } else {
        console.log(error, data);
      }
    });
  },

  handleLogout(){

    FBLoginManager.logout((error, data)=>{
      if (!error) {
        this.setState({ user : null});
        this.props.onLogout && this.props.onLogout();
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

    FBLoginManager.getCredentials((error, data) =>{
      console.log(error, data);

      if (!error) {
        this.setState({ user : data})
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
      <View style={[styles.container,this.props.wrapperStyle]}>

          <View style={styles.middleTextWrap}>
            <Text style={styles.middleText}>Save time. Get more matches </Text>
          </View>

          <FacebookButton onPress={this.onPress} />

          <View style={styles.middleTextWrap}>
            <Text style={[styles.middleText,{fontSize:16,marginTop:20}]}>Don’t worry, we wont tell your friends or post on your wall</Text>
          </View>

          <View style={[styles.middleTextWrap,styles.bottomwrap]}>
            <TouchableHighlight
              onPress={this.skipFacebook}
            >
              <Text style={styles.middleText}>No thanks</Text>
            </TouchableHighlight>
          </View>
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
    padding:40,
    backgroundColor: colors.outerSpace
  },
  LogoBox: {
    width: 40
  },
  iconButtonOuter:{
    alignSelf:'stretch',
    marginVertical:15
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
    lineHeight:22
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
  bottomwrap:{
    marginTop:DeviceHeight/4,
    marginBottom: - DeviceHeight/4,
  }
});

export { FacebookButton };
export default Facebook;
