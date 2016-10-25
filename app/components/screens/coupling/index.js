import { View, Dimensions } from 'react-native';
import React, { Component } from 'react';

import {NavigationContext, createRouter, withNavigation, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'
import colors from '../../../utils/colors';

import ActionMan from '../../../actions'
import CouplePin from './CouplePin';

import CoupleReady from './CoupleReady';

import CoupleSuccess from './CoupleSuccess';

import NoPartner from './NoPartner';

import EnterCouplePin from './EnterCouplePin';

import JoinCouple from './JoinCouple';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


const couplingRouter = createRouter(() => ({
  CouplePin: () => CouplePin,
  CoupleReady: () => CoupleReady,
  CoupleSuccess: () => CoupleSuccess,
  NoPartner: () => NoPartner,
  EnterCouplePin: () => EnterCouplePin,
  JoinCouple: () => JoinCouple
}))

@withNavigation
export default class Coupling extends Component{

  static route = {
    navigationBar: {
      backgroundColor: colors.transparent,
      title(params){
        return ''
      }
    }
  };

  constructor(props){
    super()

    this.state = { }
  }

  cancel(){
    this.props.close()
  }
  componentDidMount(){
    this.props.dispatch(ActionMan.getCouplePin());
  }

  render(){
    return (
      <View>
        <NavigationProvider context={context} router={couplingRouter}>
          <StackNavigation
            id="coupling"
            defaultRouteConfig={{
              sceneStyle: {
                backgroundColor:colors.outerSpace,
              },
              navigationBar: {
                visible: false,
              // borderBottomWidth: 0,
              // translucent: false,
              // tintColor: colors.white,
              // backgroundColor: 'rgba(0,0,0,0)',
              // titleStyle: {
              //   color: colors.white,
              //   fontFamily: 'montserrat',
              //   borderBottomWidth: 0,
              // }
              },
            }}
            initialRoute={couplingRouter.getRoute('JoinCouple', {show: true})}
          />
        </NavigationProvider>
      </View>
    )
  }

}
