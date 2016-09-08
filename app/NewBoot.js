import App from './components/app'
import React, { Component } from 'react';
import {Settings,View} from 'react-native'
import {Provider as ReduxProvider} from 'react-redux';
import {connect} from 'redux'
import configureStore from './store';
import ActionMan from  './actions/';
import loadSavedCredentials from './utils/Credentials'
import TouchID from 'react-native-touch-id'
import LockFailed from './components/LockFailed'
import colors from './utils/colors'
import Router from './Router'
import {NavigationContext, createRouter, withNavigation,NavigationProvider,StackNavigation} from '@exponent/ex-navigation'

const store = configureStore();


class NewBoot extends Component{

  state = {
    booted: false,
    locked: Settings._settings['LockedWithTouchID']
  };

  componentWillMount(){
    if(this.state.locked){
      this.checkTouchId()
    }else{
      this.initialize()
    }

  }
  initialize(){
    // console.log(store);
    // store.subscribe(this.)

      initialize()
  }

  checkTouchId(){
    TouchID.authenticate('Access Trippple')
      .then(success => {
        console.log(success);
        this.initialize()

        this.setState({
          lockFailed: false,
          locked: false
        })
      })
      .catch(error => {
        Analytics.err(err)
        this.setState({
          lockFailed: true
        })
      });
  }
  componentWillReceiveProps(nProps){


  }

  render() {
    if(this.state.lockFailed){ return <LockFailed retry={this.checkTouchId.bind(this)}/> }

    return this.state.locked ? <View/> : <AppContainer />
  }
}

export default NewBoot




const topRouter = createRouter(() => ({
  App: () => App
}))

@withNavigation
class AppContainer extends React.Component {
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


function initialize(){
  const s = store.getState();

  loadSavedCredentials().then(creds => {
    console.log(creds,'keychai');
console.log(global.creds,'glob');

    const a = s.auth
    const f = s.fbUser
console.log(a,f,'state');

    if(!global.creds){
      if(a.api_key){


        store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: a})

        return a
      }
    }else{
      store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: global.creds})


    }


  })
  .catch(err=>{

    console.log('err',err);

    if(s.fbUser.userID){
      store.dispatch(ActionMan.loginWithFacebook())
    }
  })
}
