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
    {component: SelectRelationshipStatus,title:'SelectRelationshipStatus'},

    {component: InvitePartner,  title: 'InvitePartner'},
    {component: Contacts, title: 'Contacts'},
    {component: Facebook, title: 'Facebook'},
    {component: name, title: 'name'},
    {component: bday,  title: 'bday'},
    {component: gender, title: 'gender'},
    {component: CoupleImage,  title: 'CoupleImage'},
    {component: CAMERA, title: 'CAMERA'},
    {component: EditImage, title: 'EditImage'},
    {component: SelfImage,  title: 'SelfImage'},
    {component: CAMERA, title: 'CAMERA2'},
    {component: EditImage, title: 'EditImage2'},
    {component: EditImageThumb, title: 'EditImageThumb'},
    {component: PrivacyScreen, title: 'PrivacyScreen'},
    {component: Limbo,  title: 'Limbo'},

  ];

var RouteStackSingle = [
    {component: SelectRelationshipStatus,title:'SelectRelationshipStatus'},

    {component: Facebook,title:'Facebook'},
    {component: name,title: 'name'},
    {component: bday,title: 'bday'},
    {component: gender,  title: 'gender'},
    {component: SelfImage, title: 'SelfImage'},
    {component: CAMERA, title: 'CAMERA'},
    {component: EditImage,  title: 'EditImage'},
    {component: EditImageThumb,  title: 'EditImageThumb'},
    {component: PrivacyScreen, title: 'PrivacyScreen'},
    {component: Limbo,  title: 'Limbo'},
  ];

RouteStackSingle = RouteStackSingle.map( (r,i) =>{ r.index = i; return r})
RouteStackCouple = RouteStackCouple.map( (r,i) =>{ r.index = i; return r})
console.log(RouteStackSingle,RouteStackCouple);
class Onboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      selection: 'single'
    }
  }

  selectScene (route: Navigator.route, navigator: Navigator) {
    var stack
    if(route.passProps){
      if(route.passProps.stack){
        stack = route.passProps.stack
      }else if(route.passProps.relationship_status){
        stack = route.passProps.relationship_status == 'single' ? RouteStackSingle : RouteStackCouple;
      }else if(route.index){
        console.log(route.index)
      }else{
        stack = RouteStackSingle
      }
    }else{
        stack = RouteStackSingle
      }

    var curIndex = _.findIndex(stack,(ro, i)=>{ return ro.index == route.index }) +1
    console.log('this.props.currentIndex:',curIndex);
    return (
            <route.component
              navigator={navigator}
              user={this.props.user}
              currentIndex={curIndex}
              stack={stack}
              index={route.index ? route.index : null}
              singleStack={RouteStackSingle}
              coupleStack={RouteStackCouple}
              {...route.passProps}
            />
    );
  }

  render() {

    return (
      <View style={{backgroundColor:'#000000',height:DeviceHeight,width:DeviceWidth}}>
        <Navigator
          configureScene={ (route) => route.sceneConfig ? route.sceneConfig : Navigator.SceneConfigs.FloatFromRight }
          renderScene={this.selectScene.bind(this)}
          sceneStyle={styles.container}
          navigationBar={false}
          initialRoute={RouteStackSingle[0]}
          />
          </View>
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
    backgroundColor: colors.dark
  },
});


export default Onboard
