/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  CameraRoll,
  View,
  TouchableHighlight,
  Dimensions,
  PixelRatio
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import PurpleModal from './PurpleModal'
import styles from './purpleModalStyles'

export default class CameraRollPermissionsModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  cancel(){
    this.props.goBack();
  }
  continue(){
    this.props.navigator.push(this.props.nextRoute)
  }

  render(){


    return (
    <PurpleModal>
      <View style={[styles.col,{paddingVertical:10}]}>
        <Image
          style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginVertical:20}]}
          source={require('image!iconAlbum')}
          defaultSource={require('image!placeholderUserWhite')} />

        <View style={styles.insidemodalwrapper}>


            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>YOUR PHOTO ALBUM
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:20
              }]}>
              Do you want to upload an image from your iPhone Photo Album?
            </Text>
            <View >
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.props.unMatch}>
                <View style={[styles.modalButton]} >
                  <Text style={styles.modalButtonText}>YES, OPEN MY ALBUMS</Text>
                </View>
              </TouchableHighlight>
            </View>

          <View >
            <TouchableHighlight
              underlayColor={colors.mediumPurple}
              style={styles.modalButtonWrap}
              onPress={this.props.cancel}>
              <View style={[styles.modalButton,styles.cancelButton]} >
                <Text style={styles.modalButtonText}>no thanks</Text>
              </View>
            </TouchableHighlight>
          </View>

        </View>
      </View>
      </PurpleModal>
    )
  }
}
