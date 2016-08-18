/*
* @flow
*/


import React, {Component} from "react";
import {View, Navigator} from "react-native";


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
          <NotificationDisplayer AppState={this.props.AppState}   user={this.props.user} />
          <NotificationCommander user={this.props.user} />
        </View>
    )
   }
}
export default Notifications
