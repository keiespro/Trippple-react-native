import React from "react";
import moment from 'moment';

import BoxyButton from '../../controls/boxyButton';
import Contacts from '../contacts';
import colors from '../../../utils/colors';
import formatPhone from '../../../utils/formatPhone';
import {MagicNumbers} from '../../../utils/DeviceConfig'
import {
  NavigationStyles, withNavigation
} from '@exponent/ex-navigation';
import ActionMan from '../../../actions'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  SwitchIOS,
  Animated,
  PickerIOS,
  Alert,
  Image,
  NativeModules,
  AsyncStorage,
  Navigator
} from 'react-native'
import { connect } from 'react-redux';


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
const PickerItemIOS = PickerIOS.Item;


@withNavigation
class SettingsCouple extends React.Component{


    static route = {
        navigationBar: {
            backgroundColor: colors.shuttleGrayAnimate,
            title(params){
                return `COUPLE`
            }
        }
    };

    constructor(props){
        super(props)
    }

    invitePartner(){

//         this.props.navigator.push({
//           component: Contacts,
//           passProps:{
//             _continue: ()=>{
//               // console.log(this.props.navigator)
//               let routes = this.props.navigator.getCurrentRoutes()
//               let thisRoute = routes[routes.length-3]
//               this.props.navigator.popToRoute(thisRoute);
//               this.props.dispatch(ActionMan.getUserInfo())
//             }
//           }

        // })

    }

    decouple(){
        const p = this.props.user.partner || {};
        if(p.firstname){
            Alert.alert(
                `Leave ${p.firstname}?`,
                'Are you sure you want to leave this couple?',
                [
                  {text: 'Yes', onPress: () => {
                      this.props.dispatch(ActionMan.decouple())
                      this.props.navigator.pop()
                  }},
                  {text: 'No', onPress: () => {return false}},
                ]
                        )
        }else{
            this.props.dispatch(ActionMan.decouple())
            this.props.navigator.pop()

        }


    }

    render(){
        let u = this.props.user;
        let settingOptions = this.props.settingOptions || {};

        let {partner} = this.props.user;
        if(!partner) partner = {};
        return (

      <View style={{backgroundColor:colors.outerSpace,width:DeviceWidth,height:DeviceHeight,overflow:'hidden',flex:1,paddingTop:60}}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flex:1,paddingTop:50}} contentContainerStyle={{ backgroundColor:colors.outerSpace, paddingTop: 0}}
        >

        { ( partner.id) &&
          <View>
                  <View style={{height:120,width:120,alignItems:'center',alignSelf:'center'}}>
                    <Image
                        style={styles.userimage}
                        key={partner.thumb_url}
                        source={{uri: partner.thumb_url || ''}}
                        defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
                        resizeMode={Image.resizeMode.cover}
                    />

                    </View>
                    <View style={{paddingHorizontal: 25,}}>
                      <View style={styles.formHeader}>
                        <Text style={styles.formHeaderText}>Your Partner</Text>
                      </View>
                      </View>
                    {['firstname','birthday','gender'].map((field) => {
                        return (
                        <View key={'key'+field} style={{height:60,borderBottomWidth:1,borderColor:colors.shuttleGray, alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:25}}>
                            <Text style={{color:colors.rollingStone,fontSize:18,fontFamily:'Montserrat'}}>{ field.toUpperCase()}</Text>
                          <Text style={{color:colors.shuttleGray,
                              fontSize:18,fontFamily:'Montserrat',textAlign:'right',paddingRight:30}}>{
                              field == 'birthday' ?
                              partner[field] ? moment(partner[field]).format('MM/DD/YYYY') : ''
                              : partner[field] ? partner[field].toString().toUpperCase() : ''
                            }</Text>
                            <Image
                                style={{width:15,height:15,position:'absolute',right:0,top:23}}
                                source={{uri:'assets/icon-lock.png'}}
                                resizeMode={Image.resizeMode.contain}
                            />

                          </View>
                        )
                    })}

                  </View>
                }


