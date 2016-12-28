import React from 'react';
import {View, Image} from 'react-native';
import PermissionModal from './PermissionModal/PermissionModal'
import {connect} from 'react-redux'

const LocationPermissionsModal = (props) => (
  <PermissionModal
    {...props}
    title={'LOCATION'}
    subtitle={'We’ve found some matches we think you might like. Should we prioritize the matches nearest to you?'}
    permissionKey={'location'}
    buttonText={'USE MY LOCATION'}
    onSuccess={() => { props.dispatch && props.dispatch({type: 'KILL_MODAL'}) }}
    permissionLabel={'Location'}
    closeModal={() => { props.dispatch && props.dispatch({type: 'KILL_MODAL'}) }}
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
          source={props.user.image_url ? {uri: props.user.image_url} : require('./assets/iconModalDenied@3x.png')}
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
          source={require('./assets/localIcon@3x.png')}
        />
      </View>
    )

    }
  />
)

const mapStateToProps = (state, ownProps) => {

  return {
    ...ownProps,
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)((LocationPermissionsModal));
