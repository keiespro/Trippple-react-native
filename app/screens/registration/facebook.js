import React from 'react-native'

import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  Component,
  TouchableHighlight,
} from 'react-native'

import { FBLoginManager } from 'NativeModules'
import colors from '../../utils/colors'
import UserActions from '../../flux/actions/UserActions'
import BoxyButton from '../../controls/boxyButton'

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

class Facebook extends Component{
  static propTypes = {
    style: View.propTypes.style,
    onPress: React.PropTypes.func,
    onLogin: React.PropTypes.func,
    onLogout: React.PropTypes.func,
  }

  constructor(props){
    super()
    this.state ={
      user: null,
    }
  }
  componentDidMount(){
     FBLoginManager.getCredentials((error, data) =>{
      console.log(error, data);

      if (!error) {
        this.setState({ user : data})
      }
    });

  }
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
  }

  handleLogout(){

    FBLoginManager.logout((error, data)=>{
      if (!error) {
        this.setState({ user : null});
        this.props.onLogout && this.props.onLogout();
      } else {
        console.log(error, data);
      }
    });
  }

  onPress(event){

    this.state.user
      ? this.handleLogout()
      : this.handleLogin();

    this.props.onPress && this.props.onPress();
  }


  skipFacebook =()=>{
    this.props.navigator.push({
      component: this.props.nextRoute,
    })
  }

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
}

const styles = StyleSheet.create({
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

export { FacebookButton }
export default Facebook
