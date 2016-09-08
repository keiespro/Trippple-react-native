import App from './components/app'
import React, { Component } from 'react';
import {Settings,View} from 'react-native'
import {Provider as ReduxProvider} from 'react-redux';
import configureStore from './store';
import ActionMan from  './actions/';
import loadSavedCredentials from './utils/Credentials'
import TouchID from 'react-native-touch-id'
import LockFailed from './components/LockFailed'
import Router from './Router'
import {NavigationContext,NavigationProvider} from '@exponent/ex-navigation'

const store = configureStore();


class NewBoot extends Component{

  state = {
    booted: false,
    locked: Settings._settings['LockedWithTouchID']
  };
  
  componentWillMount(){
    if(this.state.locked){
      this.checkTouchId()
    }
  }

  checkTouchId(){
    TouchID.authenticate('Access Trippple')
      .then(success => {
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
  componentDidMount(){
    initialize()
  }    

  render() {
    if(this.state.lockFailed){ return <LockFailed retry={this.checkTouchId.bind(this)}/> }

    return this.state.locked ? <View/> : <AppContainer />
  }
}

export default NewBoot


class AppContainer extends React.Component {
  render() {
    const context = new NavigationContext({ store, router: Router })
    
    return (
      <ReduxProvider store={store}>
        <NavigationProvider router={Router} >
          <App {...this.props} context={context}  />
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}


function initialize(){
  const s = store.getState();
  loadSavedCredentials().then(creds => {

    const a = s.auth
    const f = s.fbUser

    if(!global.creds){
      if(a.api_key){


        store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: a})

        return a
      }else if(f.userID){
        store.dispatch(ActionMan.loginWithFacebook())
        reject()
      }else{
        store.dispatch(ActionMan.loginWithFacebook())
        
        return false
      }
    }else{
      store.dispatch({type: 'INITIALIZE_CREDENTIALS', payload: creds})


    }
    return creds
  })
  .catch(err=>{

    console.log('err',err);

    if(s.fbUser.userID){
      store.dispatch(ActionMan.loginWithFacebook())
    }
  })
}
