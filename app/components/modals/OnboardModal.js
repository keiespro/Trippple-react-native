'use strict';

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Picker,
  Image,
  LayoutAnimation,
  ScrollView
} from 'react-native';
import React, {Component} from 'react';

import { NavigationStyles } from '@exponent/ex-navigation';

import ContinueButton from '../controls/ContinueButton';
import Coupling from '../screens/coupling';
import colors from '../../utils/colors';
import styles from './purpleModalStyles';

import ActionMan from '../../actions'
import Selectable from '../controls/Selectable'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {BlurView, VibrancyView} from 'react-native-blur';
import {MagicNumbers} from '../../utils/DeviceConfig';
var PickerItem = Picker.Item;
import PurpleModal from './PurpleModal';

const our_choices = ['Single Female', 'Single Male', 'Couple (Male/Male)', 'Couple (Female/Female)', 'Couple (Male/Female)'];
const them_choices = {
  couple: [
    'SINGLE FEMALE', 'SINGLE MALE'
  ],
  single: ['COUPLE (MALE/MALE)', 'COUPLE (MALE/FEMALE)', 'COUPLE (FEMALE/FEMALE)']
};
const get_key_vals = (v) => v.toLowerCase();


class OnboardModal extends Component {
  static route = {
    styles: NavigationStyles.FloatVertical,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      visible:false
    }
  };

  constructor(props) {
    super();

    this.state = {
      step: 0,
      selected_ours: null,
      selected_theirs: {
        mm: false,
        ff: false,
        mf: false,
        m: false,
        f: false
      },
      selected_relationship_status: null
    };
  }

  onboardUser() {
    let gender = this.state.selected_ours.slice(this.state.selected_ours.length - 2, this.state.selected_ours.length).trim();
    const payload = {
      relationship_status: this.state.selected_relationship_status,
      name: this.props.user.firstname,
      email: this.props.user.email,
      facebook_user_id: this.props.user.facebook_user_id,
      gender,
      ...Object.keys(this.state.selected_theirs).reduce((acc,s) => {
        acc[`looking_for_${s}`] = this.state.selected_theirs[s];
        return acc;
      },{})
    };


    this.props.dispatch(ActionMan.onboard(payload))
  }

  handleContinue() {
    if (this.state.selected_relationship_status == 'single') {
      this.onboardUser()
    } else {
      this.props.dispatch(ActionMan.showInModal({
        component: Coupling,
        passProps: {
          onboardUser: this.onboardUser.bind(this)
        }
      }))
    }
  }

  togglePref(p) {
    const pref = p.toLowerCase()
    const selected_theirs = { ...this.state.selected_theirs }

    selected_theirs[pref] = !selected_theirs[pref];
    LayoutAnimation.easeInEaseOut()

    this.setState({selected_theirs})
  }

  pickerValue(v, i){
    if (!v){ return false;}
    this.setState({
      selected_ours: v,
      selected_relationship_status: v.toLowerCase().indexOf('single') > -1 ? 'single' : 'couple',
      selected_theirs: {
        mm: false,
        ff: false,
        mf: false,
        m: false,
        f: false
      }
    });
  }

  render() {
    const has_theirs = Object.keys(this.state.selected_theirs).reduce((acc, el) => {
      if (this.state.selected_theirs[el]) {
        acc = true
      }
      return acc
    }, false)
    return (
      <BlurView blurType="dark">
        <View style={[
          styles.col, {
            width: DeviceWidth,
            height: DeviceHeight,
						backgroundColor: colors.outerSpace70
          }
        ]}>
          <ScrollView>
            <View style={[
              styles.col, {
                paddingBottom: 160,
                paddingTop: 40
              }
            ]}>
              {MagicNumbers.is5orless ? null :
                <Image
                style={{
                  borderRadius: 75,
                  width: 150,
                  height: 150,
                  marginVertical: 10,
									marginTop: this.state.step == 0 ? 10 : -300,
									marginBottom: this.state.step == 0 ? 0 : 200,
                }}
                key={'onboardpic'}
                source={{
                  uri: this.props.user.image_url
                }}
                defaultSource={{
                  uri: 'assets/placeholderUser@3x.png'
                }}
                resizeMode={Image.resizeMode.cover}
                />}

              <Text style={{
                color: colors.white,
								marginTop: 10,
                fontFamily: 'Montserrat-Bold',
                justifyContent: 'space-between',
                fontSize: 19
              }}>WELCOME {this.props.user.firstname}</Text>

              <Text style={{
                color: colors.white,
                fontFamily: 'Omnes',
                justifyContent: 'space-between',
                fontSize: 17,
								marginBottom: 15,
              }}>Let's get started</Text>

              <View style={[{
                marginTop: 20,
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }]}>
                <TouchableOpacity
                  style={{
                    width: DeviceWidth - 20,
                    marginLeft: 30,
                    paddingLeft: 0,
                    height: 70,
                    paddingRight: 20,
                    justifyContent: 'center',
                    backgroundColor: colors.transparent,
                    borderBottomWidth: 1,
                    borderBottomColor: this.state.step == 1 ? colors.brightPurple : colors.steelGrey
                  }}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    this.setState({step: 1});
                  }}>
                  <View style={[
                    styles.rowtext,
                    styles.bigtext, {
                      marginVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }
                  ]}>
                    <Text style={{
                      fontFamily: 'Montserrat',
                      fontSize: 20,
                      color: colors.white,
                      textAlign: 'left',
											marginLeft: 0
										}}>{this.state.selected_ours && this.state.selected_ours.indexOf('couple') > -1 ?  `WE'RE A...` : `I'M A...` }</Text>
                    {this.state.selected_ours && <Text style={{
                      fontFamily: 'Montserrat',
                      fontSize: 20,
                      color: colors.white
                    }}>{this.state.selected_ours.toUpperCase()}</Text>}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                style={{
                  width: DeviceWidth,
                  marginLeft: 30,
                  paddingLeft: 0,
                  height: 70,
                  zIndex:999,
                  justifyContent: 'center',
                  backgroundColor: colors.transparent,
                  borderBottomWidth: 1,
                  borderBottomColor: this.state.step == 2 ? colors.brightPurple : colors.steelGrey
                }}
                onPress={() => {
                  if (this.state.selected_ours) {
                    LayoutAnimation.easeInEaseOut();
                    this.setState({step: 2});
                  }
                }}>
                  <Text style={[
                    styles.rowtext,
                    styles.bigtext, {
                      fontFamily: 'Montserrat',
                      fontSize: 20,
                      marginVertical: 10,
                      textAlign: 'left',
                      color: colors.white
                    }
                  ]}>SEEKING A...</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>

          {this.state.step > 0 &&
            <View style={{
              backgroundColor: colors.outerSpace,
              width: DeviceWidth,
              height: 200,
              position: 'absolute',
              bottom: 0
            }}>
            <View style={{
              height: this.state.selected_ours && has_theirs ? 70 : 0,
              position: 'absolute',
              top: this.state.selected_ours && has_theirs ? -70 : 0,
              left: 0,
              right: 0,
              width: DeviceWidth,
              overflow: 'hidden'
            }}>
              <ContinueButton
              customText={'CONTINUE'}
              handlePress={this.handleContinue.bind(this)}
              canContinue={this.state.selected_ours && has_theirs}
              />
            </View>
            {this.state.step == 1 &&
              <Picker
                onValueChange={this.pickerValue.bind(this)}
                style={{
                  alignSelf: 'center',
                  width: DeviceWidth,
                  backgroundColor: 'transparent',
                  marginHorizontal: 0,
                  alignItems: 'stretch'
                }}
                itemStyle={{
                  fontSize: 22,
                  color: colors.white,
                  textAlign: 'center',
                }}
                selectedValue={this.state.selected_ours || null}
              >
              <PickerItem key={'xn'} value={null} label={('')}/>
              {our_choices.map((val) => {
                return (<PickerItem key={val} value={get_key_vals(val) || val} label={(val || '')}/>);
              })}
            </Picker>}

            {this.state.step == 2 && this.state.selected_ours && them_choices[this.state.selected_relationship_status].map((val) => {
              const selected = this.state.selected_theirs[val.toLowerCase()]
              return (
                <Selectable
                  selected={selected}
                  key={val + 'k'}
                  underlayColor={colors.dark}
                  value={this.state.selected_theirs[val.toLowerCase()]}
                  onPress={this.togglePref.bind(this, val)}
                  field={val}
                  label={val}
                  values={them_choices[this.state.selected_relationship_status]}
                />
              )
            })}

          </View>}
        </View>
      </BlurView>

    );
  }
}

OnboardModal.displayName = 'OnboardModal';
export default OnboardModal;
