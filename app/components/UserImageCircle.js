import React, { Component } from 'react';
import ReactNative, {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, withNavigation } from '@exponent/ex-navigation';
import colors from '../utils/colors';

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;


@withNavigation
class UserImageCircle extends Component {

  static defaultProps = {
    diameter: DeviceWidth / 2 - 20
  }

  state = {loading: false}

  render() {
    const { id, thumbUrl, onPress, dispatch, overrideStyles = {} } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          const nav = this.props.navigation.getNavigatorByUID(this.props.navState.currentNavigatorUID)
          nav.push('FBPhotoAlbums', {});
        }}
        style={{marginTop: 0}}
      >
        <View style={{width: this.props.diameter, height: this.props.diameter}}>
          <Image
            defaultSource={require('./screens/settings/assets/placeholderUser@3x.png')}
            key={`${id}thumb`}
            onLoadStart={e => {
              this.setState({loading: true})
            }}
            onLoadEnd={e => {
              this.setState({loading: false})
            }}
            resizeMode={Image.resizeMode.cover}
            source={thumbUrl ? {uri: thumbUrl} : null}
            style={[styles.userimage, overrideStyles]}
          />
          <View style={styles.circle}>
            <Image
              resizeMode={Image.resizeMode.contain}
              source={require('./screens/settings/assets/edit@3x.png')}
              style={{width: 14, height: 14}}
            />
          </View>
          {this.state.loading ? (
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  flexGrow: 1,
                  justifyContent: 'center',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: this.props.diameter,
                  height: this.props.diameter,
                  zIndex: 1999,
                }}
              >
                <ActivityIndicator
                  animating
                  color={colors.white}
                  size="large"
                />
              </View>
            ) : null
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.brightPurple,
    justifyContent: 'center',
    bottom: 2,
    right: 2,
    position: 'absolute',
    width: 32,
    height: 32,
  },
  userimage: {
    alignItems: 'center',
    borderRadius: ((DeviceWidth / 2 - 20) / 2),
    overflow: 'hidden',
    padding: 0,
    width: DeviceWidth / 2 - 20,
    height: DeviceWidth / 2 - 20,
  },
});

const mapStateToProps = (state, ownProps) => ({ ...ownProps, navState: state.navigation })
const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(UserImageCircle);
