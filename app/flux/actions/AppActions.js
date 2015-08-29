import alt from '../alt'

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

}

export default alt.createActions(AppActions)

