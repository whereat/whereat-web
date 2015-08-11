const chai = require('chai');
const should = chai.should();

const UserLocation = require('../../src/models/UserLocation');
const Location = require('../../src/models/Location');

const { s17, s17_, s17UL} = require('../support/sampleLocations');
const { USER_ID } = require('../../src/constants/Keys');

describe('UserLocation Record', () => {

  it('creates a UserLocation from javascript object', () => {
    const l = s17UL;
    UserLocation(l)
      .equals(UserLocation({ id: l.id, lat: l.lat, lon: l.lon, time: l.time }))
      .should.equal(true);
  });

  it('creates a UserLocation from javascript object missing fields', () => {
    UserLocation(s17)
      .equals(UserLocation({
        id: USER_ID,
        lat: s17.lat,
        lon: s17.lon,
        time: s17.time
      })).should.equal(true);
  });


  it('creates a UserLocation from a Location', () => {
    UserLocation(Location(s17))
      .equals(UserLocation({
        id: USER_ID,
        lat: s17.lat,
        lon: s17.lon,
        time: s17.time
      })).should.equal(true);
  });



  it('allows access to fields via dot accessors', () => {
    const loc = UserLocation(s17);
    loc.id.should.equal(USER_ID);
    loc.lat.should.equal(s17.lat);
    loc.lon.should.equal(s17.lon);
    loc.time.should.equal(s17.time);
  });

});