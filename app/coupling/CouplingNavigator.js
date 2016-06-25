import React,{Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NavigationExperimental,
  Image,
  Dimensions,
  ScrollView
} from 'react-native'

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils
} = NavigationExperimental

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import FadeInContainer from '../components/FadeInContainer'
import { BlurView, VibrancyView } from 'react-native-blur'


import JoinCouple from './JoinCouple'
import CouplePin from './CouplePin'
import CoupleSuccess from './CoupleSuccess'
import EnterCouplePin from './EnterCouplePin'
import BackButton from '../components/BackButton'
import colors from '../utils/colors'
import BlurModal from '../modals/BlurModal'

import CouplingStore from '../flux/stores/CouplingStore'
import AltContainer from 'alt-container/native';


function createReducer(initialState) {
  return (currentState = initialState, action) => {
    switch (action.type) {
      case 'push':
        return NavigationStateUtils.push(currentState, {key: action.key});
      case 'pop':
        return currentState.index > 0 ? NavigationStateUtils.pop(currentState) : currentState;
      default:
        return currentState;
    }
  }
}

const NavReducer = createReducer({
  index: 0,
  key: 'Coupling',
  children: [{key: 'JoinCouple'}]
})

const couplingRoutes = {
  JoinCouple, CoupleSuccess, CouplePin, EnterCouplePin,
}

class CouplingNavigator extends Component {

  constructor(props) {
    super()
    this.state = {
      navState: NavReducer(undefined, {})
    }
  }

  _handleAction (action) {
    const newState = NavReducer(this.state.navState, action);
    if (newState == this.state.navState) {
      return false;
    }
    this.setState({
      navState: newState
    })
    return true;
  }

  handleBackAction() {
    console.log(this.state.navState.index);
    if(this.state.navState.index == 0){
      this.props.goBack();
      return
    }
    return this._handleAction({ type: 'pop' });
  }

  _renderRoute (key) {
    if (key == 'JoinCouple') {
      return <JoinCouple
        goCouplePin={this._handleAction.bind(this, { type: 'push', key: 'CouplePin' })}
        goEnterCouplePin={this._handleAction.bind(this, { type: 'push', key: 'EnterCouplePin' })}
        couple={this.props.couple}
        goBack={ this.handleBackAction.bind(this)}
        user={this.props.user}
      />
    }
    if (key == 'CouplePin') {
      return <CouplePin
        goBack={this.handleBackAction.bind(this)}
        exit={this.props.goBack}
        couple={this.props.couple}
        user={this.props.user}
      />
    }
    if (key == 'EnterCouplePin') {
      return <EnterCouplePin
        goCoupleSuccess={this._handleAction.bind(this, { type: 'push', key: 'CoupleSuccess' })}
        goBack={ this.handleBackAction.bind(this)}
        couple={this.props.couple}
        user={this.props.user}
        exit={this.props.goBack}
      />
    }
    if (key == 'CoupleSuccess') {
      return <CoupleSuccess
        couple={this.props.couple}
        goBack={ this.handleBackAction.bind(this)}
        user={this.props.user}
        exit={this.props.goBack}
      />
    }
  }
  _renderOverlay(sceneProps) {

    return (
      <Image source={{uri:this.props.user.image_url}} resizeMode="cover" style={{height:DeviceHeight,width:DeviceWidth}}>
        <VibrancyView blurType="dark" style={styles.blurstyle} />
      </Image>

    )
  }

  _renderScene(sceneProps) {
    console.log(sceneProps);

    const couplingData = {
       couple: (props) => {
          return {
            store: CouplingStore,
            value: CouplingStore.getCouplingData()
          }
        }
      };
    const RouteComponent = couplingRoutes[sceneProps.scene.navigationState.key];

    return (
      <View style={{height:DeviceHeight,width:DeviceWidth, }}>
        <FadeInContainer style={{position:'absolute',width:DeviceWidth,height:DeviceHeight}} delayAmount={600} duration={300}>
          <VibrancyView blurType="dark" style={styles.blurstyle} />
        </FadeInContainer>
        <AltContainer stores={couplingData}>

          <RouteComponent
            couple={this.props.couple}
            goBack={ this.handleBackAction.bind(this)}
            user={this.props.user}
            exit={this.props.goBack}
            goCouplePin={this._handleAction.bind(this, { type: 'push', key: 'CouplePin' })}
            goEnterCouplePin={this._handleAction.bind(this, { type: 'push', key: 'EnterCouplePin' })}
            goCoupleSuccess={this._handleAction.bind(this, { type: 'push', key: 'CoupleSuccess' })}
          />
        </AltContainer>

        <View style={{width:100,height:20,left:10,top:-10,flex:1,position:'absolute',alignSelf:'flex-start'}}>
          <TouchableOpacity onPress={this.handleBackAction.bind(this)}>
            <View style={btnstyles.goBackButton}>
              <Text textAlign={'left'} style={[btnstyles.bottomTextIcon]}>◀︎ </Text>
              <Text textAlign={'left'} style={[btnstyles.bottomText]}>Go back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>



    )

  }


  render() {
    return (
        <NavigationCardStack
          style={styles.navigator}
          navigationState={this.state.navState}
          onNavigate={this.handleBackAction.bind(this)}
          renderScene={this._renderScene.bind(this)}
          direction={'horizontal'}
        />

    )
  }
}



const btnstyles = StyleSheet.create({
 bottomTextIcon:{
    fontSize: 14,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    color: colors.rollingStone,
    marginTop:0
  },

  bottomText: {
    marginTop: 0,
    color: colors.rollingStone,
    fontSize: 16,
    fontFamily:'Omnes-Regular',
  },
  goBackButton:{
    padding:20,
    paddingLeft:0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent:'center'
  },
});


export default CouplingNavigator




const styles = StyleSheet.create({
  navigator: {
    flex: 1,
    backgroundColor:colors.dark
  },
  scrollView: {
    marginTop: 64,

  },
  blurstyle:{
    position:'absolute',
    top:0,
    width:DeviceWidth,
    height:DeviceHeight,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column'
  },
});
