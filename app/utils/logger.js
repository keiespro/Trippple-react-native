var ENV = 'dev';

class Logger {

  log(){
    if(ENV == 'dev'){
    }else{
      // send to somewhere
    }
  }

  debug(){
  }

  error(){
  }

  track(){
    // track stuff
  }


}

export default new Logger();
