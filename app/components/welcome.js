/* @flow */


var React = require('react-native');

var {
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
var Facebook = require('./facebook');

var slides = [
  {
    title: '',
    img: require('image!trippple-logo-small'),
    content: ''
  },
  {
  	title: 'Browse',
  	img: require('image!tour-browse'),
  	content: 'Find adventurous couples and singles near you.'
  },
  {
  	title: 'Match',
  	img: require('image!tour-match'),
  	content: 'If they like you too, we\'ll connect you.'
  },
  {
  	title: 'Connect',
  	img: require('image!tour-connect'),
  	content: 'Chat with real Couples or Singles in your area.'
  },
  {
  	title: 'Private & Discreet',
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
        initialTab: selectedTab
      }
    })
  },

  handleFacebookButton(){
    console.log('handle FB login',this.props.navigator,this.props.route)

    this.props.navigator.push({
      component: Facebook,
      title: 'FB Login',
      id:'fblogin',
    })
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

class Carousel extends React.Component{
  render(){
    var welcomeSlides = slides.map( (slide,i) => {
      return (
        <View key={i+'slide'+slide.title.trim()} style={styles.slide}>
          <Image style={styles.slideImage} source={slide.img} resizeMode={Image.resizeMode.contain}/>
          <View style={styles.textwrap}><Text style={[styles.textplain]}>{slide.title}</Text></View>
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
          dot={ <View style={styles.dot} /> }
          activeDot={ <View style={styles.activeDot} /> }
        >
          {welcomeSlides}
        </Swiper>
    )
  }
}


var Welcome = React.createClass({

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
    color:'#fff',
    alignSelf:'center',
    fontSize:26,
    fontFamily:'omnes',
    textAlign:'center'
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 3,
    marginBottom: 3,
    borderColor: colors.shuttleGray
  },
  activeDot: {
    backgroundColor: colors.outerSpace,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 6,
    marginRight: 6,
    marginTop: 3,
    marginBottom: 3,
    borderWidth: 2,
    borderColor: colors.mediumPurple2
  }
});


module.exports = Welcome;
