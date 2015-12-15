var alt = require( '../alt.js');



class AppActions {

  initApp(){
    console.log(this,this.dispatch)
    this.dispatch()
  }
  gotCredentials(creds){
     this.dispatch(creds)
  }
  noCredentials(err){
    this.dispatch(err)
  }
  remoteFail(){
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
  toggleOverlay(){
    this.dispatch();
  }
  storeContactsToBlock(contacts){
    this.dispatch(contacts)
  }
  grantPermission(perm){
    this.dispatch(perm)
  }
  denyPermission(perm){
    this.dispatch(perm)
  }
  saveStores(){
    console.log('SAVING STORES')

    this.dispatch();
  }

}

module.exports =  alt.createActions(AppActions);
