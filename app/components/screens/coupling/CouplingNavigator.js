import CouplePin from './CouplePin';
import CoupleReady from './CoupleReady';
import CoupleSuccess from './CoupleSuccess';
import NoPartner from './NoPartner';
import EnterCouplePin from './EnterCouplePin';
import FadeInContainer from '../../FadeInContainer';
import JoinCouple from './JoinCouple';
import { connect} from 'react-redux'
import colors from '../../../utils/colors';

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
import { BlurView, VibrancyView } from 'react-native-blur'




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
  routes: [{key: 'JoinCouple'}]
})

const couplingRoutes = {
  JoinCouple, CouplePin, EnterCouplePin, NoPartner, CoupleSuccess
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

    if(this.state.navState.index == 0){
      this.props.goBack();
      return
    }
    return this._handleAction({ type: 'pop' });
  }


  _renderOverlay(sceneProps) {

    return (
      <Image source={{uri:this.props.user.image_url}} resizeMode="cover" style={{height:DeviceHeight,width:DeviceWidth}}>
        <VibrancyView blurType="dark" style={styles.blurstyle} />
      </Image>

    )
  }

  _renderScene(sceneProps) {

    //todo: add coupling to store, connect here
    const initialRoute = this.props.initialScreen || sceneProps.scene.route.key
    const RouteComponent = initialRoute == 'CoupleReady' ? CoupleReady : couplingRoutes[initialRoute];

    return (
      <View style={{height:DeviceHeight,width:DeviceWidth, }}>
          <BlurView blurType="dark" style={styles.blurstyle} />

          <RouteComponent
            couple={this.props.couple}
            goBack={ this.handleBackAction.bind(this)}
            user={this.props.user}
            dispatch={this.props.dispatch}
            exit={this.props.goBack}
            startState={this.props.startState}
            goCouplePin={this._handleAction.bind(this, { type: 'push', key: 'CouplePin' })}
            goNoPartner={this._handleAction.bind(this, { type: 'push', key: 'NoPartner' })}
            goEnterCouplePin={this._handleAction.bind(this, { type: 'push', key: 'EnterCouplePin' })}
            goCoupleReady={this._handleAction.bind(this, { type: 'push', key: 'CoupleReady' })}
            onboardUser={this.props.onboardUser}
          />

        <View style={{width:100,height:20,left:10,top:0,flex:1,position:'absolute',alignSelf:'flex-start'}}>
          <TouchableOpacity onPress={this.handleBackAction.bind(this)}>
            {this.state.navState.index ? <View style={btnstyles.goBackButton}>
              <Text textAlign={'left'} style={[btnstyles.bottomTextIcon]}>◀︎ </Text>
              <Text textAlign={'left'} style={[btnstyles.bottomText]}>Go back</Text>
            </View> : <View style={[btnstyles.goBackButton,{left:-20,top:15,}]}>
              <Image resizeMode={Image.resizeMode.contain} style={{margin:0,alignItems:'flex-start',height:13,width:13}} source={{uri:'assets/close@3x.png'}} />
            </View>}
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
          onNavigateBack={this.handleBackAction.bind(this)}
          renderScene={this._renderScene.bind(this)}
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



const mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(CouplingNavigator);




const styles = StyleSheet.create({
  navigator: {
    flex: 1,
    // backgroundColor:colors.dark
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
