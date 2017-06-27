import React, { Component } from 'react';
import {
    Animated,
    AsyncStorage,
    Image,
    LayoutAnimation,
    NativeModules,
    PixelRatio,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationStyles } from '@exponent/ex-navigation';
import dismissKeyboard from 'dismissKeyboard';
import { DeviceHeight, DeviceWidth, iOS, MagicNumbers } from '../../../utils/DeviceConfig';
import { SlideHorizontalIOS, FloatHorizontal } from '../../../ExNavigationStylesCustom';
import ActionMan from '../../../actions';
import AgePrefs from '../../controls/AgePrefs';
import colors from '../../../utils/colors';
import DistanceSlider from '../../controls/distanceSlider';
import FieldModal from '../../modals/FieldModal';
import PermissionSwitches from '../../controls/PermissionSwitches';
import Selectable from '../../controls/Selectable';
import styles from './settingsStyles';


class SettingsPreferences extends Component {

    static route = {
        styles: iOS ? SlideHorizontalIOS : FloatHorizontal,
        navigationBar: {
            backgroundColor: colors.shuttleGrayAnimate,
            translucent: false,
            tintColor: '#fff',
            titleStyle: {
                borderBottomWidth: 0,
                color: '#fff',
                fontFamily: 'montserrat',
                fontWeight: '800'
            },
            title: 'PREFERENCES',
            visible: true,
        },
        statusBar: {
            translucent: false,
        },
    };

    constructor(props){
        super();

        this.state = {
            bio: null,
            scroll: 'on',
            looking_for_mf: props.user.looking_for_mf || false,
            looking_for_mm: props.user.looking_for_mm || false,
            looking_for_ff: props.user.looking_for_ff || false,
            looking_for_m: props.user.looking_for_m || false,
            looking_for_f: props.user.looking_for_f || false,
        };
    }

    onPressSelectable(field) {
        this.toggleField(field);
    }

    toggleField(field) {
        const newState = {};

        newState[field] = !this.state[field];
        this.setState(newState);
        this.props.dispatch(ActionMan.updateUser(newState));
    }

    toggleScroll(direction) {
        this.setState({scroll: direction});
    }

    editBio(){
        this.props.dispatch(ActionMan.showInModal({
            component: 'FieldModal',
            passProps: {
                cancel: () => {this.props.dispatch({type:'KILL_MODAL'})},
                field: {
                    field_type: 'textarea',
                    label: 'What are you looking for in a Match?',
                },
                fieldName: 'bio',
                fieldValue: this.state.bio || this.props.user.bio || '',
                inputField: 'textarea',
                title: 'PREFERENCES',
                updateOutside: this.updateBio.bind(this),
            }
        }));
    }
    updateBio(v) {
        this.setState({bio: v});
    }

    render() {
        const { looking_for_mf, looking_for_mm, looking_for_ff, looking_for_f, looking_for_m } = this.state;
        const values = { looking_for_mf, looking_for_mm, looking_for_ff, looking_for_f, looking_for_m };

        return (

            <View
                style={{
                    backgroundColor: colors.outerSpace,
                    flex: 1,
                    paddingTop: 0
                }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={this.state.scroll == 'on' ? true : false}
                >
                    <View style={[styles.paddedSpace, {marginTop: 0}]}>
                        <View style={styles.formHeader}>
                            <Text style={styles.formHeaderText}>
                                What are you looking for in a Match?
                            </Text>
                        </View>
                    </View>
                    <View style={{marginTop: 10}}>
                        <TouchableHighlight underlayColor={colors.dark} onPress={this.editBio.bind(this)}>
                            <View style={styles.textareaWrap}>
                                <Text numberOfLines={2} style={styles.bioText}>
                                    {this.state.bio ? this.state.bio : this.props.user.bio ? this.props.user.bio : ''}
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.paddedSpace, {marginBottom: 0}]}>
                        <View style={styles.formHeader}>
                            <Text style={styles.formHeaderText}>{'Show Me'}</Text>
                        </View>
                    </View>
                    <View>
                        {this.props.user.relationship_status == 'single' && <Selectable
                            field={'looking_for_mf'}
                            label={'Couples (MALE/FEMALE)'}
                            innerStyle={defaultStyles.selectable}
                            onPress={this.onPressSelectable.bind(this, 'looking_for_mf')}
                            selected={this.state.looking_for_mf}
                            values={values}
                        />}
                        {this.props.user.relationship_status == 'single' && <Selectable
                            field={'looking_for_mm'}
                            label={'Couples (MALE/MALE)'}
                            innerStyle={defaultStyles.selectable}
                            onPress={this.onPressSelectable.bind(this, 'looking_for_mm')}
                            selected={this.state.looking_for_mm}
                            values={values}
                        />}
                        {this.props.user.relationship_status == 'single' && <Selectable
                            field={'looking_for_ff'}
                            selected={this.state.looking_for_ff}
                            innerStyle={defaultStyles.selectable}
                            onPress={this.onPressSelectable.bind(this, 'looking_for_ff')}
                            label={'Couples (FEMALE/FEMALE)'}
                            values={values}
                        />}
                        {this.props.user.relationship_status == 'couple' && <Selectable
                            field={'looking_for_f'}
                            label={'SINGLE FEMALES'}
                            innerStyle={defaultStyles.selectable}
                            onPress={this.onPressSelectable.bind(this, 'looking_for_f')}
                            selected={this.state.looking_for_f}
                            values={values}
                        />}
                        {this.props.user.relationship_status == 'couple' && <Selectable
                            field={'looking_for_m'}
                            label={'SINGLE MALES'}
                            innerStyle={defaultStyles.selectable}
                            onPress={this.onPressSelectable.bind(this, 'looking_for_m')}
                            selected={this.state.looking_for_m}
                            values={values}
                        />}
                    </View>
                    <View style={{paddingTop: 50}}>

                        <AgePrefs
                            dispatch={this.props.dispatch}
                            toggleScroll={this.toggleScroll.bind(this)}
                            user={this.props.user}
                        />

                        <DistanceSlider
                            handler={(val) => {
                                this.props.dispatch(ActionMan.updateUser({match_distance: val}));
                                this.props.dispatch(ActionMan.fetchPotentials());
                            }}
                            val={this.props.user.match_distance || 10}
                        />
                        <PermissionSwitches {...this.props} />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

SettingsPreferences.displayName = 'SettingsPreferences'

const defaultStyles = StyleSheet.create({
  selectable: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingHorizontal: 0,
    width: DeviceWidth - MagicNumbers.screenPadding,
    height: 60,
  }
})

const mapStateToProps = (state, ownProps) => {
  return {...ownProps, user: state.user }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPreferences);
