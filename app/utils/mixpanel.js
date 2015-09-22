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

function now() {
    let now = new Date();
    return now.getTime();
}
function TrackA(userId) {
    if(!(this instanceof TrackA))
        return new TrackA(userId);
    this.userId = `MXUUID:${userId}`;
    this.eventHistory = [];
    this.lastFlushAt = null;
    this.lastEventAt = null;
    this.eventCount = 0;

    //- this arrow will flush its contents to mixpanel every three seconds.
    var THREE_SECONDS = 3000;
    (function TrackingA (tracker) {
        var e,es = tracker.eventHistory;
        for(;e=es.pop();)
            TrackEvt(e.eventName, e);
        tracker.lastFlushAt = now();
        return Repeat(tracker);
    }).AsyncA().repeat(THREE_SECONDS).run(this);
}

TrackA.prototype = new AsyncA(function (Evtparams, p, k ) {
    var {
        lastFlushAt
    } = this,
        queued = this.eventHistory.length,
        data = this.eventHistory[this.eventHistory.length - 1],
        _now = now();

    this.eventHistory.push({ createdAt: _now,
                            ...Evtparams,
                            userId: this.userId});
    this.lastEventAt = _now;
    ++this.eventCount;
    k({lastFlushAt, queued, data}, p);
});

var MixA = new TrackA('elrikDante');
export default {
    track (eventName) {
        MixA.run({token: TOKEN, eventName});
    }
}
