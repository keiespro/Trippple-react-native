import { LayoutAnimation, Dimensions } from 'react-native';
import React from "react";
import { MagicNumbers } from '../../../utils/DeviceConfig';
import ActionMan from '../../../actions/';
import Analytics from '../../../utils/Analytics';
import CardDefault from './CardDefault';
import CardOpen from './CardOpen';
import ReportModal from '../../modals/ReportModal';
import animations from './LayoutAnimations';
import colors from '../../../utils/colors';
import NewCard from './NewCard';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

const medals = {
    bronze: 'goldenrod',
    silver: 'silver',
    gold: 'gold',
};

class Card extends React.Component {

    static defaultProps = {
        profileVisible: false,
    };

    constructor(props) {
        super();
        this.state = {
            slideIndex: 0,
        };
    }
    getScrollResponder() {
        return this.refs.scrollbox;
    }
    getInnerViewNode(): any {
        return this.getScrollResponder().getInnerViewNode();
    }

    scrollTo({ destY, destX }) {
        this.getScrollResponder().scrollTo({ y: destY, x: destX }, true);
    }

    scrollWithoutAnimationTo(destY?: number, destX?: number) {
        this.getScrollResponder().scrollWithoutAnimationTo(destY, destX);
    }

    // componentDidUpdate(pProps, pState) {
    //     if (pProps.profileVisible !== this.props.profileVisible) {
    //   // const scrollbox = this.refs.scrollbox;
    //   // scrollbox.setNativeProps({ contentOffset: { x: 0, y: 0 } });
    //     }
    // }

    setNativeProps(np) {
        const incard = this.refs.incard;
        incard.setNativeProps(np);
    }
    componentDidMount() {
    // this.checkPotentialSuitability();
    }
    openProfileFromImage(e, scroll) {
        if (this.props.profileVisible) {
      // this.props.toggleProfile(this.props.potential);
            this.props.dispatch({ type: 'CLOSE_PROFILE' });

        } else {
      // this.props.showProfile(this.props.potential);
            this.props.dispatch({ type: 'OPEN_PROFILE' });
        }
        // this.setState({ activeIndex: this.state.activeIndex + 1 });

    // if (scroll) {
    //   this.scrollTo({ y: DeviceHeight * 0.2, x: 0 }, true);
    // }
    }
    closeProfile() {
        this.props.dispatch({ type: 'CLOSE_PROFILE' });
    }

    componentWillReceiveProps(nProps) {
        if (nProps && nProps.pan && this.props.profileVisible !== nProps.profileVisible) {
            LayoutAnimation.configureNext(animations.layout.spring);
        }
    }

    checkPotentialSuitability() {
        if (this.props.user && this.props.user.relationship_status === 'single' && this.props.potential && this.props.potential.partner && this.props.potential.partner.id === "") {
            Analytics.warning(`CHECK POTENTIALS RESPONSE!`, `Your relationship_status is ${this.props.user.relationship_status}, but potential card is not a couple.`);
        }
    }


    render() {
        const potential = this.props.potential || { user: {} };
        const names = [potential.user && potential.user.firstname ? potential.user.firstname.trim() : null];

        if (potential.partner && potential.partner.id && potential.partner.firstname) {
            names.push(potential.partner.firstname.trim());
        }

        const { rel, profileVisible, isTopCard, isThirdCard, pan } = this.props;
        let matchName = names[0];
        let distance = potential.user.distance;
        const city = potential.user.city_state || ``;

        const partnerDistance = potential.partner ? potential.partner.distance : null;
        if (potential.partner && potential.partner.firstname) {
            matchName = `${matchName} & ${names[1]}`;
            distance = Math.min(distance, partnerDistance || 0);
        }
        const seperator = distance && city.length ? ' | ' : '';

        const heights = {
            smallest: {
                top: -60,
                second: -60,
                third: -55,
            },
            middle: {
                top: -65,
                second: -55,
                third: -50,
            },
            all: {
                top: -50,
                second: -50,
                third: -60,
            },
        };

        const heightTable = MagicNumbers.is4s ? heights.smallest : (MagicNumbers.is5orless ? heights.middle : heights.all);
        const cardHeight = DeviceHeight + (isTopCard ? heightTable.top : heightTable.second);
        const cardWidth = DeviceWidth;

        return (
        <NewCard
            profileVisible={this.props.profileVisible}
            key={`${potential.user.id}insidecard`}
            cardWidth={this.props.profileVisible ? DeviceWidth : cardWidth}
            cardHeight={cardHeight}
            seperator={seperator}
            city={city}
            potential={potential}
            pan={pan}
            dispatch={this.props.dispatch}
            activeIndex={this.state.activeIndex}
            user={this.props.user}
            isTopCard={this.props.isTopCard}
            matchName={matchName}
            distance={parseInt(distance)}
            closeProfile={this.closeProfile.bind(this)}
            openProfileFromImage={this.openProfileFromImage.bind(this, true)}
        />
      )

    }
}

export default Card;
