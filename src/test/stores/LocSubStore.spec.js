const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const should = chai.should();
chai.use(sinonChai);

const Marty = require('marty');
const Application = require('../../app/application');
const { dispatch, createApplication } = require('marty/test-utils');
const {
  shouldHaveBeenCalledWithImmutable,
  shouldHaveObjectEquality
} = require('../support/matchers');

const LocSubConstants = require('../../app/constants/LocSubConstants');
const Location = require('../../app/models/Location');
const LocPubConstants = require('../../app/constants/LocPubConstants');
const UserLocation = require('../../app/models/UserLocation');

const { Map, Seq } = require('immutable');
const { s17, s17UL, s17_UL, nyse3Seq, nyse3ULSeq } = require('../support/sampleLocations');

describe('LocSubStore', () => {

  const ls = nyse3ULSeq;

  const nyse3State = Map({
    center: Location(s17),
    locs: Map([
      [ls.get(0).id, ls.get(0)],
      [ls.get(1).id, ls.get(1)],
      [ls.get(2).id, ls.get(2)]
    ])
  });

  const nyse3ModTimeState =
          nyse3State.setIn(['locs', ls.get(2).id], ls.get(2).time + 20);

  const clearState = Map({
    center: Location(s17),
    locs: Map()
  });

  const setup = (state = clearState) => {
    const app = createApplication(Application, { include: ['locSubStore'] });
    app.locSubStore.replaceState(state);

    const listener = sinon.spy();
    app.locSubStore.addChangeListener(listener);

    return [app, listener];
  };

  describe('handlers', () => {

    describe('#save', () => {

      it('adds a location to the store', () => {
        const [app, _] = setup();
        app.locSubStore.save(UserLocation(s17UL));

        shouldHaveObjectEquality(
          app.locSubStore.state.getIn(['locs', s17UL.id]),
          UserLocation(s17UL));
      });

      it('updates a location already in the store', () => {
        const [app, _] = setup();
        app.locSubStore.save(UserLocation(s17UL));
        app.locSubStore.save(UserLocation(s17_UL));

        app.locSubStore.state.get('locs').valueSeq().size.should.equal(1);
        shouldHaveObjectEquality(
          app.locSubStore.state.getIn(['locs', s17UL.id]),
          UserLocation(s17_UL));
      });

      it('handles LOCATION_RECEIVED', () => {
        const [app, _] = setup();
        const save = sinon.spy(app.locSubStore, 'save');
        dispatch(app, LocSubConstants.LOCATION_RECEIVED, UserLocation(s17UL));

        shouldHaveBeenCalledWithImmutable( save, UserLocation(s17UL) );
        save.restore();
      });

      it('notifies listeners of a state change', () => {
        const [app, listener] = setup();
        app.locSubStore.save(UserLocation(s17UL));

        listener.should.have.been.calledOnce;
      });
    });

    describe('#saveMany', () => {


      it('adds many external user locations to the store', () => {
        const [app] = setup();
        nyse3Seq.size.should.equal(3);
        app.locSubStore.saveMany(nyse3ULSeq);

        app.locSubStore.state.get('locs').valueSeq().size.should.equal(3);
        shouldHaveObjectEquality(app.locSubStore.state, nyse3State);
      });

      it('responds to LOCATIONS_RECEIVED', () => {
        const [app] = setup();
        const saveMany = sinon.spy(app.locSubStore, 'saveMany');
        dispatch(app, LocSubConstants.LOCATIONS_RECEIVED, nyse3ULSeq);

        shouldHaveBeenCalledWithImmutable(saveMany, nyse3ULSeq);
        saveMany.restore();
      });

      it('notifies listeners of state changes', () => {
        const [app, listener] = setup();
        const ls = nyse3ULSeq;
        app.locSubStore.saveMany(ls);

        listener.should.have.been.calledOnce;
        shouldHaveBeenCalledWithImmutable(listener, nyse3State);
      });
    });

    describe('#clear', () => {

      it('clears all locations from the store', () => {

        const [app] = setup(nyse3State);
        app.locSubStore.getLocs().size.should.equal(3);

        app.locSubStore.clear();
        app.locSubStore.getLocs().size.should.equal(0);
        shouldHaveObjectEquality( app.locSubStore.state.get('locs'), Map() );
      });

      it('handles USER_REMOVED', () => {

        const [app] = setup(nyse3State);
        const clear = sinon.spy(app.locSubStore, 'clear');

        dispatch(app, LocSubConstants.USER_REMOVED);

        clear.should.have.been.calledOnce;
        clear.restore();
      });

      it('notifies listeners of state change', () => {
        const [app, listener] = setup(nyse3State);
        app.locSubStore.clear();

        shouldHaveBeenCalledWithImmutable(listener, clearState);
      });
    });
  });

  describe('#forget', () =>{

    const hourLater = s17.time + (60 * 60 * 1000);

    it('clears all locations from store older than an hour ago', () => {

      const [app] = setup(nyse3State);
      app.locSubStore.state.get('locs').valueSeq().size.should.equal(3);
      shouldHaveObjectEquality(app.locSubStore.state.get('locs'), nyse3State.get('locs'));

      app.locSubStore.forget(hourLater);

      shouldHaveObjectEquality(app.locSubStore.state.get('locs'), Map());
      app.locSubStore.state.get('locs').valueSeq().size.should.equal(0);
    });

    it("doesn't clear locations less than an hour old", () => {

      const [app] = setup(nyse3ModTimeState);
      app.locSubStore.state.get('locs').valueSeq().size.should.equal(3);

      app.locSubStore.forget(hourLater);

      app.locSubStore.state.get('locs').valueSeq().size.should.equal(1);
    });

    it('handles LOCATION_FORGET_TRIGGERED', () => {

      const [app] = setup(nyse3State);
      const forget = sinon.spy(app.locSubStore, 'forget');

      dispatch(app, LocSubConstants.LOCATION_FORGET_TRIGGERED, s17.time);

      forget.should.have.been.calledWith(s17.time);
      forget.restore();
    });

    it('notifies listeners of state change', () => {
      const [app, listener] = setup(nyse3State);
      app.locSubStore.forget(hourLater);

      shouldHaveBeenCalledWithImmutable(listener, clearState);
    });
  });

  describe('accessors', () => {

    describe('#getAll', () => {

      it('returns all locations in store', ()=> {
        const [app] = setup();
        app.locSubStore.saveMany(nyse3ULSeq);

        shouldHaveObjectEquality(
          app.locSubStore.getLocs(),
          nyse3ULSeq);
      });
    });
  });
});
