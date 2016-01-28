import React, {
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
  Dimensions,
  SegmentedControlIOS
} from 'react-native'

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import BoxyButton from '../../controls/boxyButton'
import {MagicNumbers} from '../../DeviceConfig'
import OnboardingActions from '../../flux/actions/OnboardingActions'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import SharedStyles from '../../SharedStyles'
import Gobackbutton from '../../controls/Gobackbutton'
import BackButton from './BackButton'
import ContinueButton from '../../controls/ContinueButton'

class GenderScreen extends Component{

  constructor(props){

    super(props);

    this.state = {
      selection: props.fb_gender || props.user && props.user.gender || null,
      canContinue: false
    }
  }
  componentWillMount(){
    this.setState({
      selection: this.state.selection
    })
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
    OnboardingActions.proceedToNextScreen({gender: this.state.selection});
  }
  render() {

    return (
      <View style={[styles.container]}>
        <View style={{width:100,height:50,left:MagicNumbers.screenPadding/2,alignSelf:'flex-start'}}>
          <BackButton/>
        </View>

        <View style={[styles.genderWrap,{marginHorizontal:MagicNumbers.screenPadding/2,width:MagicNumbers.screenWidth}]}>
          <View style={{
            alignItems:'center',
            justifyContent:'center',
            height: 60,
            marginBottom:10}}>
            <Text style={[styles.labelText,{fontSize:20,fontFamily:'omnes',color:colors.rollingStone}]}>{"What's your gender?"}</Text>
          </View>




          <TouchableHighlight
            underlayColor={this.state.selection == 'm' ? colors.mediumPurple : colors.mediumPurple20}
            style={{marginVertical:20}}
              onPress={this._selectMale.bind(this)}>
              <View style={[styles.privacyWrap,
                  (this.state.selection == 'm' ? styles.selectedbutton : null)]}>
        <Image source={this.state.selection == 'm' ? {uri:'assets/ovalSelected.png') : {uri:'assets/ovalDashed.png}}
                          resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>


                <Text style={styles.boxTitle}>MALE</Text>
              </View>


          </TouchableHighlight>

          <TouchableHighlight
            underlayColor={this.state.selection == 'f' ? colors.mediumPurple : colors.mediumPurple20}
            style={{marginTop:20}}
            onPress={this._selectFemale.bind(this)}>
            <View style={[styles.privacyWrap,
                (this.state.selection == 'f' ? styles.selectedbutton : null)]}>

              <Image source={this.state.selection == 'f' ? {uri:'assets/ovalSelected.png') : {uri:'assets/ovalDashed.png}}
                        resizeMode={Image.resizeMode.contain}
                            style={styles.cornerDot}/>

              <Text style={styles.boxTitle}>FEMALE</Text>
            </View>

          </TouchableHighlight>

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


const styles = StyleSheet.create({

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
  //
  // labelText:{
  //   color:colors.rollingStone,
  //   fontSize:32,
  //   fontFamily:'omnes',
  //   textAlign:'center',
  //   marginBottom:60
  //
  // },
  grayIconbutton:{
    borderColor: colors.rollingStone,
    borderWidth: 1,
    alignSelf:'stretch',
    width: DeviceWidth * 0.7,
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
    width: DeviceWidth * 0.7,

  },
  iconButtonFemale:{
    borderColor: colors.mandy,
    borderWidth: 1,
    width: DeviceWidth * 0.7,

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
    width: MagicNumbers.screenWidth,
    padding:10,
    borderWidth:2,
    borderColor:colors.shuttleGray,
    height:90,
    marginHorizontal:0
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


export default GenderScreen;
