import React, { Component } from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import {NavigationContext, createRouter, withNavigation, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'

import AppWrap from './components/appWrap'
import Router from './Router'
import colors from './utils/colors'




class AppContainer extends Component {
  render() {
    const context = new NavigationContext({ store: this.props.store, router: Router })
    const state = this.props.store.getState()



    return (
      <ReduxProvider store={this.props.store}>
        <NavigationProvider context={context} router={Router}>
            <AppWrap context={context}/>
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}
export default AppContainer
