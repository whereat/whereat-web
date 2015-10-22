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
import { HOME, SEC } from '../../app/constants/Pages';
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
      nav: { goto: sinon.spy() }
    };
    const app = createApplication(Application, {
      include: ['locSubActions', 'navActions', 'settingsStore'],
      stub: {
        locSubActions: spies.locSub,
        navActions: spies.nav
      }
    });
    app.settingsStore.state = state;
    const component = propTree(app);

    return [app, component, merge({}, spies.locSub, spies.nav)];
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

  describe('on-load events', () => {

    describe('#_forget', () =>{

      it('calls LocSubactions#forget', () => {

        const [app, comp, {forget}] = setup();
        comp.element._forget();

        forget.should.have.been.called.once;
      });
    });

    describe('_#scheduleForget', () => {

      it('schedules forgetting once and only once', () => {
        const[app, comp, {scheduleForget}] = setup();
        scheduleForget.should.have.been.calledWith(ttls[1]);
        comp.element.state.forgetScheduled.should.beTrue;

        comp.element._scheduleForget();
        scheduleForget.should.have.callCount(1);
      });
    });

    describe('#_alertSecurity', () => {

      it('shows security alert once and only once on load', () => {

        const [app, comp, {goto} ] = setup();

        goto.should.have.been.calledWith(SEC);
        comp.element.state.securityAlerted.should.beTrue;

        comp.element._alertSecurity();
        goto.should.have.callCount(1);
      });
    });
  });
});
