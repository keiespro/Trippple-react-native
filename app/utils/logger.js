const ENV = 'dev';

class Logger {

  log(){
    if(ENV == 'dev'){
      console.log(...arguments);
    }else{
      // send to somewhere
    }
  }

  debug(){
    if(ENV == 'dev') console.log(...arguments);
  }

  track(){
    // track stuff
  }


}

module.exports = new Logger();
