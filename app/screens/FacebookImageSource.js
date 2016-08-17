import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, Image, View, TouchableHighlight, Modal, Dimensions,NativeModules} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

const {OSPermissions} = NativeModules

import {MagicNumbers} from '../DeviceConfig'
import OnboardingActions from '../flux/actions/OnboardingActions'
import FBPhotoAlbums from '../components/fb.login'
import FacebookButton from '../buttons/FacebookButton'
import BoxyButton from '../controls/boxyButton'
import colors from '../utils/colors'
import NavigatorSceneConfigs from 'NavigatorSceneConfigs'
import BackButton from '../components/BackButton'
import EditImage from './EditImage'
import EditImageThumb from './EditImageThumb'

class FacebookImageSource extends Component{

  static propTypes = {
    imageType: PropTypes.oneOf(['profile','couple_profile','avatar']),

  };

  static defaultProps = {
    imageType: 'profile'
  };

  constructor(props){
    super();
    this.state = {
    }

  }

  onPressFacebook(fbUser){
     var nextRoute = {name:'FBPhotoAlbums',key:'fba'+Math.random(1)}
     nextRoute.component = FBPhotoAlbums
    nextRoute.passProps = {
      ...this.props,
      image_type: this.props.image_type || this.props.imageType,
      nextRoute: EditImage,
      fbUser
    }
    nextRoute.sceneConfig = NavigatorSceneConfigs.FloatFromBottom
    this.props.navigator.push(nextRoute)

  }



  render(){

    const isCoupleImage = this.props.image_type == 'couple_profile' || this.props.imageType == 'couple_profile';
    const copy = {
        coupleTitle: `YOUR PIC`,
        singleTitle: `YOUR PIC`,
        coupleSubtitle: ()=>{
          return (
            <Text style={[styles.textTop,{marginTop:0}]}>
              <Text>Pick a Facebook pic of </Text>
              <Text style={{color:colors.sushi}}>you and your partner {MagicNumbers.is4s ? null : 'together'}</Text>
              <Text>.</Text>
            </Text>
          )
        },
        singleSubtitle: () => {
          return (
            <Text style={[styles.textTop,{marginTop:0}]}>
              <Text>Pick a Facebook pic of </Text>
              <Text style={{color:colors.sushi}}>yourself.</Text>
              <Text>This is the picture your matches will see during your chats.</Text>
            </Text>
          )
        }

    }


console.log(this.props);
    return (
      <View style={styles.container}>

        {/* <View style={{width:100,left:10,position:'absolute',alignSelf:'flex-start',top:-10}}>
          <BackButton navigator={this.props.navigator}/>
        </View> */}
        <View style={{justifyContent:'space-around',alignItems:'center',flex:1,marginTop:MagicNumbers.is5orless ? 30 : 50,marginBottom:MagicNumbers.is5orless ? 10 : 0}}>
        <Text style={styles.textTop}>{ isCoupleImage ? copy.coupleTitle : copy.singleTitle }</Text>

        {isCoupleImage ? copy.coupleSubtitle() : copy.singleSubtitle()}


        <View style={styles.imageHolder}>
          <Image
            source={
              isCoupleImage ?
               {uri: 'assets/iconCouplePic@3x.png'} :
                {uri: 'assets/iconSinglePic@3x.png'}
              }
            resizeMode={Image.resizeMode.contain}
            style={styles.imageInside}
          />
        </View>

        <View>

          <View style={styles.fbButton}>
            {/* <FacebookButton
              buttonType={'upload'}
              _onPress={this.onPressFacebook.bind(this)}
              key={'notthesamelement'}
              buttonText="UPLOAD FROM FB"
              shouldAuthenticate={true}
            /> */}

            <BoxyButton
              text={`LOG IN WITH FACEBOOK`}
              buttonText={this.props.buttonTextStyle}
              outerButtonStyle={styles.iconButtonOuter}
              leftBoxStyles={styles.buttonIcon}
              innerWrapStyles={styles.button}
              underlayColor={colors.cornFlower}
              _onPress={this.onPressFacebook.bind(this)}>

                <Image source={{uri: 'assets/fBlogo@3x.png'}}
                          resizeMode={Image.resizeMode.contain}
                              style={{height:30,width:20,}} />
              </BoxyButton>

          </View>

          {/* <View style={styles.twoButtons}>

            <TouchableHighlight
              style={[styles.plainButton,{marginRight:MagicNumbers.screenPadding/4}]}
              onPress={this.getCameraRollPermission.bind(this)}
              underlayColor={colors.shuttleGray20}
            >
              <Text style={styles.plainButtonText}>FROM ALBUM</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.plainButton,{marginLeft:MagicNumbers.screenPadding/4}]}
              onPress={this.getCameraPermission.bind(this)}
              underlayColor={colors.shuttleGray20}
            >
              <Text style={[styles.plainButtonText]}>TAKE A SELFIE</Text>
            </TouchableHighlight>

          </View> */}
          </View>
        </View>
      </View>
    )
  }
}

FacebookImageSource.displayName = 'FacebookImageSource'

export default FacebookImageSource


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'center',
    alignSelf:'stretch',
    width: DeviceWidth,
    margin:0,
    backgroundColor: colors.outerSpace,
    // padding:0,
    height: DeviceHeight-60,
    padding:MagicNumbers.screenPadding/2
  },
  twoButtons:{
    flexDirection:'row',
    height:MagicNumbers.is5orless  ? 50 : 70,
    alignItems:'center',
    alignSelf:'stretch',
    justifyContent:'space-between',
    // padding:20,
    marginTop:MagicNumbers.isSmallDevice ? 0 : 0,
    marginBottom:0,
    width:MagicNumbers.screenWidth

  },

  plainButton:{
    borderColor: colors.rollingStone,
    borderWidth: 1,
    height:70,
    alignSelf:'stretch',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  plainButtonText:{
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily:'Montserrat',
    textAlign:'center',
  },
  textTop:{
    marginBottom: 0,
    fontSize: MagicNumbers.is5orless ? 16 : 20,
    color: colors.rollingStone,
    fontFamily:'omnes',
    textAlign:'center'
  },
  imageHolder:{
    width:MagicNumbers.is5orless ? DeviceWidth/2 - 10 : DeviceWidth/2 + 20,
    height:MagicNumbers.is5orless ? DeviceWidth/2 - 30 : DeviceWidth/2 ,
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:MagicNumbers.is5orless  ? 20 : 40
  },
  imageInside:{
    width:MagicNumbers.is5orless ? DeviceWidth/2 - 10 : DeviceWidth/2 + 20,
    height:MagicNumbers.is5orless ? DeviceWidth/2 - 30 : DeviceWidth/2 ,
  },
  fbButton:{
    alignItems:'stretch',
    alignSelf:'stretch',
    // marginHorizontal:20,
    width:MagicNumbers.screenWidth
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
   LogoBox: {
  },
  iconButtonOuter:{
    alignSelf:'stretch',
    flex:1,
    alignItems:'stretch',
    flexDirection:'row',
    height:MagicNumbers.is5orless ? 50 : 60,
    marginVertical:15,
  },
  middleTextWrap: {
    alignItems:'center',
    justifyContent:'center',
    height: 60
  },

  button:{
    borderColor: colors.cornFlower,
    borderWidth: 1,
    height:MagicNumbers.is5orless ? 50 : 60,

  },
  buttonIcon: {
    width:60,
    borderRightColor: colors.cornFlower,
    borderRightWidth: 1,
    backgroundColor: colors.cornFlower20,

  },
})
