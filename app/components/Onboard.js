import React, { Component } from 'react';
import { Text, View, } from 'react-native';

import { createRouter, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'
import colors from '../utils/colors'
import OnboardModal from './modals/OnboardModal'
import LocationPermissions from './modals/LocationPermissions'
import NotificationsPermissions from './modals/NotificationsPermissions'
import Coupling from './components/screens/coupling'

import JoinCouple from './components/screens/coupling/JoinCouple'
import EnterCouplePin from './components/screens/coupling/EnterCouplePin'
import CouplePin from './components/screens/coupling/CouplePin'
import NoPartner from './components/screens/coupling/NoPartner'
import CoupleReady from './components/screens/coupling/CoupleReady';
import CoupleSuccess from './components/screens/coupling/CoupleSuccess';

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

const Onboard = () => {

  return (
    <View>
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
        initialRoute={OnboardRouter.getRoute('OnboardModal', {show: true})}
      />
    </View>
  );
}
export default Onboard
//
//
//
// const mapStateToProps = (state, ownProps) => {
//
//   return {
//     ...ownProps,
//     user: state.user,
//     fbUser: state.fbUser,
//     auth: state.auth,
//     loggedIn,
//     exnavigation: state.exnavigation,
//     savedCredentials: state.auth.savedCredentials,
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return { dispatch };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)((Onboard));
