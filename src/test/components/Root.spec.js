const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = chai.should();

const Application = require('../../app/application');
const testTree = require('react-test-tree');
const { createApplication } = require('marty/test-utils');

const MockComponent = require('../support/mocks/MockComponent');
const Root = require('../../app/components/Root');
const sc = require('../../app/modules/scheduler');


describe('Root component', () => {

  const setup = (state) => {

    const spies = {
      forget: sinon.spy()
    };

    const app = createApplication(Application, {
      include: ['locSubActions'],
      stub: {
        locSubActions: spies
      }
    });

    const component = propTree(app);

    return [app, component, spies];
  };
  const propTree = (app) =>testTree(<Root.InnerComponent />,settings(app));
  const tree = (app) => testTree(<Root />, settings(app));

  const settings = (app) => ({
    context: { app: app },
    stub: {
      header: <MockComponent />,
      display: <MockComponent />
    }
  });

  describe('contents', () => {

    it('renders header and display childredn', () => {
      const [app, comp] = setup();
      comp.root.should.exist;
      comp.header.should.exist;
      comp.display.should.exist;
    });
  });

  describe.only('events', () => {

    describe('#_forget', () =>{

      it('calls LocSubactions#forget', () => {

        const [app, comp, {forget}] = setup();
        comp.element._forget();

        forget.should.have.been.called.once;
      });
    });

    describe('_#scheduleOnce', () => {

      it('schedules forgetting once and only once', () => {

        const schedule = sinon.spy(sc, 'schedule');
        schedule.should.not.have.been.called;

        const[app, comp] = setup();
        schedule.should.have.been.calledWith(
          comp.element._forget,
          60 * 1000
        );

        comp.element._scheduleOnce();
        schedule.should.have.callCount(1);
      });
    });
  });
});
