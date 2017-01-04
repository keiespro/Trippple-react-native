import React, {Component} from 'react'
import { View, Text } from 'react-native'
import Geocoder from 'react-native-geocoder';
import styles from './screens/potentials/styles'
import colors from '../utils/colors'

export default class CityState extends Component{

  static defaultProps = {
    coords: {
      lng: -80.191788,
      lat: 25.761681
    }
  };

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
    try{
      const g = await Geocoder.geocodePosition(this.props.coords);
      this.setState({cityState: `${g[0].locality}, ${g[0].adminArea}`})
    }catch(err){
      __DEV__ && console.log(err);
    }
  }

  render(){
    return (
      <View style={{}}>
        <Text
          style={[styles.cardBottomOtherText, { alignSelf: 'flex-start', color:  this.props.profileVisible ? '#fff' : colors.rollingStone }]}
          key={`${this.props.potential.user.id}-matchn`}
        >{this.props.cityState || this.state.cityState}</Text>
      </View>
    )
  }
}
