// import TrackEvt from "rn-redux-mixpanel/src/api/trackEvent";
// import Arrows from "./Arrows";

import Mixpanel from 'react-native-mixpanel'
// //-this is Production App
// //const TOKEN = 'f50df064bf21092e7394129ede26935b';
//
// //-this is Trippple-V2
// const TOKEN = 'eb728e735ea988864ae8b6f7b7f3841f';
//
// const THREE_SECONDS = 5000;
// const {
//     AsyncA,
//     CpsA,
//     ProgressA,
//     ConstA,
//     Done,
//     Repeat
// } = Arrows;
//
// var _distinctId;
//
// function now() {
//     let now = new Date();
//     return now.getTime();
// }
// function TrackA() {
//     if(!(this instanceof TrackA))
//         return new TrackA();
//     this.distinctId = `MXUUID:unitialised`;
//     this.eventQueue = [];
//     this.lastFlushAt = null;
//     this.lastEventAt = null;
//     this.eventCount = 0;
//
//     //- this arrow will flush its contents to mixpanel every three seconds.
//     var TrackingA = function (tracker) {
//         var e,es = tracker.eventQueue;
//         for(;e=es.pop();)
//             TrackEvt(e.eventName, e);
//         tracker.lastFlushAt = now();
//         return tracker;
//     }.AsyncA().next(Done);
//
//     TrackingA
//         .repeat(THREE_SECONDS)
//         .run(this);
// }
//
// TrackA.prototype = new AsyncA(function (Evtparams, p,k ) {
//     let _now = now(),
//         {
//             eventName,
//             eventData,
//             distinctId
//         } = Evtparams;
//
//     ++this.eventCount;
//
//     this.eventQueue.push({ createdAt: _now,eventName, eventData, distinctId});
//
//     var {
//         lastFlushAt,
//         eventCount
//     } = this,
//         queued = this.eventQueue.length,
//         data = this.eventQueue[this.eventQueue.length - 1];
//
//     this.lastEventAt = _now;
//     k({lastFlushAt, eventCount, queued, data}, p);
// });
//
// var MixA = TrackA();
export default {
  track(eventName, eventData={}) {

    Object.keys(eventData).length ?
      Mixpanel.trackWithProperties(eventName, eventData) :
        Mixpanel.track(eventName);
  },
  auth(distinctId) {
    Mixpanel.identify(distinctId)
  }
}
