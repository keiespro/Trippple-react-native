import React, { Component } from 'react';
import ReactNative, {
    Alert,
    Dimensions,
    Image,
    NativeModules,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import { DeviceHeight, DeviceWidth, iOS, MagicNumbers } from '../../../utils/DeviceConfig';
import { SlideVerticalNoGesturesIOS } from '../../../ExNavigationStylesCustom';
import ActionMan from '../../../actions/';
import Analytics from '../../../utils/Analytics';
import colors from '../../../utils/colors';
import config from '../../../../config';
import HideProfileSwitch from './HideProfileSwitch';
import LogoutButton from '../../buttons/LogoutButton';
import profileOptions from '../../../data/get_client_user_profile_options';
import ParallaxView from '../../controls/ParallaxScrollView';
import RNHotline from 'react-native-hotline';
import Router from '../../../Router';
import SettingsRow from './SettingsRow';
import UserImageCircle from '../../UserImageCircle';
import XButton from '../../buttons/XButton';

const { FBAppInviteDialog } = NativeModules;
const { INVITE_FRIENDS_APP_LINK } = config;


@withNavigation
class Settings extends Component {

    static route = {
        styles: SlideVerticalNoGesturesIOS,
        navigationBar: {
            backgroundColor: colors.transparent,
            translucent: false,
            visible: false,
        },
        statusBar: {
            translucent: false,
            backgroundColor: colors.dark70,
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            settingOptions: profileOptions,
        };
    }

    getScrollResponder() {
        return this._scrollView.getScrollResponder();
    }

    setNativeProps(props) {
        this._scrollView.setNativeProps(props);
    }

    disableAccount() {
        Analytics.event('Interaction', {
            name: 'Disable Account',
            type: 'tap',
        });

        Alert.alert(
            'Delete Your Account?',
            'Are you sure you want to delete your account? You will no longer be visible to any trippple users.',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        this.props.dispatch(ActionMan.disableAccount());
                        this.props.dispatch(ActionMan.logOut());
                    }
                },
                {
                    text: 'No',
                    onPress: () => false
                },
            ]
        );
    }

    _openProfile(){
        // Analytics.event('Interaction',{type:'tap', name: 'Preview self profile'});
        const thisYear = new Date().getFullYear();
        const { bday_year } = this.props.user;
        const age = (thisYear - bday_year);
        const selfAsPotential = {
            user: { ...this.props.user, age },
        };
        let potential;

        if (this.props.user.relationship_status == 'couple') {
            // delete selfAsPotential.coupleImage;
            // delete selfAsPotential.partner;
            potential = {
                couple: this.props.user.couple,
                partner: {
                    ...this.props.user.partner,
                    age: (thisYear - this.props.user.partner.bday_year)
                },
                user: selfAsPotential.user,
            };
        } else {
            potential = selfAsPotential;
        }

        this.props.dispatch({type:'CLOSE_DRAWER'});
        const nav = this.props.navigation.getNavigatorByUID(this.props.navState.currentNavigatorUID);
        nav.push('UserProfile', {
            potential,
            user: this.props.user,
            profileVisible: true,
        });
    }

    _updateAttr(updatedAttribute) {
        this.setState(() => updatedAttribute);
    }

    render() {
        const wh = DeviceHeight / 2;

        return (
            <View
                pointerActions={'box-none'}
                style={{
                    backgroundColor: colors.outerSpace,
                    flex: 10,
                    paddingTop: 0,
                }}
            >
                {iOS && (
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            flex: 0,
                            justifyContent: 'center',
                            left: 0,
                            position: 'absolute',
                            width: 50,
                            height: 50,
                            zIndex: 9999,
                        }}
                        onPress={() => {
                            if (this.props.ui.shouldFetchPotentials) {
                                this.props.dispatch(ActionMan.fetchPotentials());
                            }
                            this.props.navigator.pop();
                        }}
                    >
                        <Image
                            resizeMode={Image.resizeMode.contain}
                            style={{marginTop: 20, width: 15, height: 15}}
                            source={require('./assets/close@3x.png')}
                        />
                    </TouchableOpacity>
                )}
                <ParallaxView
                    backgroundSource={this.props.user.image_url ? {uri: this.props.user.image_url} : require('./assets/defaultuser.png')}
                    navigator={this.props.navigator}
                    key={this.props.user.id}
                    scrollsToTop
                    showsVerticalScrollIndicator={false}
                    style={{backgroundColor: colors.outerSpace, flex: 1, height: DeviceHeight}}
                    windowHeight={wh}
                    header={(
                        <View
                            style={[styles.userimageContainer, {
                                alignItems: 'center',
                                alignSelf: 'center',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: DeviceWidth / 2,
                                height: wh,
                                zIndex: 100,
                            }]}
                        >
                            <UserImageCircle
                                id={this.props.user.id}
                                thumbUrl={this.props.user.thumb_url}
                            />

                            <TouchableOpacity
                                onPress={this._openProfile.bind(this)}
                                style={{alignSelf: 'stretch'}}
                            >
                                <View
                                    style={{
                                        alignItems: 'stretch',
                                        alignSelf: 'stretch',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            alignSelf: 'stretch',
                                            color: colors.white,
                                            fontFamily: 'montserrat',
                                            fontSize: 18,
                                            fontWeight: '800',
                                            marginTop: 20,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {this.props.user.firstname && this.props.user.firstname.toUpperCase()}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        alignItems: 'stretch',
                                        alignSelf: 'stretch',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            alignSelf: 'stretch',
                                            color: colors.white,
                                            fontFamily: 'omnes',
                                            fontSize: 16,
                                            marginTop: 0,
                                            textAlign: 'center',
                                        }}
                                    >
                                        View Profile
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                >

                <View
                    style={{
                        backgroundColor: colors.outerSpace,
                        marginBottom: 10,
                        width: iOS ? DeviceWidth : DeviceWidth * 0.91,
                    }}
                >

                    <SettingsRow
                        pushScreen={() => {
                            this.props.dispatch({type: 'CLOSE_DRAWER'});
                            this.props.dispatch(ActionMan.pushRoute('SettingsBasic', {
                                settingOptions: profileOptions,
                                startPage: 0,
                                style: styles.container,
                            }));
                        }}
                        subtitle={'Edit your information'}
                        title={'PROFILE'}
                    />

                    {this.props.user.relationship_status == 'couple' || !this.props.user.relationship_status ?
                        <SettingsRow
                            pushScreen={(f) => {
                                this.props.dispatch({type: 'CLOSE_DRAWER'})
                                this.props.dispatch(ActionMan.pushRoute('SettingsCouple', {
                                    settingOptions: this.state.settingOptions,
                                    style: styles.container,
                                    user: this.props.user,
                                }));
                            }}
                            subtitle={`You and your partner, ${this.props.user.partner ? this.props.user.partner.firstname : ''}`}
                            title={'COUPLE'}
                        />
                    : null }

                    {this.props.user.relationship_status == 'single' ?
                        <SettingsRow
                            pushScreen={(f) => {
                                this.props.dispatch({type: 'CLOSE_DRAWER'});
                                this.props.dispatch(ActionMan.pushRoute('JoinCouple',{}));
                            }}
                            subtitle={'Connect with your partner'}
                            title={'JOIN COUPLE'}
                        /> : null
                    }

                    <SettingsRow
                        pushScreen={(f) => {
                            this.props.dispatch({type: 'CLOSE_DRAWER'});
                            this.props.dispatch(ActionMan.pushRoute('SettingsPreferences', {
                                settingOptions: this.state.settingOptions,
                                style: styles.container,
                                user: this.props.user,
                            }));
                        }}
                        subtitle={'What you\'re looking for'}
                        title={'PREFERENCES'}
                    />

                    <SettingsRow
                        pushScreen={(f) => {
                            this.props.dispatch({type: 'CLOSE_DRAWER'});
                            this.props.dispatch(ActionMan.pushRoute('SettingsSettings', {
                                settingOptions: this.state.settingOptions,
                                style: styles.container,
                            }));
                        }}
                        subtitle={'Privacy and more'}
                        title={'SETTINGS'}
                    />

                    <SettingsRow
                        pushScreen={(f) => {
                            this.props.dispatch({type: 'CLOSE_DRAWER'});
                            this.props.dispatch(ActionMan.showFaqs());
                        }}
                        subtitle={'Answers to frequently asked questions'}
                        title={'FAQS'}
                    />

                    <SettingsRow
                        pushScreen={(f) => {
                            this.props.dispatch({type: 'CLOSE_DRAWER'});
                            this.props.dispatch(ActionMan.showConvos());
                        }}
                        subtitle={'Chat with us'}
                        title={'HELP & FEEDBACK'}
                    />

                    { __DEV__ &&
                        <SettingsRow
                            pushScreen={(f) => {
                                this.props.dispatch({type: 'CLOSE_DRAWER'});
                                this.props.dispatch(ActionMan.pushRoute('SettingsDebug', {
                                    style: styles.container,
                                    settingOptions: this.state.settingOptions,
                                }));
                            }}
                            subtitle={'not working'}
                            title={'DEBUG'}
                        />
                    }

                    <HideProfileSwitch />

                    <View style={styles.paddedSpace}>
                        {this.props.profileVisible ? null : (
                            <TouchableOpacity
                                onPress={this.disableAccount.bind(this)}
                                style={{
                                    alignItems: 'flex-start',
                                    marginLeft: 10,
                                    marginVertical: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.mandy,
                                        fontFamily: 'omnes',
                                        textAlign: 'left',
                                    }}
                                >
                                    Delete My Account
                                </Text>
                            </TouchableOpacity>
                        )}
                        <LogoutButton dispatch={this.props.dispatch} />
                    </View>


                    <View
                        style={[styles.paddedSpace,{
                            marginTop: 20,
                            paddingVertical: 20
                        }]}
                    >
                        <Text
                            style={{
                                color: colors.shuttleGray,
                                fontSize: 15,
                                fontFamily: 'omnes',
                                textAlign: iOS ? 'center' : 'left',
                            }}
                        >
                            V {ReactNative.NativeModules.RNDeviceInfo.appVersion}:{ReactNative.NativeModules.RNDeviceInfo.buildNumber}
                        </Text>

                        {__DEV__ &&
                            <Text
                                style={{
                                    color: colors.white,
                                    fontSize: 15,
                                    fontFamily: 'omnes',
                                    textAlign: iOS ? 'center' : 'left',
                                }}
                            >
                                Build {ReactNative.NativeModules.RNDeviceInfo.buildNumber}
                            </Text>
                        }
                    </View>
                </View>
                </ParallaxView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        backgroundColor: colors.outerSpace,
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },
    inner: {
        alignItems: 'stretch',
        backgroundColor: colors.outerSpace,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    userimageContainer: {
        alignItems: 'center',
        padding: 0,
    },
    blur: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        paddingBottom: 20,
        paddingTop: 0,
    },
    closebox: {
        backgroundColor: 'blue',
        width: 40,
        height: 40,
    },
    changeImage: {
        alignItems: 'flex-end',
        color: colors.white,
        fontFamily: 'omnes',
        fontSize: 22,
    },
    formHeader: {
        marginTop: 40
    },
    formHeaderText: {
        color: colors.rollingStone,
        fontFamily: 'omnes',
    },
    formRow: {
        alignItems: 'center',
        alignSelf: 'stretch',
        borderBottomColor: colors.rollingStone,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flex: 1,
        flexDirection: 'row',
        paddingTop: 0,
        height: 50,
    },
    tallFormRow: {
        alignSelf: 'stretch',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        left: 0,
        width: 250,
        height: 220,
    },
    sliderFormRow: {
        paddingLeft: 30,
        paddingRight: 30,
        height: 160,
    },
    picker: {
        alignItems: 'stretch',
        alignSelf: 'flex-end',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 200,
    },
    halfcell: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-around',
        width: DeviceWidth / 2,
    },
    arrowStyle: {
        opacity: 0.4,
        tintColor: colors.shuttleGray,
        width: 12,
        height: 12,
    },
    wrapfield: {
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.shuttleGray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: MagicNumbers.screenPadding / 2,
        marginLeft: MagicNumbers.screenPadding / 1.5,
        height: 80,
    },
    privacy: {
        alignItems: 'center',
        flexDirection: 'column',
        paddingVertical: 30,
        paddingHorizontal: 20,
        height: 100,
    },
    formLabel: {
        flex: 8,
        fontSize: 18,
        fontFamily: 'omnes',
    },
    header: {
        fontFamily: 'omnes',
        fontSize: 24,
    },
    textfield: {
        alignItems: 'stretch',
        color: colors.white,
        fontFamily: 'montserrat', fontWeight: '800',
        fontSize: 20,
        flex: 1,
        textAlign: 'left',
    },
    buttonText: {
        alignSelf: 'center',
        color: '#111',
        fontSize: 18,
        fontFamily: 'omnes',
    },
    button: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#FE6650',
        borderColor: '#111',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    paddedSpace: {
        paddingHorizontal: MagicNumbers.screenPadding / 1.5,
    },

    modal: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        flex: 1,
        padding: 0,
        height: DeviceHeight - 100,
    },
    modalwrap: {
        margin: 0,
        padding: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    segmentTitles: {
        color: colors.white,
        fontFamily: 'montserrat',
        fontWeight: '800',
    },
    tab: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 0,
        width: DeviceWidth / 3,
    },
    tabs: {
        borderWidth: 1,
        backgroundColor: colors.dark,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: colors.dark,
        flex: 1,
        flexDirection: 'row',
        marginTop: -10,
        width: DeviceWidth,
        height: 50,
    },
});

Settings.displayName = 'Settings';

const mapStateToProps = ({user, ui, navigation}, ownProps) => {
    return { ...ownProps, user, ui, navState: navigation, profileVisible: user.profile_visible }
}

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
