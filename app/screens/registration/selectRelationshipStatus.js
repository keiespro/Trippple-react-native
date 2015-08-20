var React = require('react-native');
var {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Navigator,
  Image,
  ScrollView,
  TouchableHighlight,
  LayoutAnimation,
} = React;

var UserActions = require('../../flux/actions/UserActions');
var Birthday = require('../../controls/birthday');
var ImageUpload = require('../../components/imageUpload');
var Privacy = require('../../components/privacy');
var colors = require('../../utils/colors')

var DistanceSlider = require('../../controls/distanceSlider');
var ToggleSwitch = require('../../controls/switches');
var NameScreen = require('./name');

var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
var Facebook = require('./facebook');
var InvitePartner = require('./invitePartner');

class SelectRelationshipStatus extends Component{

  constructor(props){

    super()

    this.state = {
      selection: null
    }

    console.log('SelectRelationshipStatus')

  }

  _selectSingle(){
    this.setState({
      selection: 'single'
    })
    this._continue('single');
  }
  _selectCouple(){
    this.setState({
      selection: 'couple'
    })
    this._continue('couple');
  }
  _continue(selection){
    UserActions.updateUserStub({relationship_status: selection});

    if(selection === 'single'){

      this.props.navigator.push({
        component: Facebook,
        id: 'fb',
        passProps: {
          relationship_status: selection
        }
      })

    }else if(selection === 'couple'){
      this.props.navigator.push({
        component: InvitePartner,
        id: 'invite',
        passProps: {
          relationship_status: selection
        }
      })
    }
  }
  render(){

    return (
      <View style={styles.container}>
          <Text style={styles.labelText}>{"We’re a Couple\nLooking to meet singles"}</Text>

          <BoxyButton
              text={"TRIPPPLE FOR COUPLES"}
              outerButtonStyle={styles.iconButtonOuter}
              leftBoxStyles={styles.iconButtonLeftBoxCouples}
              innerWrapStyles={styles.iconButtonCouples}
              _onPress={this._selectCouple.bind(this)}>

              <Image source={require('image!ovalCouple')}
                        resizeMode={Image.resizeMode.contain}
                            style={{height:30,width:70}} />

          </BoxyButton>

          <View style={styles.dividerWrap}>
            <View style={styles.dividerLine}/>
            <Text style={styles.dividerText}>OR</Text>
          </View>

          <Text style={styles.labelText}>{"I’m a Single\nLooking to meet couples"}</Text>

          <BoxyButton
              text={"TRIPPPLE FOR SINGLES"}
              outerButtonStyle={styles.iconButtonOuter}
              leftBoxStyles={styles.iconButtonLeftBoxSingles}
              innerWrapStyles={styles.iconButtonSingles}
              _onPress={this._selectSingle.bind(this)}>

              <Image source={require('image!ovalSingle')}
                        resizeMode={Image.resizeMode.contain}
                            style={{height:30,width:30}}/>

          </BoxyButton>
      </View>
    )
  }
}


var styles = StyleSheet.create({
  dividerLine:{
    height:27,
    position:'absolute',
    width:DeviceWidth - 50,
    alignSelf:'stretch',
    marginHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor:colors.rollingStone,
  },
  dividerWrap:{
    marginVertical:20,
    width:DeviceWidth - 50,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    height:30
  },
  dividerText:{
    color:colors.rollingStone,
    fontSize:25,
    padding:10,
    textAlign:'center',
    backgroundColor: colors.outerSpace,
    fontFamily:'Montserrat'
  },
  container: {
    flex: 1,
    height:DeviceHeight,
    width:DeviceWidth,
    padding:0,
    left:0,
    right:0,
    top:0,
    bottom:0,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.mandy
  },


  labelText:{
    color:colors.rollingStone,
    fontSize:18,
    fontFamily:'omnes',
    textAlign:'center',
    marginVertical:20
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
  iconButtonCouples:{
    borderColor: colors.mediumPurple,
    borderWidth: 1,
  },
  iconButtonSingles:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1,

  },
  iconButtonOuter:{
    marginVertical:40
  },
  iconButtonSelected:{
    // backgroundColor:,
  },
  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
  }
});


export default SelectRelationshipStatus;
