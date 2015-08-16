const { Map } = require('immutable');
const UserLocation = require('../../src/models/UserLocation');
const { s17, s17_} = require('./sampleLocations');

const ps = {};

ps.emptyState = Map({
  loc: UserLocation(),
  polling: false,
  pollId: -1,
  lastPing: -1
});

ps.ping1State = Map({
  loc: UserLocation(s17),
  polling: false,
  pollId: -1,
  lastPing: -1
});

ps.ping2State = Map({
  loc: UserLocation(s17_),
  polling: false,
  pollId: -1,
  lastPing: s17.time
});

ps.pollState =  Map({
  loc: UserLocation(),
  polling: true,
  pollId: 1,
  lastPing: -1
});


module.exports = ps;
