import React from 'react-native';
import {
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  Dimensions
  // InteractionManager,
} from 'react-native'

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import CustomSceneConfigs from '../../utils/sceneConfigs'
import OnboardingStore from '../../flux/stores/OnboardingStore'
import OnboardingActions from '../../flux/actions/OnboardingActions'
import AltContainer from 'alt-container/native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import _ from 'underscore'


import Facebook from './facebook'
import SelectRelationshipStatus from './selectRelationshipStatus'
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

var RouteStackCouple = [
    {component: SelectRelationshipStatus,id:'SelectRelationshipStatus',title:'SelectRelationshipStatus'},

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

    {component: InvitePartner,  id: 'InvitePartner', title: 'InvitePartner'},
    {component: Contacts, title: 'Contacts'},
    {component: Facebook, title: 'Facebook'},
    {component: name, title: 'name'},
    {component: bday,  title: 'bday'},
    {component: gender, title: 'gender'},
    {component: PrivacyScreen, title: 'PrivacyScreen'},
    {component: CoupleImage,  title: 'CoupleImage'},
    {component: CAMERA, title: 'CAMERA', passProps:{image_type:'couple_profile'}},
    {component: EditImage, title: 'EditImage', id:'editimage'},
    {component: EditImageThumb, title: 'EditImageThumb'},
    {component: SelfImage,  title: 'SelfImage'},
    {component: CAMERA, title: 'CAMERA2', passProps:{image_type:'profile'}},
    {component: EditImage, title: 'EditImage', id:'editimage2'},
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

const stacks = {
  single: RouteStackSingle,
  couple: RouteStackCouple
}

class Onboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      selection: 'single'
    }
  }
  componentDidMount(){
    this.refs.onboardingNavigator.navigationContext.addListener('didfocus', (e)=>{

      const navIndex = this.refs.onboardingNavigator.state.presentedIndex,
            storeIndex = this.props.onboardingState.routeIndex;
      //if the current route changed by a route, update the store
      if(storeIndex < navIndex ){
        OnboardingActions.updateRoute(this.props.onboardingState.routeIndex + 1)
      }
      if( storeIndex > navIndex ){
        OnboardingActions.updateRoute(this.props.onboardingState.routeIndex-1)
      }
    })
  }
  selectScene (route: Navigator.route, navigator: Navigator) {

    return (
      <route.component
              navigator={navigator}
              user={this.props.user}
              userInfo={this.props.onboardingState.userInfo}
              AppState={this.props.AppState}
              {...route.passProps}
            />
    );
  }
  componentWillReceiveProps(nProps){
    if(this.props.onboardingState.routeIndex > nProps.onboardingState.routeIndex &&  nProps.onboardingState.popped){
      this.refs.onboardingNavigator.pop()

    }else if( nProps.onboardingState.routeIndex > this.props.onboardingState.routeIndex && nProps.onboardingState.pushed){

      this.refs.onboardingNavigator.push(
        stacks[nProps.onboardingState.currentStack][nProps.onboardingState.routeIndex]
      )
    }

  }

  render() {

    return (

      <View style={{backgroundColor:'#000000',height:DeviceHeight,width:DeviceWidth}}>
        <Navigator
          configureScene={
            (route) => route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.SlideInFromRight || Navigator.SceneConfigs.HorizontalSwipeJump
  }
          key={'obnav'}
          renderScene={this.selectScene.bind(this)}
          sceneStyle={styles.container}
          navigationBar={false}
          ref={'onboardingNavigator'}
          initialRoute={RouteStackSingle[0]}
        />
      </View>
    )

  }

}

class Onboarding extends Component{


  render(){

        return (
            <AltContainer stores={{onboardingState: OnboardingStore}}>
              <Onboard user={this.props.user} AppState={this.props.AppState} />
            </AltContainer>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:DeviceHeight,
    width:DeviceWidth,
    padding:0,
    top:0,
    left:0,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf:'stretch',
    backgroundColor: 'transparent'
  },
});


export default Onboarding
