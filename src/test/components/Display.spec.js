const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const testTree = require('react-test-tree');
const { createStore, createApplication } = require('marty/test-utils');

const Application = require('../../app/application');
const { Map } = require('immutable');

const Display = require('../../app/components/Display');
const HomePage = require('../../app/components/HomePage');
const MapPage = require('../../app/components/MapPage');
const MockComponent = require('../support/mocks/MockComponent');
const { HOME, MAP, SEC } = require('../../app/constants/Pages');

describe('Display Component', () => {

  const setup = (page) => {

    const app = createApplication(Application, {include: ['navStore', 'goButtonStore', 'notificationStore'] });
    app.navStore.state = Map({page: page});

    const component = propTree(app, page);

    return [app, component];
  };

  const propTree = (app, page) =>(
    testTree(<Display.InnerComponent page={page} />, settings(app)));

  const tree = (app) => testTree(<Display />, settings(app));

  const settings = (app) => ({
    context: { app: app },
    stub: {
      homePage: <MockComponent />,
      mapPage: <MockComponent />
    }
  });

  describe('contents', () => {

    describe('page', () => {

      describe('when `page` prop is HOME', () => {

        it('renders HomePage component', () => {
          const [app, d] = setup(HOME);

          d.getProp('page').should.equal(HOME);
          d.homePage.should.exist;
        });
      });

      describe('when `page` prop is MAP', () => {

        it('renders MapPage component', () => {
          const [app, d] = setup(MAP);

          d.getProp('page').should.equal(MAP);
          d.mapPage.should.exist;
        });
      });

      describe('when `page` prop is SEC', () => {

        it('renders SecurityPage component', () => {
          const [app, d] = setup(SEC);

          d.getProp('page').should.equal(SEC);
          d.securityPage.should.exist;
        });
      });
    });
  });

  describe('events', () =>{
    describe('listening to NavStore', () => {

      it('changes page when store page changes', () => {

        const [app, d] = setup(HOME);
        d.getProp('page').should.equal(HOME);

        app.navStore.replaceState(Map({ page: MAP }));
        const d2 = tree(app);

        d2.innerComponent.getProp('page').should.equal(MAP);
      });
    });
  });
});
