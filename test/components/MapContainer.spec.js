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
const { s17UL, nyse3Seq } = require('../support/sampleLocations');

describe('MapContainer Component', () => {

  const setup = (locs = Seq(Location())) => {

    const app = createApplication(Application, { include: ['locationStore'] });
    app.locationStore.saveMany(Seq(locs));

    const component = propTree(app, Seq(locs));

    return [app, component];
  };

  const propTree = (app, locs) =>
          testTree(<MapContainer.InnerComponent locations={locs} />, settings(app));

  const tree = (app) =>
          testTree(<MapContainer />, settings(app));

  const settings = (app) => ({
    context: { app: app },
    stub: {
      map: <MockComponent />
    }
  });

  describe('contents', () => {

    it('renders a map with correct set of markers', () => {
      const [app, mc] = setup(nyse3Seq);

      mc.map.should.exist;
      mc.getProp('locations').size.should.equal(3);
      shouldHaveObjectEquality(mc.getProp('locations'), nyse3Seq);
    });
  });

  describe('events', () =>{

    describe('listening to LocationStore', () => {

      it('updates props when store state changes', () => {

        const [app, mc] = setup(UserLocation(s17UL));
        shouldHaveObjectEquality(mc.getProp('locations'), Seq(UserLocation(s17UL)));

        app.locationStore.saveMany(nyse3Seq);
        const mc2 = tree(app);

        shouldHaveObjectEquality(mc2.innerComponent.getProp('locations'), nyse3Seq);
      });
    });
  });
});
