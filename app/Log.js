// import logger from 'react-native-logger'
// import Firebase from 'firebase'

// const fireLog = new Firebase('https://blistering-torch-607.firebaseio.com')
const noop = () => {}

const prettyPrint = (arg) => {
  if(typeof arg === 'string'){
    console.log(arg)
  }else if(arg.payload && arg.payload.matches && arg.payload.matches.length >= 0){
    return showArrayInTable(arg.payload.matches);
  }else{
    Object.keys(arg).map((k)=>{

       arg[k].error  ? console.info(arg[k]) : prettyPrint(arg[k])

    })

  }
}

const showArrayInTable = (array) => {

  /*
   *
   *   var x = ["user", "partner", "couple"].map((i) => {
    var out = {};
    array.map((pt) => {
      var keys = Object.keys(pt.user);
      return keys.map((k) => { out[i]=pt[i][k]) })
    })
    return [i,out];
  });

  console.table(x);

  {
    height: {couple: [], user: [], partner: []},
    bio: {coouple: [], user: [], partner: []},
  }

*/
  // var keys = Object.keys(array[0].user);

  // keys.reduce((acc, k, i) => {

  //   ["user","couple","partner"].reduce((row, scope) => {

  //   })

  //   console.table(...array)
  // },{})
  //

  console.table(...array)


}
const initLogger = () => {

  if (false &&  console.groupCollapsed){
    return (...args) => {
     // if(args[0] === 'afterEach' && !args[0].error){
     //    return noop
     //  }

     //   if(args.length == 1 && args[0].error){
     //    fireLog.push(args[0]);

     //    console.error(args[0]);

     //  }else if(args.length == 1 && typeof args[0] === 'string'){

     //    console.log(args[0])
     //  }else{

     //    console.groupCollapsed('--------------',args.shift(),'--------------');

        args.map((arg)=>{
          arg.error ? console.error(arg) : console.log(arg)
        })
        console.log('------------------------------------------------------------------')
     //    console.groupEnd();
     //    return
     //  }
    }
  }else{

    return () => console.log
  }
  // review this
  // if (__DEV__ && process.env.NODE_ENV !== 'production') {
  //   Logger = new logger('x.local');
  //   return Logger;
  // }
  // return (__DEBUG__ ? console.warn : noop)
}

export default initLogger()


// class Log{

//   log(){
//     console.log(...arguments)

//   }

//   error(){
//     console.error(...arguments)
//     fireLog.push(...arguments)
//   }

//   warn(){
//     console.warn(...arguments)

//   }

//   info(){

//     console.info(...arguments)
//   }

// }


