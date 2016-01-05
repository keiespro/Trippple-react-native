/* @flow */
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Navigator,
  Dimensions,
  TouchableHighlight
} from 'react-native'

import TimerMixin from 'react-timer-mixin'

import colors from '../utils/colors'
import Swiper from '../controls/swiper'
const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import CustomSceneConfigs from '../utils/sceneConfigs'
import Auth from './auth'
import Facebook from '../screens/registration/facebook'



const LOGIN   = 'login';
const REGISTER = 'register'
import Mixpanel from '../utils/mixpanel';
import {MagicNumbers} from '../DeviceConfig'

import dismissKeyboard from 'dismissKeyboard'
import FadeInContainer from '../components/FadeInContainer'
var slides = [
  {
    title: '',
    img: require('../../newimg/logo.png'),
    content: ''
  },
  {
    title: 'BROWSE',
    img: require('../../newimg/tour-browse.png'),
    content: 'Find like-minded Couples and Singles.'
  },
  {
    title: 'MATCH',
    img: require('../../newimg/tour-match.png'),
    content: 'If they like you too, we\'ll connect you.'
  },
  {
    title: 'CONNECT',
    img: require('../../newimg/tour-connect.png'),
    content: 'Chat with real Couples or Singles who share your interests.'
  },
  {
    title: 'PRIVATE & DISCREET',
    img: require('../../newimg/tour-privacy.png'),
    content: 'Protect your identity. Easily block friends and family.'
  },

];

var IntroScreen = React.createClass({
  getInitialState(){
    return {
      isAnimating: false
    }
  },

  mixins: [TimerMixin],

  activateAnimatingState(){
    this.setState({isAnimating:true})

    this.setTimeout(
     () => { this.setState({isAnimating:false}) },
     500
   );
  },

  handleNext(selectedTab){

      switch(selectedTab) {

      case LOGIN:
          Mixpanel.track ("CTA - Login");
          break;

      case REGISTER:
          Mixpanel.track ("CTA - Sign Up");
          break;
      }

    this.activateAnimatingState();
    this.props.navigator.push({
      component: Auth,
      title: 'Log in or Sign up',
      id:'auth',
      passProps: {
        initialTab: selectedTab,
        navigator: this.props.navigator
      }
    })
  },

  handleFacebookButton(){

    this.props.navigator.push({
      component: Facebook,
      title: 'FB Login',
      id:'fblogin',
      sceneConfig:CustomSceneConfigs.HorizontalSlide,

    })
  },

  componentDidMount() {
      Mixpanel.track('On - Splash Screen');
  },

  render(){
    return(
      <View style={[styles.container]}>
        <View style={styles.wrap}>
          <Carousel/>
        </View>
        <View style={styles.bottomButtons}>
          <TouchableHighlight
            style={[styles.bottomButton,(this.state.isAnimating ? styles.activeButton : styles.loginButton )]}
            onPress={ () => this.handleNext(LOGIN)}
             underlayColor={colors.outerSpace}>
             <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableHighlight>
          <TouchableHighlight
             style={[styles.bottomButton,(this.state.isAnimating ? styles.activeButton : styles.registerButton )]}
             onPress={ () => this.handleNext(REGISTER)}
             underlayColor={colors.outerSpace}>
             <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
})

class Carousel extends Component{
  constructor(props){
    super()
    this.state =  {slides}
  }
  render(){
    var welcomeSlides = this.state.slides.map( (slide,i) => {
      return (
        <View key={i+'slide'+i} style={styles.slide}>
        <Image style={ {
            marginBottom:25,
            height: MagicNumbers.is4s ? 150 : DeviceHeight/3 + MagicNumbers.screenPadding,
            paddingTop: 20,
            marginTop: i == 0 ? MagicNumbers.screenPadding*1.8 : MagicNumbers.screenPadding,
            width: i == 0 ? MagicNumbers.screenWidth : MagicNumbers.screenPadding*5
          } } source={slide.img} resizeMode={Image.resizeMode.contain}/>
      <View style={[styles.textwrap,{marginBottom:5}]}><Text style={[styles.textplain,
          {
            fontFamily:'Montserrat',
            fontWeight:'700',
            marginTop:15,
            fontSize: MagicNumbers.is4s ? 18 : 22,
          }
          ]}>{slide.title}</Text></View>
          <View style={styles.textwrap}><Text style={[styles.textplain,{
            fontSize: MagicNumbers.is4s ? 18 : 22,
          }]}>{slide.content}</Text></View>
        </View>
      )
    })
    return (
        <Swiper
          loop={true}
          style={styles.carousel}
          horizontal={true}
          grayDots={true}
          showsPagination={true}
        >
          {welcomeSlides}
        </Swiper>
    )
  }
}


var Welcome = React.createClass({

  componentDidMount() {
      Mixpanel.track('On - Home Screen');
      this.refs.nav.navigationContext.addListener('willfocus', (e)=>{
        dismissKeyboard();
      })
  },

  renderScene(route: Navigator.route, navigator: Navigator) : React.Component {
    return (<route.component {...route.passProps} key={route.id} navigator={navigator} />);
  },

  render() {

    return (
      <FadeInContainer
        delayAmount={800}
        duration={500}>

        <Image resizeMode={Image.resizeMode.cover} style={styles.imagebg}>
          <Navigator
            initialRoute={{
              component: IntroScreen,
              title: 'intro',
              id:'intro',
            }}
            ref={'nav'}
            key={'innerNav'}
            configureScene={ (route) => {
              return route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.VerticalSlide
            }}
            renderScene={this.renderScene}
          />
        </Image>
      </FadeInContainer>
    );
  },


});


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
  textplain:{
    color: colors.white,
    alignSelf:'center',
    fontSize:22,
    fontFamily:'omnes',
    textAlign:'center'
  },
  buttonText: {
    fontSize: 22,
    color: colors.white,
    alignSelf: 'center',
    fontFamily:'Montserrat'
  },
  carousel:{
    flex:1,
    marginTop:50,
  },
  slide:{
    width: DeviceWidth,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    flexWrap:'nowrap',
    padding:MagicNumbers.screenPadding/2
  },


  bottomarea:{
    height:140,
    width: undefined,
    alignSelf:'stretch',
    bottom:100
  },
  textwrap:{
    alignItems:'center',
    justifyContent:'center',
  },
  imagebg:{
    flex: 1,
    alignSelf:'stretch',
    width: DeviceWidth,
    height: DeviceHeight,
    backgroundColor: colors.outerSpace
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  bottomButton: {
    height: 80,
    flex:1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  loginButton:{
    backgroundColor: colors.shuttleGray,
  },
  activeButton:{
    backgroundColor: colors.outerSpace,
  },
  registerButton:{
    backgroundColor: colors.mediumPurple,
  },
  wrap:{
    marginTop:20,
    alignItems: 'center',
    flex:1,
    justifyContent:'center',
    alignSelf: 'stretch',
    height:undefined,
    paddingBottom: 100
  },
  bottomButtons: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignSelf:'stretch',
    width: undefined
  },
  dot: {
    backgroundColor: colors.shuttleGray,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 3,
    marginBottom: 3,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.mediumPurple20,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 3,
    marginBottom: 3,
    borderWidth: 2,
    borderColor: colors.mediumPurple
  }
});


module.exports = Welcome;
