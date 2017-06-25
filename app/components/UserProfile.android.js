import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PixelRatio,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import { DeviceHeight, DeviceWidth, MagicNumbers } from '../utils/DeviceConfig';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ActionMan from '../actions';
import Card from './screens/potentials/NewerCard';
import CityState from './CityState';
import colors from '../utils/colors';
import ParallaxSwiper from './controls/ParallaxSwiper';
import UserDetails from './UserDetails';
import VerifiedCoupleBadge from './Badge/VerifiedCoupleBadge';


const CardLabel = props => (
    <View>
        <Text
            key={`${props.potential.user.id}-names`}
            style={[styles.cardBottomText, { color: props.textColor }]}
        >
            {props.matchName}
        </Text>
        <CityState
            cityState={props.city}
            coords={{lat: props.potential.user.latitude, lng: props.potential.user.longitude}}
            potential={props.potential}
        />
    </View>
);


@withNavigation
class UserProfile extends Component {

    static route = {
        styles: NavigationStyles.Fade,
        navigationBar: {
            visible: false,
        },
    };

    static defaultProps = {
        cardWidth: DeviceWidth
    };

    constructor(props) {
        super(props);
        this.state = {slideIndex: 0};
    }

    onLayout(e) {
        const { layout } = e.nativeEvent;

        if (!this.state.contentHeight) {
            this.handleSize(layout.height + 600)
        }
    }

    reportModal() {
        const them = [this.props.potential.user];
        if (this.props.potential.partner && this.props.potential.partner.gender) {
            them.push(this.props.potential.partner);
        }
        this.props.dispatch(ActionMan.showInModal({
            component: 'ReportModal',
            passProps: {
                potential: this.props.potential,
            },
        }));
    }

    handleSize(contentHeight) {
        this.setState({contentHeight});
    }

    render() {
        const { potential } = this.props,
            distance = potential.user.distance || 0,
            city = potential.user.city_state || '';
        const name = potential.user.firstname || '';
        let matchName = name.trim();
        const profileVisible = true;

        const isTopCard = true;
        const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : ''];

        if (potential.partner && potential.partner.gender) {
            names.push(potential.partner.firstname.trim());
        }

        const seperator = distance && city.length ? ' | ' : '';
        const heights = {
            all: {
                top: -50,
                second: -50,
                third: -60,
            },
            middle: {
                top: -65,
                second: -55,
                third: -50,
            },
            smallest: {
                top: -60,
                second: -60,
                third: -55,
            },
        };

        const heightTable = MagicNumbers.is4s ? heights.smallest : (MagicNumbers.is5orless ? heights.middle : heights.all);
        const cardHeight = DeviceHeight + (isTopCard ? heightTable.top : heightTable.second);
        const cardWidth = DeviceWidth;

        if (potential.partner && potential.partner.gender) {
            matchName += ` & ${potential.partner.firstname.trim()}`;
        }

        const hasPartner = potential.partner && potential.partner.gender;
        const slideFrames = hasPartner && potential.partner.image_url && potential.partner.image_url != '' ? [potential.user, potential.partner] : [potential.user];
        const verifiedCouple = hasPartner && potential.couple.verified;

        return (
            <View style={{backgroundColor: '#000'}}>
                <Card
                    {...this.props}
                    isBrowse={true}
                    matchName={matchName}
                    profileVisible={true}
                    spacedTop={true}
                />
            </View>
        );
    }
}

class CustomTabBar extends React.Component {
    static propTypes: {
        activeTab: PropTypes.object,
        goToPage: PropTypes.func,
        pageNumber:PropTypes.number,
        tabs: PropTypes.array,
    };

