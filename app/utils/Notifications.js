/*
* @flow
*/


import React from "react";

import {Component} from "react";
import {View, Navigator} from "react-native";

import alt from '../flux/alt';
import AltContainer from 'alt-container/native';

import UserStore from '../flux/stores/UserStore';
import CredentialsStore from '../flux/stores/CredentialsStore'

import NotificationsStore from '../flux/stores/NotificationsStore';
import NotificationCommander from '../utils/NotificationCommander';
import NotificationDisplayer from '../utils/NotificationDisplayer';


class Notifications extends Component{
  constructor(props){
    super()
  }
  componentDidMount(){
  }
  render(){
    return (
        <View style={{position:'absolute',top:0}}>
          <AltContainer store={NotificationsStore}>
            <NotificationDisplayer user={this.props.user} />
          </AltContainer>

          <AltContainer store={CredentialsStore}>
            <NotificationCommander user={this.props.user}/>
          </AltContainer>
        </View>
    )
   }
}
export default Notifications
