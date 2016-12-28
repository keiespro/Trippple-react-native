import React, { Component } from 'react';
import { Text, View, } from 'react-native';
import { createRouter, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'
import colors from '../utils/colors'
import OnboardModal from './modals/OnboardModal'
import LocationPermissions from './modals/LocationPermissions'
import NotificationsPermissions from './modals/NotificationsPermissions'
import Coupling from './screens/coupling'
import JoinCouple from './screens/coupling/JoinCouple'
import EnterCouplePin from './screens/coupling/EnterCouplePin'
import CouplePin from './screens/coupling/CouplePin'
import NoPartner from './screens/coupling/NoPartner'
import CoupleReady from './screens/coupling/CoupleReady';
import CoupleSuccess from './screens/coupling/CoupleSuccess';
import {connect} from 'react-redux'
import FadeInContainer from './FadeInContainer';


export const OnboardRouter = createRouter(() => ({
  OnboardModal: () => OnboardModal,
  LocationPermissions: () => LocationPermissions,
  NotificationsPermissions: () => NotificationsPermissions,
  Coupling: () => Coupling,
  JoinCouple: () => JoinCouple,
  EnterCouplePin: () => EnterCouplePin,
  CouplePin: () => CouplePin,
  CoupleSuccess: () => CoupleSuccess,
  CoupleReady: () => CoupleReady,
  NoPartner: () => NoPartner
}));

const Onboard = (props) => {
  let initialRoute;
  if(!props.user.relationship_status){
    initialRoute = 'OnboardModal'
  }else if(!props.permissions.location){
    initialRoute = 'LocationPermissions'
  }else if(!props.permissions.notifications){
    initialRoute = 'NotificationsPermissions'
  }else{
    initialRoute = 'OnboardModal'
  }

  return (
    <View>
      <FadeInContainer duration={800} delay={2600}>

        <StackNavigation
          id="onboardnavigation"
          defaultRouteConfig={{
            navigationBar: {
              visible: false,
              title: 'ok',
              titleStyle: {
                color: colors.white,
                fontFamily: 'montserrat',
                borderBottomWidth: 0,
              }
            },
          }}
          initialRoute={OnboardRouter.getRoute(initialRoute, {show: true})}
        />
      </FadeInContainer>
    </View>
  );
}
export default Onboard


//
// const mapStateToProps = (state, ownProps) => {
//
//   return {
//     ...ownProps,
//     user: state.user,
//     permissions: state.permissions,
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return { dispatch };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)((Onboard));
