

import React, {Component} from "react";

import {PixelRatio, Navigator, ScrollView, StyleSheet, Settings, Linking, InteractionManager, Text, Image, Alert, TouchableHighlight, AsyncStorage, TouchableOpacity, Dimensions, View,Modal} from "react-native";

import { BlurView, VibrancyView } from 'react-native-blur'


import colors from '../utils/colors'


const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import AppActions from '../flux/actions/AppActions'
import Analytics from '../utils/Analytics'
// import NotificationPermissions from './NewNotificationPermissions'
// import Coupling from '../coupling/'
import url from 'url'


// class PermissionRequester extends Component{
//   componentWillReceiveProps(nProps){
//
//     if(nProps.modalVisible && !this.props.modalVisible){
//       this.setModalVisible(false)
//     }
//     if(nProps.hasSeenNotificationPermission){
//       this.setModalVisible(false)
//     }else if(!nProps.hasSeenNotificationPermission && nProps.relevantUser ){
//       this.setModalVisible(true)
//     }else if(nProps.relevantUser ){
//       this.setModalVisible(true)
//     }
//   }
//   setModalVisible(v){
//     this.setState({modalVisible:v})
//   }
//   shouldComponentUpdate(nProps,nState){
//     return  (nState.modalVisible != this.state.modalVisible) || (nProps.relevantUser != this.props.relevantUser)
//   }
//   render(){
//     return (
//       <NotificationPermissions relevantUser={this.props.relevantUser} />
//
//     )
//   }
// }

class ModalDirector extends Component{
  constructor(props){
    super()
    this.state = {
      modalVisible: true,
      activeModal: null
    }
  }
  componentWillReceiveProps(nProps){

       this.setState({
        activeModal: nProps.AppState.showModal,
        modalVisible: nProps.AppState.showModal ? true : false
      })

  }
  setModalVisible(v){
    if(v){
      this.setState({modalVisible:v})
    }else{
      this.setState({
        modalVisible:false,
      })
      AppActions.killModal();

    }
  }
  render(){
    if(!this.props.user.id || !this.state.activeModal){ return null }

    const activeModal = this.state.activeModal;
    const ActiveModal = activeModal ? activeModal.component : null;


    return (
      <View style={{backgroundColor:'transparent'}}>

        {activeModal ?
          <OverlayModalInner
            user={this.props.user}
            setModalVisible={this.setModalVisible.bind(this)}
            modalVisible={this.state.modalVisible}
          >
            <ActiveModal
              user={this.props.user}
              close={this.setModalVisible.bind(this,false)}
              {...activeModal.passProps}
            />

          </OverlayModalInner> : null
        }
      </View>

    )
  }
}
/////////////////// MODAL DIRECTOR
///////////////////
ModalDirector.displayName = "ModalDirector"
export default ModalDirector

//
// class OverlayModalOuter extends Component{
//
//   render(){
//     return (
//       <OverlayModalInner  modalVisible={this.props.modalVisible}>
//         {this.props.children}
//       </OverlayModalInner>
//     )
//   }
// }


class OverlayModalInner extends Component{
  setModalVisible(v){
    this.props.setModalVisible(v);
  }
  render(){
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={this.setModalVisible.bind(this,false)}
      >
        {/*<Image source={{uri:this.props.imageUrl || ''}} resizeMode="cover" style={{height:DeviceHeight,width:DeviceWidth}}>*/}
          <VibrancyView blurType="dark" style={{height:DeviceHeight,width:DeviceWidth,position:'absolute'}} />

          {this.props.children}
        {/*</Image>*/}

      </Modal>
    )
  }
}
