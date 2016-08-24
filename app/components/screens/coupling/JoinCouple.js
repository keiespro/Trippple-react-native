/* @flow */


import {
  StyleSheet,
  ScrollView,
  Image,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';



const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../../utils/colors'
import BlurModal from '../../modals/BlurModal'
import {MagicNumbers} from '../../../utils/DeviceConfig'



import styles from '../../modals/purpleModalStyles'

class JoinCouple extends Component{

  componentWillReceiveProps(nProps){

    if( nProps.couple && nProps.couple.hasOwnProperty('verified') && nProps.couple.verified ){
      nProps.exit({success:true})
    }
  }
  componentDidMount(){
    this.props.dispatch(ActionMan.getCouplePin());
  }


  render(){
    const couple = this.props.couple;

    const imgWidth = MagicNumbers.is5orless ? 120 : 160
    return (
      <ScrollView style={{width:DeviceWidth,height:DeviceHeight,flex:1}}>
        <View style={[{width:DeviceWidth,paddingTop:MagicNumbers.is5orless ? 20 : 50, paddingHorizontal:MagicNumbers.screenPadding/2 }]} >

          <View style={{height:imgWidth-4,marginVertical:MagicNumbers.is5orless ? 10 : 30,transform:[{scale:MagicNumbers.is5orless ? .8 : 1 }],flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <View
              style={{width:imgWidth,height:imgWidth,borderRadius:imgWidth/2,marginRight:imgWidth * -1 + 20,borderColor:colors.white,borderWidth:3,borderStyle:'dashed'}} />
            <Image style={[{width:imgWidth,height:imgWidth,borderRadius:imgWidth/2,marginLeft:imgWidth * -1 + 20}]}
              source={ {uri: this.props.user.image_url} }
              defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
            />
          </View>

          <Text style={[styles.rowtext,styles.bigtext,{ textAlign:'center',backgroundColor:'transparent', fontFamily:'Montserrat-Bold',fontSize:22,color:'#fff',marginVertical:10 }]}>
            Welcome {this.props.user.firstname}.
          </Text>

          <View style={{flexDirection:'column',marginBottom:30 }} >
            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize: MagicNumbers.is5orless ? 18 : 20,
                marginVertical:10,
                marginHorizontal:10,
                color:'#fff',
                marginBottom:15,
                flexDirection:'column',
                backgroundColor:'transparent',
              }]}>
              {`Connecting with your partner is easy. Let's get started.`}
            </Text>
          </View>
        </View>

            <TouchableHighlight onPress={(f)=>{
                 this.props.goCouplePin()
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
                        Get a code and send it to them
                        </Text>
                    </View>
                    <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={(f)=>{
              this.props.goEnterCouplePin();
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
                        My partner gave me a code
                        </Text>
                    </View>
                    <Image source={{uri: 'assets/nextArrow@3x.png'}} />
                </View>
            </TouchableHighlight>

      </ScrollView>
    )
  }
}
export default JoinCouple
