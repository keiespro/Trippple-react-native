import {StackNavigation,NavigationContext, NavigationProvider} from '@exponent/ex-navigation';
import React from 'react'
import {View,Dimensions,DrawerLayoutAndroid} from 'react-native'
import colors from './utils/colors'
import Router from './Router'
import Settings from './components/screens/settings/settings'
import { connect } from 'react-redux'
const DeviceHeight = Dimensions.get('window').height;

class AppNav extends React.Component {

    componentWillReceiveProps(nProps){
      if(nProps.drawerOpen && !this.props.drawerOpen){
        this.refs.settingsdrawer.openDrawer()
      }
    }
    render() {
        return (
        <View style={{height:DeviceHeight}}>
        <DrawerLayoutAndroid
           drawerWidth={300}
           ref="settingsdrawer"
           onDrawerOpen={this.props.setDrawerOpen}
           onDrawerClose={this.props.setDrawerClosed}
           drawerLockMode={this.props.canDrawerOpen ? 'unlocked' : 'locked-closed'}
           drawerBackgroundColor={colors.outerSpace}
           drawerPosition={DrawerLayoutAndroid.positions.Left}
           renderNavigationView={() => <Settings/>}
         >
           <StackNavigation
              id="exnavigation"
              sceneStyle={{
                  overflow: 'visible',
                  shadowColor: '#000',
                  shadowOpacity: 0.5,
                  shadowRadius: 6
              }}

              defaultRouteConfig={{
                  navigationBar: {
                      visible: true,
                      borderBottomWidth: 0,
                      translucent:true,
                      tintColor:'#fff',
                      backgroundColor:'rgba(0,0,0,0)',
                      titleStyle:{
                          color:'#fff',
                          fontFamily:'Montserrat',
                          borderBottomWidth: 0,
                      }
                  },
              }}
              initialRoute={Router.getRoute('Potentials',{show:true})}
          />
          </DrawerLayoutAndroid>

        </View>
    )
    }
}


const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    drawerOpen: state.ui.drawerOpen,
    canDrawerOpen: state.ui.currentIndex == 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setDrawerOpen: () => dispatch({type: 'SET_DRAWER_OPEN'}),
    setDrawerClosed: () => dispatch({type: 'SET_DRAWER_CLOSED'}),
    dispatch
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(AppNav)
