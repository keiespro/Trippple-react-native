import {StackNavigation} from '@exponent/ex-navigation';
import React from 'react'
import {View, Dimensions, DrawerLayoutAndroid} from 'react-native'
import { connect } from 'react-redux'

import colors from './utils/colors'
import Router from './Router'
import Settings from './components/screens/settings/settings'

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class AppNav extends React.Component {

  componentWillReceiveProps(nProps) {
    if (nProps.drawerOpen && !this.props.drawerOpen) {
      this.settingsdrawer.openDrawer()
    }
  }
  render() {
    return (
      <View style={{height: DeviceHeight}}>
        <DrawerLayoutAndroid
          drawerWidth={DeviceWidth * 0.91}
          ref={(d) => { this.settingsdrawer = d }}
          onDrawerOpen={this.props.setDrawerOpen}
          onDrawerClose={this.props.setDrawerClosed}
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
                  // shadowRadius: 6
            }}

            defaultRouteConfig={{
              navigationBar: {
                visible: true,
                borderBottomWidth: 0,
                tintColor: '#fff',
                borderWidth: 0,
                overflow: 'hidden',
                titleStyle: {
                  color: '#fff',
                  fontFamily: 'montserrat',
                  borderBottomWidth: 0,
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
  canDrawerOpen: state.ui.currentIndex == 0
})


const mapDispatchToProps = dispatch => ({
  setDrawerOpen: () => dispatch({type: 'SET_DRAWER_OPEN'}),
  setDrawerClosed: () => dispatch({type: 'SET_DRAWER_CLOSED'}),
  dispatch
});


export default connect(mapStateToProps, mapDispatchToProps)(AppNav)
