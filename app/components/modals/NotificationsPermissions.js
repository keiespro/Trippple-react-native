import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationStyles, withNavigation } from '@exponent/ex-navigation';
import PermissionModal from './PermissionModal/PermissionModal';
import { OnboardRouter } from '../Onboard';

@withNavigation
class NotificationsPermissionsModal extends Component {

  static route = {
    styles: NavigationStyles.SlideVertical,
    navigationBar: {
      visible: false,
    }
  };

  render() {
    const { relevantUser } = this.props;
    const featuredUser = relevantUser && relevantUser.user ? relevantUser.user : relevantUser || {};
    const featuredImage = featuredUser ? featuredUser.image_url || featuredUser.thumb_url : null;

    return (
      <PermissionModal
        isModal={this.props.isModal}
        title={'NOTIFICATIONS'}
        subtitle={'Would you like to be notified of new matches and messages?'}
        permissionKey={'notifications'}
        buttonText={'YES, ALERT ME'}
        imageResizeMode={'cover'}
        permissionLabel={'Notifications'}
        onSuccess={() => {this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_ON'})}}
        imageSource={featuredImage ? {uri: featuredImage} : require('./assets/icon.png')}
        imageStyle={featuredImage ? {borderRadius: 75} : {}}
      />
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user,
    relevantUser: state.likes.relevantUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPermissionsModal);
