import React from 'react';
import {connect} from 'react-redux'
import {NavigationStyles, withNavigation} from '@exponent/ex-navigation'
import PermissionModal from './PermissionModal/PermissionModal'
import {OnboardRouter} from '../Onboard'

@withNavigation
class NotificationsPermissionsModal extends React.Component{

  static route = {
    styles: NavigationStyles.SlideVertical,
    navigationBar: {
      visible: false,

    }
  };
  nextOnboardScreen(){
    this.props.navigator.push(OnboardRouter.getRoute('finish', {}))
  }
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
        subtitle={'Would you like to be notified of new matches and messages?'}
        permissionKey={'notifications'}
        buttonText={'YES, ALERT ME'}
        permissionLabel={'Notifications'}
        onSuccess={()=>{this.props.dispatch({type: 'TOGGLE_PERMISSION_SWITCH_NOTIFICATIONS_ON'})}}
        imageSource={featuredImage ? {uri:featuredImage} : require('./assets/icon.png')}
        nextOnboardScreen={this.nextOnboardScreen.bind(this)}
      />
    )
  }
}


const mapStateToProps = (state, ownProps) => {

  return {
    ...ownProps,
    user: state.user,
    relevantUser: state.likes.relevantUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)((NotificationsPermissionsModal));
