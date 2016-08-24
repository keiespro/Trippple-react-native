import colors from '../../utils/colors';

import React from 'react'
import {TouchableHighlight,View,Text,Image} from 'react-native'
import styles from '../screens/settings/settingsStyles';
import {MagicNumbers} from '../../utils/DeviceConfig'

class Selectable extends React.Component{
  constructor(props){
    super()
  }
  render(){
    const selected = this.props.selected || this.props.values[this.props.field];

    return (
      <TouchableHighlight
        underlayColor={colors.dark}
        style={styles.paddedSpace}
        onPress={() => this.props.onPress(this.props.field) }
        >
        <View style={[styles.insideSelectable,styles.formRow]}>
          <Text
            style={{color: selected ? colors.white : colors.rollingStone,
              fontSize:MagicNumbers.size18,fontFamily:'Montserrat'
            }}
          >{this.props.label}</Text>
          <Image
            style={{height:30,width:30}}
            source={{ uri:selected ? 'assets/ovalSelected@3x.png' : 'assets/ovalDashed@3x.png'} }
          />
        </View>
      </TouchableHighlight>
    )
  }
}

Selectable.displayName = "Selectable"

export default Selectable
