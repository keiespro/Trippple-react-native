import React, {Component} from 'react'
import { View, Text, InteractionManager } from 'react-native'
import Geocoder from 'react-native-geocoder';
import {pure,onlyUpdateForKeys} from 'recompose'

import styles from './screens/potentials/styles'
import colors from '../utils/colors'

@pure
export default class CityState extends Component{

  static defaultProps = {

  };

  constructor(){
    super()
    this.state = {
      cityState: ''
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      if(this.props.coords){
        this.geocode()
      }
    })

  }

  async geocode(){
    try{
      const g = await Geocoder.geocodePosition(this.props.coords);
      if(g && g[0]){
        this.setState({cityState: `${g[0].locality}, ${g[0].adminArea}`})
      }
    }catch(err){
      __DEV__ && console.log(err);
    }
  }

  render(){
    return (
      <View style={{}}>
        <Text
          style={[styles.cardBottomOtherText, { alignSelf: 'flex-start', color:  this.props.color || this.props.profileVisible ? '#fff' : colors.rollingStone }]}
          key={`${this.props.potential.user.id}-matchn`}
        >{this.state.cityState && this.state.cityState.indexOf('null') > -1 ? this.props.cityState : this.state.cityState || this.props.cityState}</Text>
      </View>
    )
  }
}
