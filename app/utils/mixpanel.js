import TrackEvt from "rn-redux-mixpanel/src/api/trackEvent";
import Arrows from "./Arrows";
const TOKEN = 'f50df064bf21092e7394129ede26935b';
var {
    AsyncA,
    CpsA,
    ProgressA,
    ConstA,
    Repeat
} = Arrows;

function TrackA(userId) {
    if(!(this instanceof TrackA))
        return new TrackA(userId);
    this.userId = `MXUUID:${userId}`;
    this.eventHistory = [];
    this.lastFlushAt = null;

    var THREE_SECONDS = 3000;
    var TrackingA = function (tracker) {
        var e,es = tracker.eventHistory;
        for(;e=es.pop();)
            TrackEvt(e.eventName, e);
        tracker.lastFlushAt = new Date();
        return Repeat(tracker);
    }.AsyncA().repeat(THREE_SECONDS).run(this);
}

TrackA.prototype = new AsyncA(function (Evtparams, p, k ) {
   this.eventHistory.push({ createdAt: new Date(), ...Evtparams, userId: this.userId});

    var {
        lastFlushAt
    } = this;

    var queued= this.eventHistory.length,
        data  = this.eventHistory[this.eventHistory.length - 1];

    k({lastFlushAt, queued, data}, p);
});

var MxA = TrackA('elrikDante').bind(
    ( ({isDraining: isDraining, ...rest}) => {
        console.log('draining', rest, isDraining);
        return {...rest, isDraining};
    })
);

export default {
    track (eventName) {
        MxA.bind( (queued: queued) => {
            console.log(queued, 'items in queue');
        }).run({token: TOKEN, eventName})
    }
}
