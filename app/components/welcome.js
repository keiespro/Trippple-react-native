/* @flow */
var React = require('react-native');

var {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Navigator,
  TouchableHighlight
} = React;

var TimerMixin = require('react-timer-mixin');

var colors = require('../utils/colors')
var Swiper = require('react-native-swiper');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
var CustomSceneConfigs = require('../utils/sceneConfigs');
var Auth = require('./auth');
var Facebook = require('../screens/registration/facebook');
import Mixpanel from '../utils/mixpanel';

var slides = [
  {
    title: '',
    img: require('image!logo'),
    content: ''
  },
  {
  	title: 'BROWSE',
  	img: require('image!tour-browse'),
  	content: 'Find adventurous couples and singles near you.'
  },
  {
  	title: 'MATCH',
  	img: require('image!tour-match'),
  	content: 'If they like you too, we\'ll connect you.'
  },
  {
  	title: 'CONNECT',
  	img: require('image!tour-connect'),
  	content: 'Chat with real Couples or Singles in your area.'
  },
  {
  	title: 'PRIVATE & DISCREET',
  	img: require('image!tour-privacy'),
  	content: 'Protect your identity. Hide from friends and family.'
  }
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
    console.log('handle register',selectedTab)

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
    console.log('handle FB login',this.props.navigator,this.props.route)

    this.props.navigator.push({
      component: Facebook,
      title: 'FB Login',
      id:'fblogin',
      sceneConfig:CustomSceneConfigs.HorizontalSlide,

    })
  },

  componentDidMount() {
      ['On - Splash Screen',
       'On - Home',
       'CTA - Sign Up',
       'CTA - Login',
       'On - Phone Number',
       'Admin - Twillio',
       'CTA - Continue'].forEach(function (evName){
           Mixpanel.track(evName);
       });

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
            onPress={ () => this.handleNext('login')}
             underlayColor={colors.outerSpace}>
             <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableHighlight>
          <TouchableHighlight
             style={[styles.bottomButton,(this.state.isAnimating ? styles.activeButton : styles.registerButton )]}
             onPress={ () => this.handleNext('register')}
             underlayColor={colors.outerSpace}>
             <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
})

class Carousel extends Component{
  render(){
    var welcomeSlides = slides.map( (slide,i) => {
      return (
        <View key={i+'slide'+slide.title.trim()} style={styles.slide}>
        <Image style={[styles.slideImage,
          {
            paddingTop: i == 0 ? 60 : 20,
            width: i == 0 ? 150 : 150
          }
        ]} source={slide.img} resizeMode={Image.resizeMode.contain}/>
        <View style={styles.textwrap}><Text style={[styles.textplain,
          {
            fontFamily:'Montserrat',
            fontWeight:"700",
            marginTop:15
          }
          ]}>{slide.title}</Text></View>
          <View style={styles.textwrap}><Text style={[styles.textplain]}>{slide.content}</Text></View>
        </View>
      )
    })
    return (
        <Swiper
          loop={true}
          style={styles.carousel}
          horizontal={true}
          showsPagination={true}
          showsButtons={false}
          dot={ <View style={styles.dot} />}
          activeDot={ <View style={styles.activeDot} /> }
        >
          {welcomeSlides}
        </Swiper>
    )
  }
}


var Welcome = React.createClass({

  componentDidMount() {
      console.log('welcome evt');
  },
  renderScene(route: Navigator.route, navigator: Navigator) : React.Component {
    return (<route.component {...route.passProps} key={route.id} navigator={navigator} />);
  },

  render() {

    return (
      <Image resizeMode={Image.resizeMode.cover} source={require('image!gradientbgs')} style={styles.imagebg}>
        <Navigator
          initialRoute={{
            component: IntroScreen,
            title: 'intro',
            id:'intro',
          }}
          key={'innerNav'}
          configureScene={ (route) => {
            return route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.VerticalSlide
          }}
          renderScene={this.renderScene}
        />
      </Image>

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
    justifyContent:'flex-start',
    flexWrap:'nowrap',
    padding:20
  },
  slideImage:{
    width: 150,
    height:350
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
