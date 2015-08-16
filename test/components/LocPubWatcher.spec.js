const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../src/application');
const { createStore, createApplication } = require('marty/test-utils');
const testTree = require('react-test-tree');
const { shouldHaveBeenCalledWithImmutable } = require('../support/matchers');

const LocPubWatcher = require('../../src/components/LocPubWatcher');
const UserLocation = require('../../src/models/UserLocation');
const UserLocationRefresh = require('../../src/models/UserLocationRefresh');

const { s17, s17_} = require('../support/sampleLocations');
const { emptyState, ping1State, ping2State, pollState } = require('../support/samplePingStates');
const { Map } = require('immutable');

describe.only('LocPubWatcher Component', () => {

  const setup = (state) => {
    const spies = {
      init: sinon.spy(),
      refresh: sinon.spy()
    };
    const app = createApplication(Application, {
      include: ['locPubStore'],
      stub: { locSubActions: spies }
    });
    app.locPubStore.state = state;
    return [app, spies];
  };

  const propTree = (app, color) => testTree(<LocPubWatcher.InnerComponent />, settings(app));
  const tree = (app) => testTree(<LocPubWatcher />, settings(app));
  const settings = (app) => ({context: { app: app }});

  describe('when locPubStore is empty', () => {

    it('does nothing', () => {
      const [app, {init, refresh}] = setup(emptyState);
      const _ = tree(app);

      init.should.not.have.been.called;
      refresh.should.not.have.been.called;
    });
  });


  describe('when locPubStore has location', () => {

    describe('on first ping', () => {

      it('calls locSubActions#init', () => {
        const [app, {init, refresh}] = setup(ping1State);
        const watcher = tree(app);

        shouldHaveBeenCalledWithImmutable(init, UserLocation(s17));
        refresh.should.not.have.been.called;
      });
    });

    describe('on subsequent pings', () => {

      it('calls locSubActions#refresh', () => {
        const [app, {init, refresh}] = setup(ping2State);
        const _ = tree(app);

        shouldHaveBeenCalledWithImmutable(
          refresh,
          UserLocationRefresh({ lastPing: s17.time, location: UserLocation(s17_) })
        );
        init.should.not.have.been.called;
      });
    });
  });



  xdescribe('listening to LocPubStore', () => {

    it('changes when polling state changes', () => {
      const [app, _] = setup(emptyState);
      const gb = tree(app);

      gb.innerComponent.getProp('polling').should.equal(false);
      gb.innerComponent.getProp('pollId').should.equal(-1);

      app.locPubStore.pollingOn(1);
      const gb2 = tree(app);

      gb.innerComponent.getProp('polling').should.equal(true);
      gb.innerComponent.getProp('pollId').should.equal(1);
    });
  });
});
