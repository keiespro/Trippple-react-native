import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React from 'react';

import styles from '../../modals/purpleModalStyles';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

import colors from '../../../utils/colors'
import {MagicNumbers} from '../../../utils/DeviceConfig'

import { BlurView, VibrancyView } from 'react-native-blur'

import { connect } from 'react-redux';
import {NavigationStyles} from '@exponent/ex-navigation'
import {SlideHorizontalIOS, FloatHorizontal} from '../../../ExNavigationStylesCustom'


class CoupleReady extends React.Component{
  static route = {
    styles: FloatHorizontal,
    navigationBar: {
      visible: false,
      translucent: true,
      backgroundColor: colors.shuttleGrayAnimate,
      borderBottomWidth: 0,
      tintColor: '#fff',
      borderWidth: 0,
      style: {
        top: 24,
        paddingTop: 24
      },
      top: 24,
      paddingTop: 24,
      titleStyle: {
        color: '#fff',
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
      },
    }
  };
  constructor(props){
    super()
    this.state = {
      pin: '',
      submitting: false,
      absoluteContinue: true,
      verifyError: null,
      inputFieldValue: ''
    }

  }
  componentDidMount(){
    this.props.dispatch({type: 'CLEAR_POTENTIALS'})
  }
  popToTop(){
    // if(this.props.navigator){
    //   this.props.navigator.pop()
    // }


    if(this.props.hideModal){
      this.props.hideModal()
    }
    if(this.props.close){
      this.props.close()
    }

    this.props.navigator.popToTop()
  }

  render(){
    return this.props.user && this.props.user.partner ? (
      <ScrollView
        contentContainerStyle={[{
          width: DeviceWidth,
          backgroundColor: colors.outerSpace,
          height: DeviceHeight,
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          top: 0
        }]}
      >

        <Text
          style={[styles.rowtext, styles.bigtext, {
            backgroundColor: 'transparent',
            textAlign: 'center',
            fontFamily: 'montserrat',
            fontWeight: '800',
            fontSize: 40,
            color: '#fff',
            marginVertical: 10
          }]}
        >
          SUCCESS!
        </Text>

        <Text
          style={[styles.rowtext, styles.bigtext, {
            fontSize: 18,
            marginVertical: 10,
            color: '#fff',
            backgroundColor: 'transparent',
            marginBottom: 15,
            textAlign: 'center',
            flexDirection: 'column'
          }]}
        >You're now a couple.</Text>

        {this.props.user.partner ? <View
          style={{
            height: 120,
            marginVertical: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            style={[{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginRight: -100
            }]}
            source={this.props.user.partner.image_url ? {uri: this.props.user.partner.image_url } : require('../chat/assets/placeholderUserWhite@3x.png')}
            defaultSource={require('../chat/assets/placeholderUserWhite@3x.png')}
          />

          <Image
            style={[{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginLeft: -100
            }]}
            source={this.props.user.image_url ? {uri: this.props.user.image_url } : require('../chat/assets/placeholderUserWhite@3x.png')}
            defaultSource={require('../chat/assets/placeholderUserWhite@3x.png')}
          />
        </View> : null}

        {/* {!this.props.user.partner ? <View>

        <Text style={[styles.rowtext,styles.bigtext,{
          fontSize:18,
          marginVertical:10,
          color:'#fff',
          marginBottom:15,textAlign:'center',
          flexDirection:'column'
        }]}>Your couple will be set up shortly.</Text></View> : null}*/}

        <TouchableHighlight
          underlayColor={colors.white20}
          style={{
            backgroundColor: 'transparent',
            borderColor: colors.white,
            borderWidth: 1,
            borderRadius: 5,
            marginHorizontal: MagicNumbers.screenPadding,
            marginTop: 50,
            marginBottom: 15
          }}
          onPress={this.popToTop.bind(this)}
        >
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20
            }}
          >
            <Text
              style={{
                fontFamily: 'montserrat',
                fontWeight: '800',
                fontSize: 18,
                textAlign: 'center',
                color: '#fff',
              }}
            >
              CONTINUE
            </Text>
          </View>
        </TouchableHighlight>

      </ScrollView>
    ) : (
      <ScrollView
        contentContainerStyle={[{
          backgroundColor: colors.outerSpace,
          width: DeviceWidth,
          height: DeviceHeight,
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          top: 0
        }]}
      >
        <Text
          style={{
            fontFamily: 'montserrat',
            fontWeight: '800',
            fontSize: 18,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          Connecting couple...
        </Text>
      </ScrollView>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  couple: state.app.coupling
})
const mapDispatchToProps = (dispatch) => ({ dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(CoupleReady)
