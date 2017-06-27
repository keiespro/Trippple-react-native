import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    LayoutAnimation,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import { withNavigation } from '@exponent/ex-navigation';
import ActionMan from '../../actions';
import BlurModal from './BlurModal';
import colors from '../../utils/colors';
import FadeInContainer from '../FadeInContainer';
import ReportModal from './ReportModal';
import Router from '../../Router';
import UserProfile from '../UserProfile';
import UnmatchModal from './UnmatchModal';

const DeviceHeight = Dimensions.get('window').height
const DeviceWidth = Dimensions.get('window').width

class Action extends React.Component{

    render() {
        const { user } = this.props;
        const currentMatch = this.props.match || this.props.currentMatch || this.props.matchInfo || this.props.route && this.props.route.params.matchInfo || {};
        const img_url_id = Object.keys(currentMatch.users).filter(uid => uid != this.props.user.id && uid != this.props.user.partner_id);

        if (typeof img_url_id == 'object') {
            img_url_id_id = img_url_id[0];
        }

        const img_url = currentMatch.users[(img_url_id_id || img_url_id) ].image_url;
        const theirIds = Object.keys(currentMatch.users).filter(u => u != this.props.user.id && u != this.props.user.partner_id)
        const them = theirIds.map(id => currentMatch.users[id]);
        let matchName;

        if (this.props.user.relationship_status == 'couple') {
            matchName = them[0].firstname
        } else {
            matchName = `${them.reduce((acc, u, i) => { return acc + u.firstname.toUpperCase() + (i == 0 ? ' & ' : '') }, '')}`;
        }

        return (
            <BlurModal>
                <View style={styles.actionmodal}>
                    <View style={[styles.insideactionmodal]}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                            }}
                        >

                            <View style={[styles.userimageContainer, styles.blur]}>
                                <Image
                                    defaultSource={require('./assets/placeholderUser@3x.png')}
                                    key={currentMatch.match_id}
                                    resizeMode={Image.resizeMode.cover}
                                    source={{uri: img_url}}
                                    style={styles.userimage}
                                />
                                <Text
                                    style={{
                                        color: colors.white,
                                        fontFamily: 'montserrat',
                                        fontSize: 18,
                                        fontWeight: '800',
                                    }}
                                >
                                    {matchName}
                                </Text>
                            </View>

                            <View>
                                <View
                                    style={{
                                        borderBottomColor: colors.shuttleGray,
                                        borderBottomWidth: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10,
                                        marginHorizontal: 10,
                                        paddingHorizontal: 0,
                                        paddingBottom: 10,
                                    }}
                                >
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.props.dispatch(
                                                ActionMan.killModal()
                                            );
                                            this.props.dispatch(
                                                ActionMan.showInModal({
                                                    component: 'UnmatchModal',
                                                    passProps: { match: currentMatch, goBack: () => { this.props.dispatch(ActionMan.killModal()) } }
                                                })
                                            );
                                        }}
                                        style={[
                                            styles.clearButton,
                                            styles.inlineButtons,
                                            {marginRight: 10}
                                        ]}
                                        underlayColor={colors.shuttleGray20}
                                    >
                                        <Text style={[styles.clearButtonText]}>UNMATCH</Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.props.dispatch(ActionMan.showInModal({component: 'ReportModal', passProps: {match: currentMatch}}))
                                        }}
                                        style={[
                                            styles.clearButton,
                                            styles.inlineButtons,
                                            {marginLeft: 10},
                                        ]}
                                        underlayColor={colors.shuttleGray20}
                                    >
                                        <Text style={[styles.clearButtonText]}>REPORT</Text>
                                    </TouchableHighlight>
                                </View>
                                <TouchableHighlight
                                    onPress={() => {
                                        const theirIds = Object.keys(currentMatch.users).filter(u => { return u != user.id && u != user.partner_id })
                                        const them = theirIds.map((id) => currentMatch.users[id])
                                        const MatchUserAsPotential = {
                                            user: them[0],
                                            partner: them[1] || {},
                                            couple: {}
                                        }
                                        this.props.dispatch(ActionMan.killModal())
                                        this.props.dispatch(ActionMan.pushRoute('UserProfile', { potential: MatchUserAsPotential, user: this.props.user}));
                                    }}
                                    style={[
                                        styles.clearButton,
                                        styles.modalButton,
                                        {
                                            backgroundColor: colors.mediumPurple20,
                                            borderColor: colors.mediumPurple,
                                        },
                                    ]}
                                    underlayColor={colors.mediumPurple}
                                >
                                    <Text style={[styles.clearButtonText, styles.modalButtonText]}>
                                        VIEW PROFILE
                                    </Text>
                                </TouchableHighlight>
                            </View>

                            <TouchableOpacity onPress={() => { this.props.dispatch(ActionMan.killModal()) }}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor:'transparent',
                                        flexGrow: 1,
                                        justifyContent: 'center',
                                        width: DeviceWidth - 20,
                                        height: 30,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.white,
                                            fontSize: 16,
                                            fontFamily:'omnes',
                                            textAlign: 'center',
                                        }}
                                    >
                                        CANCEL
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BlurModal>
        );
    }
}

