import React from 'react';
import {View, Image} from 'react-native';
import PermissionModal from './PermissionModal/PermissionModal'

const LocationPermissionsModal = ({user: {image_url}}) => (
  <PermissionModal
    title={'LOCATION'}
    subtitle={' '}
    isPersistant
    permissionKey={'location'}
    buttonText={'USE MY LOCATION'}
    permissionLabel={'Location'}
    renderImage={() => (
      <View
        style={{
          width: 200,
          height: 200,
          marginVertical: 10,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image
          style={[{
            width: 100,
            height: 100,
            borderRadius: 50,
            top: 0,
            left: 0,
            margin: 50,
            position: 'absolute'
          }]}
          source={image_url ? {uri: image_url} : require('./assets/iconModalDenied.png')}
        />
        <Image
          style={{
            width: 200,
            height: 200,
            marginVertical: 0,
            top: 0,
            left: 0,
            padding: 0,
            position: 'absolute'
          }}
          resizeMode="cover"
          source={require('./assets/localIcon.png')}
        />
      </View>
    )

    }
  />
)

export default LocationPermissionsModal
