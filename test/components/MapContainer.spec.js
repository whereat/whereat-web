const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const testTree = require('react-test-tree');
const { createStore, createApplication } = require('marty/test-utils');
const Application = require('../../src/application');

const MapContainer = require('../../src/components/MapContainer');
const MockComponent = require('../support/mocks/MockComponent');

const { Map, Seq } = require('immutable');
const { s17, nyse3 } = require('../support/sampleLocations');

describe('MapContainer Component', () => {

  const setup = (locs = []) => {

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
      const [app, mc] = setup(nyse3);

      mc.map.should.exist;
      mc.getProp('locations').size.should.equal(3);
      mc.getProp('locations').equals(Seq(nyse3)).should.be.true;
    });
  });

  describe('events', () =>{

    describe('listening to LocationStore', () => {

      it('updates props when store state changes', () => {

        const [app, mc] = setup(s17);
        mc.getProp('locations').equals(Seq(s17)).should.be.true;

        app.locationStore.saveMany(nyse3);
        const mc2 = tree(app);

        mc2.innerComponent.getProp('locations')
          .equals(Seq(nyse3)).should.be.true;
      });
    });
  });
});
