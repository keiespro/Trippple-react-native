import {StackNavigation} from '@exponent/ex-navigation';
import React from 'react'
import {View, Dimensions, BackAndroid, StatusBar, DrawerLayoutAndroid} from 'react-native'
import { connect } from 'react-redux'

import colors from './utils/colors'
import Router from './Router'
import Settings from './components/screens/settings/settings'
import {SlideHorizontalIOS, FloatHorizontal, FloatVertical} from './ExNavigationStylesCustom'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class AppNav extends React.Component {

  componentWillReceiveProps(nProps) {
    if(nProps.drawerOpen && !this.props.drawerOpen) {
      this.settingsdrawer.openDrawer()
    }
  }
  setDrawerClosed(){
    // StatusBar.setTranslucent(false);
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAndroid.bind(this))
    this.props.setDrawerClosed()
  }
  setDrawerOpen(){
    // StatusBar.setTranslucent(true);
     BackAndroid.addEventListener('hardwareBackPress', this.handleBackAndroid.bind(this))
    this.props.setDrawerOpen()
  }
  handleBackAndroid(){
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAndroid.bind(this))
    this.settingsdrawer.closeDrawer()
    return this.props.canDrawerOpen
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.outerSpace, }}>

        <DrawerLayoutAndroid
          drawerWidth={DeviceWidth * 0.91}
          ref={(d) => { this.settingsdrawer = d }}
          onDrawerOpen={this.setDrawerOpen.bind(this)}
          onDrawerClose={this.setDrawerClosed.bind(this)}
          drawerLockMode={this.props.canDrawerOpen ? 'unlocked' : 'locked-closed'}
          drawerBackgroundColor={colors.outerSpace}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => <Settings />}
        >
          <StackNavigation
            id="exnavigation"
            sceneStyle={{
                  // overflow: 'visible',
                  // shadowColor: '#000',
                  // shadowOpacity: 0.5,
                  backgroundColor: colors.outerSpace,
                  // shadowRadius: 6
            }}

            defaultRouteConfig={{
              styles: FloatVertical,
              sceneStyle:{
                backgroundColor: colors.outerSpace,
              },
              statusBar:{
                translucent: true,
                backgroundColor:colors.mediumPurple70
              },
              navigationBar: {
                visible: true,
                borderBottomWidth: 0,
                tintColor: '#fff',
                borderWidth: 0,
                translucent: true,
                backgroundColor: colors.shuttleGrayAnimate,
                titleStyle: {
                  color: '#fff',
                  fontFamily: 'montserrat',
                  borderBottomWidth: 0,
                  fontWeight:'800'
                }
              },
            }}
            initialRoute={Router.getRoute('Potentials', {show: true})}
          />
        </DrawerLayoutAndroid>

      </View>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  drawerOpen: state.ui.drawerOpen,
  canDrawerOpen: state.ui.currentIndex == 0 && !state.ui.profileVisible
})


const mapDispatchToProps = dispatch => ({
  setDrawerOpen: () => dispatch({type: 'SET_DRAWER_OPEN'}),
  setDrawerClosed: () => dispatch({type: 'SET_DRAWER_CLOSED'}),
  dispatch
});


export default connect(mapStateToProps, mapDispatchToProps)(AppNav)
