import React from 'react-native'

import SelectImageSource from '../SelectImageSource'

class CoupleImage extends React.Component{
  constructor(props){
    super()
  }

  render(){
    return <SelectImageSource {...this.props} imageType={'couple_profile'} />
  }
}

export default CoupleImage
