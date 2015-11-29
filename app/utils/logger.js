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

module.exports = new Logger();
