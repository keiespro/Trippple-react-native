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
var SelectRelationshipStatus = require('./selectRelationshipStatus')
var Facebook = require('./facebook');
var CustomSceneConfigs = require('../../utils/sceneConfigs');

class OnboardSingle extends React.Component{

    selectScene(route: Navigator.route, navigator: Navigator) : React.Component {
      return (<route.component {...route.passProps} navigator={navigator} user={this.props.user} />);
    }
    handleFBLogin(data){
      console.log(data,'FB LOGIN')

    }
    render(){


      return(

        <Navigator
          ref="nav"
          renderScene={this.selectScene.bind(this)}
          sceneStyle={styles.sceneWrap}
          configureScene={ (route) => {
            return route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.VerticalSlide
          }}
          initialRoute={{
             component: Facebook,
             id:'fb',
             passProps: {
               onLogin: this.handleFBLogin,
             }
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

class Onboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      relationshipStatus: null
    }
  }

  choose(choice){
    this.setState({
      relationshipStatus: choice,
    });

  }

  render() {

    switch (this.state.relationshipStatus){

      case "single":
        return (<OnboardSingle user={this.props.user}/>)
      case "couple":
        return (<OnboardCouple user={this.props.user}/>)
      case null:
      default:
        return (<SelectRelationshipStatus user={this.props.user} choose={this.choose.bind(this)}/>)

    }
  }

}


var styles = StyleSheet.create({

  sceneWrap:{
    backgroundColor: colors.outerSpace
  },
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
