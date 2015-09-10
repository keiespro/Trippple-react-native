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


import Facebook from './facebook'
import SelectRelationshipStatus from './selectRelationshipStatus'
import BdayScreen from './bday'
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

const RouteStacks = {
  root: [ SelectRelationshipStatus ],
  single: [
    Facebook, name, bday, gender, SelfImage, EditImage, EditImageThumb, PrivacyScreen, Limbo
  ],
  couple: [
    InvitePartner, Contacts, Facebook, name, bday, gender, CoupleImage, EditImage, SelfImage, EditImage, EditImageThumb, PrivacyScreen, Limbo
  ]
}

class Onboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      selection: 'single'
    }
  }

  selectScene (route: Navigator.route, navigator: Navigator) {
    var whichStack = route.passProps && route.passProps.whichStack || this.state.selection

    console.log(whichStack)
    var nextIndex = route.index || route.__navigatorRouteID - 1
    if(nextIndex < 0) { nextIndex = 1 }
    var nextRoute = RouteStacks[whichStack][ nextIndex  ]
    console.log('Next route:',nextIndex )
    return (
            <route.component
              navigator={navigator}
              user={this.props.user}
              index={nextIndex}
              whichStack={whichStack}
              nextRoute={ nextRoute}
              {...route.passProps}
            />
    );
  }

  render() {

    return (
        <Navigator
          configureScene={ (route) => route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.SlideInFromRight }
          renderScene={this.selectScene.bind(this)}
          sceneStyle={styles.container}
          navigationBar={false}
          initialRoute={{

            component: SelectRelationshipStatus,
            passProps: {
              chooseStack: (selection)=>{
                this.setState({selection})
              },
              singleStack:Facebook,
              coupleStack:InvitePartner
            }
          }}
        />
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
