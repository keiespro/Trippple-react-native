/* @flow */


import React, {Component, PropTypes} from "react";
import { StyleSheet, Image, Text, ActivityIndicator, View, TouchableHighlight, Dimensions, PixelRatio, TouchableOpacity} from "react-native";

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import BlurModal from '../modals/BlurModal'
import {MagicNumbers} from '../DeviceConfig'
import UserActions from '../flux/actions/UserActions'
import UserStore from '../flux/stores/UserStore'
import AltContainer from 'alt-container/native';
import styles from '../modals/purpleModalStyles'
import CouplePin from './CouplePin'
import CoupleSuccess from './CoupleSuccess'
import EnterCouplePin from './EnterCouplePin'
import BackButton from '../components/BackButton'

class InsideJoinCouple extends React.Component{
  
  componentWillReceiveProps(nProps){
    if(this.props.couple && !this.props.couple.verified && nProps.couple && nProps.couple.verified){
      console.log('succes,replace screen',this.props.navigator);
      // this.props.navigator.pop();
      this.props.navigator.replace({
        component: CoupleSuccess,
        passProps: { ...nProps }
      })
      
    }
  }
  
  render(){
    const couple = this.props.couple;
    console.log(couple);
    return (this.props.initialScreen  ? 
           ( this.props.initialScreen == 'CouplePin' ? 
            <CouplePin {...this.props} /> :
            <EnterCouplePin  {...this.props} /> ) :
      <View>
        <View style={[{width:DeviceWidth,paddingTop:MagicNumbers.is5orless ? 20 : 50, paddingHorizontal:MagicNumbers.screenPadding/2 }]} >

          <View style={{height:160,marginVertical:30,transform:[{scale:MagicNumbers.is5orless ? .8 : 1 }],flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <View
              style={{width:156,height:156,borderRadius:80,marginRight:-145,borderColor:colors.white,borderWidth:3,borderStyle:'dashed'}} />
            <Image style={[{width:160,height:160,borderRadius:80,marginLeft:-145}]}
              source={ {uri: this.props.user.image_url} }
              defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            />
          </View>

          <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center', fontFamily:'Montserrat-Bold',fontSize:22,color:'#fff',marginVertical:10 }]}>
            Welcome {this.props.user.firstname}.
          </Text>

          <View style={{flexDirection:'column',marginBottom:30 }} >
            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize: MagicNumbers.is5orless ? 18 : 20,
                marginVertical:10,
                color:'#fff',
                marginBottom:15,
                flexDirection:'column'
              }]}>
              {`Connecting with your partner is easy. Let's get started.`}
            </Text>
          </View>
        </View>

            <TouchableHighlight onPress={(f)=>{
                this.props.navigator.push({
                  component: CouplePin,
                  // sceneConfig:NavigatorSceneConfigs.FloatFromRight,
                  passProps: {
                    user:this.props.user,
                    couple:this.props.couple,
                    navigator:this.props.navigator,

                  }
                })
              }} underlayColor={colors.white20}>
                <View style={{
                   borderBottomWidth: StyleSheet.hairlineWidth,
                   borderColor:colors.shuttleGray,
                   height:80,
                   alignItems:'center',
                   justifyContent:'space-between',
                   flexDirection:'row',
                   paddingRight:MagicNumbers.screenPadding/1.5,
                   marginLeft:MagicNumbers.screenPadding/1.5
                 }}>
                    <View>
                        <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>INVITE YOUR PARTNER</Text>
                        <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                        My partner is not on trippple
                        </Text>
                    </View>
                    <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={(f)=>{
                this.props.navigator.push({
                  component: EnterCouplePin,
                   passProps: {
                     user:this.props.user,
                     couple: this.props.couple,
                    navigator:this.props.navigator
                  }
                })
              }} underlayColor={colors.white20}>

              <View style={{
                   borderBottomWidth: StyleSheet.hairlineWidth,
                   borderColor:colors.shuttleGray,
                   height:80,
                   alignItems:'center',
                   justifyContent:'space-between',
                   flexDirection:'row',
                   paddingRight:MagicNumbers.screenPadding/1.5,
                   marginLeft:MagicNumbers.screenPadding/1.5
                 }}>
                    <View>
                        <Text style={{color:colors.white,fontSize:18,fontFamily:'Montserrat-Bold'}}>ENTER COUPLE CODE</Text>
                        <Text style={{color:colors.rollingStone,fontSize:16,fontFamily:'omnes'}}>
                        My partner is already on trippple
                        </Text>
                    </View>
                    <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                </View>
            </TouchableHighlight>

      </View>
    )
  }
}


class JoinCouple extends React.Component{

  constructor(props){
    super()
    this.state = { }
  }

  cancel(){
    this.props.navigator.pop()
  }

  componentWillMount(){
    UserActions.getCouplePin();
  }

  render(){
    const couplingData = {
      couple: (props) => {
        return {
          store: UserStore,
          value: UserStore.getCouplingData()
        }
      }
    };
    
    return  (
      <BlurModal navigator={this.props.navigator} user={this.props.user}>
        <AltContainer stores={couplingData}>
          {
            <InsideJoinCouple {...this.props} />
          }
        </AltContainer>
      </BlurModal>
    )
  }

}


export default JoinCouple
