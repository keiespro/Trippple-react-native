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

var Swiper = require('react-native-swiper');
var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
var CustomSceneConfigs = require('../utils/sceneConfigs');
var Register = require('./register');
var Login = require('./login');
var Facebook = require('./facebook');

var slides = [
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

  handleRegisterButton(){
    console.log('handle register',this.props.navigator,this.props.route)

    this.props.navigator.push({
      component: Register,
      title: 'Register',
      id:'register',
    })
  },


  handleLoginButton(){
    console.log('handle login',this.props.navigator,this.props.route)

    this.props.navigator.push({
      component: Login,
      title: 'Login',
      id:'login',
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
    console.log('render intro',this.props.user)
    return(
      <View style={styles.container}>
        <Text style={[styles.textplain]}>Welcome Screen</Text>
        <TouchableHighlight
           style={styles.button}
           onPress={this.handleLoginButton}
           underlayColor="black">
           <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight
           style={styles.button}
           onPress={this.handleRegisterButton}
           underlayColor="black">
           <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>
        <Facebook/>

    </View>
    )
  }
})

class Carousel extends React.Component{
  render(){
    var welcomeSlides = slides.map( (slide,i) => {
      return (
        <View key={i+'slide'} style={styles.slide}>
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
        showsButtons={false}>
        {welcomeSlides}
      </Swiper>
    )
  }
}

class WelcomeCarousel extends React.Component{
  _handleGetStartedButton(){
    this.props.navigator.push({
      component: IntroScreen,
      title: 'Intro',
      id:'intro',
      sceneConfigs: ()=>{ return CustomSceneConfigs.VerticalSlide}
    })

  }

  render(){


    return (
      <View style={styles.container}>

        <Carousel/>
        <View style={[styles.bottomarea]}>
          <TouchableHighlight
             style={styles.button}
             onPress={this._handleGetStartedButton.bind(this)}
             underlayColor="black">
             <Text style={styles.buttonText}>Get Started</Text>
          </TouchableHighlight>
        </View>
    </View>
    )
  }
}

var Welcome = React.createClass({

  renderScene(route: Navigator.route, navigator: Navigator) : React.Component {
    return (<route.component {...route.passProps} navigator={navigator} />);
  },

  render() {

    return (
      <Image resizeMode={Image.resizeMode.cover} source={require('image!GradientBackground')} style={styles.imagebg}>

        <Navigator
            initialRoute={{
              component: WelcomeCarousel,
              title: 'intro',
              id:'intro',
              index:0
            }}
            configureScene={(route) => { return  route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.VerticalSlide}}

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
    fontFamily:'omnes'

  },

  carousel:{
    // overflow:'hidden',
    flex:1,
    marginTop:0,

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

});


module.exports = Welcome;
