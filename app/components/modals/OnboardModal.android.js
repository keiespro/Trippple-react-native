import { Text, View, Dimensions, TouchableOpacity, Picker, Image, LayoutAnimation, ScrollView } from 'react-native';
import React, {Component} from 'react';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import ContinueButton from '../controls/ContinueButton';
import colors from '../../utils/colors';
import styles from './purpleModalStyles';
import ActionMan from '../../actions'
import Selectable from '../controls/Selectable'
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../utils/DeviceConfig';
const PickerItem = Picker.Item;

const us_choices = [
  {
    value: 'f',
    label: 'Single Female',
  },
  {
    value: 'm',
    label: 'Single Male',
  },
  {
    value: 'mf',
    label: 'Couple (Male/Female)',
  },
  {
    value: 'mm',
    label: 'Couple (Male/Male)',
  },
  {
    value: 'ff',
    label: 'Couple (Female/Female)',
  }
];
const them_choices = {
  couple: [
    {
      label: 'SINGLE FEMALES',
      value: 'f'
    },
    {
      label: 'SINGLE MALES',
      value: 'm'
    }
  ],
  single: [
    {
      label: 'COUPLES (MALE/MALE)',
      value: 'mm'
    },
    {
      label: 'COUPLES (MALE/FEMALE)',
      value: 'mf'
    },
    {
      label: 'COUPLES (FEMALE/FEMALE)',
      value: 'ff'
    }
  ]
};
const get_key_vals = (v) => v.toLowerCase();

@withNavigation
class OnboardModal extends Component {
  static route = {
    styles: NavigationStyles.FloatVertical,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      visible: false
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
    const payload = {
      relationship_status: this.state.selected_relationship_status,
      genders: this.state.selected_genders,
      ...Object.keys(this.state.selected_theirs).reduce((acc, s) => {
        acc[`looking_for_${s}`] = this.state.selected_theirs[s];
        return acc;
      }, {})
    };


    this.props.dispatch(ActionMan.onboard(payload))
  }

  handleContinue() {
    if(this.state.selected_relationship_status == 'single') {
      this.onboardUser()
    }else{
      this.props.navigator.push(this.props.navigation.router.getRoute('JoinCouple', {
        ...this.state
      }))
      this.props.dispatch(ActionMan.killModal())
    }
  }

  togglePref(pref) {
    const selected_theirs = { ...this.state.selected_theirs }

    selected_theirs[pref] = !selected_theirs[pref];
    LayoutAnimation.easeInEaseOut()

    this.setState({selected_theirs})
  }

  pickerValue(v, i){
    if(!v){ return false; }
    this.setState({
      selected_ours: v,
      selected_genders: v,
      selected_relationship_status: v.length == 1 ? 'single' : 'couple',
      selected_theirs: {
        mm: false,
        ff: false,
        mf: false,
        m: false,
        f: false
      },
      // step:2
    });
  }

