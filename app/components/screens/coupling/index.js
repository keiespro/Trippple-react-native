import { View, Dimensions } from 'react-native';
import React, { Component } from 'react';

import CouplingNavigator from './CouplingNavigator';
import colors from '../../../utils/colors';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width


export default class Coupling extends Component{

  static route = {
    navigationBar: {
      backgroundColor: colors.transparent,
      title(params){
        return ``
      }
    }
  };

  constructor(props){
    super()

    this.state = { }
  }

  cancel(){
    this.props.close()
  }
  componentDidMount(){
    // UserActions.getCouplePin();

  }

  render(){


    return  (
      <View>
        <CouplingNavigator goBack={this.cancel.bind(this)} {...this.props} />
      </View>
    )
  }

}
