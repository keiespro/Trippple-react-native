import { LayoutAnimation } from 'react-native'

const CustomLayoutAnimations = {
  layout: {
    spring: {
      duration: 250,
      create: {
        duration: 250,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.spring,
        springDamping: 2,
      },
      update: {
        duration: 350,
        type: LayoutAnimation.Types.spring,
        springDamping: 2,
        property: LayoutAnimation.Properties.scaleXY
      }
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY

      },
      update: {

        duration: 200,
        // property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.easeInEaseOut,

      }
    }
  }
}

export default CustomLayoutAnimations
