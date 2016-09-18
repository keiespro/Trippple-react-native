import { Dimensions, View, Modal } from 'react-native';
import React, {Component} from "react";

import { BlurView, VibrancyView } from 'react-native-blur'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

import { withNavigation} from '@exponent/ex-navigation';

import url from 'url'
import ActionMan from '../../actions'
import { connect } from 'react-redux';
import Action from './Action'                                                                                                                                        
import ActionModal from './ActionModal'
import BlurModal from './BlurModal' 
// import CameraPermissions from './CameraPermissions' 
// import CameraRollPermissions from './CameraRollPermissions'
import CheckPermissions from './CheckPermissions'
import FieldModal from './FieldModal'
import LocationPermission from './LocationPermission'
import NewNotificationPermissions from './NewNotificationPermissions'
import OnboardModal from './OnboardModal'
import PartnerMissingModal from './PartnerMissingModal'
import PrivacyPermissions from './PrivacyPermissions'
import ReportModal from './ReportModal'
import UnmatchModal from './UnmatchModal'

import Coupling from '../screens/coupling';

const Modals = {
  Action, 
  ActionModal, 
  BlurModal, 
  // CameraPermissions, 
  // CameraRollPermissions, 
  CheckPermissions, 
  FieldModal, 
  LocationPermission, 
  NewNotificationPermissions,
  NotificationPermissions: NewNotificationPermissions, 
  OnboardModal, 
  PrivacyPermissions, 
  ReportModal, 
  UnmatchModal,
  Coupling
};


@withNavigation
class ModalDirector extends Component{
  constructor(props){
    super()
    this.state = {
      modalVisible: false,
      activeModal: props.ui.activeModal
    }
  }

  componentWillReceiveProps(nProps){

    this.setState({
      activeModal: nProps.ui.activeModal || {component:Action, passProps: nProps.ui.actionModal},
      modalVisible: nProps.ui.activeModal || nProps.ui.actionModal ? true : false
    })

  }

  setModalVisible(v){
    if(v){
      this.setState({modalVisible:v})
    }else{
      this.setState({
        modalVisible:false,
      })
      this.props.dispatch(ActionMan.killModal());

    }
  }
  render(){
    if(!this.props.user.id || !this.state.activeModal){ return null }

    const { activeModal} = this.state;
    const ActiveModal = Modals[activeModal.component] || null;
    const ActiveModalProps = activeModal.passProps;
    return (
      <View style={{backgroundColor:'transparent'}}>

        {ActiveModal ? <OverlayModalInner
            user={this.props.user}
            setModalVisible={this.setModalVisible.bind(this)}
            modalVisible={this.state.modalVisible}
            navigator={this.props.navigator}
            navigation={this.props.navigation}
            dispatch={this.props.dispatch}
          >
            <ActiveModal
              user={this.props.user}
              close={this.setModalVisible.bind(this,false)}
              {...ActiveModalProps}
              navigation={this.props.navigation}
              navigator={this.props.navigator}
              dispatch={this.props.dispatch}
            />

          </OverlayModalInner> : <View/>
        }
      </View>

    )
  }
}
/////////////////// MODAL DIRECTOR
///////////////////
ModalDirector.displayName = "ModalDirector"

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    ui: state.ui,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDirector);



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
        navigator={this.props.navigator}
        dispatch={this.props.dispatch}
      >
        {/*<Image source={{uri:this.props.imageUrl || ''}} resizeMode="cover" style={{height:DeviceHeight,width:DeviceWidth}}>*/}
          {/* <VibrancyView blurType="dark" style={{height:DeviceHeight,width:DeviceWidth,position:'absolute'}} /> */}

          {this.props.children}
        {/*</Image>*/}

      </Modal>
    )
  }
}
