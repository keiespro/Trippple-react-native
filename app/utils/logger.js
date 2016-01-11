var ENV = 'dev';

class Logger {

  log(){
    console.warn(arguments)
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
