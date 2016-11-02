import React from 'react';
import { Platform, } from 'react-native';

import PermissionModal from './PermissionModal/PermissionModal'

const PrivacyPermissionsModal = ({success}) => (
  <PermissionModal
    title={'PRIVACY'}
    subtitle={'Hide from your Facebook Friends and Phone Contacts'}
    isPersistant
    permissionKey={'contacts'}
    onSuccess={() => {success && success()}}
    buttonText={'HIDE FROM CONTACTS'}
    permissionLabel={'Contacts'}
    imageSource={require('./assets/iconModalPrivacy@3x.png')}
  />
)

export default PrivacyPermissionsModal
