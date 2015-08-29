import alt from '../alt'

class AppActions {
  initApp(){
    console.log('INIT APP')
     this.dispatch()
  }
  gotCredentials(creds){
    console.log('gotCredentials',creds)
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

