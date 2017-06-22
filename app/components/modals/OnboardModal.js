import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Picker,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView, VibrancyView } from 'react-native-blur';
import { connect } from 'react-redux';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import { MagicNumbers } from '../../utils/DeviceConfig';
import ActionMan from '../../actions';
import ContinueButton from '../controls/ContinueButton';
import colors from '../../utils/colors';
import Router from '../../Router';
import Selectable from '../controls/Selectable';
import styles from './purpleModalStyles';
import UserImageCircle from '../UserImageCircle';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
const PickerItem = Picker.Item;
const TOP_DISTANCE = DeviceHeight - 160;
const iOS = Platform.OS == 'ios';
const us_choices = [
  {
    value: 'm',
    label: 'Single Male',
  },
  {
    value: 'f',
    label: 'Single Female',
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
  },
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
    },
  ]
};
const get_key_vals = (v) => v.toLowerCase();


@withNavigation
class OnboardModal extends Component {

  static route = {
    styles: NavigationStyles.SlideVertical,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      visible: false,
    },
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
    };

    this.props.dispatch(ActionMan.onboardUserNowWhat(payload));
  }

  handleContinue() {
    if (this.state.selected_relationship_status == 'single') {
      this.onboardUser();
    } else {
      const payload = {
        relationship_status: this.state.selected_relationship_status,
        genders: this.state.selected_genders,
      };
      this.props.dispatch(ActionMan.selectCoupleGenders(payload));
      this.props.navigator.push(Router.getRoute('JoinCouple', {
        ...this.state
      }));
    }
  }

  togglePref(pref) {
    const selected_theirs = { ...this.state.selected_theirs }

    selected_theirs[pref] = !selected_theirs[pref];
    LayoutAnimation.easeInEaseOut();
    
    this.props.dispatch(ActionMan.updateUser(selected_theirs));
    this.setState({selected_theirs});
  }

  _pressNewImage() {
    this.props.navigator.push(this.props.navigation.router.getRoute('FBPhotoAlbums', {}));
  }

  pickerValue(v, i) {
    if (!v) { return false; }
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
    });
  }

  render() {
    const has_theirs = Object.keys(this.state.selected_theirs).reduce((acc, el) => {
      if (this.state.selected_theirs[el]) {
        acc = true
      }
      return acc;
    }, false);

    return (
      <View
        style={{
          backgroundColor: colors.outerSpace,
          position: 'absolute',
          top: 0,
          width: DeviceWidth,
          height: DeviceHeight,
        }}
      >
        <ScrollView
          contentContainerStyle={{
            backgroundColor: colors.outerSpace,
            height: DeviceHeight ,
          }}
          showsVerticalScrollIndicator={false}
          style={[
            styles.scrollView, {
              flex: 0,
              height: DeviceHeight,
            }
          ]}
          vertical
        >
          <View
            style={[styles.col, {
              flex: 1,
              top: 0,
            }]}
          >
            <View
              style={[styles.col, {
                flex: 0,
                marginTop: this.state.step == 0 ? 100 : 0,
                paddingBottom: 160,
                paddingTop: MagicNumbers.is5orless ? 40 : 140,
              }]}
            >
              <View
                style={{
                  alignItems:'center',
                  justifyContent:'center',
                  top: this.state.step == 0 ? -50 : -90,
                }}
              >
                <UserImageCircle
                  diameter={120}
                  id={this.props.user.id}
                  overrideStyles={{
                    borderRadius: 60,
                    marginBottom:30,
                    position:'relative',
                    width:  120,
                    height: 120,
                  }}
                  thumbUrl={this.props.user.thumb_url}
                />
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: 'montserrat',
                    fontSize: 19,
                    fontWeight: '800',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  WELCOME {this.props.user.firstname ? this.props.user.firstname.toUpperCase() : '' }
                </Text>
                <Text
                  style={{
                    color: colors.rollingStone,
                    fontFamily: 'omnes',
                    fontSize: 17,
                    justifyContent: 'space-between',
                    marginBottom: 15,
                  }}
                >
                  Let's get started
                </Text>
                <View
                  style={[{
                    alignItems: 'flex-start',
                    flex:0,
                    justifyContent: 'space-between',
                    marginTop: 0,
                  }]}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.transparent,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: this.state.step == 1 ? colors.brightPurple : colors.steelGrey,
                      flex: 0,
                      justifyContent: 'center',
                      marginLeft: 30,
                      paddingLeft: 0,
                      width: DeviceWidth - 20,
                      height: 70,
                    }}
                    onPress={() => {
                      LayoutAnimation.easeInEaseOut();
                      this.setState({step: 1});
                    }}
                  >
                    <View style={[
                      styles.rowtext,
                      styles.bigtext, {
                        flexDirection: 'row',
                        flex: 0,
                        justifyContent: 'space-between',
                        marginVertical: 10,
                        paddingRight: 15,
                      }
                    ]}
                    >
                      <Text style={{
                        color: colors.white,
                        fontFamily: 'montserrat',
                        fontSize: 18,
                        fontWeight: '600',
                        marginLeft: 0,
                        textAlign: 'left',
                      }}
                      >
                        {this.state.selected_ours && this.state.selected_ours.length > 1 ? 'WE\'RE A...' : 'I\'M A...' }
                      </Text>
                      {this.state.selected_ours &&
                        <Text style={{color: colors.white, fontFamily: 'montserrat', fontSize: 20, marginRight: 40}}>
                          {this.state.selected_ours.length > 1 ? 'COUPLE' : 'SINGLE '} ({this.state.selected_genders.toUpperCase()})
                        </Text>
                      }
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          position: 'absolute',
                          right: 20,
                          top: 5,
                          width: 20,
                          height: 20,
                        }}
                      >
                        <Image
                          resizeMode={Image.resizeMode.contain}
                          style={{width: 15, height: 15}}
                          source={require('./assets/edit@3x.png')}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.transparent,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: this.state.step == 2 ? colors.darkPurple : colors.steelGrey,
                      flex: 0,
                      justifyContent: 'center',
                      marginLeft: 30,
                      paddingLeft: 0,
                      width: DeviceWidth - 20,
                      height: 70,
                      zIndex: 999,
                    }}
                    onPress={() => {
                      if (this.state.selected_ours) {
                        this.setState({step: 2});
                      }
                    }}
                  >
                    <View
                      style={[ styles.rowtext, styles.bigtext, {
                        flexDirection: 'row',
                        flex: 0,
                        justifyContent: 'space-between',
                        marginVertical: 10,
                      }]}
                    >
                      <Text
                        style={{
                          color: colors.white,
                          fontFamily: 'montserrat',
                          fontSize: 18,
                          fontWeight: '600',
                          textAlign: 'left',
                        }}
                      >
                        LOOKING FOR...
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          position: 'absolute',
                          right: 20,
                          top: 5,
                          width: 20,
                          height: 20,
                        }}
                      >
                        <Image
                          resizeMode={Image.resizeMode.contain}
                          style={{
                            opacity: this.state.selected_ours ? 1 : 0.6,
                            width: 15,
                            height: 15,
                          }}
                          source={require('./assets/edit@3x.png')}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {this.state.step > 0 &&
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.outerSpace,
                  position: 'absolute',
                  bottom: 0,
                  flex: 1,
                  justifyContent: 'center',
                  width: DeviceWidth,
                  height: 200,
                }}
              >
                {this.state.step == 1 &&
                  <Picker
                    onValueChange={this.pickerValue.bind(this)}
                    style={{
                      alignItems: 'stretch',
                      alignSelf: 'center',
                      backgroundColor: colors.dark,
                      marginHorizontal: 0,
                      width: DeviceWidth,
                    }}
                    itemStyle={{
                      color: colors.white,
                      fontSize: 22,
                      textAlign: 'center',
                    }}
                    selectedValue={this.state.selected_ours || null}
                  >
                    <PickerItem key={'xn'} value={null} label={('')}/>
                      {us_choices.map(item => {
                        return (<PickerItem key={item.label.trim()} value={item.value} label={item.label} />);
                      })}
                  </Picker>}
              </View>
            }
          </View>
        </ScrollView>
        <View
          style={{
            bottom: this.state.selected_ours && has_theirs ? 180 : 0,
            flex: 1,
            left: 0,
            right: 0,
            overflow: 'hidden',
            width: DeviceWidth,
            height: this.state.selected_ours && has_theirs ? 70 : 0,
          }}
        >
          <ContinueButton
            canContinue={this.state.selected_ours && has_theirs}
            customText={'CONTINUE'}
            handlePress={this.handleContinue.bind(this)}
          />
        </View>
        <View style={{bottom: 0, position: 'absolute'}}>
          {this.state.step == 2 && this.state.selected_ours && them_choices[this.state.selected_relationship_status].map((item, i) => (
            <Selectable
              field={item}
              isLast={i == them_choices[this.state.selected_relationship_status].length - 1}
              key={`${item.label.trim()}k`}
              label={item.label}
              moreStyle={{
                alignItems: 'center',
                backgroundColor: colors.dark,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.white20,
                flex: 0,
                flexDirection: 'row',
                justifyContent:'space-between',
                overflow: 'hidden',
                width: DeviceWidth,
                height: them_choices[this.state.selected_relationship_status].length == 3 ? 60 : 90,
              }}
              onPress={this.togglePref.bind(this, item.value)}
              selected={this.state.selected_theirs[item.value]}
              underlayColor={colors.dark}
              value={this.state.selected_theirs[item.value]}
              values={them_choices[this.state.selected_relationship_status]}
            />
          ))}
        </View>
      </View>
    )
  }
}

OnboardModal.displayName = 'OnboardModal';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardModal);
