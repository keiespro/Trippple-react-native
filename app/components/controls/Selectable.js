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
    const selected = this.props.selected;

    return (
      <TouchableHighlight
        underlayColor={this.props.underlayColor || colors.dark}
        style={styles.paddedSpace}
        onPress={() => this.props.onPress(this.props.field) }
        >
        <View style={[styles.insideSelectable,styles.formRow,this.props.isLast && {
          borderBottomWidth: 0,
        }]}>
          <Text
            style={{color: selected ? colors.white : colors.rollingStone,
              fontSize:MagicNumbers.size18,fontFamily:'Montserrat'
            }}
          >{this.props.label}</Text>
      {selected ? <Image
            style={{height:30,width:30}}
            source={{ uri: 'assets/ovalSelected@3x.png'} }
          /> :
          <View
            style={{height:30,width:30,
              borderWidth:1.5,
              borderColor:colors.shuttleGray,
              borderStyle:'dashed',
              borderRadius:15
            }}/>
          }

        </View>
      </TouchableHighlight>
    )
  }
}

Selectable.displayName = "Selectable"

export default Selectable
