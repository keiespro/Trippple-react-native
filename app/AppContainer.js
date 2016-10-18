import App from './components/app'
import React, { Component } from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import configureStore from './store';
import ActionMan from './actions/';
import Router from './Router'
import colors from './utils/colors'
import {NavigationContext, createRouter, withNavigation,NavigationProvider,StackNavigation} from '@exponent/ex-navigation'

const topRouter = createRouter(() => ({
  App: () => App
}))

@withNavigation
class AppContainer extends React.Component {

  render() {
    const context = new NavigationContext({ store: this.props.store, router: Router })

    return (
      <ReduxProvider store={this.props.store}>
        <NavigationProvider context={context} router={topRouter}>
          <StackNavigation
            id="navigation"
            defaultRouteConfig={{
              navigationBar: {
                visible: false,
                borderBottomWidth: 0,
                translucent:true,
                tintColor:colors.white,
                backgroundColor:'rgba(0,0,0,0)',
                titleStyle:{
                  color:colors.white,
                  fontFamily:'montserrat',
                  borderBottomWidth: 0,
                }
              },
            }}
            initialRoute={topRouter.getRoute('App',{show:true})}
          />
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}
export default AppContainer
