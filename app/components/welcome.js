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

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;

var Register = require('./register');
var Login = require('./login');
var Facebook = require('./facebook');
var Composer = require('NativeModules').RNMessageComposer;

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

  handleSendMessage(){
    Composer.composeMessageWithArgs(
    {
        'messageText':'My sample message body text',
        'subject':'My Sample Subject',
        'recipients':['3055282534']
    },
    (result) => {
        switch(result) {
            case Composer.Sent:
                console.log('the message has been sent');
                break;
            case Composer.Cancelled:
                console.log('user cancelled sending the message');
                break;
            case Composer.Failed:
                console.log('failed to send the message');
                break;
            case Composer.NotSupported:
                console.log('this device does not support sending texts');
                break;
            default:
                console.log('something unexpected happened');
                break;
        }
    }
    );
  },
  render(){
    console.log('render intro',this.props.route)
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
          <TouchableHighlight
             style={styles.button}
             onPress={this.handleSendMessage}
             underlayColor="black">
             <Text style={styles.buttonText}>send text</Text>
          </TouchableHighlight>
      </View>
    )
  }
})

class Carousel extends React.Component{
  render(){
    var welcomeSlides = slides.map( (slide,i) => {
      return (
        <View key={i} style={styles.slide}>
          <Image style={styles.slideImage} source={slide.img} resizeMode={Image.resizeMode.contain}/>
          <View style={styles.textwrap}><Text style={[styles.textplain]}>{slide.title}</Text></View>
        <View style={styles.textwrap}><Text style={[styles.textplain]}>{slide.content}</Text></View>
        </View>
      )
    })
    return (
      <ScrollView
        contentContainerStyle={styles.carousel}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        >
          {welcomeSlides}
      </ScrollView>
    )
  }
}

class WelcomeCarousel extends React.Component{
  handleGetStartedButton(){
    this.props.navigator.push({
      component: IntroScreen,
      title: 'Intro',
      id:'intro'
    })

  }

  render(){


    return (
      <View  style={[styles.container]}>
        <Carousel/>
        <View style={[styles.bottomarea]}>
          <TouchableHighlight
             style={styles.button}
             onPress={this.handleGetStartedButton.bind(this)}
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
        <Navigator
            initialRoute={{
              component: WelcomeCarousel,
              title: 'intro',
              id:'intro',
              index:0,
              passProps: {
              }
            }}
            renderScene={this.renderScene}
        />


    );
  },


});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6A85B1',
    padding:20,
    alignSelf:'stretch'
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
  scrollview:{
    // overflow:'hidden'
    alignSelf: 'stretch',
    height: undefined,
width: DeviceWidth,
flex:1,


  },
  carousel:{
    // overflow:'hidden',
    alignSelf:'stretch',
    height:undefined,
    width: DeviceWidth,
    flex:1,
    top:0
  },
  slide:{
    width: DeviceWidth,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-start',
    flexWrap:'nowrap',
  },
  slideImage:{
    width: 150,
    height:400
  },
  bottomarea:{
    height:100,
    width: undefined,
    alignSelf:'stretch'
  },
  textwrap:{
    alignItems:'center',
    justifyContent:'center',

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
