const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../src/application');
const testTree = require('react-test-tree');
const { createStore, createApplication } = require('marty/test-utils');
const { shouldHaveObjectEquality } = require('../support/matchers');

const MapContainer = require('../../src/components/MapContainer');
const MockComponent = require('../support/mocks/MockComponent');

const Location = require('../../src/models/Location');
const UserLocation = require('../../src/models/UserLocation');

const { Map, Seq } = require('immutable');
const { s17, s17UL, nyse3Seq, nyse3ULSeq } = require('../support/sampleLocations');

describe('MapContainer Component', () => {

  const emptyState = Map({
    center: Location(s17),
    locs: Map()
  });

  const ls = nyse3ULSeq;

  const nyse3State = Map({
    center: Location(s17),
    locs: Map([
      [ls.get(0).id, ls.get(0)],
      [ls.get(1).id, ls.get(1)],
      [ls.get(2).id, ls.get(2)]
    ])
  });

  const setup = (state) => {

    const app = createApplication(Application, { include: ['locationStore'] });
    app.locationStore.state = state;

    const stubs = {
      getCenter: sinon.stub(),
      getLocs: sinon.stub()
    };
    app.locationStore.getCenter = stubs.getCenter;
    app.locationStore.getLocs = stubs.getCenter;

    const component = propTree(app, state.get('locs').valueSeq(), state.get('center'));

    return [app, component, stubs];
  };

  const propTree = (app, locs, ctr) =>(
    testTree(
      <MapContainer.InnerComponent locations={locs} center={ctr}/>,
      settings(app)));

  const tree = (app) => testTree(<MapContainer />, settings(app));

  const settings = (app) => ({
    context: { app: app },
    stub: {
      map: <MockComponent />
    }
  });

  describe('contents', () => {

    it('renders a map with correct set of markers', () => {
      const [app, mc, _] = setup(nyse3State);

      mc.map.should.exist;
      mc.getProp('locations').count().should.equal(3);
      shouldHaveObjectEquality(mc.getProp('locations'), nyse3ULSeq);
    });
  });

  describe('events', () =>{

    describe('listening to LocationStore', () => {

      it('updates props when store state changes', () => {
        const [_, mc, {getLocs}] = setup(emptyState);

        getLocs.returns(Seq());
        shouldHaveObjectEquality(mc.getProp('locations'), Seq());

        getLocs.returns(nyse3Seq);
        shouldHaveObjectEquality(mc.getProp('locations'), nyse3ULSeq);
      });
    });
  });
});
