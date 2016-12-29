import React from 'react';
import PermissionModal from './PermissionModal/PermissionModal'
import {NavigationStyles} from '@exponent/ex-navigation'

class NotificationsPermissionsModal extends React.Component{

  static route = {
    styles: NavigationStyles.SlideVertical,
    navigationBar: {
      visible: false,

    }
  };

  render(){
    const {relevantUser} = this.props;
    const featuredUser = relevantUser && relevantUser.user ? relevantUser.user : relevantUser || {};
    // const featuredPartner = featuredUser.relationship_status === 'couple' ? relevantUser.partner : {};
    // const displayName = (`${featuredUser.firstname} ${featuredPartner.firstname || ''}`).trim();
    const featuredImage = (relevantUser && relevantUser.image_url) || (featuredUser && featuredUser.image_url) || null;
    return (
      <PermissionModal
        isModal={this.props.isModal}
        title={'GET NOTIFIED'}
        subtitle={'app/components/modals/assets/icon'}
        isPersistant
        permissionKey={'notifications'}
        buttonText={'YES, ALERT ME'}
        permissionLabel={'Notifications'}
        imageSource={featuredImage || require('./assets/icon.png')}
        onNoThanks={{type: 'KILL_MODAL', payload: true}}
      />
    )
  }
}

export default NotificationsPermissionsModal
