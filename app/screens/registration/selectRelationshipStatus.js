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
var colors = require('../../utils/colors')
var BoxyButton = require('../../controls/boxyButton')
import CheckMarkScreen from '../CheckMark'

import Facebook from './facebook'
import PrivacyScreen from './privacy'
import InvitePartner from './invitePartner'
import Contacts from '../contacts'
import name from './name'
import bday  from './bday'
import gender from './gender'
import CoupleImage from './CoupleImage'
import EditImage from './EditImage'
import EditImageThumb from './EditImageThumb'
import SelfImage from './SelfImage'
import Limbo from './Limbo'
import CAMERA from '../../controls/cameraControl'

var DeviceHeight = require('Dimensions').get('window').height;
var DeviceWidth = require('Dimensions').get('window').width;
import {MagicNumbers} from '../../DeviceConfig'

var RouteStackCouple = [
    {component: SelectRelationshipStatus,title:'SelectRelationshipStatus'},

    /*
     *
     * DEV MODE: PUT THE SCREEN CURRENTLY BEING WORKED ON HERE.
     *
     * MAKE SURE TO REMOVE
     *
     */



    /*
     *
     * MAKE SURE TO REMOVE
     *
     */

    {component: InvitePartner,  title: 'InvitePartner'},
    {component: Contacts, title: 'Contacts'},
    {component: Facebook, title: 'Facebook'},
    {component: name, title: 'name'},
    {component: bday,  title: 'bday'},
    {component: gender, title: 'gender'},
    {component: PrivacyScreen, title: 'PrivacyScreen'},
    {component: CoupleImage,  title: 'CoupleImage'},
    {component: CAMERA, title: 'CAMERA'},
    {component: EditImage, title: 'EditImage'},
    {component: SelfImage,  title: 'SelfImage'},
    {component: CAMERA, title: 'CAMERA2'},
    {component: EditImage, title: 'EditImage2'},
    {component: EditImageThumb, title: 'EditImageThumb'},
    {component: Limbo,  title: 'Limbo'},

  ];

var RouteStackSingle = [
    {component: SelectRelationshipStatus,title:'SelectRelationshipStatus'},

    {component: Facebook,title:'Facebook'},
    {component: name,title: 'name'},
    {component: bday,title: 'bday'},
    {component: gender,  title: 'gender'},
    {component: PrivacyScreen, title: 'PrivacyScreen'},
    {component: SelfImage, title: 'SelfImage'},
    {component: CAMERA, title: 'CAMERA'},
    {component: EditImage,  title: 'EditImage'},
    {component: EditImageThumb,  title: 'EditImageThumb'},
    {component: Limbo,  title: 'Limbo'},
  ];

var singleStack = RouteStackSingle.map( (r,i) =>{ r.index = i; return r})
var coupleStack = RouteStackCouple.map( (r,i) =>{ r.index = i; return r})

class SelectRelationshipStatus extends Component{

  constructor(props){

    super()

    this.state = {
      selection: null
    }
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
         console.log(selection,this.props,this.props.navigator.getCurrentRoutes());
         if(selection == 'couple'){

console.log('COUPLE')
          this.props.navigator.push({
            component: coupleStack[1].component,
            passProps: {
              ...this.props,
              stack: coupleStack,
              partner: this.state.partnerSelection
            }
          })


        }else if(selection == 'single'){
console.log('SINGLE')

          this.props.navigator.push({
            component: singleStack[1].component,
            passProps: {
              ...this.props,
              stack: singleStack,
              partner: this.state.partnerSelection
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
              underlayColor={colors.mediumPurple20}
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
              underlayColor={colors.darkSkyBlue20}
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
    width:MagicNumbers.screenWidth,
    alignSelf:'stretch',
    flex:1,
    borderBottomWidth: 1,
    borderBottomColor:colors.rollingStone,
  },
  dividerWrap:{
    marginVertical:MagicNumbers.is4s ? 10 : 50,
    width:MagicNumbers.screenWidth,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'stretch',
    height:30,
    marginHorizontal: MagicNumbers.screenPadding/2,

  },
  dividerText:{
    color:colors.rollingStone,
    fontSize:25,
    padding:10,
    alignSelf:'center',
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
    position:'absolute',
    backgroundColor: colors.outerSpace
  },


  labelText:{
    color:colors.rollingStone,
    fontSize:20,
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
    marginBottom:40,
    marginTop:20,
    width:DeviceWidth-50
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


export default SelectRelationshipStatus
