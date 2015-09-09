import TrackEvt from "rn-redux-mixpanel/src/api/trackEvent";
const TOKEN = 'f50df064bf21092e7394129ede26935b';
export default {
    track (eventName) {
        TrackEvt({token: TOKEN, eventName, distinctId: 'elrikdante'});
    }
}
