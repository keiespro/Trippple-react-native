/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  NativeModules,
  CameraRoll,
  View,
  TouchableHighlight,
  Dimensions,
  PixelRatio,
  TouchableOpacity
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

var {FBLoginManager,AddressBook} = require('NativeModules')

import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'
import BoxyButton from '../controls/boxyButton'
import UserActions from '../flux/actions/UserActions'

export default class PrivacyPermissionsModal extends Component{

  constructor(props) {
    super();
    this.state = {
      hasFacebookPermissions: null,
      hasContactsPermissions: null
    }
  }

  componentDidMount(){
    FBLoginManager.getCredentials((error, data)=>{
      if (!error) {
        this.setState({ hasFacebookPermissions: true })
      } else {
        this.setState({ hasFacebookPermissions: false })
      }
    });

    AddressBook.checkPermission((err, permission) => {
      if(!err && permission === AddressBook.PERMISSION_AUTHORIZED){
        this.setState({ hasContactsPermissions: true })
      }
    })
  }

  componentWillUpdate(nProps,nState){
    // nState.hasFacebookPermissions && nState.hasContactsPermissions ? auto close?
  }

  handleTapContacts(){

    AddressBook.checkPermission((err, permission) => {
      if(err){
        console.log(err)
       //TODO:  handle err;
      }

     // AddressBook.PERMISSION_AUTHORIZED || AddressBook.PERMISSION_UNDEFINED || AddressBook.PERMISSION_DENIED
     if(permission === AddressBook.PERMISSION_UNDEFINED){
       this.getContacts();
     }
     if(permission === AddressBook.PERMISSION_AUTHORIZED){
        this.getContacts()
      }
     if(permission === AddressBook.PERMISSION_DENIED){
       //handle permission denied
     }

    })
  }
  getContacts(){
    AddressBook.getContacts((err, contacts) => {
      if (!err) {
        UserActions.handleContacts(contacts)
        UserActions.updateUser({privacy:'private'})
        this.setState({hasContactsPermissions: true })
      }else{

      }
    })
  }

  handleTapFacebook(){
    FBLoginManager.login( (err, data) => {

      if (!err) {
        UserActions.updateUser({
          facebook_user_id: data.credentials.userId,
          facebook_oauth_access_token: data.credentials.token
        });

        this.setState({ hasFacebookPermissions: true })

      } else {
        this.setState({ hasFacebookPermissions: false });

      }
    });



  }

  render(){

    const {hasFacebookPermissions,hasContactsPermissions} = this.state

    return (
    <PurpleModal>
      <View style={[styles.col,{justifyContent:'space-around',paddingVertical:0}]}>
        <Image
          resizeMode={Image.resizeMode.contain}

          style={[{width:120,height:120,marginBottom:10,marginTop:30}]}
          source={require('image!iconPrivacyMask')} />

        <View style={styles.insidemodalwrapper}>
            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat-Bold',fontSize:20,marginVertical:0
              }]}>PROTECT YOUR PRIVACY</Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:18,marginVertical:10,color: colors.white,marginHorizontal:10
              }]}>
              Hide from your Facebook Friends and Phone Contacts
            </Text>

            <View style={{marginTop:10}}>



            <BoxyButton
              text={"BLOCK FACEBOOK"}
              buttonText={buttonStyles.buttonText}
              underlayColor={colors.mediumPurple20}
              innerWrapStyles={buttonStyles.innerWrapStyles}
              leftBoxStyles={  buttonStyles.grayIconbuttonLeftBox}

              _onPress={this.handleTapFacebook.bind(this)}>

              {hasFacebookPermissions ?
                      <Image source={require('image!checkmarkWhiteSmall') }
                        resizeMode={Image.resizeMode.cover}
                            style={{height:21,width:30}} /> :
                            <View style={{backgroundColor:colors.mediumPurple,height:20,width:20,borderRadius:10,alignSelf:'center'}} /> }
            </BoxyButton>

            <BoxyButton
                text={"BLOCK CONTACTS"}
                outerButtonStyle={buttonStyles.iconButtonOuter}
                buttonText={buttonStyles.buttonText}
                underlayColor={colors.mediumPurple20}
                innerWrapStyles={buttonStyles.innerWrapStyles}
                leftBoxStyles={ buttonStyles.grayIconbuttonLeftBox}
                _onPress={this.handleTapContacts.bind(this)}>

              {hasContactsPermissions ?
                <Image source={require('image!checkmarkWhiteSmall') }
                  resizeMode={Image.resizeMode.cover}
                      style={{height:21,width:30}} /> :
                      <View style={{backgroundColor:colors.mediumPurple,height:20,width:20,borderRadius:10,alignSelf:'center'}} /> }
          </BoxyButton>

          <View >
            {this.state.hasFacebookPermissions && this.state.hasContactsPermissions ?
              <TouchableOpacity
                underlayColor={colors.mediumPurple}
                style={{marginTop:20,marginBottom:20}}
                onPress={this.props.success}>
                <View style={[styles.cancelButton,{backgroundColor:'transparent'}]} >
                  <Text style={{color:colors.white,textAlign:'center'}}>Good to go!</Text>
                </View>
              </TouchableOpacity>  :
            <TouchableOpacity
              underlayColor={colors.mediumPurple}
              style={{marginTop:20,marginBottom:20}}
              onPress={this.props.cancel}>
              <View style={[styles.cancelButton,{backgroundColor:'transparent'}]} >
                <Text style={{color:colors.white,textAlign:'center'}}>no thanks</Text>
              </View>
            </TouchableOpacity>}
          </View>

        </View>
      </View>
    </View>

      </PurpleModal>
    )
  }
}


const buttonStyles = StyleSheet.create({

  privacyStyle:{
    height:60,
  },
  innerWrapStyles:{
    borderColor: colors.purple,
    borderWidth: 1,
    borderRadius:10,
    overflow:'hidden',
    backgroundColor:colors.sapphire50
  },

  iconButtonOuter:{
    marginTop:10
  },
  grayIconbuttonLeftBox:{
    backgroundColor: '#582A99',
    borderRightColor: colors.purple,
    borderRightWidth: 1,
  },



  iconButtonText:{
    color: colors.white,
    fontFamily: 'Montserrat',
    fontSize: 16,
    textAlign: 'center'
  },

  buttonText:{
    color:colors.white,
    fontSize:18,
    fontFamily:'Montserrat-Bold'
  },

})
