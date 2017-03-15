import React, {Component} from 'react'
import { View, Text } from 'react-native'
import Geocoder from 'react-native-geocoder';
import {pure} from 'recompose'

import styles from './screens/potentials/styles'
import colors from '../utils/colors'
import {GOOGLE_MAPS_API_KEY} from '../../config'

Geocoder.fallbackToGoogle(GOOGLE_MAPS_API_KEY);

@pure
export default class CityState extends Component{

  constructor(){
    super()
    this.state = {
      cityState: ''
    }
  }

  componentDidMount(){
    this.geocode()
  }

  async geocode(){
    if(this.props.coords.lat && this.props.coords.lng){
      try{
        const g = await Geocoder.geocodePosition(this.props.coords);
        if(g && g[0]){
          this.setState({cityState: `${g[0].locality}, ${g[0].adminArea}`})
        }
      }catch(err){
        __DEV__ && console.log('geocode err', err);
      }
    }
  }

  render(){
    return (
      <View style={{backgroundColor: 'transparent', height: 30}}>
        <Text
          style={[
            styles.cardBottomOtherText,
            {
              alignSelf: 'flex-start',
              color: this.props.color ? this.props.color : this.props.profileVisible ? '#fff' : colors.rollingStone
            }
          ]}
          key={`${this.props.potential.user.id}-matchn`}
        >{
          (this.state.cityState && this.state.cityState.indexOf('null') > -1) ? this.props.cityState : this.state.cityState || this.props.cityState
        }</Text>
      </View>
    )
  }
}