const styles = StyleSheet.create({
    actionmodal: {
        backgroundColor: 'transparent',
        bottom: 0,
        flexGrow: 1,
        justifyContent: 'flex-start',
        margin: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        width: DeviceWidth,
        height: DeviceHeight,
    },
    insideactionmodal: {
        bottom: 0,
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
        position: 'absolute',
        width: DeviceWidth,
        height: DeviceHeight,
    },
    clearButton: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: colors.rollingStone,
        borderRadius: 0,
        borderWidth: 1,
        justifyContent: 'center',
        marginVertical: 10,
        height: 60,
    },
    modalButton: {
        alignItems: 'center',
        alignSelf: 'stretch',
        borderRadius: 0,
        borderWidth: 1,
        justifyContent: 'center',
        margin: 10,
        height: 60,
    },
    profileButton: {
        backgroundColor: colors.mediumPurple20,
        borderColor: colors.mediumPurple,
    },
    inlineButtons: {
        flex: 1,
    },
    modalButtonText: {
        color: colors.white,
        fontFamily: 'montserrat',
        fontSize: 18,
        textAlign: 'center'
    },
    clearButtonText: {
        color: colors.rollingStone,
        fontFamily: 'montserrat',
        fontSize: 18,
        textAlign: 'center',
    },
    container: {
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'absolute',
        top: 0,
        width: DeviceWidth,
        height: DeviceHeight,
    },
    fullwidth: {
        width: DeviceWidth
    },
    col: {
        flexDirection: 'column',
        padding: 0,
    },
    userimageContainer: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'center',
        marginVertical: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        paddingTop: 0,
        width: DeviceWidth - 20,
    },
    blur: { },
    userimage: {
        borderRadius: 75,
        marginBottom: 20,
        marginVertical: 10,
        overflow: 'hidden',
        padding: 0,
        position: 'relative',
        width: 150,
        height: 150,
    },
})

const animations = {
    layout: {
        spring: {
            create: {
                delay: 500,
                duration: 300,
                property: LayoutAnimation.Properties.opacity,
                type: LayoutAnimation.Types.easeInEaseOut,
            },
            duration: 500,
            update: {
                springDamping: 200,
                type: LayoutAnimation.Types.spring,
            },
        },
        easeInEaseOut: {
            create: {
                delay: 500,
                property: LayoutAnimation.Properties.scaleXY,
                type: LayoutAnimation.Types.easeInEaseOut,
            },
            duration: 300,
            update: {
                delay: 100,
                type: LayoutAnimation.Types.easeInEaseOut
            },
        }
    }
};

export default Action;
