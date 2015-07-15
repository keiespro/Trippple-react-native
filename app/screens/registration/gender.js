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

var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;


class GenderScreen extends React.Component{

  constructor(props){

    super(props);

    this.state = {
      selection: null
    }
  }

  _selectFemale(){
    this.setState({
      selection: this.state.selection == 'f' ? null : 'f'
    })
  }

  _selectMale(){
    this.setState({
      selection: this.state.selection == 'm' ? null : 'm'
    })

  }
  _continue(){

  }
  render() {

    return (
      <View style={styles.container}>
          <Text style={styles.labelText}>{"What's your gender?"} </Text>

          <BoxyButton
              text={"MALE"}
              leftBoxStyles={this.state.selection == 'm' ? styles.iconButtonLeftBoxMale : styles.grayIconbuttonLeftBox}
              innerWrapStyles={this.state.selection == 'm' ? styles.iconButtonMale : styles.grayIconbutton}
              _onPress={this._selectMale.bind(this)}>

            <Image source={require('image!boxers')}
                      resizeMode={Image.resizeMode.cover}
                          style={{height:21,width:30}} />
          </BoxyButton>

          <BoxyButton
              text={"FEMALE"}
              leftBoxStyles={this.state.selection == 'f' ? styles.iconButtonLeftBoxFemale : styles.grayIconbuttonLeftBox}
              innerWrapStyles={this.state.selection == 'f' ? styles.iconButtonFemale : styles.grayIconbutton}
              _onPress={this._selectFemale.bind(this)}>

              <Image source={require('image!bra')}
                        resizeMode={Image.resizeMode.cover}
                            style={{height:24,width:30}}/>

          </BoxyButton>


          <View style={[styles.continueButtonWrap,
              {
                bottom: this.state.selection ? 0 : -80,
                backgroundColor: this.state.selection ? colors.mediumPurple : 'transparent'
              }]}>
            <TouchableHighlight
               style={[styles.continueButton]}
               onPress={this.handleContinue}
               underlayColor="black">

               <Text style={styles.continueButtonText}>CONTINUE</Text>
             </TouchableHighlight>
          </View>

      </View>
    );
  }


}


var styles = StyleSheet.create({

  container: {
    flex: 1,
    height: DeviceHeight,
    width: DeviceWidth,
    padding:0,
    flexDirection:'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: colors.outerSpace
  },


  labelText:{
    color:colors.rollingStone,
    fontSize:18,
    fontFamily:'omnes',
    textAlign:'center',

  },
  grayIconbutton:{
    borderColor: colors.rollingStone,
    borderWidth: 1,
    alignSelf:'stretch',
    width: DeviceWidth * .7,
    flex:1

  },
  grayIconbuttonLeftBox:{
    backgroundColor: colors.steelGrey20,
    borderRightColor: colors.rollingStone,
    borderRightWidth: 1,
  },
  iconButtonLeftBoxMale: {
    backgroundColor: colors.darkSkyBlue20,
    borderRightColor: colors.darkSkyBlue,
    borderRightWidth: 1
  },
  iconButtonLeftBoxFemale: {
    backgroundColor: colors.darkishPink20,
    borderRightColor: colors.mandy,
    borderRightWidth: 1

  },
  iconButtonMale:{
    borderColor: colors.darkSkyBlue,
    borderWidth: 1,
    width: DeviceWidth * .7,

  },
  iconButtonFemale:{
    borderColor: colors.mandy,
    borderWidth: 1,
    width: DeviceWidth * .7,

  },


  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
  },


      continueButtonWrap:{
        alignSelf: 'stretch',
        alignItems: 'stretch',
        justifyContent: 'center',
        height: 80,
        backgroundColor: colors.mediumPurple,

        width:DeviceWidth
      },
      continueButton: {
        height: 80,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
      },
      continueButtonText: {
        padding: 4,
        fontSize: 30,
        fontFamily:'Montserrat',
        color: colors.white,
        textAlign:'center'
      }
});


module.exports = GenderScreen;
