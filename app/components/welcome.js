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
    console.log('render intro',this.props.route)
    return(
      <View style={styles.container}>
      <Text style={[styles.textplain]}>Welcome Screen</Text>
        <TouchableHighlight
           style={styles.button}
           onPress={this.handleLoginButton.bind(this)}
           underlayColor="black">
           <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight
           style={styles.button}
           onPress={this.handleRegisterButton.bind(this)}
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
        <View key={i} style={styles.slide}>
          <Image style={styles.slideImage} source={slide.img}/>
          <Text style={[styles.textwrap,styles.textplain]}>{slide.title}</Text>
          <Text style={[styles.textwrap,styles.textplain]}>{slide.content}</Text>
        </View>
      )
    })
    return (
      <ScrollView
        contentContainerStyle={styles.carousel}
        horizontal={true}
        decelerationRate={0.99}
        showsHorizontalScrollIndicator={true}
        pagingEnabled={true}
        scrollEnabled={true}
        onScrollAnimationEnd={() => { console.log('onScrollAnimationEnd!'); }}
        onScroll={() => { console.log('onScroll!'); }}
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
    backgroundColor: '#fff',
    alignSelf:'stretch'
  },
  textplain:{
    color:'#111',
    fontSize:30,
    fontFamily:'omnes'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
    fontFamily:'omnes'

  },
  scrollview:{
    // overflow:'hidden'
    alignSelf: 'stretch',
    height: undefined,

    width:1280


  },
  carousel:{
    // overflow:'hidden',
    alignSelf:'stretch',
    height:undefined,
    width: undefined,
  },
  slide:{
    alignSelf: 'stretch',
    width: 320,
    flexDirection:'column',
    flexWrap:'wrap',
    backgroundColor: 'red',
  },
  slideImage:{
    width: 200,
    height: 200,
  },
  bottomarea:{
    height:100,
    width: undefined,
    alignSelf:'stretch'
  },
  textwrap:{

  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },

});


module.exports = Welcome;
