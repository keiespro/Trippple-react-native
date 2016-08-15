import React from "react";

import FacebookImageSource from '../../screens/FacebookImageSource'

class CoupleImage extends React.Component{
  constructor(props){
    super()
  }
  render(){
    return <FacebookImageSource {...this.props} imageType={'couple_profile'} />
  }
}

export default CoupleImage
