import React, { Component } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import { DeviceHeight, DeviceWidth, MagicNumbers } from '../../../utils/DeviceConfig';
import ActionMan from '../../../actions/';
import Carousel from './carousel';
import colors from '../../../utils/colors';
import FacebookButton from '../../buttons/FacebookButton/welcomeScreen';
import Loading from './Loading';


@reactMixin.decorate(TimerMixin)
export class Welcome extends Component {
    static route = {
        styles: NavigationStyles.Fade,
        navigationBar: {
            backgroundColor: colors.transparent,
            renderRight(route, props) {
                return false;
            },
            renderLeft(route, props){
                return false;
            },
            translucent: true,
            visible: false,
        },
        statusBar: {
            backgroundColor: colors.dark70,
            translucent: false,
        },
    };

    static displayName: 'Intro';

    constructor() {
        super();
    
        this.state = {
            busy: false,
            isAnimating: false,
        };
    }

    componentDidMount() {
        this._BackHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackHandler);
    }

    componentWillReceiveProps(nProps) {
        if (nProps.loggedIn && nProps.status != this.props.status) {
            if (nProps.status == 'onboarded') {
                this.props.dispatch(ActionMan.resetRoute('Potentials'));
            } else {
                this.props.dispatch(ActionMan.resetRoute('Onboard'));
            }
        }
    }

    componentWillUnmount() {
        if (this._BackHandler) {
            this._BackHandler.remove();
        }
    }

    handleBackHandler() {
        this.props.navigator.pop();
        return true;
    }

    whyFacebookModal() {
        this.props.dispatch(ActionMan.showInModal({component: 'WhyFacebook', passProps: {} }))
    }

    login() {
        this.setState({busy: true});
        this.props.dispatch({type: 'LOADING_PENDING'});
        this.setTimeout(() => {
            this.setState({busy: false});
        }, 20000)

        this.props.dispatch(ActionMan.loginWithFacebook());
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View>
                    <Carousel />
                </View>

                <View style={{marginHorizontal: 20}}>
                    <FacebookButton
                        busy={this.state.busy}
                        buttonStyles={{
                            backgroundColor: colors.cornFlower,
                            borderWidth: 0,
                            height: 80
                        }}
                        buttonText={'LOG IN WITH FACEBOOK'}
                        iconTintColor={'#fff'}
                        leftBoxStyles={{height: 80}}
                        onPress={this.login.bind(this)}
                        outerButtonStyle={{height: 80, marginVertical: 10}}
                        shouldAuthenticate
                    />
                </View>
                <TouchableOpacity
                    onPress={this.whyFacebookModal.bind(this)}
                >
                    <View style={{alignSelf: 'center', height: 50}}>
                        <Text
                            style={{
                                color: colors.rollingStone,
                                fontFamily: 'omnes',
                                fontSize: 12,
                                textDecorationLine: 'underline',
                            }}
                        >
                            Why Facebook?
                        </Text>
                    </View>
                </TouchableOpacity>
                {this.state.busy && <Loading />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        backgroundColor: colors.outerSpace,
        justifyContent: 'space-between',
        margin: 0,
        padding: 0,
        width: DeviceWidth,
        height: DeviceHeight,
    },
    textplain: {
        alignSelf: 'center',
        color: colors.white,
        fontSize: 22,
        fontFamily: 'omnes',
        textAlign: 'center',
    },
    buttonText: {
        alignSelf: 'center',
        color: colors.white,
        fontSize: 22,
        fontFamily: 'montserrat',
    },
    carousel: {
        marginTop: 0,
        width: DeviceWidth,
        height: DeviceHeight - 200,
    },
    slide: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: MagicNumbers.screenPadding / 2,
        width: DeviceWidth,
        height: DeviceHeight - 150,
    },
    bottomarea: {
        alignSelf: 'stretch',
        bottom: 100,
        width: undefined,
        height: 140,
    },
    textwrap: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    imagebg: {
        alignSelf: 'stretch',
        backgroundColor: colors.outerSpace,
        flex: 1,
        width: DeviceWidth,
        height: DeviceHeight,
    },
    button: {
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10,
        height: 45,
    },
    bottomButton: {
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 0,
        borderRadius: 0,
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 0,
        marginTop: 0,
        height: 80,
    },
    loginButton: {
        backgroundColor: colors.shuttleGray,
    },
    activeButton: {
        backgroundColor: colors.outerSpace,
    },
    registerButton: {
        backgroundColor: colors.mediumPurple,
    },
    wrap: {
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginTop: 0,
        paddingBottom: 0
    },
    bottomButtons: {
        alignItems: 'center',
        alignSelf: 'stretch',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: undefined,
        height: 80,
    },
});

const mapStateToProps = (state, p) => ({
  ...p,
  loggedIn: state.auth.api_key && state.auth.user_id, status: state.user.status
});

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
