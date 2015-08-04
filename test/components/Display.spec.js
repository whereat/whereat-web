var React = require('react');
const Application = require('../../src/application');
const { Map } = require('immutable');

const Display = require('../../src/components/Display');
const HomePage = require('../../src/components/HomePage');
const MapPage = require('../../src/components/MapPage');
const { HOME, MAP } = require('../../src/constants/Pages');

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const testTree = require('react-test-tree');
const { createStore, createApplication } = require('marty/test-utils');

describe('Display Component', () => {

  const setup = (page) => {

    const app = createApplication(Application, {include: ['navStore', 'goButtonStore'] });
    app.navStore.state = Map({page: page});

    const component = testTree(<Display.InnerComponent page={page} />, { context: { app: app }});

    return [app, component];
  };

  describe('contents', () => {

    describe('page', () => {

      describe('when `page` prop is HOME', () => {

        it('renders HomePage component', () => {
          const [app, d] = setup(MAP);

          d.getProp('page').should.equal(MAP);
          d.page.getClassName().should.equal('mapPage');
        });
      });

      describe('when `page` prop is MAP', () => {

        it('renders MapPage component', () => {
          const [app, d] = setup(HOME);

          d.page.getClassName().should.equal('HomePage');
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
        const d2 = testTree(<Display />, { context: { app: app }});

        d2.innerComponent.getProp('page').should.equal(MAP);
      });
    });
  });
});