    renderTabOption(name, page) {
        const isTabActive = this.props.pageNumber === page;

        return (
            <TouchableOpacity
                key={`${name + page} ${isTabActive}`}
                onPress={() => this.props.goToPage(page)}
            >
                <View style={styles.tab}>
                    <Text
                        style={{
                            color: isTabActive ? colors.white : colors.shuttleGray,
                            fontFamily: 'montserrat',
                            fontSize: 16,
                        }}
                    >
                        {name.toUpperCase()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const numberOfTabs = this.props.tabs.length;
        const w = MagicNumbers.screenWidth / numberOfTabs;

        const tabUnderlineStyle = {
            backgroundColor: colors.mediumPurple,
            bottom: 0,
            left: 0,
            position: 'absolute',
            transform: [
                {translateX: this.props.activeTab ? this.props.activeTab.interpolate({
                    inputRange: this.props.tabs.map((c, i) => (w * i)),
                    outputRange: [0, w],
                }) : 0
            }],
            width: MagicNumbers.screenWidth / 2,
            height: 2,
        };

        return (
            <View style={[styles.tabs, { marginHorizontal: MagicNumbers.screenPadding / 2 }]}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                <Animated.View style={tabUnderlineStyle} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    shadowCard: {
        shadowColor: colors.darkShadow,
        shadowRadius: 5,
        shadowOpacity: 50,
        shadowOffset: {
            width: 0,
            height: 5,
        },
    },
    tab: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 0,
        width: DeviceWidth,
    },
    singleTab: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: MagicNumbers.screenPadding / 2,
        width: MagicNumbers.screenWidth,
    },
    tabs: {
        alignItems: 'center',
        borderColor: colors.shuttleGray,
        borderTopWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
        marginHorizontal: 0,
        overflow: 'hidden',
        width: DeviceWidth,
        height: 60,
    },
    animatedIcon: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 30,
        justifyContent: 'center',
        left: (DeviceWidth / 2) - 50,
        top: (DeviceHeight / 2) - 80,
        overflow: 'hidden',
        position: 'absolute',
        width: 60,
        height: 60,
    },
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        overflow: 'hidden',
        top: 50,
    },
    absoluteText: {
        backgroundColor: 'transparent',
        color: '#ffffff',
        fontSize: 20,
        position: 'absolute',
    },
    absoluteTextTop: {
        top: 0,
    },
    absoluteTextBottom: {
        bottom: 0,
    },
    basicCard: {
        backgroundColor: 'transparent',
        borderRadius: 6,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: 'rgba(0,0,0,.2)',
        overflow: 'hidden',
    },
    bottomButtons: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-around',
        top: -40,
        width: undefined,
        height: 80,
    },
    topButton: {
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        borderColor: colors.white,
        borderWidth: 0,
        borderRadius: 0,
        flex: 1,
        flexDirection: 'row',
        marginBottom: 0,
        marginTop: 0,
        justifyContent: 'center',
        height: 80,
    },
    card: {
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        borderColor: 'rgba(0,0,0,.2)',
        borderRadius: 6,
        borderWidth: 0,
        flex: 1,
        overflow: 'hidden',
    },
    closeProfile: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: 25,
        left: 5,
        top: 10,
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 20,
        position: 'absolute',
        width: 50,
        height: 50,
    },
    dashedBorderImage: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 0,
        marginTop: 65,
        marginBottom: 20,
        padding: 0,
        width: DeviceWidth,
        height: DeviceHeight - 100,
    },
    imagebg: {
        alignItems: 'stretch',
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'column',
        padding: 0,
        width: DeviceWidth,
        height: DeviceHeight,
    },
    dot: {
        backgroundColor: 'transparent',
        borderColor: colors.white,
        borderRadius: 7.5,
        borderWidth: 2,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 6,
        marginBottom: 6,
        width: 15,
        height: 15,
    },
    activeDot: {
        backgroundColor: colors.mediumPurple20,
        borderColor: colors.mediumPurple,
        borderWidth: 2,
        borderRadius: 7.5,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 6,
        marginBottom: 6,
        width: 15,
        height: 15,
    },
    wrapper: { },
    scrollSection: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
    },
    circleimage: {
        backgroundColor: colors.shuttleGray,
        borderColor: colors.white,
        borderRadius: 30,
        borderWidth: 3,
        width: 60,
        height: 60,
    },
    cardStackContainer: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        width: DeviceWidth,
        height: DeviceHeight,
    },
    cardBottomText: {
        color: colors.shuttleGray,
        fontFamily: 'montserrat', fontWeight: '800',
        fontSize: 18,
        marginLeft: 0,
        marginTop: 0
    },
    cardBottomOtherText: {
        color: colors.rollingStone,
        fontFamily: 'omnes',
        fontSize: 16,
        marginLeft: 0,
        marginTop: 10,
        opacity: 0.9,
    },
});

const mapStateToProps = (state, ownProps) => ({
    ...ownProps,
    user: state.user,
})

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
