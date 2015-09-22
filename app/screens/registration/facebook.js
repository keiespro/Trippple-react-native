import React from 'react-native'

import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  View,
  Component,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'

import { FBLoginManager } from 'NativeModules'
import colors from '../../utils/colors'
import UserActions from '../../flux/actions/UserActions'
import BoxyButton from '../../controls/boxyButton'
import BackButton from '../../components/BackButton'
import FBPhotoAlbums from '../../components/fb.login'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import FacebookButton from '../../buttons/FacebookButton'


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
    //  FBLoginManager.getCredentials((error, data) =>{
    //   console.log(error, data);
    //
    //   if (!error) {
    //     this.setState({ user : data})
    //   }
    // });

  }


  handleCredentials(fbUser){
    console.log(fbUser)
    this.setState({fbUser})
    var api = `https://graph.facebook.com/v2.3/${fbUser.userId}?access_token=${fbUser.token}`;

    console.log('FB api > ProfileInfo',api);

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData)

        var {
          email,
          first_name,
          gender,
          facebook_id,
          last_name,
          verified,
          timezone,
          updated_time
        } = responseData;

        UserActions.updateUserStub({
          email,
          first_name,
          gender,
          facebook_id,
          last_name,
          fb_verified:verified,
          timezone,
          fb_updated_time:updated_time
        });
      })
      .done();

  }


  skipFacebook =()=>{

    var lastindex = this.props.navigator.getCurrentRoutes().length;
    console.log(lastindex);
    var nextRoute = this.props.stack[lastindex];

    nextRoute.passProps = {
      ...this.props,

    }
    this.props.navigator.push(nextRoute)


  }

  render() {
    // var text = this.state.user ? "LOG OUT" : "LOG IN WITH FACEBOOK";
    return (
     <View style={{width:DeviceWidth,height:DeviceHeight,position:'relative',backgroundColor:colors.outerSpace}}>

         <View style={{width:100,height:50,left:20}}>
          <BackButton navigator={this.props.navigator}/>
        </View>

      <View style={[styles.container,this.props.wrapperStyle]}>

          <View style={styles.middleTextWrap}>
            <Text style={styles.middleText}>Save time. Get more matches.</Text>
          </View>

          <FacebookButton buttonType={'onboard'} buttonText={'VERIFY WITH FB'} _onPress={this.handleCredentials.bind(this)} />

          <View style={styles.middleTextWrap}>
            <Text style={[styles.middleText,{fontSize:16,marginTop:20}]}>Don’t worry, we wont tell ever your friends or post on your wall.</Text>
          </View>

          <View style={[styles.middleTextWrap,styles.bottomwrap]}>
            <TouchableOpacity
              onPress={this.skipFacebook}
            >
              <Text style={styles.middleText}>No thanks</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop:0,
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
    color:colors.rollingStone,
    fontSize:20,
    fontFamily:'omnes',
    textAlign:'center',
    marginVertical:20
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
    marginBottom: -DeviceHeight/4,
  }
});

export { FacebookButton }
export default Facebook
