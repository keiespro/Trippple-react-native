var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  LayoutAnimation,
  SegmentedControlIOS
} = React;

var UserActions = require('../../flux/actions/UserActions');
var Birthday = require('../../controls/birthday');
var ImageUpload = require('../../components/imageUpload');
var Privacy = require('../../components/privacy');
var colors = require('../../utils/colors')

var DistanceSlider = require('../../controls/distanceSlider');
var ToggleSwitch = require('../../controls/switches');
var NameScreen = require('./name');



  var NavigationBarRouteMapper = {

    LeftButton: function(route, navigator, index, navState) {
      if(route.id == 'aboutyou') return false;
      return (
        <TouchableOpacity
          onPress={() => {
            navigator.pop();
          }}>
          <View style={styles.navBarLeftButton}>
            <Text style={[styles.navBarText, styles.navBarButtonText]}>
              Back
            </Text>
          </View>
        </TouchableOpacity>

      );

    },
    Title: function(route, navigator, index, navState) {
      return (
        <View >
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            {route.title}
          </Text>
        </View>
      );
    },
    RightButton:  function(route, navigator, index, navState) {
      return false;
    }
  };

class OnboardSingle extends React.Component{

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
      return (<route.component {...route.passProps} navigator={navigator} user={this.props.user} />);
    }

    render(){


      return(

        <Navigator
                ref="nav"
                itemWrapperStyle={[styles.container,styles.padTop]}
                renderScene={this.selectScene.bind(this)}

                navigationBar={ <Navigator.NavigationBar routeMapper={NavigationBarRouteMapper} style={styles.navbar} /> }

                initialRoute={{
                   component: AboutYou,
                   title: 'About You',
                   id:'aboutyou'
                 }}
                  />


      )
    }
}
class OnboardCouple extends React.Component{
    render(){


      return(
        <View style={styles.container}>
          <Text style={styles.textplain}>COUPLE</Text>
          <AboutYou user={this.props.user}/>
        </View>
      )
    }
}

exports.onboardCouple = OnboardCouple;
exports.onboardSingle = OnboardSingle;

class Onboard extends React.Component{
  render() {
    console.log(this.props.user);

    switch (this.props.user.relationship_status){

      case "single":
        return (<OnboardSingle user={this.props.user}/>)
      case "couple":
        return (<OnboardCouple user={this.props.user}/>)
      case null:
      default:
        return (<SelectRelationshipStatus user={this.props.user}/>)

    }
  }

}


class SelectRelationshipStatus extends React.Component{

  constructor(props){

    super(props);

    this.state = {
      selection: null
    }
  }