                    <TouchableOpacity
                        style={{
                            alignSelf:'stretch',
                            marginVertical:50,
                            borderRadius:5,
                            flexDirection:'row',
                            marginHorizontal:MagicNumbers.screenPadding/2,
                            backgroundColor:'transparent',
                            borderColor:colors.mandy,
                            borderWidth:2
                        }}
                        underlayColor={colors.darkShadow}
                        onPress={this.decouple.bind(this)}
                    >
                    <View style={{padding:20,flex:1}}>
                      <Text style={{
                          backgroundColor:'transparent',
                          color:colors.mandy,
                          fontSize:18,
                          textAlign:'center',
                          fontFamily:'Montserrat'
                      }}>LEAVE COUPLE</Text>
                    </View>
                </TouchableOpacity>
                  {/*!partner.phone &&
                    <View>
                    <View style={{height:120,width:120,alignItems:'center',alignSelf:'center',marginBottom:20}}>
                      <Image
                        style={[styles.userimage]}
                        key={partner.thumb_url}
                        source={{uri: 'assets/iconModalDenied@3x'}}
                        resizeMode={Image.resizeMode.contain}/>

                      </View>
                      <View style={styles.middleTextWrap}>
                        <Text style={styles.middleText}>Oh no! You don't have a partner! Go ahead and invite someone now</Text>
                      </View>
                      <BoxyButton
                        text={"INVITE YOUR PARTNER"}
                        leftBoxStyles={styles.iconButtonLeftBoxCouples}
                        innerWrapStyles={styles.iconButtonCouples}
                        outerButtonStyle={{
                          alignSelf:'stretch',
                          flexDirection:'row',
                          marginHorizontal:MagicNumbers.screenPadding/2
                        }}
                        underlayColor={colors.mediumPurple20}
                        _onPress={this.invitePartner.bind(this)}>

                        <Image source={{uri: 'assets/ovalInvite@3x.png'}}
                                  resizeMode={Image.resizeMode.contain}
                                      style={{height:30,width:101}} />

                    </BoxyButton>
                    </View>
                    */}

      </ScrollView>
        </View>


    )
    }
}

SettingsCouple.displayName = "SettingsCouple"

const mapStateToProps = (state, ownProps) => {
    return {...ownProps }
}

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCouple);

const styles = StyleSheet.create({
    iconButtonCouples:{
        borderColor: colors.mediumPurple,
        borderWidth: 1
    },
    iconButtonLeftBoxCouples: {
        backgroundColor: colors.mediumPurple20,
        borderRightColor: colors.mediumPurple,
        borderRightWidth: 1
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        position:'relative',
        alignSelf: 'stretch',
        backgroundColor:colors.outerSpace
  //  overflow:'hidden'
    },
    inner:{
        flex: 1,
        alignItems: 'stretch',
        backgroundColor:colors.outerSpace,
        flexDirection:'column',
        justifyContent:'flex-start'
    },

    blur:{
        flex:1,
        alignSelf:'stretch',
        alignItems:'center',
        paddingTop: 0,
        paddingBottom: 40,

    },
    closebox:{
        height:40,
        width:40,
        backgroundColor:'blue'
    },

    formHeader:{
        marginTop:40
    },
    formHeaderText:{
        color: colors.rollingStone,
        fontFamily: 'omnes'
    },
    formRow: {
        alignItems: 'center',
        flexDirection: 'row',

        alignSelf: 'stretch',
        paddingTop:0,
        height:50,
        flex:1,
        borderBottomWidth: 2,
        borderBottomColor: colors.rollingStone

    },
    tallFormRow: {
        width: 250,
        left:0,
        height:220,
        alignSelf:'stretch',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    sliderFormRow:{
        height:160,
        paddingLeft: 30,
        paddingRight:30
    },
    picker:{
        height:200,
        alignItems: 'stretch',
        flexDirection: 'column',
        alignSelf:'flex-end',
        justifyContent:'center',
    },
    halfcell:{
        width:DeviceWidth / 2,
        alignItems: 'center',
        alignSelf:'center',
        justifyContent:'space-around'


    },

    formLabel: {
        flex: 8,
        fontSize: 18,
        fontFamily:'omnes'
    },
    header:{
        fontSize:24,
        fontFamily:'omnes'

    },
    textfield:{
        color: colors.white,
        fontSize:20,
        alignItems: 'stretch',
        flex:1,
        textAlign: 'left',
        fontFamily:'Montserrat',
    },
    userimage:{
        backgroundColor:colors.dark,
        width:120,height:120,borderRadius:60,alignSelf:'center',
    },
    middleTextWrap: {
        alignItems:'center',
        justifyContent:'center',
        height: 100,
        marginHorizontal:20,
        marginBottom:20
    },
    middleText: {
        color: colors.rollingStone,
        fontSize: 18,

        textAlign:'center',
    },
    middleTextSmall:{
        fontSize: 17
    },
});
