import { Platform, Dimensions, View } from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'
import ActionMan from './actions/';



const iOS = Platform.OS == 'ios';
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;




class LikeSender extends React.Component{


  componentWillReceiveProps(nProps){
    if(!nProps.sendingLike && nProps.pendingLikes && nProps.internet){
      nProps.dispatch(ActionMan.sendLike(nProps.swipeQueue[0]))
    }
  }

  render(){
    return (<View style={{height:0,width:0,zIndex:-1000,opacity:0}}/>)
  }

}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  user: state.user,
  pendingLikes: Object.keys(state.swipeQueue).length > 0,
  swipeQueue: Object.values(state.swipeQueue),
  internet: state.app.isConnected,
  sendingLike: state.app.sendingLike
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(LikeSender);
