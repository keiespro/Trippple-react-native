import App from './components/app'
import React, { Component } from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import configureStore from './store';
import ActionMan from  './actions/';
import loadSavedCredentials from './utils/Credentials'
import Router from './Router'
import colors from './utils/colors'

import {NavigationContext, createRouter, withNavigation,NavigationProvider,StackNavigation} from '@exponent/ex-navigation'

const store = configureStore();
const topRouter = createRouter(() => ({
  App: () => App
}))

@withNavigation
class AppContainer extends React.Component {
  componentDidMount(){
    initialize()
  }
  render() {
    const context = new NavigationContext({ store: store, router: Router })

    return (
      <ReduxProvider store={store}>
        <NavigationProvider context={context} router={topRouter}  >
          <StackNavigation
            id="navigation"
            defaultRouteConfig={{
              navigationBar: {
                visible: false,
              }
            }}
            initialRoute={topRouter.getRoute('App',{show:true})}
          />
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}
export default AppContainer



function initialize(){
  const s = store.getState();

  loadSavedCredentials().then(creds => {
    if(creds){
      store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})
    }else if(global.creds){
      store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: global.creds})
    }


  })
  .catch(err=>{

    console.log('err',err);

  })
}
