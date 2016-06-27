import alt from '../alt'
import UserActions from '../actions/UserActions'
import NotificationActions from '../actions/NotificationActions'
import Analytics from '../../utils/Analytics'

class CouplingStore {

  constructor() {

   this.state = {
      couple: {},
      readyToCouple: false
    }

    this.exportPublicMethods({
      getCouplingData: this.getCouplingData
    })


    this.bindListeners({
      handleVerifyCouplePin: UserActions.VERIFY_COUPLE_PIN,
      handleRequestCouplePin: UserActions.GET_COUPLE_PIN,
      handleCoupleCreatedEvent: NotificationActions.RECEIVE_COUPLE_CREATED_NOTIFICATION,
      handleGetUserInfo: UserActions.GET_USER_INFO,

    });

    this.on('init', () => {

    });

    this.on('error', (err, payload, currentState) => {

      Analytics.all('ERROR COUPLING STORE',err, payload, currentState);
      Analytics.err({...err, payload})

    });
    this.on('afterEach', (payload, currentState) => {

    })

  }

  handleRequestCouplePin(res){
    this.setState({couple: res.response.response});
  }

  handleVerifyCouplePin(res){
    this.setState({couple: res.response.response});
  }

  handleCoupleCreatedEvent(payload){
    this.setState({readyToCouple: true})
  }

  handleGetUserInfo(res){
    if(!this.readyToCouple){return false}
    const {user_info,client_ip} = res.response;
    if(user_info.partner_id){
      this.setState({readyToCouple: false, couple: {...this.couple, success: true, partner: user_info.partner}})
    }
  }

  getCouplingData(){
    return this.getState().couple
  }

}

export default alt.createStore(CouplingStore, 'CouplingStore');
