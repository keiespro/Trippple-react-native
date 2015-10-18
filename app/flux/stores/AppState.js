import alt from '../alt'
import AppActions from '../actions/AppActions'
import UserActions from '../actions/UserActions'
import MatchActions from '../actions/MatchActions'

class AppStateStore {
  constructor() {

    this.userStatus = null
    this.showCheckmark = false
    this.checkmarkRequireButtonPress = false
    this.checkMarkCopy = {}
    this.currentRoute = null

    this.bindListeners({
      handleInitialize: AppActions.GOT_CREDENTIALS,
      handleInitSuccess: UserActions.INIT_SUCCESS,
      handleGetUserInfo: UserActions.getUserInfo,
      handleUpdateUser: UserActions.UPDATE_USER,
      handleLogOut: UserActions.LOG_OUT,
      handleHideCheckmark: AppActions.HIDE_CHECKMARK,
      handleShowCheckmark: AppActions.SHOW_CHECKMARK,
      handleSelectPartner: UserActions.SELECT_PARTNER,
      handleUpdateRoute: AppActions.UPDATE_ROUTE

    });

  }

  handleInitialize(){


  }

  handleInitSuccess(res){
    this.setState({
      userStatus: res.response.user_info.status
    })

  }

  handleGetUserInfo(res){
    if(res.error){
      return false;
    }
    this.setState({
      userStatus: res.response.user_info.status
    })
  }

  handleShowCheckmark(cm){
    var cm = cm || {};
    this.setState({
      showCheckmark: true,
      checkMarkCopy: cm ? cm.copy : {} ,
      checkmarkRequireButtonPress: cm  && cm.button
    })

    if(!cm.button){
      setTimeout(()=>{
        this.setState({showCheckmark:false,checkMarkCopy: {}})
      },5000);
    }

  }

  handleHideCheckmark(){

    this.setState({
      showCheckmark: false,
      checkMarkCopy: {}
    })

  }

  handleSelectPartner(payload){
    console.log(payload);
    if(payload.err){
      return false;
      }
      if(payload.showCheckmark){
        this.handleShowCheckmark({
          copy:{
            title:'INVITATION SENT',
            partnerName: payload.partnerName

          },
          button: true
        });
      }
  }




  handleLogOut(){
    this.setState({ userStatus: null});

  }
  //
  // updateUserInfo(attributes){
  //   const prevUser = this.state.user;
  //   const updatedUser = {...prevUser, ...attributes};
  //   this.setState({user:updatedUser});
  // }
  //
  // handleUpdateUser(wrap){
  //   this.updateUserInfo(wrap.updates);
  // }
  //



}
export default alt.createStore(AppStateStore, 'AppStateStore');