  render() {
    const has_theirs = Object.keys(this.state.selected_theirs).reduce((acc, el) => {
      if(this.state.selected_theirs[el]) {
        acc = true
      }
      return acc
    }, false);

    return (
      <View>
        <View
          blurType="dark"
          style={{
            width: DeviceWidth,
            height: DeviceHeight,
            position: 'absolute', top: 0, left: 0, right: 0,
            backgroundColor: colors.outerSpace20
          }}
        />
        <View
          style={[styles.col, {
            width: DeviceWidth,
            height: DeviceHeight,
            backgroundColor: colors.outerSpace20
          }]}
        >
          <ScrollView>
            <View style={[styles.col, {
              paddingBottom: 160,
              paddingTop: MagicNumbers.is5orless ? 40 : 140,
              marginTop: this.state.step == 0 ? 70 : 0
            }]}
            >
              {MagicNumbers.is5orless ? null :

                <View style={{
                  top: this.state.step == 0 ? -50 : -300,
                  position: 'absolute',
                  width: DeviceWidth,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 220
                }}
                >
                  <Image
                    style={{
                      borderRadius: 75,
                      width: 150,
                      height: 150,

                    }}

                    key={'onboardpic'}
                    source={{
                      uri: this.props.user.image_url
                    }}
                    defaultSource={require('./assets/placeholderUser@3x.png')}
                    resizeMode={Image.resizeMode.contain}
                  /></View>}

              <Text style={{
                color: colors.white,
                marginTop: 10,
                fontFamily: 'montserrat',
                fontWeight: '800',
                justifyContent: 'space-between',
                fontSize: 19
              }}
              >WELCOME {this.props.user.firstname ? this.props.user.firstname.toUpperCase() : '' }</Text>

              <Text style={{
                color: colors.white,
                fontFamily: 'omnes',
                justifyContent: 'space-between',
                fontSize: 17,
                marginBottom: 15,
              }}
              >Let's get started</Text>

              <View style={[{
                marginTop: 20,
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }]}
              >
                <TouchableOpacity
                  style={{
                    width: DeviceWidth - 20,
                    marginLeft: 30,
                    paddingLeft: 0,
                    height: 70,
                    justifyContent: 'center',
                    backgroundColor: colors.transparent,
                    borderBottomWidth: 1,
                    borderBottomColor: this.state.step == 1 ? colors.brightPurple : colors.steelGrey
                  }}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    this.setState({step: 1});
                  }}
                >
                  <View style={[
                    styles.rowtext,
                    styles.bigtext, {
                      marginVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingRight: 15,
                    }
                  ]}
                  >
                    <Text style={{
                      fontFamily: 'montserrat',
                      fontSize: 20,
                      color: colors.white,
                      textAlign: 'left',
                      marginLeft: 0
                    }}
                    >{this.state.selected_ours && this.state.selected_ours.length > 1 ? 'WE\'RE A...' : 'I\'M A...' }</Text>
                    {this.state.selected_ours && <Text style={{ fontFamily: 'montserrat', fontSize: 20, marginRight: 40, color: colors.white }}>
                        {this.state.selected_ours.length > 1 ? 'COUPLE' : 'SINGLE '} ({this.state.selected_genders.toUpperCase()})</Text>}
                    <View style={{width: 20, position: 'absolute', top: 5, height: 20, marginLeft: 10, right: 20}}>
                      <Image
                        style={{width: 15, height: 15, }}
                        source={{uri: 'assets/edit@3x.png'}}
                        resizeMode={Image.resizeMode.contain}
                      />
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: DeviceWidth - 20,
                    marginLeft: 30,
                    paddingLeft: 0,
                    height: 70,
                    zIndex: 999,
                    justifyContent: 'center',
                    backgroundColor: colors.transparent,
                    borderBottomWidth: 1,
                    borderBottomColor: this.state.step == 2 ? colors.brightPurple : colors.steelGrey
                  }}
                  onPress={() => {
                    if(this.state.selected_ours) {
                      LayoutAnimation.easeInEaseOut();
                      this.setState({step: 2});
                    }
                  }}
                >
                  <View style={[
                    styles.rowtext,
                    styles.bigtext, {
                      marginVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }
                  ]}
                  >
                    <Text style={[{
                      fontFamily: 'montserrat',
                      fontSize: 20,
                      textAlign: 'left',
                      color: colors.white
                    }
                  ]}
                    >SEEKING...</Text>
                    <View style={{width: 20, position: 'absolute', top: 5, height: 20, marginLeft: 10, right: 20}}>
                      <Image
                        style={{width: 15, height: 15, opacity: this.state.selected_ours ? 1 : 0.6}}
                        source={{uri: 'assets/edit@3x.png'}}
                        resizeMode={Image.resizeMode.contain}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
          {this.state.step > 0 &&
            <View style={{
              backgroundColor: colors.outerSpace,
              width: DeviceWidth,
              height: 50,
              position: 'absolute',
              bottom: 100,

              justifyContent: 'center',
              alignItems: 'center'
            }}
            >
              <View style={{
              // height: this.state.selected_ours && has_theirs ? 70 : 0,
                position: 'absolute',
              // top: this.state.selected_ours && has_theirs ? -70 : 0,
                bottom: 200,
                zIndex: 99,
                left: 0,
                right: 0,
                width: DeviceWidth,
                overflow: 'hidden',
              }}
              >
                <ContinueButton
                  customText={'CONTINUE'}
                  handlePress={this.handleContinue.bind(this)}
                  canContinue={this.state.selected_ours && has_theirs}
                />
              </View>
            </View>}

          {this.state.step == 1 &&

              us_choices.map((item, i) => {
                // console.log(item);
                return (
                  <View style={{width: DeviceWidth }}>
                    <Selectable
                      selected={this.state.selected_ours == item.value}
                      key={`${item.label.trim()}k`}
                      underlayColor={colors.dark}
                      value={item.value}
                      onPress={this.pickerValue.bind(this, item.value)}
                      field={item}
                      isLast={i == us_choices.length - 1}
                      label={item.label}
                      values={us_choices}
                    />
                  </View>
              );
              })}

          {this.state.step == 2 && this.state.selected_ours && them_choices[this.state.selected_relationship_status].map((item, i) => {
            return (
              <View style={{width: DeviceWidth}}>
                <Selectable
                  selected={this.state.selected_theirs[item.value]}
                  key={`${item.label.trim()}k`}
                  underlayColor={colors.dark}
                  value={this.state.selected_theirs[item.value]}
                  onPress={this.togglePref.bind(this, item.value)}
                  field={item}
                  isLast={i == them_choices[this.state.selected_relationship_status].length - 1}
                  label={item.label}
                  values={them_choices[this.state.selected_relationship_status]}
                />
              </View>
              )
          })}

        </View>
      </View>

    )
  }
}

OnboardModal.displayName = 'OnboardModal';
export default OnboardModal;
