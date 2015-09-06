const chai = require('chai');
const should = chai.should();

const Location = require('../../app/models/Location');
const { s17, s17UL } = require('../support/sampleLocations');

describe('Location Record', () => {

  it('creates a Location from javascript object', () => {
    Location(s17)
      .equals(Location( {lat: s17.lat, lon: s17.lon, time: s17.time }))
      .should.equal(true);
  });

  it('drops extraneous fields from the record', () => {
    should.exist(s17UL.id);
    should.not.exist(Location(s17UL).get('id'));
  });

  it('allows access to fields via dot accessors', () => {
    const loc = Location(s17);
    loc.lat.should.equal(s17.lat);
    loc.lon.should.equal(s17.lon);
    loc.time.should.equal(s17.time);
  });

});
