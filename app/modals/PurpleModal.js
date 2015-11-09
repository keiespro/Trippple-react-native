/* @flow */

import React from 'react-native'
import {
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  AlertIOS,
  TextInput,
  ListView,
  TouchableHighlight,
  Dimensions,
  PixelRatio,
  Modal
} from 'react-native'

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width
import colors from '../utils/colors'
import _ from 'underscore'
import MatchActions from '../flux/actions/MatchActions'
import { BlurView,VibrancyView } from 'react-native-blur'
import styles from './purpleModalStyles'
import {MagicNumbers} from '../DeviceConfig'


var passProps = function(component,props) {
  return React.addons.cloneWithProps(component, props);
};

class PurpleModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  cancel(){
    this.props.goBack();
  }
  render(){


    return (
      <View style={[{padding:0,backgroundColor: 'transparent',flex:1,position:'relative'}]}>

        <View style={[styles.col,{justifyContent:'center',alignSelf:'center',backgroundColor: 'transparent'}]}>

          <Image style={[styles.modalcontainer,{overflow:'hidden',width:MagicNumbers.screenWidth,
            marginHorizontal:MagicNumbers.screenPadding/2,padding:MagicNumbers.screenPadding/2,
          height:DeviceHeight-MagicNumbers.screenPadding*2,marginTop:MagicNumbers.screenPadding}]} source={require('../../newimg/gradientbgs.png')}                 resizeMode={Image.resizeMode.stretch} >
            {this.props.children}
          </Image>
        </View>
      </View>

    )
  }
}

export default PurpleModal

export class ReportModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }

  report(them, reason){

    for(var they of them){
      MatchActions.reportUser(they, reason)
    }
    this.props.goBack();

  }

  render(){
    var {match} = this.props
    var theirIds = Object.keys(match.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> match.users[id])
    var matchName = them.map( (user,i) => user.firstname.trim().toUpperCase() ).join(' & ');

    return (
      <PurpleModal>

        <View style={[styles.col,{paddingVertical:10}]}>

          <View style={[styles.insidemodalwrapper,{justifyContent:'space-between'}]}>


            <Text style={[styles.rowtext,styles.bigtext,{
                fontFamily:'Montserrat',fontSize:20,marginVertical:10
              }]}>
              {`REPORT ${matchName}`}
            </Text>

            <Text style={[styles.rowtext,styles.bigtext,{
                fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:10
              }]}>
              Is this person bothering you?
              Tell us what they did.
            </Text>

              <View style={{marginTop:30}}>
                <TouchableHighlight
                  style={styles.modalButtonWrap}
                  underlayColor={colors.mediumPurple}
                  onPress={this.report.bind(this,them,'offensive')}>
                  <View style={styles.modalButton} >
                    <Text style={styles.modalButtonText}>OFFENSIVE BEHAVIOR</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View  >
                <TouchableHighlight
                  underlayColor={colors.mediumPurple}
                  style={styles.modalButtonWrap}
                  onPress={this.report.bind(this,them,'fake')}>
                  <View style={[styles.modalButton]} >
                    <Text style={styles.modalButtonText}>FAKE USER</Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View >
                <TouchableHighlight
                  underlayColor={colors.mediumPurple}
                  style={styles.modalButtonWrap}
                  onPress={this.props.goBack}>
                  <View style={[styles.modalButton,styles.cancelButton]} >
                    <Text style={styles.modalButtonText}>CANCEL</Text>
                  </View>
                </TouchableHighlight>
              </View>

          </View>

        </View>
      </PurpleModal>

    )
  }
}


export class UnmatchModal extends Component{

  constructor(props) {
    super();
    this.state = {}
  }
  unMatch(){
    MatchActions.unMatch(this.props.match.id)
    this.props.goBack();
  }

  render(){
    var rowData = this.props.match
    var theirIds = Object.keys(rowData.users).filter( (u)=> u != this.props.user.id)
    var them = theirIds.map((id)=> rowData.users[id])
    var matchName = them.map( (user,i) => user.firstname.trim().toUpperCase() ).join(' & ');
    var modalVisible = this.state.isVisible
    var self = this
    var matchImage = them.couple && them.couple.thumb_url || them[0].thumb_url || them[1].thumb_url

    return (
      <PurpleModal>
        <View style={[styles.col,{paddingVertical:10}]}>
          <Image
            style={[styles.contactthumb,{width:150,height:150,borderRadius:75,marginVertical:20}]}
            source={{uri:matchImage}}
            defaultSource={require('../../newimg/placeholderUserWhite.png')} />

          <View style={styles.insidemodalwrapper}>


              <Text style={[styles.rowtext,styles.bigtext,{
                  fontFamily:'Montserrat',fontSize:20,marginVertical:10
                }]}>
                {`UNMATCH ${matchName}`}
              </Text>

              <Text style={[styles.rowtext,styles.bigtext,{
                  fontSize:20,marginVertical:10,color: colors.lavender,marginHorizontal:20
                }]}>
                Are you sure?
              </Text>
              <View >
                <TouchableHighlight
                  underlayColor={colors.mediumPurple}
                  style={styles.modalButtonWrap}
                  onPress={this.unMatch.bind(this)}>
                  <View style={[styles.modalButton]} >
                    <Text style={styles.modalButtonText}>UNMATCH</Text>
                  </View>
                </TouchableHighlight>
              </View>

            <View >
              <TouchableHighlight
                underlayColor={colors.mediumPurple}
                style={styles.modalButtonWrap}
                onPress={this.props.goBack}>
                <View style={[styles.modalButton,styles.cancelButton]} >
                  <Text style={styles.modalButtonText}>CANCEL</Text>
                </View>
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </PurpleModal>
    )
  }
}
