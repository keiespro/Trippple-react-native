
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  LayoutAnimation,
  Dimensions,
  Modal,ScrollView
} from 'react-native';
import React, { Component } from 'react';

import UserProfile from '../UserProfile';

import {withNavigation} from '@exponent/ex-navigation';


const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../utils/colors'
import _ from 'underscore'
import FadeInContainer from '../FadeInContainer'
import ReportModal from './ReportModal'
import UnmatchModal from './UnmatchModal'
import ActionMan from '../../actions'
import { BlurView,VibrancyView} from 'react-native-blur'

@withNavigation
class Action extends React.Component{
  
  render(){
    const currentMatch = this.props.match || this.props.currentMatch || this.props.scene.route.params.matchInfo;

    const img_url_id = Object.keys(currentMatch.users).filter(uid => uid != this.props.user.id  && uid != this.props.user.partner_id);
    console.log(img_url_id);
    if(typeof img_url_id == 'object'){
      img_url_id_id = img_url_id[0]
    }
    const img_url = currentMatch.users[(img_url_id_id || img_url_id) ].image_url;

    var theirIds = Object.keys(currentMatch.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id)
    var them = theirIds.map(id=> currentMatch.users[id] )
    var  matchName;
    if(this.props.user.relationship_status == 'couple'){
      matchName = them[0].firstname
    }else{
      matchName = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },'') +'';
    }
    
    return (
      
      <BlurView blurType="dark" style={styles.actionmodal}>
      <ScrollView >

<View  style={[styles.actionmodal]}>
  <TouchableOpacity activeOpacity={0.5} onPress={this.props.toggleModal}
   style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight,backgroundColor:'transparent'}]} >
   <View/>
 </TouchableOpacity>
  <View style={[styles.insideactionmodal]}>
  <View style={{flexDirection:'column',justifyContent:'space-around',flex:1}}>

  <View style={[styles.userimageContainer,styles.blur]}>
    <Image
      style={styles.userimage}
      key={currentMatch.match_id}
      source={ {uri: img_url} }
      defaultSource={{uri: 'assets/placeholderUser@3x.png'}}
      resizeMode={Image.resizeMode.cover}
    />
    <Text style={{color:colors.white,fontFamily:'Montserrat-Bold',fontSize:18}}>
      {matchName}
    </Text>

  </View>

<View>
    <View style={{flexDirection:'row',justifyContent:'space-between',
      marginHorizontal:10,
      paddingHorizontal:0,
      paddingBottom:10,
      marginBottom:10,
      borderBottomWidth:1,
      borderBottomColor:colors.shuttleGray}}>

      <TouchableHighlight
        style={[styles.clearButton,styles.inlineButtons,{marginRight:10}]}
        underlayColor={colors.shuttleGray20}
        onPress={()=>{ 
          this.props.dispatch(ActionMan.killModal())

          this.props.dispatch(ActionMan.showInModal({component: UnmatchModal, passProps:{match:currentMatch,goBack:()=>{this.props.dispatch(ActionMan.killModal()) } }}))


        }}>
        <View >
          <Text style={[styles.clearButtonText]}>
            UNMATCH
          </Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        style={[styles.clearButton,styles.inlineButtons,{marginLeft:10}]}
        underlayColor={colors.shuttleGray20}
        onPress={()=>{
            this.props.dispatch(ActionMan.showInModal({component: ReportModal, passProps:{match:currentMatch,goBack:()=>{this.props.dispatch(ActionMan.killModal()) }}}))


        }}>
        <View >
          <Text style={[styles.clearButtonText]}>
            REPORT
          </Text>
        </View>
      </TouchableHighlight>

    </View>

