import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
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
import _ from 'lodash';
import { BlurView, VibrancyView } from 'react-native-blur';
import { connect } from 'react-redux';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import { MagicNumbers } from '../../utils/DeviceConfig';
import ActionMan from '../../actions';
import DoneButton from '../controls/DoneButton';
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
    label: 'Single Woman',
  },
  {
    value: 'f',
    label: 'Single Man',
  },
  {
    value: 'mf',
    label: 'Male/Female Couple',
  },
  {
    value: 'mm',
    label: 'Female/Female Couple',
  },
  {
    value: 'ff',
    label: 'Male/Male Couple',
  },
];
const looking_choices = [
  {
    value: 'f',
    label: 'Single Women',
  },
  {
    value: 'm',
    label: 'Single Men',
  },
  {
    value: 'mf',
    label: 'Male/Female Couples',
  },
  {
    value: 'ff',
    label: 'Female/Female Couples',
  },
  {
    value: 'mm',
    label: 'Male/Male Couples',
  },
];
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
      isDoneActive: false,
      pickers: us_choices,
      step: 0,
      selected_ours: null,
      selected_theirs: {
        mm: false,
        ff: false,
        mf: false,
        m: false,
        f: false
      },
      selected_relationship_status: null,
    };

    this.boardScale = new Animated.Value(1);
    this.boardMargin = new Animated.Value(0);
    this.boardHeight = new Animated.Value(1.6 * DeviceHeight / 3);
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

  toggleFirstAnimation() {
    this.boardScale = new Animated.Value(1);
    this.boardMargin = new Animated.Value(0);
    this.boardHeight = new Animated.Value(1.6 * DeviceHeight / 3);
    Animated.parallel([
      Animated.timing(
        this.boardScale,
        {
          toValue: 0.8,
          duration: 100,
          easing: Easing.linear,
        }
      ),
      Animated.timing(
        this.boardMargin,
        {
          toValue: -100,
          duration: 100,
          easing: Easing.linear,
        }
      ),
      Animated.timing(
        this.boardHeight,
        {
          toValue: 2 * DeviceHeight / 3,
          duration: 100,
          easing: Easing.quad,
        }
      )
    ]).start();
  }

  toggleSecondAnimation() {
    this.boardHeight = new Animated.Value(2 * DeviceHeight / 3);
    Animated.timing(
      this.boardHeight,
      {
        toValue: 2.4 * DeviceHeight / 3,
        duration: 100,
        easing: Easing.quad
      }
    ).start();
  }

  _pressNewImage() {
    this.props.navigator.push(this.props.navigation.router.getRoute('FBPhotoAlbums', {}));
  }

  pickerValue(value) {
    if (this.state.step == 1) {
      this.setState({
        selected_ours: value,
        selected_genders: value,
        selected_relationship_status: value.length == 1 ? 'single' : 'couple',
        selected_theirs: {
          mm: false,
          ff: false,
          mf: false,
          m: false,
          f: false,
        },
      });

      this.toggleSecondAnimation();
      this.setState({step: 2});
      this.setState({pickers: looking_choices});
    } else {
      const { selected_theirs } = this.state;
      let checked = false;

      selected_theirs[value] = !selected_theirs[value];
      this.setState({selected_theirs});
      _.each(selected_theirs, (selected) => {
        if (selected) checked=selected;
      });
      this.setState({isDoneActive: checked})
    }
  }

  render() {
    const has_theirs = Object.keys(this.state.selected_theirs).reduce((acc, el) => {
      if (this.state.selected_theirs[el]) {
        acc = true;
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
            height: DeviceHeight,
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
            <Animated.View
              style={[styles.col, {
                flex: 0,
                marginTop: this.boardMargin,
                paddingBottom: 160,
                paddingTop: MagicNumbers.is5orless ? 40 : 140,
                transform: [{scale: this.boardScale}]
              }]}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: this.state.step == 0 ? -50 : -90,
                }}
              >
                <UserImageCircle
                  diameter={120}
                  id={this.props.user.id}
                  overrideStyles={{
                    borderRadius: 60,
                    marginBottom: 30,
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
                    flex: 0,
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
                      this.setState({step: 1});
                      this.toggleFirstAnimation();
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
                      style={[styles.rowtext, styles.bigtext, {
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
            </Animated.View>
            {this.state.step > 0 &&
              <Animated.View
                style={{
                  alignItems: 'flex-start',
                  backgroundColor: colors.outerSpace,
                  bottom: 0,
                  flex: 1,
                  flexDirection: 'column',
                  position: 'absolute',
                  width: DeviceWidth,
                  height: this.boardHeight,
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: colors.dark,
                    justifyContent: 'center',
                    width: DeviceWidth,
                    height: 50,
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: 'montserrat',
                      fontSize: 18,
                      fontWeight: '600',
                    }}
                  >
                    {this.state.selected_ours == null ? (
                      'I\'M A'
                    ) : (
                      'LOOKING FOR'
                    )}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                  }}
                >
                  {this.state.pickers.map((item, i) => {
                    return (
                      <Selectable
                        diameter={20}
                        isLast={i == us_choices.length - 1}
                        field={item}
                        key={`${item.label.trim()}k`}
                        label={item.label}
                        outerStyle={{
                          flex: 1,
                          flexDirection: 'column',
                          width: DeviceWidth,
                        }}
                        innerStyle={{
                          alignItems: 'center',
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          borderBottomColor: colors.white20,
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginLeft: 30,
                          marginRight: 30,
                          overflow: 'hidden',
                        }}
                        onPress={() => this.pickerValue(item.value)}
                        selected={this.state.step == 1 ? this.state.selected_ours == item.value : this.state.selected_theirs[item.value]}
                        underlayColor={colors.dark}
                        value={item.value}
                        values={us_choices}
                      />
                    );
                  })}

                  {(this.state.selected_ours) && (
                    <DoneButton
                      active={this.state.isDoneActive}
                      text="DONE"
                    />
                  )}
                </View>
              </Animated.View>
            }
          </View>
        </ScrollView>
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
