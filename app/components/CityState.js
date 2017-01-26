import React, {Component} from 'react'
import { View, Text } from 'react-native'
import Geocoder from 'react-native-geocoder';
import styles from './screens/potentials/styles'
import colors from '../utils/colors'

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

    if(this.props.coords){
      this.geocode()
    }
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
          style={[styles.cardBottomOtherText, { alignSelf: 'flex-start', color:  this.props.profileVisible ? '#fff' : colors.rollingStone }]}
          key={`${this.props.potential.user.id}-matchn`}
        >{this.state.cityState || this.props.cityState}</Text>
      </View>
    )
  }
}
