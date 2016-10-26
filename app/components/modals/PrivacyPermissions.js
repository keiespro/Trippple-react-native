import React from 'react';
import { Platform, } from 'react-native';

import PermissionModal from './PermissionModal/PermissionModal'

const PrivacyPermissionsModal = () => (
  <PermissionModal
    title={'PRIVACY'}
    subtitle={'Hide from your Facebook Friends and Phone Contacts'}
    isPersistant
    permissionKey={'contacts'}
    buttonText={'HIDE FROM CONTACTS'}
    permissionLabel={'Contacts'}
    imageSource={require('./assets/iconModalPrivacy.png')}
  />
)

export default PrivacyPermissionsModal
