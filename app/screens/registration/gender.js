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
var NameScreen = require('./name');
var SelfImage = require('./SelfImage');
var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
import SharedStyles from '../../SharedStyles'
import Gobackbutton from '../../controls/Gobackbutton'

class GenderScreen extends Component{

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
    console.log(this.state.selection)
    UserActions.updateUserStub({gender: this.state.selection});

    this.props.navigator.push({
            component: SelfImage,
            id: 'selfimage',
            passProps: {
              gender: this.state.selection,
            }
          })

  }
  render() {

    return (
      <View style={[styles.container]}>
        <View style={styles.genderWrap}>
          <Text style={styles.labelText}>{"What's your gender?"} </Text>

          <BoxyButton
            text={"MALE"}
            buttonText={styles.buttonText}
            leftBoxStyles={this.state.selection == 'm' ? styles.iconButtonLeftBoxMale : styles.grayIconbuttonLeftBox}
            innerWrapStyles={this.state.selection == 'm' ? styles.iconButtonMale : styles.grayIconbutton}
            _onPress={this._selectMale.bind(this)}>

              <Image source={this.state.selection == 'm' ? require('image!boxersBlue') : require('image!boxers') }
                      resizeMode={Image.resizeMode.cover}
                          style={{height:21,width:30}} />
          </BoxyButton>

          <BoxyButton
              text={"FEMALE"}
              outerButtonStyle={styles.iconButtonOuter}
              buttonText={styles.buttonText}
              leftBoxStyles={this.state.selection == 'f' ? styles.iconButtonLeftBoxFemale : styles.grayIconbuttonLeftBox}
              innerWrapStyles={this.state.selection == 'f' ? styles.iconButtonFemale : styles.grayIconbutton}
              _onPress={this._selectFemale.bind(this)}>

              <Image source={this.state.selection == 'f' ? require('image!braPink') : require('image!bra')}
                        resizeMode={Image.resizeMode.cover}
                            style={{height:24,width:30}}/>

          </BoxyButton>
          <Gobackbutton navigator={this.props.navigator}/>

        </View>

        <View style={[SharedStyles.continueButtonWrap,
            {
              bottom: this.state.selection ? 0 : -80,
              backgroundColor: this.state.selection ? colors.mediumPurple : 'transparent'
            }]}>
          <TouchableHighlight
             style={[SharedStyles.continueButton]}
             onPress={this._continue.bind(this)}
             underlayColor="black">

             <Text style={SharedStyles.continueButtonText}>CONTINUE</Text>
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
  genderWrap:{
    justifyContent: 'center',
    flex: 1,
    flexDirection:'column',
    alignItems: 'center',
    alignSelf:'stretch',
    paddingHorizontal:20
  },

  labelText:{
    color:colors.rollingStone,
    fontSize:20,
    fontFamily:'omnes',
    textAlign:'center',
    marginBottom:60

  },
  grayIconbutton:{
    borderColor: colors.rollingStone,
    borderWidth: 1,
    alignSelf:'stretch',
    width: DeviceWidth * .7,
    flex:1

  },
  iconButtonOuter:{
    marginTop:40
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

  buttonText:{
    color:colors.white,
    fontSize:20
  },
});


module.exports = GenderScreen;
