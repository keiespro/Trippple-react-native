import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  LayoutAnimation,
  Dimensions,
  Modal,
} from 'react-native';
import React, { Component } from 'react';

import UserProfile from '../UserProfile';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../utils/colors'
import _ from 'underscore'
import FadeInContainer from '../FadeInContainer'
import ReportModal from '../modals/ReportModal'
import UnmatchModal from '../modals/UnmatchModal'

import { BlurView,VibrancyView} from 'react-native-blur'

class ActionModal extends Component{

  constructor(props){
    super();

    this.state = {
      modalBG: 'transparent',
      favorited: props.currentMatch ? props.currentMatch.isFavourited : false
    }
  }


  _continue(){
    this.toggleModal();
  }
  toggleModal(){
    this.props.toggleModal()
  }
  showProfile(match){

    var {user} = this.props,
          rel = user.relationship_status


    var theirIds = Object.keys(match.users).filter( u => { return u != user.id && u != user.partner_id})
    var them = theirIds.map((id) => match.users[id])

    const MatchUserAsPotential = {
      user: them[0],
      partner: them[1] || null
    }

    this.props.navigator.push(this.props.navigation.router.getRoute('UserProfile',{potential:MatchUserAsPotential,user:this.props.user}));

  }

  unMatchModal(match){

     this.props.navigator.push({
      component:  UnmatchModal,
      passProps:{
        action: 'unmatch',
        match,
        goBack: ()=> {
          this.props.navigator.pop()
        }
      }
    })
    this.toggleModal()

  }

  reportModal(match){

     this.props.navigator.push({
      component: ReportModal,
      passProps: {
        action: 'report',
        match,
        goBack: ()=> {
          this.props.navigator.pop()
        }
      }
    })
    this.toggleModal()

  }



  render(){

    if(!this.props.currentMatch ){ return false;}
    var {isVisible} = this.props
    var theirIds = Object.keys(this.props.currentMatch.users).filter( (u)=> u != this.props.user.id && u != this.props.user.partner_id)
    var them = theirIds.map((id)=> this.props.currentMatch.users[id])
    var img_url = them[0].thumb_url
    var  matchName
    if(this.props.user.relationship_status == 'couple'){
      matchName = them[0].firstname
    }else{
      matchName = them.reduce((acc,u,i)=>{return acc + u.firstname.toUpperCase() + (i == 0 ? ` & ` : '')  },'') +''
    }
    return (

      <ActualModal
        isVisible={isVisible || false}
        them={them}
        theirIds={theirIds}
        currentMatch={this.props.currentMatch}
        unMatchModal={this.unMatchModal.bind(this)}
        reportModal={this.reportModal.bind(this)}
        showProfile={this.showProfile.bind(this)}
        toggleModal={this.toggleModal.bind(this)}
        matchName={matchName}
        img_url={img_url}
        user={this.props.user}

        />

    );
  }


}

class ActualModal extends Component{

  constructor(props){
    super();

  }
  render(){
    const {img_url,them,matchName,theirIds,isVisible,user} = this.props
    var matchImage;
          // var img = img_url;//(thumb_url && typeof thumb_url === 'string' ? thumb_url : image_url);
          // if(img && img.includes('test')){
          //   var u = img;
          //   var x = u.split('/test/')[0].split('uploads') + u.split('test')[1];
          //   matchImage = x.split('/images')[0] + x.split('/images')[1]
          // }else{
          //   matchImage = +'';
          // }
    if(isVisible){
      return (
        <Modal
          isVisible={isVisible || true}
          animationType={'slide'}
          transparent={true}
          onDismiss={()=>{
              this.props.toggleModal();
          }}>

          <View style={[styles.actionmodal]}>
            <TouchableOpacity activeOpacity={0.5} onPress={this.props.toggleModal}
             style={[{position:'absolute',top:0,left:0,width:DeviceWidth,height:DeviceHeight,backgroundColor:'transparent'}]} >
             <View/>
           </TouchableOpacity>
            <View style={[styles.insideactionmodal]}>

            <View style={[styles.userimageContainer,styles.blur]}>
              <Image
                style={styles.userimage}
                key={this.props.currentMatch.match_id}
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
                    this.props.unMatchModal(this.props.currentMatch)
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
                    this.props.reportModal(this.props.currentMatch)
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
                  MatchActions.toggleFavorite(this.props.currentMatch.match_id.toString())
                }}>
                <View >
                  <Text style={[styles.clearButtonText,styles.modalButtonText]}>
                    {this.props.currentMatch.isFavourited ? 'UNFAVORITE' : 'FAVORITE'}
                  </Text>
                </View>
              </TouchableHighlight>
*/}
              <TouchableHighlight
                style={[styles.clearButton,styles.modalButton,{borderColor:colors.mediumPurple,backgroundColor:colors.mediumPurple20}]}
                underlayColor={colors.mediumPurple}
                onPress={()=>{
                  // this.props.toggleModal()
                  this.props.showProfile(this.props.currentMatch)
                }}>
                <View >
                  <Text style={[styles.clearButtonText,styles.modalButtonText]}>
                    VIEW PROFILE
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableOpacity onPress={this.props.toggleModal}>
                <View style={{flex:1,paddingVertical:10}}>
                  <Text style={{textAlign:'center',fontSize:16,color:colors.shuttleGray}}>CANCEL</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>
          </View>
        </Modal>
      )
    }else{
      return <View/>
    }
  }
}
ActionModal.displayName = "ActionModal"

export default ActionModal;

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
    backgroundColor: colors.outerSpace,
    padding:10,
    bottom:0,
    position:'absolute',
    width:DeviceWidth,

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
    flex:1,
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
     height: 100,
     marginBottom:20,
     width:100,
     position:'relative',
     borderRadius:50,
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
