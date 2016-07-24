import React, {Component} from "react";
import {StyleSheet, Text, View, Navigator, Dimensions} from "react-native";

import UserActions from '../../flux/actions/UserActions'
import colors from '../../utils/colors'
import CustomSceneConfigs from '../../utils/sceneConfigs'
import OnboardingStore from '../../flux/stores/OnboardingStore'
import OnboardingActions from '../../flux/actions/OnboardingActions'
import AltContainer from 'alt-container/native';
import Analytics from '../../utils/Analytics';

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
import Mixpanel from '../../utils/mixpanel'

var RouteStackCouple = [
    {component: SelectRelationshipStatus,id:'SelectRelationshipStatus',title:'SelectRelationshipStatus',
      name:'SelectRelationshipStatus'
    },
    {component: InvitePartner,  id: 'InvitePartner', title: 'InvitePartner',
      name: 'InvitePartner'
    },
    {component: Contacts, title: 'Contacts',
      name: 'Contacts'
    },
    {component: Facebook, title: 'Facebook',
      name: 'Facebook'
    },
    {component: name, title: 'name',
      name: 'Onboarding name'
    },
    {component: bday,  title: 'bday',
      name: 'Onboarding bday'
    },
    {component: gender, title: 'gender',
      name: 'Gender'
    },
    {component: PrivacyScreen, title: 'PrivacyScreen',
      name: 'PrivacyScreen'
    },
    {component: CoupleImage,  title: 'CoupleImage',
      name: 'CoupleImage'
    },
    {component: CAMERA, title: 'CAMERA', passProps:{image_type:'couple_profile'},
      name: 'CAMERA'
    },
    {component: EditImage, title: 'EditImage', id:'editimage',
      name: 'EditImage'
    },
    {component: EditImageThumb, title: 'EditImageThumb',
      name: 'EditImageThumb'
    },
    {component: SelfImage,  title: 'SelfImage',
      name: 'SelfImage'
    },
    {component: CAMERA, title: 'CAMERA2', passProps:{image_type:'profile'},
      name: 'CAMERA'
    },
    {component: EditImage, title: 'EditImage', id:'editimage2',
      name: 'EditImage'
    },
    {component: EditImageThumb, title: 'EditImageThumb',
      name: 'EditImageThumb'
    },
    {component: Limbo,  title: 'Limbo',
      name: 'Limbo'
    },

  ];

var RouteStackSingle = [
    {component: SelectRelationshipStatus,title:'SelectRelationshipStatus',title:'SelectRelationshipStatus'},

    {component: Facebook,title:'Facebook',
       name:'Facebook'
     },
    {component: name,title: 'name',
       name: 'Onboarding name'
     },
    {component: bday,title: 'bday',
       name: 'Onboarding bday'
     },
    {component: gender,  title: 'gender',
      name: 'Gender'
    },
    {component: PrivacyScreen, title: 'PrivacyScreen',
      name: 'PrivacyScreen'
    },
    {component: SelfImage, title: 'SelfImage',
      name: 'SelfImage'
    },
    {component: CAMERA, title: 'CAMERA',
      name: 'CAMERA'
    },
    {component: EditImage,  title: 'EditImage',
      name: 'EditImage'
    },
    {component: EditImageThumb,  title: 'EditImageThumb',
      name: 'EditImageThumb'
    },
    {component: Limbo,  title: 'Limbo',
      name: 'Limbo'
    },
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
    this.refs.onboardingNavigator.navigationContext.addListener('didfocus', (nav)=>{
      var route = nav.target.currentRoute;

      var routeName =  route.name || route.id || (route.title && route.title.length ? route.title : false) || route.component.displayName;
      Analytics.screen(routeName)


      const navIndex = this.refs.onboardingNavigator.state.presentedIndex,
            storeIndex = this.props.onboardingState.routeIndex;
      //if the current route changed by a route, update the store
      if(storeIndex < navIndex ){
      }
      if( storeIndex > navIndex ){
      }
    })

    // if(this.props.user.partner_id){
    //   this.setState({selection: 'couple'})
    // }

        if(this.props.user.relationship_status){

          // this.setState({selection: this.props.user.relationship_status})


          //
          // this.refs.onboardingNavigator.replace(
          //   stacks[this.props.user.relationship_status][this.props.user.partner_id ?
          //     this.props.user.facebook_user_id ? 4 : 3 :
          //       1]
          // )
          // OnboardingActions.updateRoute( 1);

        }
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
    // if(nProps.user.partner_id && nProps.onboardingState.routeIndex == 0){
    //   console.log('status');
    //   // this.setState({selection: 'couple'})
    //
    //   this.refs.onboardingNavigator.replace( stacks['couple'][ nProps.user.facebook_user_id ? 4 : 3 ] )
    //   OnboardingActions.updateRoute(nProps.user.facebook_user_id ? 4 : 3);
    //
    // }

    if(this.props.onboardingState.routeIndex > nProps.onboardingState.routeIndex &&  nProps.onboardingState.popped){
      this.refs.onboardingNavigator.pop()

    }else if( nProps.onboardingState.routeIndex > this.props.onboardingState.routeIndex && nProps.onboardingState.pushed){

      this.refs.onboardingNavigator.push(
        stacks['single'][nProps.onboardingState.routeIndex]
      )
    }

  }

  render() {
    return(
      <View style={{backgroundColor:'#000000',height:DeviceHeight,width:DeviceWidth}}>
        <Navigator
          configureScene={
            (route) => route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.HorizontalSlide || Navigator.SceneConfigs.HorizontalSwipeJump
          }
          key={'obnav'}
          renderScene={this.selectScene.bind(this)}
          sceneStyle={styles.container}
          navigationBar={false}
          ref={'onboardingNavigator'}
          initialRoute={ RouteStackSingle[0]}
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
