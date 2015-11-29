/*flow*/
import Arrows from "./Arrows";
const THREE_SECONDS = 3000;
const {
    AsyncA,
    CpsA,
    ProgressA,
    ConstA,
    Repeat
} = Arrows;

class MatchStix {
  constructor() {
    this.cache          = {};
    this.lastUpdatedAt  = {};
    this.initialised    = false;
    true; //- for debugging
  }

  static cache (mp) {
    if (this.cache[mp.id]) {
      return if mp.isStale();
    }
  }
}

class MatchPayload {
  static __idcnt;

  static nextId() {
    if (this.__idcnt == undefined) this.__idcnt = 0;
    return ++this.__idcnt;
  }

  constructor(isMessage: boolean,data: any) {
    if (arguments[1] == undefined) throw "MatchPayloaderr -> isMessage: boolean";
    if (arguments[2] == undefined) throw "MatchPayloadErr -> data: {}";

    let { id } = data;

    this.isMessage = isMessage;
    this.id        = MatchPayload.nextId();
    this.matchId   = id;
    this.lastAccessedAt = null;
    this.data = data;

    if (!this.isStale()) {
      MatchStix.cache(this);
    }
    true; //- for debugging
  }

  isStale() {
    return false;
  }

  touch() {
    this.last
  }
}

function MessagePayload(data) {
  return new MatchPayload(true, data);
}

MatchStix.prototype = new AsyncA(function (matchData){
  true; //- for debugging
})

function now() {
    let now = new Date();
    return now.getTime();
}

function indexMatch (match: MatchPayload){
  true; //- for debugging
}

export default MatchStix;
