import React from 'react';
import PermissionModal from './PermissionModal/PermissionModal'

class NotificationsPermissionsModal extends React.Component{

  render(){
    const {relevantUser} = this.props;
    const featuredUser = relevantUser && relevantUser.user ? relevantUser.user : relevantUser || {};
    // const featuredPartner = featuredUser.relationship_status === 'couple' ? relevantUser.partner : {};
    // const displayName = (`${featuredUser.firstname} ${featuredPartner.firstname || ''}`).trim();
    const featuredImage = (relevantUser && relevantUser.image_url) || (featuredUser && featuredUser.image_url) || null;
    return (
      <PermissionModal
        title={'NOTIFICATIONS'}
        subtitle={' '}
        isPersistant
        permissionKey={'notifications'}
        buttonText={'GET NOTIFICATIONS'}
        permissionLabel={'Notifications'}
        imageSource={featuredImage || require('./assets/iconModalDenied@3x.png')}

      />
    )
  }
}

export default NotificationsPermissionsModal
