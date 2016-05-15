import React from "react";

import SelectImageSource from '../../screens/SelectImageSource'

class SelfImage extends React.Component{
  constructor(props){
    super()
  }

  render(){
    return <SelectImageSource {...this.props} imageType={'profile'} />
  }
}

export default SelfImage