  _selectSingle(){
    this.setState({
      selection: 'single'
    })
    this._continue();
  }
  _selectCouple(){
    this.setState({
      selection: 'couple'
    })
    this._continue();
  }
  _continue(){



    this.props.navigator.push({
      component: NameScreen,
      title: 'Name',
      id:'Name',
      passProps: {
        relationship_status: this.state.selection
      }
    })
    // UserActions.updateUser({relationship_status:this.state.selection})
  }
  render() {

    return (
      <View style={styles.container}>

          <TouchableHighlight
            onPress={this._selectCouple.bind(this)}>
            <View
              style={[styles.iconButton,styles.iconButtonCouples]}>
              <View
                style={[styles.iconButtonLeftBox,styles.iconButtonLeftBoxCouples]}>
                <Image source={require('image!oval2')} resizeMode={Image.resizeMode.cover} style={{height:30,width:30,right:-5}}/>
                <Image source={require('image!oval2')} resizeMode={Image.resizeMode.cover} style={{height:30,width:30,left:-5,top:0}}/>
              </View>
              <View
                style={styles.iconButtonRightBox}>
                <Text style={[styles.textplain,styles.iconButtonText]}>TRIPPPLE FOR COUPLES</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this._selectSingle.bind(this)}>
            <View
              style={[styles.iconButton,styles.iconButtonSingles]}>
              <View
                style={[styles.iconButtonLeftBox,styles.iconButtonLeftBoxSingles]}>
                <Image source={require('image!oval2')} resizeMode={Image.resizeMode.cover} style={{height:30,width:30}}/>
              </View>
              <View
                style={styles.iconButtonRightBox}>
                <Text style={[styles.textplain,styles.iconButtonText]}>TRIPPPLE FOR SINGLES</Text>
              </View>
            </View>
          </TouchableHighlight>

      {/*    <TouchableHighlight
            style={[styles.iconButton,styles.iconButtonSingles,(this.state.selection == 'single' && styles.iconButtonSelected)]}
            onPress={this._selectSingle.bind(this)}>
            <Text style={[styles.textplain,styles.iconButtonText]}>TRIPPPLE FOR SINGLES</Text>
          </TouchableHighlight>

           this.state.selection ?
            <TouchableHighlight
              style={styles.button}
              onPress={this._continue.bind(this)}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableHighlight> :
            <View style={[styles.button,styles.disabledButton]}>
              <Text style={[styles.buttonText, styles.disabledbuttonText]}>Continue</Text>
            </View> */}

      </View>
    );
  }


}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    height:undefined,
    width:undefined,
    padding:0,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace
  },
  padTop:{

    paddingTop:60
  },
  textplain:{
    // color:'#111',
    // fontSize:30,
    fontFamily:'omnes'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
    fontFamily:'omnes'

  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: '#111',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  disabledButton: {
    borderColor: '#aaa',
  },
  disabledButtonText: {
    fontSize: 18,
    color: '#aaa',
    alignSelf: 'center',
    fontFamily:'omnes'

  },
  iconButton:{
    height:70,
    alignItems:'center',
    flexDirection: 'row',
    justifyContent:'center',
    alignSelf:'stretch',
    flex: 1,
    width: undefined
    // marginVertical:10
  },
  iconButtonLeftBox: {
    width: 80,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:10,
  },
  iconButtonLeftBoxCouples: {
    backgroundColor: colors.mediumPurple20,
    borderRightColor: colors.mediumPurple,
    borderRightWidth: 1
  },
  iconButtonLeftBoxSingles: {
    backgroundColor: colors.darkSkyBlue20,
    borderRightColor: colors.darkSkyBlue,
    borderRightWidth: 1

  },
  iconButtonRightBox: {
    width: undefined,
    height: undefined,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding:20,
    flex: 1
  },
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1
  },
  iconButtonSingles:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1
  },
  iconButtonSelected:{
    // backgroundColor:,
  },


  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
  },
  textfieldWrap:{
    height:undefined,
    flex:1,
    alignSelf:'stretch',
    width:undefined
  },
  textfield:{
    color:'#111',
    backgroundColor:'#fff',
    fontSize:18,
    borderWidth:2,
    borderColor:'#111',
    paddingHorizontal:20,
    fontFamily:'omnes',
    height:60
  },
  header:{
    fontSize:24,
    fontFamily:'omnes'

  },
  panel:{
    width:undefined,
    height:undefined,

    borderColor:'#000',
    borderWidth:2
  },
  navBar: {
    backgroundColor: '#39365c',
    height: 50,
    justifyContent:'space-between',
    alignSelf: 'stretch',
    alignItems:'center',
  },
  navBarText: {
    fontSize: 16,
  },
  navBarTitleText: {
    color: '#222',
    fontWeight: '500',
    fontFamily:'omnes',
    height: 50,

  },
  navBarLeftButton: {
    paddingLeft: 10,
    height: 50,

  },
  navBarRightButton: {
    paddingRight: 10,
    height: 50,

  },
  navBarButtonText: {
    color: '#dddddd',
    fontFamily:'omnes'
  },
  continue:{
    backgroundColor:'green',
    alignItems:'center',
    justifyContent:'center',
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight:15,
    backgroundColor:'#fff',
    height:60,
  },
  tallFormRow: {
    width: 250,
    left:0,
    height:120,
    alignSelf:'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  sliderFormRow:{
    height:120,
    paddingLeft: 30,
    paddingRight:30
  },

});


module.exports = Onboard;
