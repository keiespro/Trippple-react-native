import alt from '../alt'
import Api from '../../utils/api'

class AppActions {
  initApp(){
     this.dispatch()
  }
  gotCredentials(creds){
     this.dispatch(creds)
  }
  noCredentials(err){
    console.log('FAIL',err)
    this.dispatch(err)
  }
  remoteFail(){
    console.log('remote fail')
    this.dispatch()
  }
  loadingUser(){
    this.dispatch()
  }
  showCheckmark(copy){
    this.dispatch(copy)
  }
  hideCheckmark(){
    this.dispatch()
  }
  updateRoute(d){
    this.dispatch(d)
  }
  storeContactsToBlock(contacts){
    this.dispatch(contacts)
  }
}

export default alt.createActions(AppActions)
