const {__DEBUG__} = global

const Log = () => {
  if(__DEV__){
    return console.log
  }else if(__DEBUG__){
    return console.warn
  }
}

export default Log