{/*        <TouchableHighlight
      style={[styles.clearButton,styles.modalButton]}
      underlayColor={colors.mediumPurple}
      onPress={()=>{
       }}>
      <View >
        <Text style={[styles.clearButtonText,styles.modalButtonText]}>
          {match:currentMatch.isFavourited ? 'UNFAVORITE' : 'FAVORITE'}
        </Text>
      </View>
    </TouchableHighlight>
*/}
    <TouchableHighlight
      style={[styles.clearButton,styles.modalButton,{borderColor:colors.mediumPurple,backgroundColor:colors.mediumPurple20}]}
      underlayColor={colors.mediumPurple}
      onPress={()=>{

    var {user,match} = this.props,
          rel = user.relationship_status


    var theirIds = Object.keys(match.users).filter( u => { return u != user.id && u != user.partner_id})
    var them = theirIds.map((id) =>match.users[id])

    const MatchUserAsPotential = {
      user: them[0],
      partner: them[1] || null
    }
console.log(this.props);
        this.props.navigator.push(this.props.navigation.router.getRoute('UserProfile',{potential:MatchUserAsPotential,user:this.props.user}));
      }}>
      <View >
        <Text style={[styles.clearButtonText,styles.modalButtonText]}>
          VIEW PROFILE
        </Text>
      </View>
    </TouchableHighlight>
</View>

        </View>
  <TouchableOpacity onPress={()=>{ this.props.close()}}>
        <View style={{flex:1,paddingVertical:10,paddingTop:30}}>
          <Text style={{textAlign:'center',fontSize:16,color:colors.shuttleGray}}>CANCEL</Text>
        </View>
      </TouchableOpacity>

</View></View>

</ScrollView>
</BlurView>

)
}

}

export default Action


const styles = StyleSheet.create({
  actionmodal:{
    width:DeviceWidth,
    backgroundColor: 'transparent',
    height:DeviceHeight,
    justifyContent:'flex-start',
    margin:0,
    position:'absolute',
    bottom:0,
    top:0,
    overflow:'hidden'

  },
  insideactionmodal:{
    // backgroundColor: colors.outerSpace,
    padding:10,
    bottom:0,
    position:'absolute',
    flex:1,
    width:DeviceWidth,
    justifyContent:'space-between',

    height:DeviceHeight,

  },
  clearButton:{
    backgroundColor:'transparent',
    borderColor:colors.rollingStone,
    alignItems:'center',
    marginVertical: 10,
    borderRadius:0,
    justifyContent:'center',
    height:60,
    borderWidth:1

  },
  modalButton:{
    alignSelf:'stretch',
    alignItems:'center',
    margin: 10,
    borderRadius:0,
    justifyContent:'center',
    height:60,
    borderWidth:1
  },
  profileButton:{
    backgroundColor:colors.mediumPurple20,
    borderColor:colors.mediumPurple,

  },
  inlineButtons:{
    flex:1,
  },
  modalButtonText:{
    color:colors.white,
    fontFamily:'Montserrat',
    fontSize:18,

    textAlign:'center'
  },
  clearButtonText:{
    color:colors.rollingStone,
    fontFamily:'Montserrat',
    fontSize:18,

    textAlign:'center'
  },

  container: {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf:'stretch',
    flexDirection: 'column',
    width: DeviceWidth,
    height: DeviceHeight,
    top:0,
    position:'absolute'


  },
  fullwidth:{
    width: DeviceWidth
  },
   col: {
    flexDirection: 'column',
    padding: 0,
  },


   userimageContainer: {

    alignItems: 'center',
    flexDirection:'column',
    justifyContent:'center',
    alignSelf:'stretch',
    paddingTop: 0,
    marginVertical:10,
    paddingBottom: 20,
    width: DeviceWidth - 20,
    paddingHorizontal: 20,
   },

   blur:{

   },

   userimage: {
     padding:0,
     marginVertical:10,
     height: 150,
     marginBottom:20,
     width:150,
     position:'relative',
     borderRadius:75,
     overflow:'hidden'
   },
})



var animations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 300,
        delay: 500,
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
        delay: 500,
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
