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
var colors = require('../../utils/colors')
var BoxyButton = require('../../controls/boxyButton')

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
import SharedStyles from '../../SharedStyles'
import Gobackbutton from '../../controls/Gobackbutton'
import BackButton from '../../components/BackButton'
import ContinueButton from '../../controls/ContinueButton'

class GenderScreen extends Component{

  constructor(props){

    super(props);

    this.state = {
      selection: null,
      canContinue: false
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
    UserActions.updateUserStub({gender: this.state.selection});

 var lastindex = this.props.navigator.getCurrentRoutes().length;
  console.log(lastindex);
  var nextRoute = this.props.stack[lastindex];

   nextRoute.passProps = {
          ...this.props,
              gender: this.state.selection,
            }

    this.props.navigator.push(nextRoute)
    console.log('HEY')

  }
  render() {

    return (
      <View style={[styles.container]}>
        <View style={{width:100,height:50,left:20,alignSelf:'flex-start'}}>
          <BackButton navigator={this.props.navigator}/>
        </View>

        <View style={[styles.genderWrap]}>
          <View style={{
            alignItems:'center',
            justifyContent:'center',
            height: 60,
            marginBottom:10}}>
            <Text style={styles.labelText,{fontSize:20,fontFamily:'omnes',color:colors.rollingStone}}>{"What's your gender?"} </Text>
          </View>




          <TouchableOpacity
            style={{margin:20}}
              onPress={this._selectMale.bind(this)}>
              <View style={[styles.privacyWrap,
                  (this.state.selection == 'm' ? styles.selectedbutton : null)]}>
        <Image source={this.state.selection == 'm' ? require('image!ovalSelected') : require('image!ovalDashed')}
                          resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>


                <Text style={styles.boxTitle}>MALE</Text>
              </View>


          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop:20}}
            onPress={this._selectFemale.bind(this)}>
            <View style={[styles.privacyWrap,
                (this.state.selection == 'f' ? styles.selectedbutton : null)]}>

              <Image source={this.state.selection == 'f' ? require('image!ovalSelected') : require('image!ovalDashed')}
                        resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>

              <Text style={styles.boxTitle}>FEMALE</Text>
            </View>

          </TouchableOpacity>






          {/*

          <BoxyButton
            text={"MALE"}
            buttonText={styles.buttonText}
              underlayColor={colors.darkSkyBlue20}

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
              underlayColor={colors.darkishPink20}
              leftBoxStyles={this.state.selection == 'f' ? styles.iconButtonLeftBoxFemale : styles.grayIconbuttonLeftBox}
              innerWrapStyles={this.state.selection == 'f' ? styles.iconButtonFemale : styles.grayIconbutton}
              _onPress={this._selectFemale.bind(this)}>

              <Image source={this.state.selection == 'f' ? require('image!braPink') : require('image!bra')}
                        resizeMode={Image.resizeMode.cover}
                            style={{height:24,width:30}}/>

          </BoxyButton>
        */}

        </View>

        <ContinueButton
        canContinue={this.state.canContinue}
        handlePress={this._continue.bind(this)} />


      </View>
    );
  }

 componentWillUpdate(props, state) {

    if(state.selection !== this.state.selection) {
      LayoutAnimation.configureNext(animations.layout.spring);
    }

  }

  componentDidUpdate(){

    if(!this.state.canContinue &&  this.state.selection && this.state.selection != ''){
      this.showContinueButton();
    }else if(this.state.canContinue && ( !this.state.selection  || this.state.selection == '')){
      this.hideContinueButton();
    }
  }

   showContinueButton(){
    this.setState({
      canContinue: true
    })
  }

  hideContinueButton(){
    this.setState({
      canContinue: false
    })
  }

}


var animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut
      }
    }
  }
};


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
    width: DeviceWidth,
    paddingHorizontal:50
  },

  labelText:{
    color:colors.rollingStone,
    fontSize:32,
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

  cornerDot: {
    height:30,
    width:30,
    marginHorizontal:20
  },
  topWrap:{
    justifyContent: 'center',
    flex: 1,
    flexDirection:'column',
    alignItems: 'center',
    alignSelf:'stretch',

  },
  privacyWrap:{
    justifyContent: 'flex-start',
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    alignSelf:'stretch',
    width: DeviceWidth-80,
    padding:10,
    borderWidth:2,
    borderColor:colors.shuttleGray,
    height:90,
    marginHorizontal:40
  },

  labelText:{
    color:colors.rollingStone,
    fontSize:18,
    fontFamily:'omnes',
    textAlign:'left',

  },


selectedbutton:{
  backgroundColor:colors.mediumPurple20,
  borderWidth:2,
  borderColor:colors.mediumPurple
},



  boxTitle:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 22,
    textAlign: 'center'
  },


    boxP:{
      color: colors.white,
      fontFamily: 'Omnes',
      fontSize: 14,
      textAlign: 'left'
    },

});


module.exports = GenderScreen;
