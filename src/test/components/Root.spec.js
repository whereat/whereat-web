import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const should = chai.should();

import Application from '../../app/application';
import testTree from 'react-test-tree';
import { createApplication } from 'marty/test-utils';

import MockComponent from '../support/mocks/MockComponent';
import Root from '../../app/components/Root';
import { POWER, SEC } from '../../app/constants/Pages';
import sc from '../../app/modules/scheduler';
import { s1t1, s1t2, s2t1, s2t2 } from '../support/sampleSettings';
import stgs from '../../app/constants/Settings';
const { locTtl: { values: ttls } } = stgs;

import { merge } from 'lodash';


describe('Root component', () => {

  const setup = (state = s2t1) => {
    const spies = {
      locSub: {
        forget: sinon.spy(),
        scheduleForget: sinon.spy()
      },
      locPub: {
        poll: sinon.spy()
      },
      nav: { goto: sinon.spy() }
    };
    const app = createApplication(Application, {
      include: ['locSubActions', 'navActions', 'settingsStore'],
      stub: {
        locSubActions: spies.locSub,
        locPubActions: spies.locPub,
        navActions: spies.nav
      }
    });
    app.settingsStore.state = state;
    const component = propTree(app);

    return [app, component, merge({}, spies.locSub, spies.locPub, spies.nav)];
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

    it('renders header and display children', () => {
      const [app, comp] = setup();
      comp.root.should.exist;
      comp.header.should.exist;
      comp.display.should.exist;
    });
  });

  describe('on-load events', () => {

    describe('#_forget', () =>{

      it('calls LocSubactions#forget', () => {

        const [app, comp, {forget}] = setup();
        comp.element._forget();

        forget.should.have.been.called.once;
      });
    });

    describe('#_onFirstLoad', () => {

      it('schedules forgetting and starts polling once and only once', () => {
        const[app, comp, {scheduleForget, poll}] = setup();

        comp.element.state.firstLoad.should.beFalse;
        scheduleForget.should.have.been.calledWith(ttls[1]);
        poll.should.have.been.calledWith(5000);

        comp.element.componentDidMount();
        scheduleForget.should.have.callCount(1);
        poll.should.have.callCount(1);
      });
    });
  });
});
