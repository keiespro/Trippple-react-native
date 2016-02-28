import { LayoutAnimation } from 'react-native'

const CustomLayoutAnimations = {
  layout: {
    spring: {
      duration: 500,
      create: {
        duration: 500,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.spring,
        springDamping: 15,
      },
      update: {
        duration: 500,
        type: LayoutAnimation.Types.spring,
        springDamping: 15,
        property: LayoutAnimation.Properties.scaleXY
      }
    },
    easeInEaseOut: {
      duration: 100,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.scaleXY,
        duration: 100,

      },
      update: {

        duration: 100,
        property: LayoutAnimation.Properties.scaleXY,
        type: LayoutAnimation.Types.linear,

      }
    }
  }
}

export default CustomLayoutAnimations
