const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);

const Marty = require('marty');
const Application = require('../../src/application');
const { dispatch, createApplication } = require('marty/test-utils');

const LocationConstants = require('../../src/constants/LocationConstants');
const { Map, Seq } = require('immutable');
const { s17, s17_, nyse3 } = require('../support/sampleLocations');

describe('LocationStore', () => {

  const setup = (state = Map()) => {
    const app = createApplication(Application, { include: ['locationStore'] });
    app.locationStore.state = state;

    const listener = sinon.spy();
    app.locationStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('handlers', () => {

    describe('#save', () => {

      it('adds a location to the store', () => {
        const [app, _] = setup();
        app.locationStore.save(s17);

        app.locationStore.state.get(s17.id).should.eql(s17);
      });

      it('updates a location already in the store', () => {
        const [app, _] = setup();
        app.locationStore.save(s17);
        app.locationStore.save(s17_);

        app.locationStore.state.get(s17.id).should.eql(s17_);
        app.locationStore.state.valueSeq().size.should.equal(1);
      });

      it('responds to LOCATION_RECEIVED', () => {
        const [app, _] = setup();
        dispatch(app, LocationConstants.LOCATION_RECEIVED, s17);

        app.locationStore.state.get(s17.id).should.eql(s17);
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup();
        app.locationStore.save(s17);

        listener.should.have.been.calledOnce;
      });
    });

    describe('#saveMany', () => {

      it('adds many locations to the store', () => {
        const [app, _] = setup();
        app.locationStore.saveMany(nyse3);

        app.locationStore.state.valueSeq().size.should.equal(3);
      });

      it('responds to LOCATIONS_RECEIVED', () => {
        const [app, _] = setup();
        dispatch(app, LocationConstants.LOCATIONS_RECEIVED, nyse3);

        app.locationStore.state.valueSeq().size.should.eql(3);
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup();
        app.locationStore.saveMany(nyse3);

        listener.should.have.been.calledThrice;
      });
    });
  });

  describe('accessors', () => {

    describe('#getAll', () => {

      it('returns all locations in store', ()=> {
        const [app, _] = setup();
        app.locationStore.saveMany(nyse3);

        app.locationStore.getAll().equals(Seq(nyse3)).should.be.true;
      });
    });
  });
});
