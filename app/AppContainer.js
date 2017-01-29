import React, { Component } from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import {NavigationContext, createRouter, withNavigation, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'

import App from './components/app'
import Router from './Router'
import colors from './utils/colors'




@withNavigation
class AppContainer extends Component {
  render() {
    const context = new NavigationContext({ store: this.props.store, router: Router })
    const state = this.props.store.getState()
    console.log(state.navigation);
    return (
      <ReduxProvider store={this.props.store}>
        <NavigationProvider context={context} router={Router}>
            <App context={context}/>
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}
export default AppContainer
