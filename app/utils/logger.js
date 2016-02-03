class Logger {

  log(name, info){

    if(__DEBUG__){
      console.warn(name, {...info, ...arguments})
    }else{

    }
  }

  debug(){

  }

  error(){

  }

  track(){
    // track stuff
  }

  info(){

  }
}

export default new Logger();
