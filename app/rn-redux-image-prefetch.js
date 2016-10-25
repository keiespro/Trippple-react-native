import { Image, NativeModules, Platform } from 'react-native'
import _ from 'lodash'

const {ImageLoader} = NativeModules
const PREFETCH_STARTED = 'PREFETCH_STARTED';
const PREFETCH_COMPLETE = 'PREFETCH_COMPLETE';

export default function createPrefetcher(config = {}) {
  // defaults


  // config
  const {
    watchKeys,
    debug
  } = config;

  return ({ dispatch, getState }) => (next) => (action) => {
    // Exit early if predicate function returns 'false'
    // if (typeof predicate === 'function' && !predicate(getState, action)) {
    //   return next(action);
    // }
    //
    const state = getState();
    const targetKeys = watchKeys;
    // console.warn(watchKeys);
    // || Object.keys(state);

    targetKeys.forEach(targetKeyMap => {
      const targetAction = Object.keys(targetKeyMap)[0];
      if(action.type != targetAction) return;

      const imgKey = targetKeyMap[targetAction];

      const incoming = action.payload.response[imgKey.key]

      processStateKey(imgKey, state[imgKey], incoming)
    });

    return next(action);


    function resolveChildProperty(parent, childKey){
      if(typeof childKey === 'object'){
        const subkey = Object.keys(childKey)[0]; // only allowing 1 subkey for now
        if(subkey){
          const subsubkey = Object.keys(childKey[subkey])[0]; // only allowing 1 subkey for now

          return parent[subkey][subsubkey];
        }else{
          return parent[subkey];
        }
      }else{
        return parent[childKey];
      }
    }

    function processStateKey(pointer, stateValue, incoming){
      let images = [];

      if(!incoming || !incoming.length){
        return;
      }
    // If it's an array, assume we're dealing with a collection of things that will each have one or more images
      if(Array.isArray(incoming)){
      // if the user provided a mapping to the image url inside a collection item
      // if (typeof watchKeys === 'object'){
        images = incoming.map(item => resolveChildProperty(item, pointer.location))
      // } else {
      //   // for now just inspect the whole thing
      //
      //   images = incoming.reduce((imgs, item) => {
      //     if (item.substr(0, 4) == 'http'){
      //       imgs.push(item[watchKeys[pointer]])
      //     }
      //
      //     return imgs
      //   }, []);
      // }
      }else if(typeof incoming === 'object'){
        // dont decened uet
        images = Object.keys(incoming[pointer]).reduce((imgs, item) => {
          if(item.substr(0, 4) == 'http'){
            imgs.push(item[watchKeys[pointer]])
          }

          return imgs
        }, []);
      }

      if(debug) console.warn(images.length);

      let cacheCheck;
      if(Platform.os == 'android'){
        cacheCheck = ImageLoader.queryCache(images)
        .then(cache => {
          if(debug) console.log(cache);
          const uncached = _.difference(images, Object.keys(cache))
          if(debug) console.log(uncached, 'going to prefetch')
          return uncached
        })
      }else{
        cacheCheck = new Promise((resolve, reject) => {
          setImmediate(() => {
            const a = true;
            console.log('Image loader check cache not supported on iOS');
            if(a){
              resolve()
            }else{
              reject()
            }
          })
        })
      }

      cacheCheck.then(imgs => {
        if(debug) console.log(imgs);

        imgs.forEach(imageUrl => {
          if(debug) console.log(imageUrl);

          dispatch(prefetchStartedAction({imageUrl}));

          Image.prefetch(imageUrl)
            .then(success => {
              if(debug) console.log(`success: ${success}`);
              dispatch(prefetchCompleteAction({imageUrl}));
            })
            .catch(error => {
              if(debug) console.warn('err', error)
              dispatch(prefetchCompleteAction({imageUrl}, error));
            })
        })
      })
      .catch(error => {
        if(debug) console.warn('err', error)
        dispatch(prefetchCompleteAction({error}));
      })
    }
  }
}


function prefetchStartedAction(payload, error = null) {
  return {
    type: PREFETCH_STARTED,
    payload,
    error
  }
}


function prefetchCompleteAction(payload, error = null) {
  return {
    type: PREFETCH_COMPLETE,
    payload,
    error
  }
}
